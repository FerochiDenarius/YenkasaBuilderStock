import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from 'react';
import {
  Bell,
  Building2,
  Check,
  Download,
  Eye,
  EyeOff,
  Home,
  KeyRound,
  LockKeyhole,
  Monitor,
  Pencil,
  RefreshCw,
  Search,
  Save,
  Settings,
  ShieldCheck,
  Smartphone,
  SlidersHorizontal,
  Upload,
  UserCircle,
  Users,
} from 'lucide-react';
import type {
  OwnerAccount,
  OwnerActivity,
  OwnerSecurity,
} from '@yenkasa/contracts';
import { ownerApi } from './api';

const fallback: OwnerAccount = {
  fullName: 'Bright Kofi Ofosu Menya',
  role: 'Business Owner',
  phone: '+233 24 123 4567',
  email: 'bright@yenkasa.xyz',
  identificationType: 'Ghana Card',
  idNumber: 'GHA-123456789-0',
  dateOfBirth: '12 Jan 1989',
  gender: 'Male',
  photoRef: '',
};
const permissions = [
  'Manage company information',
  'Manage business branding',
  'Create and manage branches',
  'Create and manage user roles',
  'Access all branches and reports',
  'Configure system settings',
  'Approve critical changes',
];
const settingsItems: Array<[string, typeof Home]> = [
  ['Business Information', Building2],
  ['Owner Account', UserCircle],
  ['Users & Roles', Users],
  ['Branches', Building2],
  ['System Settings', Settings],
];

