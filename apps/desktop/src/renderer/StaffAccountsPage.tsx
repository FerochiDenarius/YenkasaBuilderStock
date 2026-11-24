import { useEffect, useMemo, useState } from 'react';
import {
  Check,
  Edit3,
  KeyRound,
  Plus,
  ShieldCheck,
  UserCircle,
  Users,
  X,
} from 'lucide-react';
import type { StaffAccount } from '@yenkasa/contracts';
import { staffApi } from './api';

type Form = {
  fullName: string;
  username: string;
  email: string;
  role: 'STOCK_MANAGER' | 'SALES_OFFICER' | 'CASHIER' | 'SALES_CASHIER';
  password: string;
  permissions: string[];
};
type EditForm = { fullName: string; email: string; permissions: string[] };
type SessionLike = { userId: string; branchId: string; role: string };
const permissionOptions = [
  ['sales', 'Sales & Invoices'],
  ['quotations', 'Quotations'],
  ['invoices', 'Invoice access'],
  ['invoice_view', 'View invoices'],
  ['payments', 'Cashier & Payments'],
  ['receipts', 'Receipts'],
  ['customers', 'Customers'],
  ['suppliers', 'Suppliers'],
  ['inventory_view', 'View inventory'],
  ['inventory', 'Manage inventory'],
  ['stock_receipts', 'Stock receiving'],
  ['purchases', 'Purchasing'],
  ['stock_adjustments', 'Stock adjustments'],
  ['material_release', 'Material release'],
  ['payment_reports', 'Payment reports'],
  ['stock_reports', 'Stock reports'],
  ['limited_reports', 'Limited reports'],
] as const;
const defaultPermissions = (role: string) => {
  const defaults: Record<string, string[]> = {
    STOCK_MANAGER: ['inventory_view', 'inventory', 'stock_receipts', 'purchases', 'suppliers', 'stock_adjustments', 'material_release', 'stock_reports'],
    SALES_OFFICER: ['sales', 'quotations', 'invoices', 'inventory_view', 'customers', 'limited_reports'],
    CASHIER: ['invoice_view', 'payments', 'receipts', 'payment_reports'],
    SALES_CASHIER: ['sales', 'quotations', 'invoices', 'invoice_view', 'payments', 'receipts', 'inventory_view'],
  };
  return defaults[role] ?? [];
};
const blank: Form = {
  fullName: '',
  username: '',
  email: '',
  role: 'STOCK_MANAGER',
  password: '',
  permissions: defaultPermissions('STOCK_MANAGER'),
};

