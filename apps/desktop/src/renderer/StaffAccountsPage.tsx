import { useEffect, useMemo, useState } from 'react';
import {
  Edit3,
  Eye,
  EyeOff,
  KeyRound,
  Plus,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react';
import type { Branch, StaffAccount } from '@yenkasa/contracts';
import { branchApi, staffApi, type RoleDefinition } from './api';

type Form = {
  fullName: string;
  username: string;
  email: string;
  role: string;
  password: string;
  permissions: string[];
  branchId: string;
};
type EditForm = { fullName: string; email: string; role: string; permissions: string[]; branchId: string };
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
    BRANCH_MANAGER: ['sales', 'quotations', 'invoices', 'payments', 'receipts', 'customers', 'suppliers', 'inventory_view', 'inventory', 'stock_receipts', 'purchases', 'stock_adjustments', 'material_release', 'financial_reports', 'system_settings', 'staff_management', 'edit_selling_prices'],
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
  branchId: '',
};

const permissionMatrix = [
  { module: 'Dashboard', view: 'inventory_view', manage: undefined, approve: undefined, print: undefined },
  { module: 'Sales', view: 'sales', manage: 'sales', approve: undefined, print: 'invoices' },
  { module: 'Invoices & Quotations', view: 'invoice_view', manage: 'invoices', approve: undefined, print: 'invoices' },
  { module: 'Cashier & Payments', view: 'invoice_view', manage: 'payments', approve: 'payments', print: 'receipts' },
  { module: 'Inventory', view: 'inventory_view', manage: 'inventory', approve: undefined, print: 'stock_reports' },
  { module: 'Stock Adjustments', view: 'inventory_view', manage: undefined, approve: 'stock_adjustments', print: 'stock_reports' },
  { module: 'Purchasing', view: 'purchases', manage: 'purchases', approve: undefined, print: 'stock_reports' },
  { module: 'Material Release', view: 'material_release', manage: 'material_release', approve: 'material_release', print: 'material_release' },
  { module: 'Customers', view: 'customers', manage: 'customers', approve: undefined, print: undefined },
  { module: 'Reports', view: 'limited_reports', manage: undefined, approve: undefined, print: 'payment_reports' },
  { module: 'Staff Accounts', view: 'staff_management', manage: 'staff_management', approve: undefined, print: undefined },
  { module: 'Branch Management', view: 'branch_management', manage: 'branch_management', approve: undefined, print: undefined },
  { module: 'Company Setup', view: 'company_setup', manage: 'company_setup', approve: undefined, print: undefined },
  { module: 'System Settings', view: 'system_settings', manage: 'system_settings', approve: undefined, print: undefined },
] as const;

