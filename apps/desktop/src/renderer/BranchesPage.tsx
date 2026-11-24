import {
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  ChevronDown,
  LockKeyhole,
  MapPin,
  Monitor,
  Plus,
  Search,
  ShieldCheck,
  UserCircle,
  Users,
  X,
} from 'lucide-react';
import type { Branch } from '@yenkasa/contracts';
import { branchApi } from './api';

type Form = {
  name: string;
  code: string;
  branchType: string;
  location: string;
  phone: string;
  email: string;
  manager: string;
  managerContact: string;
  managerUsername: string;
  managerPassword: string;
  confirmPassword: string;
  deviceName: string;
  activateDevice: boolean;
};
const emptyForm: Form = {
  name: '',
  code: '',
  branchType: 'Sales & Warehouse',
  location: '',
  phone: '',
  email: '',
  manager: '',
  managerContact: '',
  managerUsername: '',
  managerPassword: '',
  confirmPassword: '',
  deviceName: '',
  activateDevice: true,
};
const accessRights = [
  ['sales', 'Sales', 'Create sales, print receipts and invoices'],
  [
    'purchases',
    'Purchases',
    'Create purchase orders and record goods received',
  ],
  ['inventory', 'Inventory', 'Manage stock, stock adjustments and transfers'],
  ['customers', 'Customers', 'Add and manage customer records'],
  ['suppliers', 'Suppliers', 'Add and manage supplier records'],
  ['reports', 'Reports', 'View branch sales, stock and transaction reports'],
];
const actionRights = [
  ['edit_selling_prices', 'Edit selling prices'],
  ['apply_discounts', 'Apply discounts'],
  ['process_returns', 'Process returns'],
  ['adjust_stock', 'Adjust stock (stock in/out)'],
  ['transfer_stock', 'Transfer stock (to/from branches)'],
  ['financial_reports', 'View financial reports (branch only)'],
];