export function StaffAccountsPage() {
  const stored = readSession();
  const ownerMode = !stored;
  const managerMode = stored?.role === 'BRANCH_MANAGER';
  const [accounts, setAccounts] = useState<StaffAccount[]>([]);
  const [form, setForm] = useState<Form>(blank);
  const [editForm, setEditForm] = useState<EditForm>({
    fullName: '',
    email: '',
    permissions: [],
  });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<StaffAccount | null>(null);
  const [resetting, setResetting] = useState<StaffAccount | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [auditOpen, setAuditOpen] = useState(false);
  const [audit, setAudit] = useState<
    Array<{
      id: string;
      action: string;
      actorUserId: string;
      targetUserId: string;
      createdAt: string;
    }>
  >([]);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const load = async () => {
    try {
      const list = ownerMode
        ? await staffApi.companyUsers()
        : managerMode && stored
          ? await staffApi.list(stored.branchId, stored.userId)
          : [];
      setAccounts(list);
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : 'Unable to load users.',
      );
    }
  };
  useEffect(() => {
    load();
  }, []);
  const filtered = useMemo(
    () =>
      accounts
        .filter((account) =>
          `${account.fullName} ${account.username} ${account.email} ${account.role} ${account.branchName ?? ''}`
            .toLowerCase()
            .includes(query.toLowerCase()),
        )
        .filter(
          (account) =>
            statusFilter === 'All' ||
            (statusFilter === 'Active' ? account.active : !account.active),
        )
        .filter(
          (account) => roleFilter === 'All' || account.role === roleFilter,
        ),
    [accounts, query, roleFilter, statusFilter],
  );
  const create = async () => {
    if (!stored || !managerMode) {
      setError(
        'Only an authenticated Branch Manager can create staff accounts.',
      );
      return;
    }
    if (
      !form.fullName.trim() ||
      !form.username.trim() ||
      form.password.length < 8
    ) {
      setError(
        'Full name, username and a password of at least 8 characters are required.',
      );
      return;
    }
    try {
      await staffApi.create(stored.branchId, stored.userId, form);
      await load();
      setForm(blank);
      setOpen(false);
      setStatus('Staff account created securely');
      setError('');
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'Unable to create staff account.',
      );
    }
  };
  const saveEdit = async () => {
    if (!editing || !stored || !managerMode) return;
    try {
      await staffApi.update(
        editing.id,
        stored.branchId,
        stored.userId,
        editForm,
      );
      await load();
      setEditing(null);
      setStatus('Staff information updated');
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'Unable to update staff account.',
      );
    }
  };
  const toggle = async (account: StaffAccount) => {
    if (!stored || !managerMode) return;
    try {
      await staffApi.update(account.id, stored.branchId, stored.userId, {
        active: !account.active,
      });
      await load();
      setStatus(account.active ? 'Account deactivated' : 'Account reactivated');
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'Unable to update account status.',
      );
    }
  };
  const resetPassword = async () => {
    if (!resetting || !stored || !managerMode || newPassword.length < 8) {
      setError('Enter a new password with at least 8 characters.');
      return;
    }
    try {
      await staffApi.resetPassword(
        resetting.id,
        stored.branchId,
        stored.userId,
        newPassword,
      );
      setResetting(null);
      setNewPassword('');
      setStatus('Password reset securely');
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : 'Unable to reset password.',
      );
    }
  };
  const showAudit = async () => {
    try {
      const rows = await staffApi.audit(stored?.branchId, stored?.userId);
      setAudit(rows);
      setAuditOpen(true);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'Unable to load audit records.',
      );
    }
  };
  const activeCount = accounts.filter((account) => account.active).length;
  return (
    <div className="setup-page staff-page">
      <div className="setup-breadcrumb">
        ⌂ &nbsp;›&nbsp; Company Setup &nbsp;›&nbsp;{' '}
        <strong>Users & Roles</strong>
      </div>
      <section className="setup-title">
        <div className="setup-title-icon">
          <Users size={31} />
        </div>
        <div>
          <h2>{ownerMode ? 'Users & Roles' : 'Staff Accounts'}</h2>
          <p>
            {ownerMode
              ? 'Review company users, branch assignments and access status from headquarters.'
              : 'Create and manage Sales Officer, Cashier and Stock Manager accounts for the authenticated branch.'}
          </p>
        </div>
      </section>
      {managerMode && (
        <div className="staff-action-row">
          <button
            className="primary-button"
            type="button"
            data-testid="staff-add"
            onClick={() => {
              setOpen(true);
              setError('');
            }}
          >
            <Plus size={17} />
            Add Staff Account
          </button>
        </div>
      )}
      {managerMode && (
        <div className="staff-policy">
          <ShieldCheck size={20} />
          <span>
            Branch Managers can assign only Sales Officer, Cashier and Stock
            Manager roles. Staff accounts cannot create users or elevate their
            own privileges.
          </span>
        </div>
      )}
      {ownerMode && (
        <div className="staff-stats">
          <Stat label="Total users" value={String(accounts.length)} />
          <Stat label="Active users" value={String(activeCount)} />
          <Stat
            label="Branch managers"
            value={String(
              accounts.filter((account) => account.role === 'BRANCH_MANAGER')
                .length,
            )}
          />
        </div>
      )}
      <section className="panel staff-list">
        <div className="staff-tabs">
          <button
            className={!auditOpen ? 'active-tab' : ''}
            type="button"
            onClick={() => setAuditOpen(false)}
          >
            <Users size={16} />
            Users
          </button>
          <button
            className={auditOpen ? 'active-tab' : ''}
            type="button"
            onClick={showAudit}
          >
            <ShieldCheck size={16} />
            Audit Log
          </button>
          <div className="staff-filters">
            <input
              data-testid="staff-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search users..."
            />
            <select
              data-testid="staff-role-filter"
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
            >
              <option value="All">All roles</option>
              <option value="BRANCH_MANAGER">Branch Manager</option>
              <option value="STOCK_MANAGER">Stock Manager / Storekeeper</option>
              <option value="SALES_OFFICER">Sales Officer</option>
              <option value="CASHIER">Cashier</option>
              <option value="SALES_CASHIER">Sales + Cashier (Combined)</option>
            </select>
            <select
              data-testid="staff-status-filter"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option>All</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>
        {auditOpen ? (
          <AuditRows rows={audit} />
        ) : (
          <>
            {!ownerMode && !managerMode ? (
              <div className="staff-empty">
                Sign in as a Branch Manager to manage branch staff.
              </div>
            ) : filtered.length === 0 ? (
              <div className="staff-empty">No matching user accounts.</div>
            ) : (
              <div className="staff-table">
                {filtered.map((account) => (
                  <StaffRow
                    key={account.id}
                    account={account}
                    ownerMode={ownerMode}
                    onEdit={() => {
                      setEditing(account);
                      setEditForm({
                        fullName: account.fullName,
                        email: account.email,
                        permissions: account.permissions?.length
                          ? account.permissions
                          : defaultPermissions(account.role),
                      });
                    }}
                    onToggle={() => toggle(account)}
                    onReset={() => {
                      setResetting(account);
                      setNewPassword('');
                    }}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </section>
      {status && (
        <small className="save-status" role="status">
          {status}
        </small>
      )}
      {error && (
        <small className="save-error" role="alert">
          {error}
        </small>
      )}
      {open && (
        <CreateModal
          form={form}
          setForm={setForm}
          onClose={() => setOpen(false)}
          onCreate={create}
        />
      )}
      {editing && (
        <EditModal
          form={editForm}
          setForm={setEditForm}
          onClose={() => setEditing(null)}
          onSave={saveEdit}
        />
      )}
      {resetting && (
        <ResetModal
          password={newPassword}
          setPassword={setNewPassword}
          onClose={() => setResetting(null)}
          onReset={resetPassword}
        />
      )}
    </div>
  );
}

function readSession(): SessionLike | null {
  try {
    return JSON.parse(sessionStorage.getItem('yenkasa-session') ?? 'null');
  } catch {
    return null;
  }
}
function StaffRow({
  account,
  ownerMode,
  onEdit,
  onToggle,
  onReset,
}: {
  account: StaffAccount;
  ownerMode: boolean;
  onEdit: () => void;
  onToggle: () => void;
  onReset: () => void;
}) {
  return (
    <div className="staff-row">
      <UserCircle size={22} />
      <div>
        <strong>{account.fullName}</strong>
        <small>
          {account.username} ·{' '}
          {account.role === 'SALES_CASHIER'
            ? 'Sales + Cashier (Combined)'
            : account.role === 'SALES_OFFICER'
              ? 'Sales Officer'
              : account.role === 'CASHIER'
                ? 'Cashier'
                : account.role === 'STOCK_MANAGER'
                  ? 'Stock Manager / Storekeeper'
                  : 'Branch Manager'}
          {ownerMode && ` · ${account.branchName ?? 'Unassigned'}`}
        </small>
      </div>
      <span
        className={account.active ? 'status in-stock' : 'status out-of-stock'}
      >
        {account.active ? 'Active' : 'Inactive'}
      </span>
      {!ownerMode && (
        <>
          <button
            className="outline small-button"
            type="button"
            data-testid={`staff-edit-${account.id}`}
            onClick={onEdit}
          >
            <Edit3 size={13} />
            Edit
          </button>
          <button
            className="outline small-button"
            type="button"
            data-testid={`staff-reset-${account.id}`}
            onClick={onReset}
          >
            <KeyRound size={13} />
            Reset
          </button>
          <button
            className="outline small-button"
            type="button"
            onClick={onToggle}
          >
            {account.active ? 'Deactivate' : 'Reactivate'}
          </button>
        </>
      )}
      <span>{account.active ? <Check size={17} /> : '—'}</span>
    </div>
  );
}
function CreateModal({
  form,
  setForm,
  onClose,
  onCreate,
}: {
  form: Form;
  setForm: (form: Form) => void;
  onClose: () => void;
  onCreate: () => void;
}) {
  return (
    <section className="panel staff-create">
      <div className="panel-heading">
        <div>
          <h2>Create Staff Account</h2>
          <p>
            Passwords are hashed before they leave this form and are never
            returned by the API.
          </p>
        </div>
        <button type="button" className="icon-button" onClick={onClose}>
          <X size={18} />
        </button>
      </div>
      <div className="staff-fields">
        <Field
          label="Full Name"
          value={form.fullName}
          onChange={(value) => setForm({ ...form, fullName: value })}
        />
        <Field
          label="Username"
          value={form.username}
          onChange={(value) => setForm({ ...form, username: value })}
        />
        <Field
          label="Email"
          value={form.email}
          onChange={(value) => setForm({ ...form, email: value })}
        />
        <label>
          Role
          <select
            value={form.role}
            onChange={(event) =>
              setForm({ ...form, role: event.target.value as Form['role'], permissions: defaultPermissions(event.target.value) })
            }
          >
            <option value="STOCK_MANAGER">Stock Manager / Storekeeper</option>
            <option value="SALES_OFFICER">Sales Officer</option>
            <option value="CASHIER">Cashier</option>
            <option value="SALES_CASHIER">Sales + Cashier (Combined)</option>
          </select>
        </label>
        <Field
          label="Initial Password"
          type="password"
          value={form.password}
          onChange={(value) => setForm({ ...form, password: value })}
        />
      </div>
      <fieldset className="staff-permission-grid">
        <legend>Initial branch permissions</legend>
        <p>Grant or revoke modules for this account. The backend enforces these permissions.</p>
        {permissionOptions.map(([key, label]) => (
          <label key={key}>
            <input
              type="checkbox"
              checked={form.permissions.includes(key)}
              onChange={(event) => setForm({ ...form, permissions: event.target.checked ? [...form.permissions, key] : form.permissions.filter((permission) => permission !== key) })}
            />
            {label}
          </label>
        ))}
      </fieldset>
      <div className="setup-actions">
        <button
          className="outline"
          type="button"
          onClick={() => setForm(blank)}
        >
          Reset
        </button>
        <button className="primary-button" type="button" onClick={onCreate}>
          <KeyRound size={16} />
          Create Account
        </button>
      </div>
    </section>
  );
}
function EditModal({
  form,
  setForm,
  onClose,
  onSave,
}: {
  form: EditForm;
  setForm: (form: EditForm) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <section className="panel staff-create staff-modal">
      <div className="panel-heading">
        <h2>Edit Staff Information</h2>
        <button type="button" className="icon-button" onClick={onClose}>
          <X size={18} />
        </button>
      </div>
      <div className="staff-fields">
        <Field
          label="Full Name"
          value={form.fullName}
          onChange={(value) => setForm({ ...form, fullName: value })}
        />
        <Field
          label="Email"
          value={form.email}
          onChange={(value) => setForm({ ...form, email: value })}
        />
      </div>
      <fieldset className="staff-permission-grid">
        <legend>Branch permissions</legend>
        <p>Choose the modules this account can use. Changes apply at the next login.</p>
        {permissionOptions.map(([key, label]) => (
          <label key={key}>
            <input
              type="checkbox"
              checked={form.permissions.includes(key)}
              onChange={(event) =>
                setForm({
                  ...form,
                  permissions: event.target.checked
                    ? [...form.permissions, key]
                    : form.permissions.filter((permission) => permission !== key),
                })
              }
            />
            {label}
          </label>
        ))}
      </fieldset>
      <div className="setup-actions">
        <button className="outline" type="button" onClick={onClose}>
          Cancel
        </button>
        <button className="primary-button" type="button" onClick={onSave}>
          Save Changes
        </button>
      </div>
    </section>
  );
}
function ResetModal({
  password,
  setPassword,
  onClose,
  onReset,
}: {
  password: string;
  setPassword: (value: string) => void;
  onClose: () => void;
  onReset: () => void;
}) {
  return (
    <section className="panel staff-create staff-modal">
      <div className="panel-heading">
        <h2>Reset Password</h2>
        <button type="button" className="icon-button" onClick={onClose}>
          <X size={18} />
        </button>
      </div>
      <div className="staff-fields">
        <Field
          label="New Password"
          type="password"
          value={password}
          onChange={setPassword}
        />
      </div>
      <div className="setup-actions">
        <button className="outline" type="button" onClick={onClose}>
          Cancel
        </button>
        <button className="primary-button" type="button" onClick={onReset}>
          Reset Password
        </button>
      </div>
    </section>
  );
}
function AuditRows({
  rows,
}: {
  rows: Array<{
    id: string;
    action: string;
    actorUserId: string;
    targetUserId: string;
    createdAt: string;
  }>;
}) {
  return rows.length ? (
    <div className="audit-list">
      {rows.map((row) => (
        <div className="audit-row" key={row.id}>
          <ShieldCheck size={17} />
          <strong>{row.action.replaceAll('_', ' ')}</strong>
          <span>{new Date(row.createdAt).toLocaleString()}</span>
        </div>
      ))}
    </div>
  ) : (
    <div className="staff-empty">No audit events recorded yet.</div>
  );
}
function Field({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label>
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="staff-stat">
      <small>{label}</small>
      <strong>{value}</strong>
    </div>
  );
}
