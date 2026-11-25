import { useEffect, useState } from 'react';
import { Building2, Settings } from 'lucide-react';
import type { CompanyRegistration } from '@yenkasa/contracts';
import { companyApi } from './api';

const initial: CompanyRegistration = {
  registeredName: '',
  tradingName: '',
  category: '',
  email: '',
  phone: '',
  country: 'Ghana',
  address: '',
  currency: 'GHS – Ghana Cedi (GH₵)',
  timezone: 'Africa/Accra (GMT+00:00)',
  brandColor: '#0B2D6B',
  tagline: '',
  logoRef: '',
  secondaryColor: '#F7B500',
  accentColor: '#D7263D',
  showLogoReceipts: true,
  showLogoInvoices: true,
  useBrandColours: true,
};
const categories = [
  'Building Materials',
  'Construction',
  'Retail',
  'Hardware',
  'Other',
];
const countries = ['Ghana', 'Nigeria', 'Togo', 'Côte d’Ivoire'];
const currencies = [
  'GHS – Ghana Cedi (GH₵)',
  'NGN – Nigerian Naira (₦)',
  'USD – US Dollar ($)',
];
const timezones = [
  'Africa/Accra (GMT+00:00)',
  'Africa/Lagos (GMT+01:00)',
  'UTC (GMT+00:00)',
];
type FieldErrors = Partial<
  Record<
    | 'registeredName'
    | 'tradingName'
    | 'category'
    | 'email'
    | 'phone'
    | 'country'
    | 'address'
    | 'currency'
    | 'timezone',
    string
  >
>;