export function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [wizard, setWizard] = useState(false);
  const load = () => {
    setLoading(true);
    branchApi
      .list()
      .then(setBranches)
      .catch(() => undefined)
      .finally(() => setLoading(false));
  };
  useEffect(load, []);
  const filtered = useMemo(
    () =>
      branches.filter((branch) =>
        `${branch.name} ${branch.code} ${branch.location} ${branch.manager}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [branches, query],
  );
  if (wizard)
    return (
      <BranchCreationWizard
        onCancel={() => setWizard(false)}
        onCreated={(branch) => {
          setBranches((current) =>
            [...current, branch].sort((a, b) => a.name.localeCompare(b.name)),
          );
          window.dispatchEvent(new Event('yenkasa-branches-changed'));
          setWizard(false);
        }}
      />
    );
  const active = branches.filter((branch) => branch.status === 'Active').length;
  const users = branches.reduce(
    (total, branch) => total + branch.usersCount,
    0,
  );
  return (
    <div className="setup-page branch-page">
      <div className="setup-breadcrumb">
        ⌂ &nbsp;›&nbsp; Company Setup &nbsp;›&nbsp; <strong>Branches</strong>
      </div>
      <section className="setup-title">
        <div className="setup-title-icon">
          <Building2 size={31} />
        </div>
        <div>
          <h2>Branch Setup</h2>
          <p>
            Create and manage company branches, branch accounts and access from
            headquarters.
          </p>
        </div>
      </section>
      <div className="branch-stats">
        <Stat
          label="Total Branches"
          value={String(branches.length)}
          tone="blue"
        />
        <Stat label="Active Branches" value={String(active)} tone="teal" />
        <Stat
          label="Suspended"
          value={String(branches.length - active)}
          tone="orange"
        />
        <Stat label="Branch Users" value={String(users)} tone="purple" />
      </div>
      <section className="panel branch-list">
        <div className="panel-heading">
          <div>
            <h2>Registered Branches</h2>
            <p>
              Every branch is isolated to your company and has its own manager
              account.
            </p>
          </div>
          <div className="search-box">
            <Search size={15} />
            <input
              data-testid="branch-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search branches..."
            />
          </div>
          <button
            className="primary-button"
            type="button"
            data-testid="branch-add-new"
            onClick={() => setWizard(true)}
          >
            <Plus size={17} />
            Add New Branch
          </button>
        </div>
        <div className="branch-table">
          <div className="branch-row branch-head">
            <span>#</span>
            <span>Branch Name</span>
            <span>Branch Code</span>
            <span>Location</span>
            <span>Manager</span>
            <span>Users</span>
            <span>Status</span>
          </div>
          {loading ? (
            <div className="page-loading">Loading branches…</div>
          ) : filtered.length ? (
            filtered.map((branch, index) => (
              <div className="branch-row" key={branch.id}>
                <span>{index + 1}</span>
                <strong>▥ &nbsp;{branch.name}</strong>
                <span>{branch.code}</span>
                <span>{branch.location}</span>
                <span>{branch.manager}</span>
                <span>{branch.usersCount}</span>
                <span
                  className={`status ${branch.status === 'Active' ? 'in-stock' : 'low-stock'}`}
                >
                  {branch.status}
                </span>
              </div>
            ))
          ) : (
            <div className="page-loading">No branches match this search.</div>
          )}
        </div>
      </section>
    </div>
  );
}

function BranchCreationWizard({
  onCancel,
  onCreated,
}: {
  onCancel: () => void;
  onCreated: (branch: Branch) => void;
}) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(emptyForm);
  const [permissions, setPermissions] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      [...accessRights, ...actionRights].map(([key]) => [key, true]),
    ),
  );
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const update = (key: keyof Form, value: string | boolean) => {
    setForm((current) => ({ ...current, [key]: value }));
    setError('');
    setStatus('');
  };
  const next = () => {
    setError('');
    if (
      step === 1 &&
      (!form.name.trim() ||
        !form.code.trim() ||
        !form.location.trim() ||
        !form.manager.trim())
    )
      return setError('Complete branch name, code, address and manager name.');
    if (
      step === 2 &&
      (!form.managerUsername.trim() ||
        !form.managerPassword ||
        form.managerPassword.length < 8 ||
        form.managerPassword !== form.confirmPassword)
    )
      return setError(
        form.managerPassword !== form.confirmPassword
          ? 'Passwords do not match.'
          : 'Enter a username and a password of at least 8 characters.',
      );
    setStep((current) => Math.min(3, current + 1));
  };
  const create = async () => {
    setSaving(true);
    setError('');
    setStatus('Creating branch, manager account and device record…');
    try {
      const branch = await branchApi.create({
        name: form.name,
        code: form.code,
        location: form.location,
        phone: form.phone,
        email: form.email,
        manager: form.manager,
        managerContact: form.managerContact,
        branchType: form.branchType,
        managerUsername: form.managerUsername,
        managerPassword: form.managerPassword,
        managerRole: 'BRANCH_MANAGER',
        deviceName: form.deviceName,
        activateDevice: form.activateDevice,
        permissions,
      });
      onCreated(branch);
    } catch (reason) {
      setStatus('');
      setError(
        reason instanceof Error ? reason.message : 'Unable to create branch.',
      );
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="setup-page branch-wizard">
      <div className="setup-breadcrumb">
        <button type="button" className="breadcrumb-link" onClick={onCancel}>
          Branches
        </button>{' '}
        &nbsp;›&nbsp; <strong>Add New Branch</strong>
      </div>
      <section className="setup-title">
        <div className="setup-title-icon">
          <Building2 size={31} />
        </div>
        <div>
          <h2>Create New Branch</h2>
          <p>Set up branch details, login access and permissions.</p>
        </div>
        <div className="wizard-header-actions">
          <button
            className="outline"
            type="button"
            data-testid="branch-cancel"
            onClick={onCancel}
          >
            <X size={17} />
            Cancel
          </button>
          {step === 3 && (
            <button
              className="primary-button"
              type="button"
              data-testid="branch-create-final"
              disabled={saving}
              onClick={create}
            >
              <Check size={17} />
              {saving ? 'Creating…' : 'Create Branch'}
            </button>
          )}
        </div>
      </section>
      <div className="wizard-steps">
        {[
          ['1', 'Branch Details'],
          ['2', 'Login Setup'],
          ['3', 'Permissions'],
        ].map(([number, label], index) => (
          <button
            type="button"
            key={label}
            className={
              step === index + 1 ? 'active' : step > index + 1 ? 'complete' : ''
            }
            onClick={() => step > index + 1 && setStep(index + 1)}
          >
            <b>{step > index + 1 ? <Check size={17} /> : number}</b>
            <span>{label}</span>
            {step > index + 1 && <Check size={17} />}
          </button>
        ))}
      </div>
      {step === 1 && <StepDetails form={form} update={update} onNext={next} />}
      {step === 2 && (
        <StepLogin
          form={form}
          update={update}
          onBack={() => setStep(1)}
          onNext={next}
        />
      )}
      {step === 3 && (
        <StepPermissions
          form={form}
          permissions={permissions}
          setPermissions={setPermissions}
          onBack={() => setStep(2)}
          onCreate={create}
          saving={saving}
        />
      )}
      {error && (
        <div className="wizard-error" role="alert">
          {error}
        </div>
      )}
      {status && (
        <div className="wizard-status" role="status">
          {status}
        </div>
      )}
    </div>
  );
}

function StepDetails({
  form,
  update,
  onNext,
}: {
  form: Form;
  update: (key: keyof Form, value: string | boolean) => void;
  onNext: () => void;
}) {
  return (
    <section className="panel wizard-panel">
      <WizardHeading
        icon={<Building2 size={29} />}
        title="Branch Details"
        text="Basic information about the branch"
      />
      <div className="wizard-fields">
        <Field
          name="name"
          label="Branch Name"
          value={form.name}
          required
          onChange={(value) => update('name', value)}
        />
        <Field
          name="code"
          label="Branch Code"
          value={form.code}
          required
          onChange={(value) => update('code', value.toUpperCase())}
        />
        <label>
          Branch Type <em>*</em>
          <select
            data-testid="branch-type"
            value={form.branchType}
            onChange={(event) => update('branchType', event.target.value)}
          >
            <option>Sales & Warehouse</option>
            <option>Warehouse Only</option>
            <option>Sales Only</option>
          </select>
        </label>
        <label>
          Status
          <div className="switch-line">
            <button type="button" aria-pressed="true" className="switch-on">
              <i />
            </button>
            Active
          </div>
        </label>
        <Field
          name="location"
          label="Address"
          value={form.location}
          required
          onChange={(value) => update('location', value)}
          wide
          icon={<MapPin size={17} />}
        />
        <Field
          name="phone"
          label="Phone"
          value={form.phone}
          onChange={(value) => update('phone', value)}
        />
        <Field
          name="email"
          label="Email"
          value={form.email}
          onChange={(value) => update('email', value)}
          type="email"
        />
        <Field
          name="manager"
          label="Branch Manager (Full Name)"
          value={form.manager}
          required
          onChange={(value) => update('manager', value)}
          icon={<UserCircle size={17} />}
        />
        <Field
          name="managerContact"
          label="Manager Contact"
          value={form.managerContact}
          onChange={(value) => update('managerContact', value)}
        />
      </div>
      <WizardFooter action="Continue to Login Setup" onAction={onNext} />
    </section>
  );
}
function StepLogin({
  form,
  update,
  onBack,
  onNext,
}: {
  form: Form;
  update: (key: keyof Form, value: string | boolean) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <section className="panel wizard-panel">
      <WizardHeading
        icon={<UserCircle size={29} />}
        title="Login Setup"
        text="Create the branch manager's login account and device access"
      />
      <div className="wizard-login-grid">
        <div>
          <h3>Manager Account</h3>
          <div className="radio-row">
            <label>
              <input type="radio" checked readOnly />
              Create New Account
            </label>
            <label>
              <input type="radio" disabled />
              Assign Existing User
            </label>
          </div>
          <Field
            name="managerUsername"
            label="Username"
            value={form.managerUsername}
            required
            onChange={(value) => update('managerUsername', value)}
            icon={<UserCircle size={17} />}
          />
          <Field
            name="managerPassword"
            label="Password"
            value={form.managerPassword}
            required
            onChange={(value) => update('managerPassword', value)}
            type="password"
            icon={<LockKeyhole size={17} />}
          />
          <Field
            name="confirmPassword"
            label="Confirm Password"
            value={form.confirmPassword}
            required
            onChange={(value) => update('confirmPassword', value)}
            type="password"
            icon={<LockKeyhole size={17} />}
          />
        </div>
        <div>
          <label>
            Role <em>*</em>
            <div className="static-select">
              <ShieldCheck size={17} />
              Branch Manager
              <ChevronDown size={16} />
            </div>
          </label>
          <div className="device-card">
            <h3>
              <Monitor size={21} />
              Branch Computer Activation
            </h3>
            <p>Register this computer for the branch (offline & sync)</p>
            <Field
              name="deviceName"
              label="Device Name"
              value={form.deviceName}
              required
              onChange={(value) => update('deviceName', value)}
            />
            <label className="check-line">
              <input
                type="checkbox"
                checked={form.activateDevice}
                onChange={(event) =>
                  update('activateDevice', event.target.checked)
                }
              />
              Activate branch computer now
            </label>
          </div>
        </div>
      </div>
      <WizardFooter
        back
        onBack={onBack}
        action="Continue to Permissions"
        onAction={onNext}
      />
    </section>
  );
}
function StepPermissions({
  form,
  permissions,
  setPermissions,
  onBack,
  onCreate,
  saving,
}: {
  form: Form;
  permissions: Record<string, boolean>;
  setPermissions: Dispatch<SetStateAction<Record<string, boolean>>>;
  onBack: () => void;
  onCreate: () => void;
  saving: boolean;
}) {
  const toggle = (key: string) =>
    setPermissions((current) => ({ ...current, [key]: !current[key] }));
  return (
    <section className="panel wizard-panel">
      <WizardHeading
        icon={<ShieldCheck size={29} />}
        title="Branch Permissions"
        text={`Select what ${form.manager || 'the branch manager'} can access and do at this branch`}
      />
      <div className="permissions-grid">
        <div className="permission-box">
          <h3>Access Rights</h3>
          {accessRights.map(([key, label, detail]) => (
            <label className="permission-check" key={key}>
              <input
                type="checkbox"
                checked={!!permissions[key]}
                onChange={() => toggle(key)}
              />
              <span>
                <strong>{label}</strong>
                <small>{detail}</small>
              </span>
            </label>
          ))}
        </div>
        <div>
          <div className="permission-box">
            <h3>Action Permissions</h3>
            {actionRights.map(([key, label]) => (
              <div className="permission-toggle" key={key}>
                <span>{label}</span>
                <button
                  type="button"
                  aria-pressed={!!permissions[key]}
                  className={permissions[key] ? 'switch-on' : ''}
                  onClick={() => toggle(key)}
                >
                  <i />
                </button>
              </div>
            ))}
          </div>
          <div className="branch-note green">
            <LockKeyhole size={17} />
            <span>
              These permissions apply to the branch manager for{' '}
              <strong>{form.name || 'this branch'}</strong> only.
            </span>
          </div>
        </div>
      </div>
      <WizardFooter
        back
        onBack={onBack}
        action={saving ? 'Creating…' : 'Create Branch'}
        onAction={onCreate}
      />
    </section>
  );
}

function WizardHeading({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="wizard-heading">
      {icon}
      <div>
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
    </div>
  );
}
function WizardFooter({
  back = false,
  onBack,
  action,
  onAction,
}: {
  back?: boolean;
  onBack?: () => void;
  action: string;
  onAction: () => void;
}) {
  return (
    <div className="wizard-footer">
      {back ? (
        <button type="button" className="outline" onClick={onBack}>
          <ArrowLeft size={17} />
          Back
        </button>
      ) : (
        <span />
      )}
      {
        <button type="button" className="primary-button" onClick={onAction}>
          {action}
          <ArrowRight size={17} />
        </button>
      }
    </div>
  );
}
function Field({
  name,
  label,
  value,
  onChange,
  required,
  type = 'text',
  wide = false,
  icon,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
  wide?: boolean;
  icon?: ReactNode;
}) {
  return (
    <label className={wide ? 'wide-field' : ''}>
      {label}
      {required && <em> *</em>}
      <div className="wizard-input">
        {icon}
        <input
          data-testid={`branch-${name}`}
          name={name}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </label>
  );
}
function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className="summary-card">
      <div className={`summary-icon ${tone}`}>
        <Users size={21} />
      </div>
      <p>{label}</p>
      <strong>{value}</strong>
    </div>
  );
}