export function OwnerAccountPage({
  onNavigate,
}: {
  onNavigate?: (page: string) => void;
}) {
  const photoInput = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(fallback);
  const [savedValue, setSavedValue] = useState(fallback);
  const [editing, setEditing] = useState(false);
  const [section, setSection] = useState('Profile Information');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    ownerApi
      .get()
      .then((data) => {
        if (data) {
          setValue(data);
          setSavedValue(data);
        }
      })
      .catch((reason) =>
        setError(
          reason instanceof Error
            ? reason.message
            : 'Unable to load owner account.',
        ),
      );
  }, []);
  const update = (key: keyof OwnerAccount, next: string) => {
    setValue((current) => ({ ...current, [key]: next }));
    setStatus('');
    setError('');
  };
  const choosePhoto = () => photoInput.current?.click();
  const onPhotoSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      setError('Choose a PNG, JPG or WebP profile photo.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Profile photo must be 2 MB or smaller.');
      return;
    }
    const reader = new FileReader();
    reader.onerror = () =>
      setError('The selected profile photo could not be read.');
    reader.onload = () =>
      typeof reader.result === 'string' && update('photoRef', reader.result);
    reader.readAsDataURL(file);
  };
  const save = async () => {
    if (
      !value.fullName.trim() ||
      !value.role.trim() ||
      !value.phone.trim() ||
      !value.email.trim()
    ) {
      setError('Complete the required owner fields before saving.');
      setEditing(true);
      return;
    }
    setSaving(true);
    setError('');
    setStatus('Saving locally…');
    try {
      const saved = await ownerApi.save(value);
      setValue(saved);
      setSavedValue(saved);
      setStatus('Saved owner account locally to SQLite');
      setEditing(false);
    } catch (reason) {
      setStatus('');
      setError(
        reason instanceof Error
          ? reason.message
          : 'Unable to save owner account.',
      );
    } finally {
      setSaving(false);
    }
  };
  const reset = () => {
    setValue(savedValue);
    setEditing(false);
    setStatus('Changes reset');
    setError('');
  };
  const initials =
    value.fullName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase() || 'BO';
  const navigate = (page: string) => onNavigate?.(page);
  return (
    <div className="owner-reference-shell">
      <header className="owner-reference-topbar">
        <div className="reference-brand">
          <div className="reference-brand-mark">⌂</div>
          <div>
            <strong>
              Yenkasa<span>BuildersStock</span>
            </strong>
            <small>Building Materials Management</small>
          </div>
        </div>
        <nav className="reference-main-nav">
          <button type="button" onClick={() => navigate('Dashboard')}>
            <Home size={20} />
            Dashboard
          </button>
          <button type="button" onClick={() => navigate('Inventory')}>
            <Monitor size={20} />
            Inventory
          </button>
          <button type="button" onClick={() => navigate('Sales')}>
            <span className="nav-glyph">▱</span>Sales
          </button>
          <button type="button" onClick={() => navigate('Purchasing')}>
            <span className="nav-glyph">▱</span>Purchases
          </button>
          <button type="button" onClick={() => navigate('Customers')}>
            <Users size={20} />
            Customers
          </button>
          <button type="button" onClick={() => navigate('Reports')}>
            <Monitor size={20} />
            Reports
          </button>
        </nav>
        <button
          className="reference-branch"
          type="button"
          onClick={() =>
            setStatus(
              'Branch selector is available when branch access is configured.',
            )
          }
        >
          Branch: Oyarifa <span>⌄</span>
        </button>
        <button
          className="reference-user"
          type="button"
          onClick={() => setStatus('Owner profile menu')}
        >
          {initials}
        </button>
      </header>
      <aside className="owner-reference-sidebar">
        <div className="reference-settings-title">
          <SlidersHorizontal size={24} />
          Settings
        </div>
        {settingsItems.map(([label, Icon]) => (
          <button
            type="button"
            key={label}
            className={label === 'Owner Account' ? 'active' : ''}
            onClick={() =>
              label === 'Owner Account' ? undefined : navigate(label)
            }
          >
            <Icon size={22} />
            {label}
          </button>
        ))}
      </aside>
      <main className="owner-reference-main">
        <div className="reference-owner-layout">
          <section className="reference-section-menu">
            {['Profile Information', 'Security & Login', 'Activity Log'].map(
              (label) => (
                <button
                  type="button"
                  key={label}
                  className={section === label ? 'active' : ''}
                  onClick={() => setSection(label)}
                >
                  <span>
                    {label === 'Profile Information' ? (
                      <UserCircle size={23} />
                    ) : label === 'Security & Login' ? (
                      <LockKeyhole size={23} />
                    ) : (
                      <Monitor size={23} />
                    )}
                  </span>
                  {label}
                </button>
              ),
            )}
          </section>
          <section className="reference-content">
            {section === 'Profile Information' ? (
              <>
                <section className="reference-profile-card">
                  <button
                    className="reference-edit"
                    type="button"
                    onClick={() => setEditing(true)}
                  >
                    <Pencil size={17} /> Edit Profile
                  </button>
                  <div className="reference-profile-avatar">
                    {value.photoRef ? (
                      <img src={value.photoRef} alt="Owner profile" />
                    ) : (
                      <div className="owner-initials">{initials}</div>
                    )}
                    <button
                      type="button"
                      aria-label="Change profile photo"
                      onClick={choosePhoto}
                    >
                      <Upload size={15} />
                    </button>
                  </div>
                  <div className="reference-profile-info">
                    <div className="reference-profile-title">
                      <h2>Owner Profile</h2>
                      <span>Active</span>
                    </div>
                    {editing ? (
                      <div className="reference-edit-form">
                        <OwnerField
                          name="fullName"
                          label="Full Name"
                          required
                          value={value.fullName}
                          onChange={(v) => update('fullName', v)}
                        />
                        <OwnerField
                          name="phone"
                          label="Phone"
                          required
                          value={value.phone}
                          onChange={(v) => update('phone', v)}
                        />
                        <OwnerField
                          name="email"
                          label="Email"
                          required
                          value={value.email}
                          onChange={(v) => update('email', v)}
                        />
                        <OwnerField
                          name="gender"
                          label="Gender"
                          value={value.gender}
                          onChange={(v) => update('gender', v)}
                          select
                          options={['Male', 'Female', 'Prefer not to say']}
                        />
                        <OwnerField
                          name="dateOfBirth"
                          label="Date of Birth"
                          value={value.dateOfBirth}
                          onChange={(v) => update('dateOfBirth', v)}
                        />
                        <OwnerField
                          name="identificationType"
                          label="ID Type"
                          value={value.identificationType}
                          onChange={(v) => update('identificationType', v)}
                          select
                          options={['Ghana Card', 'Passport', 'Driver Licence']}
                        />
                        <OwnerField
                          name="idNumber"
                          label="ID Number"
                          value={value.idNumber}
                          onChange={(v) => update('idNumber', v)}
                        />
                        <OwnerField
                          name="role"
                          label="Role"
                          required
                          value={value.role}
                          onChange={(v) => update('role', v)}
                        />
                      </div>
                    ) : (
                      <div className="reference-profile-details">
                        <Detail label="Full Name" value={value.fullName} />
                        <Detail label="Phone" value={value.phone} />
                        <Detail label="Email" value={value.email} />
                        <Detail label="Gender" value={value.gender} />
                        <Detail
                          label="Date of Birth"
                          value={value.dateOfBirth}
                        />
                        <Detail
                          label="ID Type"
                          value={value.identificationType}
                        />
                        <Detail label="ID Number" value={value.idNumber} />
                      </div>
                    )}
                  </div>
                  <input
                    ref={photoInput}
                    data-testid="owner-photo-input"
                    className="visually-hidden-file"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={onPhotoSelected}
                  />
                </section>
                <div className="reference-cards">
                  <ReferenceCard
                    title="Business Ownership"
                    icon={<Building2 size={27} />}
                    rows={[
                      ['Company', 'Yenkasa Builders Supplies Ltd'],
                      ['Owner Since', '01 Nov 2026'],
                      ['Ownership Type', 'Primary Owner'],
                      ['Account Scope', 'Full Access'],
                    ]}
                  />
                  <section className="reference-card">
                    <h3>
                      <ShieldCheck size={27} />
                      Owner Permissions
                    </h3>
                    {permissions.map((permission) => (
                      <div className="reference-permission" key={permission}>
                        <Check size={17} />
                        {permission}
                      </div>
                    ))}
                  </section>
                </div>
              </>
            ) : (
              <ReferenceSubsection section={section} />
            )}
          </section>
        </div>
        {section === 'Profile Information' && (
          <div className="reference-actions">
            <button
              className="reference-reset"
              type="button"
              data-testid="owner-reset"
              onClick={reset}
            >
              ↶ &nbsp;Reset Changes
            </button>
            <button
              className="reference-save"
              type="button"
              data-testid="owner-save"
              disabled={saving}
              onClick={save}
            >
              <Save size={18} />
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
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
          </div>
        )}
      </main>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="reference-detail">
      <span>{label}</span>
      <strong>{value || '—'}</strong>
    </div>
  );
}
function OwnerField({
  name,
  label,
  required,
  value,
  onChange,
  select,
  options,
}: {
  name: string;
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  select?: boolean;
  options?: string[];
}) {
  return (
    <label className="reference-field">
      {label}
      {required && <em> *</em>}
      {select ? (
        <select
          name={name}
          data-testid={`owner-${name}`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          {options?.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      ) : (
        <input
          name={name}
          data-testid={`owner-${name}`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </label>
  );
}
function ReferenceCard({
  title,
  icon,
  rows,
}: {
  title: string;
  icon: ReactNode;
  rows: string[][];
}) {
  return (
    <section className="reference-card">
      <h3>
        {icon}
        {title}
      </h3>
      {rows.map(([label, value]) => (
        <div className="reference-row" key={label}>
          <span>{label}</span>
          {label === 'Account Scope' ? (
            <b>{value}</b>
          ) : (
            <strong>{value}</strong>
          )}
        </div>
      ))}
    </section>
  );
}
function ReferenceSubsection({ section }: { section: string }) {
  if (section === 'Security & Login') return <OwnerSecuritySection />;
  if (section === 'Activity Log') return <OwnerActivitySection />;
  return null;
}

const fallbackSecurity: OwnerSecurity = {
  username: 'brightkofi',
  email: 'bright@yenkasa.xyz',
  passwordSet: true,
  twoFactorEnabled: true,
  emailNotifications: true,
  smsNotifications: false,
  recoveryPhone: '+233 24 123 4567',
  recoveryEmail: 'bright@yenkasa.xyz',
};

function OwnerSecuritySection() {
  const [value, setValue] = useState<OwnerSecurity>(fallbackSecurity);
  const [savedValue, setSavedValue] = useState<OwnerSecurity>(fallbackSecurity);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  useEffect(() => {
    ownerApi
      .getSecurity()
      .then((data) => {
        setValue(data);
        setSavedValue(data);
      })
      .catch((reason) =>
        setError(
          reason instanceof Error
            ? reason.message
            : 'Unable to load security settings.',
        ),
      );
  }, []);
  const update = <K extends keyof OwnerSecurity>(
    key: K,
    next: OwnerSecurity[K],
  ) => {
    setValue((current) => ({ ...current, [key]: next }));
    setStatus('');
    setError('');
  };
  const saveSecurity = async () => {
    if (!value.username.trim() || !value.email.trim()) {
      setError('Username and email are required.');
      return;
    }
    setSaving(true);
    setStatus('Saving security settings…');
    setError('');
    try {
      const saved = await ownerApi.saveSecurity({
        ...value,
        password: password || undefined,
      });
      setValue(saved);
      setSavedValue(saved);
      setPassword('');
      setStatus('Saved security settings to SQLite');
    } catch (reason) {
      setStatus('');
      setError(
        reason instanceof Error
          ? reason.message
          : 'Unable to save security settings.',
      );
    } finally {
      setSaving(false);
    }
  };
  const reset = () => {
    setValue(savedValue);
    setPassword('');
    setStatus('Changes reset');
    setError('');
  };
  const manageTwoFactor = () => {
    update('twoFactorEnabled', !value.twoFactorEnabled);
    setStatus(
      value.twoFactorEnabled
        ? 'Two-factor authentication will be disabled after saving.'
        : 'Two-factor authentication will be enabled after saving.',
    );
  };
  const generateRecoveryCodes = () =>
    setRecoveryCodes(
      Array.from(
        { length: 6 },
        () =>
          `${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      ),
    );
  return (
    <div className="owner-security-page">
      <section className="reference-card owner-section-heading">
        <div className="owner-section-icon">
          <UserCircle size={28} />
        </div>
        <div>
          <h2>Security &amp; Login</h2>
          <p>
            Manage your login credentials, authentication and account security.
          </p>
        </div>
      </section>
      <div className="owner-security-grid">
        <section className="reference-card owner-security-card">
          <h3>
            <UserCircle size={24} />
            Login Details
          </h3>
          <label className="security-field">
            Username
            <input
              data-testid="owner-security-username"
              value={value.username}
              onChange={(event) => update('username', event.target.value)}
            />
          </label>
          <label className="security-field">
            Email Address
            <input
              data-testid="owner-security-email"
              type="email"
              value={value.email}
              onChange={(event) => update('email', event.target.value)}
            />
          </label>
          <label className="security-field">
            Password
            <input
              data-testid="owner-security-password"
              type={showPassword ? 'text' : 'password'}
              placeholder={
                value.passwordSet ? '••••••••••••' : 'Set a password'
              }
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          <button
            className="security-outline-button"
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}{' '}
            {showPassword ? 'Hide Password' : 'Show Password'}
          </button>
        </section>
        <section className="reference-card owner-security-card">
          <div className="security-card-title">
            <h3>
              <ShieldCheck size={24} />
              Two-Factor Authentication (2FA)
            </h3>
            <button
              className={`security-toggle ${value.twoFactorEnabled ? 'on' : ''}`}
              type="button"
              aria-label="Toggle two-factor authentication"
              aria-pressed={value.twoFactorEnabled}
              data-testid="owner-security-2fa"
              onClick={manageTwoFactor}
            >
              <i />
            </button>
          </div>
          <p className="security-help">
            Add an extra layer of security to your account.
          </p>
          <div
            className={`security-status ${value.twoFactorEnabled ? 'enabled' : ''}`}
          >
            {value.twoFactorEnabled ? '✓ 2FA is enabled' : '2FA is disabled'}
          </div>
          <div className="security-button-row">
            <button
              className="security-outline-button"
              type="button"
              onClick={manageTwoFactor}
            >
              <KeyRound size={16} />
              Manage 2FA
            </button>
            <button
              className="security-outline-button"
              type="button"
              onClick={generateRecoveryCodes}
            >
              Recovery Codes
            </button>
          </div>
          {recoveryCodes.length > 0 && (
            <div className="recovery-codes">
              {recoveryCodes.map((code) => (
                <code key={code}>{code}</code>
              ))}
            </div>
          )}
        </section>
        <section className="reference-card owner-security-card">
          <div className="security-card-title">
            <h3>
              <Bell size={24} />
              Login Notifications
            </h3>
            <button
              className={`security-toggle ${value.emailNotifications || value.smsNotifications ? 'on' : ''}`}
              type="button"
              aria-label="Toggle login notifications"
              aria-pressed={value.emailNotifications || value.smsNotifications}
              onClick={() => {
                const enabled = !(
                  value.emailNotifications || value.smsNotifications
                );
                update('emailNotifications', enabled);
                update('smsNotifications', enabled);
              }}
            >
              <i />
            </button>
          </div>
          <p className="security-help">
            Get alerts when your account is signed in on a new device.
          </p>
          <label className="security-check">
            <input
              data-testid="owner-security-email-notifications"
              type="checkbox"
              checked={value.emailNotifications}
              onChange={(event) =>
                update('emailNotifications', event.target.checked)
              }
            />
            Email Notifications
          </label>
          <label className="security-check">
            <input
              data-testid="owner-security-sms-notifications"
              type="checkbox"
              checked={value.smsNotifications}
              onChange={(event) =>
                update('smsNotifications', event.target.checked)
              }
            />
            SMS Notifications
          </label>
        </section>
        <section className="reference-card owner-security-card">
          <h3>
            <Smartphone size={24} />
            Trusted Devices
          </h3>
          <p className="security-help">
            Devices that have signed in to your account.
          </p>
          <div className="trusted-device">
            <Smartphone size={23} />
            <div>
              <strong>This device</strong>
              <small>Local Electron app · Active now</small>
            </div>
            <button
              type="button"
              aria-label="Trusted device options"
              onClick={() =>
                setStatus(
                  'The current device cannot be revoked while it is in use.',
                )
              }
            >
              •••
            </button>
          </div>
          <div className="trusted-device">
            <Monitor size={23} />
            <div>
              <strong>Previously trusted device</strong>
              <small>Local SQLite record · Review required</small>
            </div>
            <button
              type="button"
              onClick={() =>
                setStatus('Device review is available from Device Activation.')
              }
            >
              •••
            </button>
          </div>
        </section>
        <section className="reference-card owner-security-card">
          <h3>
            <ShieldCheck size={24} />
            Account Recovery
          </h3>
          <p className="security-help">
            Set up recovery options to regain access if you cannot log in.
          </p>
          <label className="security-field">
            Recovery Phone
            <input
              value={value.recoveryPhone}
              onChange={(event) => update('recoveryPhone', event.target.value)}
            />
          </label>
          <label className="security-field">
            Recovery Email
            <input
              type="email"
              value={value.recoveryEmail}
              onChange={(event) => update('recoveryEmail', event.target.value)}
            />
          </label>
          <div className="verified-row">
            <span>✓ Verified options are stored locally</span>
          </div>
        </section>
      </div>
      <div className="owner-security-actions">
        <button className="reference-reset" type="button" onClick={reset}>
          ↶ &nbsp;Reset Changes
        </button>
        <button
          className="reference-save"
          type="button"
          data-testid="owner-security-save"
          disabled={saving}
          onClick={saveSecurity}
        >
          <Save size={17} />
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
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
      </div>
    </div>
  );
}

function OwnerActivitySection() {
  const [rows, setRows] = useState<OwnerActivity[]>([]);
  const [activityType, setActivityType] = useState('All Activities');
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const load = () => {
    setError('');
    ownerApi
      .activity()
      .then(setRows)
      .catch((reason) =>
        setError(
          reason instanceof Error
            ? reason.message
            : 'Unable to load activity log.',
        ),
      );
  };
  useEffect(load, []);
  const filtered = rows.filter((row) => {
    const matchesType =
      activityType === 'All Activities' || row.activityType === activityType;
    const matchesQuery =
      !query.trim() ||
      `${row.activityType} ${row.details} ${row.device}`
        .toLowerCase()
        .includes(query.toLowerCase());
    const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const matchesDate =
      dateRange === 'All Time' ||
      Number.isNaN(Date.parse(row.createdAt)) ||
      Date.parse(row.createdAt) >= cutoff;
    return matchesType && matchesQuery && matchesDate;
  });
  const exportLog = () => {
    const csv = [
      ['Date & Time', 'Activity', 'Details', 'IP / Device'],
      ...filtered.map((row) => [
        row.createdAt,
        row.activityType,
        row.details,
        row.device,
      ]),
    ]
      .map((line) =>
        line.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(','),
      )
      .join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'owner-activity-log.csv';
    link.click();
    URL.revokeObjectURL(url);
    setStatus('Activity log exported');
  };
  return (
    <div className="owner-activity-page">
      <section className="reference-card owner-section-heading">
        <div className="owner-section-icon">
          <Monitor size={28} />
        </div>
        <div>
          <h2>Activity Log</h2>
          <p>
            Track important account activities, security events and changes to
            your owner account.
          </p>
        </div>
        <button
          className="security-outline-button activity-export"
          type="button"
          data-testid="owner-activity-export"
          onClick={exportLog}
        >
          <Download size={16} />
          Export
        </button>
      </section>
      <section className="reference-card owner-activity-card">
        <div className="owner-activity-toolbar">
          <label>
            Activity Type
            <select
              data-testid="owner-activity-type"
              value={activityType}
              onChange={(event) => setActivityType(event.target.value)}
            >
              <option>All Activities</option>
              <option>Login</option>
              <option>Security</option>
              <option>Profile Update</option>
              <option>Branch</option>
              <option>User Management</option>
              <option>System Settings</option>
              <option>Logout</option>
            </select>
          </label>
          <label>
            Date Range
            <select
              data-testid="owner-activity-range"
              value={dateRange}
              onChange={(event) => setDateRange(event.target.value)}
            >
              <option>Last 30 Days</option>
              <option>All Time</option>
            </select>
          </label>
          <label className="activity-search">
            <Search size={16} />
            <input
              data-testid="owner-activity-search"
              placeholder="Search activity..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <button
            className="activity-refresh"
            type="button"
            data-testid="owner-activity-refresh"
            onClick={load}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
        <div className="owner-activity-table">
          <div className="owner-activity-row activity-head">
            <strong>Date &amp; Time</strong>
            <strong>Activity</strong>
            <strong>Details</strong>
            <strong>IP / Device</strong>
          </div>
          {filtered.map((row) => (
            <div className="owner-activity-row" key={row.id}>
              <span>{formatActivityDate(row.createdAt)}</span>
              <strong>{row.activityType}</strong>
              <span>{row.details}</span>
              <span>{row.device}</span>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="activity-empty">
              No activities match the selected filters.
            </p>
          )}
        </div>
        <div className="activity-footer">
          Showing {filtered.length} of {rows.length} activities
        </div>
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
      </section>
    </div>
  );
}

function formatActivityDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
}