export function StaffAccountsPage() {
  const stored = readSession();
  const ownerMode = !stored && Boolean(sessionStorage.getItem('yenkasa-owner-session'));
  const managerMode = stored?.role === 'BRANCH_MANAGER';
  const [accounts, setAccounts] = useState<StaffAccount[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [roles, setRoles] = useState<RoleDefinition[]>([]);
  const [rolesOpen, setRolesOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState('BRANCH_MANAGER');
  const [roleDraft, setRoleDraft] = useState({ name: '', description: '', permissions: [] as string[] });
  const [form, setForm] = useState<Form>(blank);
  const [editForm, setEditForm] = useState<EditForm>({
    fullName: '',
    email: '',
    role: 'SALES_OFFICER',
    permissions: [],
    branchId: '',
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
      if (ownerMode) {
        const [branchList, roleList] = await Promise.all([branchApi.list(), staffApi.roles()]);
        setBranches(branchList);
        setRoles(roleList);
        const firstRole = roleList.find((role) => role.id === selectedRoleId) ?? roleList[0];
        if (firstRole) {
          setSelectedRoleId(firstRole.id);
          setRoleDraft({ name: firstRole.name, description: firstRole.description, permissions: firstRole.permissions });
        }
      }
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : 'Unable to load users.',
      );
    }
  };
  useEffect(() => {
    void load();
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
  const createOwnerUser = async () => {
    if (!ownerMode || !form.branchId) { setError('Select the branch for this user.'); return; }
    if (!form.fullName.trim() || !form.username.trim() || form.password.length < 8) { setError('Full name, username and a password of at least 8 characters are required.'); return; }
    try {
      await staffApi.companyCreate({ ...form, branchId: form.branchId });
      await load(); setForm({ ...blank }); setOpen(false); setStatus('User account created securely'); setError('');
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to create user account.'); }
  };
  const saveEdit = async () => {
    if (!editing) return;
    try {
      if (ownerMode) await staffApi.companyUpdate(editing.id, editForm);
      else if (stored && managerMode) await staffApi.update(editing.id, stored.branchId, stored.userId, editForm);
      else return;
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
    if (!ownerMode && (!stored || !managerMode)) return;
    try {
      if (ownerMode) await staffApi.companyUpdate(account.id, { active: !account.active });
      else if (stored) await staffApi.update(account.id, stored.branchId, stored.userId, { active: !account.active });
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
    if (!resetting || (!ownerMode && (!stored || !managerMode)) || newPassword.length < 8) {
      setError('Enter a new password with at least 8 characters.');
      return;
    }
    try {
      if (ownerMode) await staffApi.companyResetPassword(resetting.id, newPassword);
      else if (stored) await staffApi.resetPassword(resetting.id, stored.branchId, stored.userId, newPassword);
      setResetting(null);
      setNewPassword('');
      setStatus('Password reset securely');
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : 'Unable to reset password.',
      );
    }
  };
  const selectRole = (role: RoleDefinition) => {
    setSelectedRoleId(role.id);
    setRoleDraft({ name: role.name, description: role.description, permissions: role.permissions });
  };
  const newRole = () => {
    setSelectedRoleId('');
    setRoleDraft({ name: '', description: '', permissions: [] });
    setRolesOpen(true);
  };
  const toggleRolePermission = (permission: string) => setRoleDraft((current) => ({ ...current, permissions: current.permissions.includes(permission) ? current.permissions.filter((item) => item !== permission) : [...current.permissions, permission] }));
  const saveRole = async () => {
    try {
      const saved = roles.find((role) => role.id === selectedRoleId)?.system
        ? await staffApi.updateRole(selectedRoleId, roleDraft)
        : selectedRoleId && roles.some((role) => role.id === selectedRoleId)
          ? await staffApi.updateRole(selectedRoleId, roleDraft)
          : await staffApi.createRole(roleDraft);
      setRoles((current) => current.some((role) => role.id === saved.id) ? current.map((role) => role.id === saved.id ? saved : role) : [...current, saved]);
      setSelectedRoleId(saved.id); setRoleDraft({ name: saved.name, description: saved.description, permissions: saved.permissions }); setStatus('Role permissions saved');
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to save role permissions.'); }
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
      {managerMode ? (
        <section className="staff-hero">
          <div className="staff-hero-title"><div className="setup-title-icon"><Users size={28} /></div><div><h2>Staff Accounts</h2><p>Create and manage authorized staff for this branch.</p></div></div>
          <button className="primary-button" type="button" data-testid="staff-add" onClick={() => { setOpen(true); setError(''); }}><Plus size={16} /> Add Staff</button>
        </section>
      ) : ownerMode ? (
        <section className="staff-owner-hero">
          <div className="staff-hero-title"><div className="setup-title-icon"><Users size={28} /></div><div><h2>Users &amp; Roles</h2><p>Create and manage user accounts, assign roles and control access across headquarters and branches.</p></div></div>
          <div className="staff-owner-actions"><button className="outline compact-button" type="button" onClick={() => setRolesOpen(true)}><ShieldCheck size={15} /> Manage Roles</button><button className="primary-button compact-button" type="button" onClick={() => { setForm({ ...blank, branchId: branches[0]?.id ?? '' }); setOpen(true); setError(''); }}><Plus size={15} /> Add User</button></div>
        </section>
      ) : (
        <section className="setup-title">
          <div className="setup-title-icon"><Users size={31} /></div>
          <div><h2>Users &amp; Roles</h2><p>Review company users, branch assignments and access status from headquarters.</p></div>
        </section>
      )}
      {ownerMode && (
        <div className="staff-stats">
          <Stat label="Total users" value={String(accounts.length)} />
          <Stat label="Active users" value={String(activeCount)} />
          <Stat label="Inactive users" value={String(accounts.length - activeCount)} />
          <Stat label="Roles" value={String(roles.length)} />
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
          {ownerMode && <button className={rolesOpen ? 'active-tab' : ''} type="button" onClick={() => setRolesOpen((current) => !current)}><ShieldCheck size={16} /> Roles &amp; Permissions</button>}
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
        {rolesOpen ? (
          <RolePermissionsPanel roles={roles} selectedRoleId={selectedRoleId} roleDraft={roleDraft} onSelect={selectRole} onToggle={toggleRolePermission} onChange={setRoleDraft} onSave={() => void saveRole()} onNew={newRole} />
        ) : auditOpen ? (
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
                <div className="staff-grid-head"><span>#</span><span>Staff Name</span><span>Username</span><span>Role</span><span>Status</span><span>Actions</span></div>
                {filtered.map((account, index) => (
                  <StaffRow
                    key={account.id}
                    account={account}
                    index={index + 1}
                    onEdit={() => {
                      setEditing(account);
                      setEditForm({
                        fullName: account.fullName,
                        email: account.email,
                        role: account.role,
                        permissions: account.permissions?.length
                          ? account.permissions
                          : defaultPermissions(account.role),
                        branchId: account.branchId,
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
          onCreate={ownerMode ? createOwnerUser : create}
          ownerMode={ownerMode}
          branches={branches}
        />
      )}
      {editing && (
        <EditModal
          form={editForm}
          setForm={setEditForm}
          onClose={() => setEditing(null)}
          onSave={saveEdit}
          ownerMode={ownerMode}
          branches={branches}
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
  index,
  onEdit,
  onToggle,
  onReset,
}: {
  account: StaffAccount;
  index: number;
  onEdit: () => void;
  onToggle: () => void;
  onReset: () => void;
}) {
  const roleLabel = account.role === 'OWNER' ? 'Owner' : account.role === 'SALES_CASHIER' ? 'Sales + Cashier' : account.role === 'SALES_OFFICER' ? 'Sales Officer' : account.role === 'CASHIER' ? 'Cashier' : account.role === 'STOCK_MANAGER' ? 'Stock Manager' : account.role === 'BRANCH_MANAGER' ? 'Branch Manager' : account.role;
  const protectedOwner = account.role === 'OWNER';
  return <div className="staff-row"><span className="staff-index">{index}</span><div className="staff-identity"><span className="staff-avatar">{account.fullName.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase()}</span><strong>{account.fullName}</strong></div><span className="staff-username">{account.username}</span><span className="staff-role-pill">{roleLabel}</span><span className={`status ${account.active ? 'in-stock' : 'out-of-stock'}`}>{account.active ? 'Active' : 'Inactive'}</span>{!protectedOwner ? <div className="staff-actions"><button className="outline small-button" type="button" data-testid={`staff-edit-${account.id}`} onClick={onEdit}><Edit3 size={13} /> Edit</button><button className="outline small-button" type="button" data-testid={`staff-reset-${account.id}`} onClick={onReset}><KeyRound size={13} /> Reset Password</button><button className="outline small-button danger-button" type="button" onClick={onToggle}>{account.active ? 'Deactivate' : 'Reactivate'}</button></div> : <span className="staff-protected">Protected</span>}</div>;
}

function RolePermissionsPanel({
  roles,
  selectedRoleId,
  roleDraft,
  onSelect,
  onToggle,
  onChange,
  onSave,
  onNew,
}: {
  roles: RoleDefinition[];
  selectedRoleId: string;
  roleDraft: { name: string; description: string; permissions: string[] };
  onSelect: (role: RoleDefinition) => void;
  onToggle: (permission: string) => void;
  onChange: (draft: { name: string; description: string; permissions: string[] }) => void;
  onSave: () => void;
  onNew: () => void;
}) {
  return <div className="role-permissions-panel">
    <div className="role-panel-toolbar"><div><h3>Roles &amp; Permissions</h3><p>Control the permissions available to each supported role. Changes are enforced by the backend.</p></div><button className="outline compact-button" type="button" onClick={onNew}><Plus size={14} /> New Custom Role</button></div>
    <div className="role-panel-layout">
      <div className="role-list">{roles.map((role) => <button key={role.id} className={role.id === selectedRoleId ? 'role-list-item active' : 'role-list-item'} type="button" onClick={() => onSelect(role)}><strong>{role.name}</strong><small>{role.description}</small>{role.system && <em>System role</em>}</button>)}</div>
      <div className="permission-editor">
        <div className="permission-editor-head"><div><label>Role name<input value={roleDraft.name} disabled={roles.find((role) => role.id === selectedRoleId)?.system === true} onChange={(event) => onChange({ ...roleDraft, name: event.target.value })} /></label><label>Description<input value={roleDraft.description} onChange={(event) => onChange({ ...roleDraft, description: event.target.value })} /></label></div><div className="permission-actions"><button className="outline compact-button" type="button" onClick={() => onChange({ ...roleDraft, permissions: [] })}>Reset</button><button className="primary-button compact-button" type="button" onClick={onSave}>Save Permissions</button></div></div>
        <div className="permission-matrix"><div className="permission-matrix-head"><span>Module</span><span>View</span><span>Manage</span><span>Approve</span><span>Print / Export</span></div>{permissionMatrix.map((row) => <div className="permission-matrix-row" key={row.module}><strong>{row.module}</strong>{([row.view, row.manage, row.approve, row.print] as Array<string | undefined>).map((permission, index) => <label key={`${row.module}-${index}`}>{permission ? <input type="checkbox" checked={roleDraft.permissions.includes(permission)} onChange={() => onToggle(permission)} aria-label={`${row.module} ${['View', 'Manage', 'Approve', 'Print or Export'][index]}`} /> : <span className="permission-not-supported">—</span>}</label>)}</div>)}</div>
      </div>
    </div>
  </div>;
}

function CreateModal({
  form,
  setForm,
  onClose,
  onCreate,
  ownerMode,
  branches,
}: {
  form: Form;
  setForm: (form: Form) => void;
  onClose: () => void;
  onCreate: () => void;
  ownerMode: boolean;
  branches: Branch[];
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
            {ownerMode && <option value="BRANCH_MANAGER">Branch Manager</option>}
            <option value="STOCK_MANAGER">Stock Manager / Storekeeper</option>
            <option value="SALES_OFFICER">Sales Officer</option>
            <option value="CASHIER">Cashier</option>
            <option value="SALES_CASHIER">Sales + Cashier (Combined)</option>
          </select>
        </label>
        {ownerMode && <label>Branch<select value={form.branchId} onChange={(event) => setForm({ ...form, branchId: event.target.value })}><option value="">Select branch</option>{branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name} ({branch.code})</option>)}</select></label>}
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
  ownerMode,
  branches,
}: {
  form: EditForm;
  setForm: (form: EditForm) => void;
  onClose: () => void;
  onSave: () => void;
  ownerMode: boolean;
  branches: Branch[];
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
        <label>
          Role
          <select
            value={form.role}
            onChange={(event) =>
              setForm({
                ...form,
                role: event.target.value as EditForm['role'],
                permissions: defaultPermissions(event.target.value),
              })
            }
          >
            {ownerMode && <option value="BRANCH_MANAGER">Branch Manager</option>}
            <option value="STOCK_MANAGER">Stock Manager / Storekeeper</option>
            <option value="SALES_OFFICER">Sales Officer</option>
            <option value="CASHIER">Cashier</option>
            <option value="SALES_CASHIER">Sales + Cashier (Combined)</option>
          </select>
        </label>
        {ownerMode && <label>Branch<select value={form.branchId} onChange={(event) => setForm({ ...form, branchId: event.target.value })}><option value="">Select branch</option>{branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name} ({branch.code})</option>)}</select></label>}
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
  const [visible, setVisible] = useState(false);
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
          type={visible ? 'text' : 'password'}
          value={password}
          onChange={setPassword}
        />
        <button className="password-toggle" type="button" onClick={() => setVisible((current) => !current)}>
          {visible ? <EyeOff size={15} /> : <Eye size={15} />}
          {visible ? 'Hide password' : 'View password'}
        </button>
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