export function BusinessInfoPage() {
  const [value, setValue] = useState(initial);
  const [savedValue, setSavedValue] = useState(initial);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  useEffect(() => {
    companyApi
      .get()
      .then((data) => {
        if (data) {
          setValue({ ...initial, ...data });
          setSavedValue({ ...initial, ...data });
        }
      })
      .catch((reason) =>
        setError(
          reason instanceof Error
            ? reason.message
            : 'Unable to load company information.',
        ),
      )
      .finally(() => setLoading(false));
  }, []);
  const update = (key: keyof CompanyRegistration, next: string) => {
    setValue((current) => ({ ...current, [key]: next }));
    setMessage('');
    setError('');
    setFieldErrors((current) => ({ ...current, [key]: undefined }));
  };
  const validate = (): FieldErrors => {
    const errors: FieldErrors = {};
    const required: Array<keyof FieldErrors> = [
      'registeredName',
      'tradingName',
      'category',
      'email',
      'phone',
      'country',
      'address',
      'currency',
      'timezone',
    ];
    required.forEach((key) => {
      if (!String(value[key] ?? '').trim())
        errors[key] = 'This field is required.';
    });
    if (
      value.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email.trim())
    )
      errors.email = 'Enter a valid business email address.';
    if (value.phone.trim() && !/^[+0-9][0-9 ()-]{7,}$/.test(value.phone.trim()))
      errors.phone = 'Enter a valid phone number.';
    return errors;
  };
  const save = async () => {
    setMessage('');
    setError('');
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length) {
      setError('Review the highlighted fields before saving.');
      return;
    }
    setSaving(true);
    try {
      const saved = await companyApi.save({
        ...value,
        registeredName: value.registeredName.trim(),
        tradingName: value.tradingName.trim(),
        address: value.address.trim(),
        phone: value.phone.trim(),
      });
      setValue(saved);
      setSavedValue(saved);
      setMessage('Saved locally to SQLite');
      window.dispatchEvent(new Event('yenkasa-branding-changed'));
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'Unable to save company information.',
      );
    } finally {
      setSaving(false);
    }
  };
  const reset = () => {
    setValue(savedValue);
    setMessage('Changes reset');
    setError('');
    setFieldErrors({});
  };
  return (
    <div className="setup-page info-page">
      <div className="setup-breadcrumb">
        ⌂ &nbsp;›&nbsp; Company Setup &nbsp;›&nbsp;{' '}
        <strong>Business Information</strong>
      </div>
      <section className="setup-title">
        <div className="setup-title-icon">
          <Building2 size={31} />
        </div>
        <div>
          <h2>Business Information</h2>
          <p>Manage your registered company details and business profile.</p>
        </div>
      </section>
      <div className="info-design-grid">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Company Information</h2>
              <p>Keep your official business details up to date.</p>
            </div>
          </div>
          {loading ? (
            <div className="page-loading">
              Loading saved company information…
            </div>
          ) : (
            <>
              <div className="setup-fields">
                <Field
                  name="registeredName"
                  label="Registered Company Name"
                  value={value.registeredName}
                  onChange={(v) => update('registeredName', v)}
                  required
                  error={fieldErrors.registeredName}
                />
                <Field
                  name="tradingName"
                  label="Trading / Business Name"
                  value={value.tradingName}
                  onChange={(v) => update('tradingName', v)}
                  required
                  error={fieldErrors.tradingName}
                />
                <SelectField
                  name="category"
                  label="Business Category"
                  value={value.category}
                  options={categories}
                  onChange={(v) => update('category', v)}
                  required
                  error={fieldErrors.category}
                />
                <Field
                  name="email"
                  label="Business Email"
                  value={value.email}
                  onChange={(v) => update('email', v)}
                  required
                  type="email"
                  error={fieldErrors.email}
                />
                <Field
                  name="phone"
                  label="Phone Number"
                  value={value.phone}
                  onChange={(v) => update('phone', v)}
                  required
                  error={fieldErrors.phone}
                />
                <SelectField
                  name="country"
                  label="Country"
                  value={value.country}
                  options={countries}
                  onChange={(v) => update('country', v)}
                  required
                  error={fieldErrors.country}
                />
                <Field
                  name="address"
                  label="Business Address"
                  value={value.address}
                  onChange={(v) => update('address', v)}
                  required
                  textarea
                  error={fieldErrors.address}
                />
                <SelectField
                  name="currency"
                  label="Currency"
                  value={value.currency}
                  options={currencies}
                  onChange={(v) => update('currency', v)}
                  required
                  error={fieldErrors.currency}
                />
                <SelectField
                  name="timezone"
                  label="Timezone"
                  value={value.timezone}
                  options={timezones}
                  onChange={(v) => update('timezone', v)}
                  required
                  error={fieldErrors.timezone}
                />
              </div>
              <div className="setup-actions">
                <button
                  className="outline"
                  data-testid="business-info-reset"
                  onClick={reset}
                >
                  Reset Changes
                </button>
                <button
                  className="primary-button"
                  data-testid="business-info-save"
                  disabled={saving}
                  onClick={save}
                >
                  <Settings size={16} />
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
                {message && (
                  <small className="save-status" role="status">
                    {message}
                  </small>
                )}
                {error && (
                  <small className="save-error" role="alert">
                    {error}
                  </small>
                )}
              </div>
            </>
          )}
        </section>
        <section className="panel setup-info-side">
          <div className="panel-heading">
            <div>
              <h2>Company Profile</h2>
              <p>How your company appears across the application.</p>
            </div>
          </div>
          <div className="company-profile-preview">
            <div className="company-emblem">
              <Building2 size={42} />
            </div>
            <h3>{value.registeredName || 'Your company'}</h3>
            <p>
              {value.category || 'Business category'} · {value.country}
            </p>
            <span>
              {value.currency} · {value.timezone}
            </span>
          </div>
        </section>
      </div>
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
  textarea = false,
  error,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
  textarea?: boolean;
  error?: string;
}) {
  const describedBy = error ? `${name}-error` : undefined;
  return (
    <label className={error ? 'field-invalid' : undefined}>
      {label}
      {required && <em> *</em>}
      {textarea ? (
        <textarea
          name={name}
          data-testid={`business-info-${name}`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
        />
      ) : (
        <input
          name={name}
          data-testid={`business-info-${name}`}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
        />
      )}
      {error && (
        <small id={describedBy} className="field-error">
          {error}
        </small>
      )}
    </label>
  );
}
function SelectField({
  name,
  label,
  value,
  options,
  onChange,
  required,
  error,
}: {
  name: string;
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
}) {
  const describedBy = error ? `${name}-error` : undefined;
  return (
    <label className={error ? 'field-invalid' : undefined}>
      {label}
      {required && <em> *</em>}
      <select
        name={name}
        data-testid={`business-info-${name}`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && (
        <small id={describedBy} className="field-error">
          {error}
        </small>
      )}
    </label>
  );
}
