import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import {
  Building2,
  Image,
  Palette,
  Settings,
  Trash2,
  Upload,
  UserCircle,
} from 'lucide-react';
import type {
  CompanyRegistration,
  DocumentTemplateContent,
  DocumentTemplateItem,
  DocumentTemplateSettings,
  DocumentTemplateStyles,
} from '@yenkasa/contracts';
import { companyApi } from './api';

const fallback: CompanyRegistration = {
  registeredName: 'Yenkasa Builders Supplies Ltd',
  tradingName: 'Yenkasa Builders',
  category: 'Building Materials',
  email: 'info@yenkasa.xyz',
  phone: '+233 24 567 8900',
  country: 'Ghana',
  address: 'Oyarifa Main Road, Accra, Greater Accra Region, Ghana',
  currency: 'GHS – Ghana Cedi (GH₵)',
  timezone: 'Africa/Accra (GMT+00:00)',
  brandColor: '#0B2D6B',
  tagline: 'Quality Building Materials for Every Project',
  logoRef: '',
  secondaryColor: '#F7B500',
  accentColor: '#D7263D',
  showLogoReceipts: true,
  showLogoInvoices: true,
  useBrandColours: true,
  documentTemplates: {
    selectedDocument: 'Invoice Template',
    layoutStyle: 'Classic',
    pageSize: 'A4 (210 × 297 mm)',
    showCompanyLogo: true,
    showCompanyDetails: true,
    showBranchInformation: true,
    showFooterMessage: true,
    footerMessage: 'Thank you for your business!',
    templateId: 'invoice-classic-default',
    templateName: 'Classic Invoice',
    version: 1,
    styles: {
      headingFontFamily: 'Arial',
      headingFontSize: '20',
      headingColor: '#0B7E34',
      headingBold: true,
      logoWidth: '170',
      logoHeight: '88',
      logoOffsetX: '0',
      logoOffsetY: '0',
    },
    content: {
      companyName: 'Yenkasa Builders Supplies Ltd',
      branchName: 'Oyarifa Branch, Accra',
      companyPhone: '+233 24 123 4567',
      companyEmail: 'info@yenkasa.xyz',
      invoiceNumber: 'INV-000218',
      date: '22 Jan 2026',
      dueDate: '29 Jan 2026',
      billToName: 'BuildRight Construction Ltd',
      billToAddress: 'P. O. Box CT 456, Accra',
      billToPhone: '+233 55 987 6543',
      paymentTerms: 'Cash / Credit',
      notes:
        'Goods are not returnable after delivery.\nPlease keep this invoice for your records.',
      items: [
        {
          description: 'Cement (50kg)',
          quantity: '20',
          unit: 'bags',
          unitPrice: '85.00',
        },
        {
          description: 'Roofing Sheet (0.45mm)',
          quantity: '10',
          unit: 'pcs',
          unitPrice: '125.00',
        },
        {
          description: 'PVC Pipe 4" (6m)',
          quantity: '5',
          unit: 'pcs',
          unitPrice: '180.00',
        },
      ],
      discountPercent: '5',
      vatPercent: '15',
      amountPaid: '0',
    },
  },
};

export function ConnectedBusinessInfo() {
  const [value, setValue] = useState(fallback);
  const [status, setStatus] = useState('');
  useEffect(() => {
    companyApi
      .get()
      .then((data) => data && setValue({ ...fallback, ...data }))
      .catch(() =>
        setStatus('Using local sample values until the API is available.'),
      );
  }, []);
  const update = (key: keyof CompanyRegistration, next: string) =>
    setValue((current) => ({ ...current, [key]: next }));
  const save = async () => {
    setStatus('Saving locally…');
    try {
      await companyApi.save(value);
      setStatus('Saved locally');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to save');
    }
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
          <div className="setup-fields">
            <ConnectedField
              label="Registered Company Name"
              value={value.registeredName}
              onChange={(v) => update('registeredName', v)}
              required
            />
            <ConnectedField
              label="Trading / Business Name"
              value={value.tradingName}
              onChange={(v) => update('tradingName', v)}
              required
            />
            <ConnectedField
              label="Business Category"
              value={value.category}
              onChange={(v) => update('category', v)}
              required
            />
            <ConnectedField
              label="Business Email"
              value={value.email}
              onChange={(v) => update('email', v)}
              required
            />
            <ConnectedField
              label="Phone Number"
              value={value.phone}
              onChange={(v) => update('phone', v)}
              required
            />
            <ConnectedField
              label="Country"
              value={value.country}
              onChange={(v) => update('country', v)}
              required
            />
            <label className="wide-field">
              Business Address <em>*</em>
              <textarea
                value={value.address}
                onChange={(e) => update('address', e.target.value)}
              />
            </label>
            <ConnectedField
              label="Currency"
              value={value.currency}
              onChange={(v) => update('currency', v)}
              required
            />
            <ConnectedField
              label="Timezone"
              value={value.timezone}
              onChange={(v) => update('timezone', v)}
              required
            />
          </div>
          <div className="setup-actions">
            <button className="outline" onClick={() => setValue(fallback)}>
              Reset Changes
            </button>
            <button className="primary-button" onClick={save}>
              <Settings size={16} />
              Save Changes
            </button>
            {status && <small className="save-status">{status}</small>}
          </div>
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
            <h3>{value.registeredName}</h3>
            <p>
              {value.category} · {value.country}
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

export function ConnectedBranding() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(fallback);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [previewTab, setPreviewTab] = useState('Application');
  const [brandSection, setBrandSection] = useState<
    'Brand Identity' | 'Document Templates' | 'Brand Preview'
  >('Brand Identity');
  useEffect(() => {
    companyApi
      .get()
      .then((data) => {
        if (data) {
          const loaded = {
            ...fallback,
            ...data,
            documentTemplates: {
              ...fallback.documentTemplates,
              ...data.documentTemplates,
              styles: {
                ...fallback.documentTemplates.styles,
                ...data.documentTemplates?.styles,
              },
              content: {
                ...fallback.documentTemplates.content,
                ...data.documentTemplates?.content,
                items:
                  data.documentTemplates?.content?.items ??
                  fallback.documentTemplates.content.items,
              },
            },
          };
          setValue(loaded);
        }
      })
      .catch((reason) =>
        setError(
          reason instanceof Error ? reason.message : 'Unable to load branding.',
        ),
      );
  }, []);
  const update = (key: keyof CompanyRegistration, next: string | boolean) => {
    setValue((current) => ({ ...current, [key]: next }));
    setStatus('');
    setError('');
  };
  const updateTemplate = <K extends keyof DocumentTemplateSettings>(
    key: K,
    next: DocumentTemplateSettings[K],
  ) => {
    setValue((current) => ({
      ...current,
      documentTemplates: { ...current.documentTemplates, [key]: next },
    }));
    setStatus('');
    setError('');
  };
  const updateTemplateContent = <K extends keyof DocumentTemplateContent>(
    key: K,
    next: DocumentTemplateContent[K],
  ) => {
    setValue((current) => ({
      ...current,
      documentTemplates: {
        ...current.documentTemplates,
        content: { ...current.documentTemplates.content, [key]: next },
      },
    }));
    setStatus('');
    setError('');
  };
  const chooseLogo = () => {
    setError('');
    fileInputRef.current?.click();
  };
  const onLogoSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    const allowed = ['image/png', 'image/jpeg', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setError('Choose a PNG, JPG or WebP image.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Logo must be 2 MB or smaller.');
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => setError('The selected logo could not be read.');
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        update('logoRef', reader.result);
        setStatus('Logo selected; save branding to persist it.');
      }
    };
    reader.readAsDataURL(file);
  };
  const validate = () => {
    const problems: string[] = [];
    if (!value.tradingName.trim()) problems.push('Business name is required.');
    if (
      ![value.brandColor, value.secondaryColor, value.accentColor].every(
        (colour) => /^#[0-9a-f]{6}$/i.test(colour),
      )
    )
      problems.push(
        'Brand colours must be six-digit hex values such as #0B2D6B.',
      );
    const template = value.documentTemplates;
    const content = template.content;
    if (!content.companyName.trim())
      problems.push('Document company name is required.');
    if (!content.invoiceNumber.trim())
      problems.push('Invoice number is required.');
    if (!content.date.trim()) problems.push('Invoice date is required.');
    if (!content.billToName.trim()) problems.push('Customer name is required.');
    if (!content.items.length)
      problems.push('At least one invoice item is required.');
    content.items.forEach((item, index) => {
      const quantity = Number(item.quantity);
      const unitPrice = Number(item.unitPrice);
      if (!item.description.trim())
        problems.push(`Item ${index + 1} needs an item name.`);
      if (!item.unit.trim()) problems.push(`Item ${index + 1} needs a unit.`);
      if (!Number.isFinite(quantity) || quantity <= 0)
        problems.push(`Item ${index + 1} quantity must be greater than zero.`);
      if (!Number.isFinite(unitPrice) || unitPrice < 0)
        problems.push(`Item ${index + 1} unit price must be zero or greater.`);
    });
    const discount = Number(content.discountPercent);
    const vat = Number(content.vatPercent);
    if (!Number.isFinite(discount) || discount < 0 || discount > 100)
      problems.push('Discount must be between 0 and 100 percent.');
    if (!Number.isFinite(vat) || vat < 0 || vat > 100)
      problems.push('VAT must be between 0 and 100 percent.');
    return problems;
  };
  const save = async () => {
    const problems = validate();
    if (problems.length) {
      setError(problems.join(' '));
      setStatus('');
      return;
    }
    setSaving(true);
    setStatus('Saving locally…');
    setError('');
    try {
      const { templates: existingTemplates, ...currentTemplate } =
        value.documentTemplates;
      const toSave = {
        ...value,
        documentTemplates: {
          ...value.documentTemplates,
          templates: {
            ...(existingTemplates ?? {}),
            [value.documentTemplates.selectedDocument]: currentTemplate,
          },
          version: Math.max(1, value.documentTemplates.version) + 1,
        },
      };
      const saved = await companyApi.save(toSave);
      setValue({
        ...fallback,
        ...saved,
        documentTemplates: {
          ...fallback.documentTemplates,
          ...saved.documentTemplates,
          content: {
            ...fallback.documentTemplates.content,
            ...saved.documentTemplates?.content,
            items:
              saved.documentTemplates?.content?.items ??
              fallback.documentTemplates.content.items,
          },
          styles: {
            ...fallback.documentTemplates.styles,
            ...saved.documentTemplates?.styles,
          },
          templates: saved.documentTemplates?.templates,
        },
      });
      setStatus('Saved branding locally to SQLite');
    } catch (reason) {
      setStatus('');
      setError(
        reason instanceof Error ? reason.message : 'Unable to save branding.',
      );
    } finally {
      setSaving(false);
    }
  };
  const reset = () => {
    setValue(fallback);
    setStatus('Reset to default values; save to persist the reset.');
    setError('');
  };
  const removeLogo = () => {
    update('logoRef', '');
    setStatus('Logo removed; save branding to persist removal.');
  };
  return (
    <div className="setup-page branding-page">
      <div className="setup-breadcrumb">
        ⌂ &nbsp;›&nbsp; Company Setup &nbsp;›&nbsp;{' '}
        <strong>Business Branding</strong>
      </div>
      <section className="setup-title">
        <div className="setup-title-icon">
          <Palette size={31} />
        </div>
        <div>
          <h2>Business Branding</h2>
          <p>
            Customise your business identity, logo and visual appearance across
            the application, receipts and reports.
          </p>
        </div>
      </section>
      <div
        className="branding-section-tabs"
        role="tablist"
        aria-label="Business branding sections"
      >
        {(
          ['Brand Identity', 'Document Templates', 'Brand Preview'] as const
        ).map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={brandSection === tab}
            className={brandSection === tab ? 'active' : ''}
            onClick={() => setBrandSection(tab)}
          >
            {tab === 'Brand Identity' ? (
              <Building2 size={19} />
            ) : tab === 'Document Templates' ? (
              <Image size={19} />
            ) : (
              <Settings size={19} />
            )}
            {tab}
          </button>
        ))}
      </div>
      <div className="branding-grid">
        {brandSection === 'Brand Identity' ? (
          <section className="panel brand-identity">
            <div className="brand-section">
              <h3>
                <Building2 size={20} />
                Brand Identity
              </h3>
              <ConnectedField
                name="tradingName"
                label="Business Name"
                value={value.tradingName}
                onChange={(v) => update('tradingName', v)}
                required
              />
              <ConnectedField
                name="tagline"
                label="Business Tagline (optional)"
                value={value.tagline}
                onChange={(v) => update('tagline', v)}
              />
              <h3>
                <Image size={20} />
                Logo
              </h3>
              <div className="brand-logo-row">
                <div className="brand-logo-box">
                  {value.logoRef ? (
                    <img
                      className="brand-logo-image"
                      src={value.logoRef}
                      alt={`${value.tradingName || 'Business'} logo`}
                    />
                  ) : (
                    <div className="brand-logo-mark">⌂</div>
                  )}
                  <strong>{value.tradingName || 'Yenkasa'}</strong>
                  <small>Builders Supplies Ltd</small>
                </div>
                <div>
                  <button
                    className="brand-outline"
                    data-testid="branding-change-logo"
                    type="button"
                    onClick={chooseLogo}
                  >
                    <Upload size={16} />
                    Change Logo
                  </button>
                  <button
                    className="outline brand-remove"
                    data-testid="branding-remove-logo"
                    type="button"
                    onClick={removeLogo}
                    disabled={!value.logoRef}
                  >
                    <Trash2 size={15} /> Remove
                  </button>
                  <input
                    ref={fileInputRef}
                    data-testid="branding-logo-input"
                    className="visually-hidden-file"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={onLogoSelected}
                  />
                </div>
              </div>
              <p className="brand-help">
                PNG, JPG or WebP · maximum 2 MB
                <br />
                Recommended: at least 512 × 512 px (transparent background
                preferred)
              </p>
              {error && (
                <small className="save-error" role="alert">
                  {error}
                </small>
              )}
              <hr />
              <h3>
                <Palette size={20} />
                Brand Colours
              </h3>
              <div className="colour-fields">
                <ColourField
                  name="primaryColor"
                  label="Primary Colour"
                  value={value.brandColor}
                  colour={value.brandColor}
                  onChange={(v) => update('brandColor', v)}
                />
                <ColourField
                  name="secondaryColor"
                  label="Secondary Colour"
                  value={value.secondaryColor}
                  colour={value.secondaryColor}
                  onChange={(v) => update('secondaryColor', v)}
                />
                <ColourField
                  name="accentColor"
                  label="Accent Colour"
                  value={value.accentColor}
                  colour={value.accentColor}
                  onChange={(v) => update('accentColor', v)}
                />
              </div>
              <h3>
                <Settings size={20} />
                Business Assets
              </h3>
              <ToggleRowConnected
                label="Show logo on receipts"
                checked={value.showLogoReceipts}
                onChange={() =>
                  update('showLogoReceipts', !value.showLogoReceipts)
                }
              />
              <ToggleRowConnected
                label="Show logo on invoices"
                checked={value.showLogoInvoices}
                onChange={() =>
                  update('showLogoInvoices', !value.showLogoInvoices)
                }
              />
              <ToggleRowConnected
                label="Use brand colours in the application"
                checked={value.useBrandColours}
                onChange={() =>
                  update('useBrandColours', !value.useBrandColours)
                }
              />
            </div>
          </section>
        ) : brandSection === 'Document Templates' ? (
          <DocumentTemplatesPanel
            value={value.documentTemplates}
            update={updateTemplate}
            updateContent={updateTemplateContent}
            saveTemplate={save}
            logoRef={value.logoRef}
            brandColor={value.brandColor}
            error={error}
            setStatus={setStatus}
          />
        ) : (
          <section className="brand-right">
            <section className="panel branding-preview">
              <div className="brand-panel-heading">
                <h3>
                  <Settings size={20} />
                  Branding Preview
                </h3>
              </div>
              <div className="preview-tabs">
                {['Application', 'Receipt', 'Invoice', 'Report'].map((item) => (
                  <button
                    type="button"
                    data-testid={`branding-preview-${item.toLowerCase()}`}
                    className={previewTab === item ? 'active' : ''}
                    key={item}
                    onClick={() => setPreviewTab(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <div className="brand-mock">
                <aside style={{ background: value.brandColor }}>
                  <div className="mock-logo">
                    {value.logoRef ? (
                      <img
                        className="mock-logo-image"
                        src={value.logoRef}
                        alt=""
                      />
                    ) : (
                      '⌂'
                    )}{' '}
                    <strong>{value.tradingName}</strong>
                  </div>
                  <b>⌂ &nbsp; Dashboard</b>
                  <span>🛒 &nbsp; Sales</span>
                  <span>▱ &nbsp; Inventory</span>
                  <span>◈ &nbsp; Purchasing</span>
                </aside>
                <div className="mock-content">
                  <div className="mock-skeleton">
                    <i />
                    <i />
                    <i />
                  </div>
                  <h3>{previewTab} preview</h3>
                  <p>How your business identity appears on this document.</p>
                  <div className="mock-cards">
                    <b>
                      Business name
                      <br />
                      <strong>{value.tradingName || 'Your business'}</strong>
                    </b>
                    <b>
                      Primary colour
                      <br />
                      <strong style={{ color: value.secondaryColor }}>
                        {value.brandColor}
                      </strong>
                    </b>
                    <b>
                      Logo
                      <br />
                      <strong>{value.logoRef ? 'Uploaded' : 'Not set'}</strong>
                    </b>
                  </div>
                </div>
              </div>
            </section>
            <div className="brand-callout">
              <UserCircle size={22} />
              <div>
                <strong>Where your branding will be used</strong>
                <p>
                  Your business name, logo and colours will appear in the
                  application, receipts, invoices, reports and other printed
                  documents.
                </p>
              </div>
            </div>
          </section>
        )}
      </div>
      {brandSection !== 'Brand Preview' && (
        <div className="brand-actions">
          <button
            className="outline"
            data-testid="branding-reset"
            type="button"
            onClick={reset}
          >
            ↶ &nbsp; Reset to Default
          </button>
          <button
            className="primary-button"
            data-testid="branding-save"
            type="button"
            disabled={saving}
            onClick={save}
          >
            <Settings size={17} />
            {saving ? 'Saving…' : 'Save Branding'}
          </button>
          {status && (
            <small className="save-status" role="status">
              {status}
            </small>
          )}
        </div>
      )}
    </div>
  );
}

function DocumentTemplatesPanel({
  value,
  update,
  updateContent,
  saveTemplate,
  logoRef,
  brandColor,
  error,
  setStatus,
}: {
  value: DocumentTemplateSettings;
  update: <K extends keyof DocumentTemplateSettings>(
    key: K,
    next: DocumentTemplateSettings[K],
  ) => void;
  updateContent: <K extends keyof DocumentTemplateContent>(
    key: K,
    next: DocumentTemplateContent[K],
  ) => void;
  saveTemplate: () => Promise<void>;
  logoRef: string;
  brandColor: string;
  error: string;
  setStatus: (message: string) => void;
}) {
  const documents = [
    ['Invoice Template', 'Sales invoice layout'],
    ['Receipt Template', 'Payment receipt layout'],
    ['Quotation Template', 'Customer quotation layout'],
    ['Delivery Note Template', 'Goods delivery layout'],
    ['Credit Note Template', 'Sales return / credit layout'],
  ];
  const [editing, setEditing] = useState(false);
  const [selectedElement, setSelectedElement] = useState('Company Heading');
  const [history, setHistory] = useState<DocumentTemplateSettings[]>([]);
  const [future, setFuture] = useState<DocumentTemplateSettings[]>([]);
  const content = value.content;
  const styles = value.styles;

  const number = (input: string) => {
    const parsed = Number(input);
    return Number.isFinite(parsed) ? parsed : 0;
  };
  const money = (input: number) =>
    input.toLocaleString('en-GH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  const rows = content.items.map((item) => ({
    ...item,
    amount: number(item.quantity) * number(item.unitPrice),
  }));
  const subtotal = rows.reduce((sum, row) => sum + row.amount, 0);
  const discount = subtotal * (number(content.discountPercent) / 100);
  const taxable = subtotal - discount;
  const vat = taxable * (number(content.vatPercent) / 100);
  const total = taxable + vat;
  const amountPaid = number(content.amountPaid);
  const balance = total - amountPaid;

  const restore = (snapshot: DocumentTemplateSettings) => {
    (Object.keys(snapshot) as Array<keyof DocumentTemplateSettings>).forEach(
      (key) => update(key, snapshot[key]),
    );
  };
  const remember = (next: DocumentTemplateSettings) => {
    setHistory((items) => [...items, value].slice(-20));
    setFuture([]);
    restore(next);
  };
  const changeContent = <K extends keyof DocumentTemplateContent>(
    key: K,
    next: DocumentTemplateContent[K],
  ) => {
    setHistory((items) => [...items, value].slice(-20));
    setFuture([]);
    updateContent(key, next);
  };
  const changeStyles = <K extends keyof DocumentTemplateStyles>(
    key: K,
    next: DocumentTemplateStyles[K],
  ) => {
    setHistory((items) => [...items, value].slice(-20));
    setFuture([]);
    update('styles', { ...styles, [key]: next });
  };
  const undo = () => {
    const previous = history[history.length - 1];
    if (!previous) return;
    setHistory((items) => items.slice(0, -1));
    setFuture((items) => [value, ...items].slice(0, 20));
    restore(previous);
    setStatus('Last template edit undone.');
  };
  const redo = () => {
    const next = future[0];
    if (!next) return;
    setFuture((items) => items.slice(1));
    setHistory((items) => [...items, value].slice(-20));
    restore(next);
    setStatus('Template edit restored.');
  };
  const updateItem = <K extends keyof DocumentTemplateItem>(
    index: number,
    key: K,
    next: DocumentTemplateItem[K],
  ) => {
    const items = content.items.map((item, itemIndex) =>
      itemIndex === index ? { ...item, [key]: next } : item,
    );
    changeContent('items', items);
  };
  const addItem = () => {
    changeContent('items', [
      ...content.items,
      {
        description: 'New item',
        quantity: '1',
        unit: 'pcs',
        unitPrice: '0.00',
      },
    ]);
    setStatus('Item row added.');
    window.setTimeout(() => {
      document
        .querySelector<HTMLInputElement>(
          `[data-testid="document-item-${content.items.length}-description"]`,
        )
        ?.focus();
    }, 0);
  };
  const removeItem = (index: number) => {
    if (content.items.length === 1) return;
    changeContent(
      'items',
      content.items.filter((_, itemIndex) => itemIndex !== index),
    );
  };
  const addTool = (tool: string) => {
    setSelectedElement(tool);
    if (tool === 'Add Company Logo') update('showCompanyLogo', true);
    if (tool === 'Add Company Information') update('showCompanyDetails', true);
    if (tool === 'Add Branch Information')
      update('showBranchInformation', true);
    if (tool === 'Add Footer') update('showFooterMessage', true);
    if (tool === 'Add Customer Information')
      setStatus('Customer information is bound to the Bill To fields below.');
    else if (tool === 'Add Item Table')
      setStatus('Item table is active and editable below.');
    else setStatus(`${tool} added to the template editor.`);
  };
  const selectDocument = (name: string) => {
    const { templates: existingTemplates, ...currentTemplate } = value;
    const nextTemplates = {
      ...(existingTemplates ?? {}),
      [value.selectedDocument]: currentTemplate,
    };
    const savedTemplate = existingTemplates?.[name];
    if (savedTemplate) {
      remember({
        ...savedTemplate,
        selectedDocument: name,
        templates: nextTemplates,
      });
    } else {
      remember({
        ...value,
        selectedDocument: name,
        templateName: `Classic ${name.replace(' Template', '')}`,
        templates: nextTemplates,
      });
    }
    setStatus(
      `${name} selected. Save the template to make it available to branches.`,
    );
  };
  const editText = (
    key: keyof DocumentTemplateContent,
    event: React.FocusEvent<HTMLElement>,
  ) => {
    const text = event.currentTarget.textContent ?? '';
    if (text !== content[key])
      changeContent(key, text as DocumentTemplateContent[typeof key]);
  };
  const print = () => {
    if (window.desktopBridge?.print) void window.desktopBridge.print();
    else window.print();
  };
  const exportPdf = async () => {
    if (window.desktopBridge?.exportPdf) {
      const result = await window.desktopBridge.exportPdf(
        undefined,
        value.pageSize,
      );
      setStatus(result ? `PDF saved to ${result}` : 'PDF export cancelled.');
    } else {
      window.print();
      setStatus('Choose “Save as PDF” in the print dialog.');
    }
  };
  const documentTitle = value.selectedDocument
    .replace(' Template', '')
    .toUpperCase();
  const editorTools = [
    'Add Text',
    'Add Company Logo',
    'Add Company Information',
    'Add Branch Information',
    'Add Customer Information',
    'Add Invoice Details',
    'Add Item Table',
    'Add Totals',
    'Add Payment Details',
    'Add Signature',
    'Add Footer',
    'Add QR Code',
    'Add Lines and Shapes',
  ];
  return (
    <section className="panel document-templates-panel">
      <div className="document-templates-heading">
        <div>
          <h2>
            <Image size={24} />
            Document Templates
          </h2>
          <p>Customize invoice, receipt and other document layouts.</p>
        </div>
        <div className="document-template-actions">
          <button
            type="button"
            className="outline"
            onClick={() => {
              remember({
                ...value,
                selectedDocument: 'Invoice Template',
                templateName: 'Classic Invoice',
                version: value.version + 1,
              });
              setStatus(
                'Invoice Template selected as the default; save the template to persist it.',
              );
            }}
          >
            ✓ &nbsp;Set as Default
          </button>
          <button
            type="button"
            className="outline"
            onClick={() => setEditing(false)}
          >
            ◉ &nbsp;Preview
          </button>
          <button
            type="button"
            className="outline"
            data-testid="document-edit-toggle"
            onClick={() => setEditing((current) => !current)}
          >
            ✎ &nbsp;{editing ? 'Close Editor' : 'Edit Template'}
          </button>
          <button
            type="button"
            className="outline"
            data-testid="document-print-test"
            onClick={print}
          >
            ▣ &nbsp;Print
          </button>
          <button type="button" className="outline" onClick={exportPdf}>
            ⇩ &nbsp;Save PDF
          </button>
        </div>
      </div>
      {editing && (
        <div className="document-editor-toolbar">
          <button
            type="button"
            className="outline"
            onClick={undo}
            disabled={!history.length}
          >
            ↶ Undo
          </button>
          <button
            type="button"
            className="outline"
            onClick={redo}
            disabled={!future.length}
          >
            ↷ Redo
          </button>
          <span>
            Editor mode · select a tool, then edit the document fields.
          </span>
          <button
            type="button"
            className="primary-button"
            onClick={() => void saveTemplate()}
          >
            Save Template
          </button>
        </div>
      )}
      {error && (
        <div className="document-validation-error" role="alert">
          {error}
        </div>
      )}
      <div
        className={`document-template-layout ${editing ? 'document-editor-layout' : ''}`}
      >
        {editing && (
          <aside className="document-editor-tools">
            <h3>Editing Tools</h3>
            {editorTools.map((tool) => (
              <button
                type="button"
                key={tool}
                className={selectedElement === tool ? 'selected' : ''}
                onClick={() => addTool(tool)}
              >
                <span>＋</span>
                {tool}
              </button>
            ))}
          </aside>
        )}
        {!editing && (
          <aside className="document-template-list">
            <h3>Select Document</h3>
            {documents.map(([name, description]) => (
              <button
                type="button"
                key={name}
                className={value.selectedDocument === name ? 'selected' : ''}
                onClick={() => selectDocument(name)}
              >
                <Image size={21} />
                <span>
                  <strong>{name}</strong>
                  <small>{description}</small>
                </span>
              </button>
            ))}
          </aside>
        )}
        <section
          className={`document-template-preview ${editing ? 'document-editor-canvas' : ''}`}
        >
          <div className="document-preview-title">
            <div>
              <h2>{value.selectedDocument}</h2>
              <p>
                Design and customize your{' '}
                {value.selectedDocument.replace(' Template', '').toLowerCase()}.
              </p>
            </div>
            <span>Default</span>
          </div>
          <div
            className={`document-paper ${value.layoutStyle.toLowerCase()}`}
            style={{ borderTopColor: brandColor }}
          >
            {value.showCompanyLogo && (
              <div
                className={`document-paper-logo ${selectedElement === 'Add Company Logo' ? 'document-element-selected' : ''}`}
                style={{
                  width: `${styles.logoWidth}px`,
                  height: `${styles.logoHeight}px`,
                  transform: `translate(${styles.logoOffsetX}px, ${styles.logoOffsetY}px)`,
                }}
                onClick={() => setSelectedElement('Add Company Logo')}
              >
                {logoRef ? (
                  <img src={logoRef} alt="Company logo" />
                ) : (
                  <span>⌂</span>
                )}
              </div>
            )}
            {value.showCompanyDetails && (
              <div className="document-paper-company">
                <strong
                  contentEditable={editing}
                  suppressContentEditableWarning
                  onClick={() => setSelectedElement('Company Heading')}
                  onBlur={(event) => editText('companyName', event)}
                  style={{
                    fontFamily: styles.headingFontFamily,
                    fontSize: `${styles.headingFontSize}px`,
                    color: styles.headingColor,
                    fontWeight: styles.headingBold ? 800 : 400,
                  }}
                >
                  {content.companyName}
                </strong>
                <small>{content.branchName}</small>
                <small>
                  {content.companyEmail} · {content.companyPhone}
                </small>
              </div>
            )}
            <div className="document-paper-meta">
              <div>
                <span>Branch</span>
                <strong>
                  {value.showBranchInformation ? content.branchName : '—'}
                </strong>
              </div>
              <div>
                <span>Document No.</span>
                <strong
                  contentEditable={editing}
                  suppressContentEditableWarning
                  onBlur={(event) => editText('invoiceNumber', event)}
                >
                  {content.invoiceNumber}
                </strong>
              </div>
              <div>
                <span>Date</span>
                <strong
                  contentEditable={editing}
                  suppressContentEditableWarning
                  onBlur={(event) => editText('date', event)}
                >
                  {content.date}
                </strong>
              </div>
              <div>
                <span>Due Date</span>
                <strong
                  contentEditable={editing}
                  suppressContentEditableWarning
                  onBlur={(event) => editText('dueDate', event)}
                >
                  {content.dueDate}
                </strong>
              </div>
            </div>
            <h3>{documentTitle}</h3>
            <div className="document-paper-bill-to">
              <strong>Bill To</strong>
              <b>{content.billToName}</b>
              <span>{content.billToAddress}</span>
              <span>{content.billToPhone}</span>
            </div>
            <table className="document-paper-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Item Description</th>
                  <th>Qty</th>
                  <th>Unit</th>
                  <th>Unit Price (GH₵)</th>
                  <th>Amount (GH₵)</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={`${row.description}-${index}`}>
                    <td>{index + 1}</td>
                    <td>{row.description}</td>
                    <td>{row.quantity}</td>
                    <td>{row.unit}</td>
                    <td>{money(number(row.unitPrice))}</td>
                    <td>{money(row.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="document-paper-totals">
              <span>Subtotal</span>
              <strong>{money(subtotal)}</strong>
              <span>Discount ({content.discountPercent}%)</span>
              <strong>-{money(discount)}</strong>
              <span>VAT ({content.vatPercent}%)</span>
              <strong>{money(vat)}</strong>
              <b>Total (GH₵)</b>
              <b>{money(total)}</b>
              <span>Amount Paid</span>
              <strong>{money(amountPaid)}</strong>
              <span>Outstanding Balance</span>
              <strong>{money(balance)}</strong>
            </div>
            <div className="document-paper-payment">
              <strong>Payment Terms:</strong> {content.paymentTerms}
            </div>
            <div className="document-paper-notes">
              <strong>Notes:</strong>
              {content.notes.split('\n').map((line) => (
                <span key={line}>• {line}</span>
              ))}
            </div>
            {value.showFooterMessage && (
              <p className="document-paper-footer">{value.footerMessage}</p>
            )}
          </div>
        </section>
        <aside className="document-template-options">
          <h3>Template Options</h3>
          <strong>Layout Style</strong>
          {['Classic', 'Modern', 'Professional', 'Simple'].map((style) => (
            <label
              className={`template-radio ${value.layoutStyle === style ? 'selected' : ''}`}
              key={style}
            >
              <input
                type="radio"
                name="layoutStyle"
                checked={value.layoutStyle === style}
                onChange={() => update('layoutStyle', style)}
              />
              {style}
              {style === 'Classic' && ' (Recommended)'}
            </label>
          ))}
          <label className="security-field">
            Page Size
            <select
              value={value.pageSize}
              onChange={(event) => update('pageSize', event.target.value)}
            >
              <option>A4 (210 × 297 mm)</option>
              <option>A5 (148 × 210 mm)</option>
              <option>80 mm Receipt</option>
            </select>
          </label>
          <strong>Brand Elements</strong>
          <label className="security-check">
            <input
              type="checkbox"
              checked={value.showCompanyLogo}
              onChange={(event) =>
                update('showCompanyLogo', event.target.checked)
              }
            />
            Show Company Logo
          </label>
          <label className="security-check">
            <input
              type="checkbox"
              checked={value.showCompanyDetails}
              onChange={(event) =>
                update('showCompanyDetails', event.target.checked)
              }
            />
            Show Company Details
          </label>
          <label className="security-check">
            <input
              type="checkbox"
              checked={value.showBranchInformation}
              onChange={(event) =>
                update('showBranchInformation', event.target.checked)
              }
            />
            Show Branch Information
          </label>
          <label className="security-check">
            <input
              type="checkbox"
              checked={value.showFooterMessage}
              onChange={(event) =>
                update('showFooterMessage', event.target.checked)
              }
            />
            Show Footer Message
          </label>
          <label className="security-field">
            Footer Message
            <input
              data-testid="document-footerMessage"
              value={value.footerMessage}
              onChange={(event) => update('footerMessage', event.target.value)}
            />
          </label>
          {editing && (
            <div className="document-properties">
              <h3>Element Properties</h3>
              <strong>{selectedElement}</strong>
              <label className="security-field">
                Font Family
                <select
                  value={styles.headingFontFamily}
                  onChange={(event) =>
                    changeStyles('headingFontFamily', event.target.value)
                  }
                >
                  <option>Arial</option>
                  <option>Georgia</option>
                  <option>Inter</option>
                  <option>Times New Roman</option>
                </select>
              </label>
              <label className="security-field">
                Font Size
                <input
                  type="number"
                  min="8"
                  max="48"
                  value={styles.headingFontSize}
                  onChange={(event) =>
                    changeStyles('headingFontSize', event.target.value)
                  }
                />
              </label>
              <label className="security-field">
                Text Colour
                <input
                  type="color"
                  value={styles.headingColor}
                  onChange={(event) =>
                    changeStyles('headingColor', event.target.value)
                  }
                />
              </label>
              <label className="security-check">
                <input
                  type="checkbox"
                  checked={styles.headingBold}
                  onChange={(event) =>
                    changeStyles('headingBold', event.target.checked)
                  }
                />{' '}
                Bold heading
              </label>
              <label className="security-field">
                Logo Width
                <input
                  type="number"
                  min="40"
                  max="300"
                  value={styles.logoWidth}
                  onChange={(event) =>
                    changeStyles('logoWidth', event.target.value)
                  }
                />
              </label>
              <label className="security-field">
                Logo Height
                <input
                  type="number"
                  min="30"
                  max="180"
                  value={styles.logoHeight}
                  onChange={(event) =>
                    changeStyles('logoHeight', event.target.value)
                  }
                />
              </label>
              <label className="security-field">
                Logo Move X
                <input
                  type="number"
                  min="-100"
                  max="100"
                  value={styles.logoOffsetX}
                  onChange={(event) =>
                    changeStyles('logoOffsetX', event.target.value)
                  }
                />
              </label>
              <label className="security-field">
                Logo Move Y
                <input
                  type="number"
                  min="-100"
                  max="100"
                  value={styles.logoOffsetY}
                  onChange={(event) =>
                    changeStyles('logoOffsetY', event.target.value)
                  }
                />
              </label>
              <h3>Invoice Content</h3>
              <div className="document-editor-fields">
                {(
                  [
                    ['invoiceNumber', 'Invoice Number'],
                    ['date', 'Invoice Date'],
                    ['dueDate', 'Due Date'],
                    ['companyName', 'Company Name'],
                    ['branchName', 'Branch'],
                    ['companyEmail', 'Company Email'],
                    ['companyPhone', 'Company Phone'],
                    ['billToName', 'Customer Name'],
                    ['billToAddress', 'Customer Address'],
                    ['billToPhone', 'Customer Phone'],
                    ['paymentTerms', 'Payment Terms'],
                    ['discountPercent', 'Discount %'],
                    ['vatPercent', 'VAT %'],
                    ['amountPaid', 'Amount Paid'],
                  ] as Array<[keyof DocumentTemplateContent, string]>
                ).map(([key, label]) => (
                  <label key={key}>
                    {label}
                    <input
                      data-testid={`document-${String(key)}`}
                      value={String(content[key])}
                      onChange={(event) =>
                        changeContent(key, event.target.value as never)
                      }
                    />
                  </label>
                ))}
                <label>
                  Notes
                  <textarea
                    data-testid="document-notes"
                    value={content.notes}
                    onChange={(event) =>
                      changeContent('notes', event.target.value)
                    }
                  />
                </label>
              </div>
              <h3>Item Rows</h3>
              <div className="document-item-editor">
                {content.items.map((item, index) => (
                  <div
                    className="document-item-row"
                    key={`${index}-${item.description}`}
                  >
                    <label>
                      Item name
                      <input
                        data-testid={`document-item-${index}-description`}
                        value={item.description}
                        onChange={(event) =>
                          updateItem(index, 'description', event.target.value)
                        }
                        placeholder="Enter item name"
                      />
                    </label>
                    <div className="document-item-inline-fields">
                      <label>
                        Qty
                        <input
                          value={item.quantity}
                          onChange={(event) =>
                            updateItem(index, 'quantity', event.target.value)
                          }
                          placeholder="0"
                          inputMode="decimal"
                        />
                      </label>
                      <label>
                        Unit
                        <input
                          value={item.unit}
                          onChange={(event) =>
                            updateItem(index, 'unit', event.target.value)
                          }
                          placeholder="pcs"
                        />
                      </label>
                      <label>
                        Unit price
                        <input
                          value={item.unitPrice}
                          onChange={(event) =>
                            updateItem(index, 'unitPrice', event.target.value)
                          }
                          placeholder="0.00"
                          inputMode="decimal"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        aria-label={`Remove item ${index + 1}`}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" className="outline" onClick={addItem}>
                ＋ Add Item Row
              </button>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}

function ConnectedField({
  name,
  label,
  value,
  onChange,
  required,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <label>
      {label}
      {required && <em> *</em>}
      <input
        name={name}
        data-testid={`branding-${name}`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
function ColourField({
  name,
  label,
  value,
  colour,
  onChange,
}: {
  name: string;
  label: string;
  value: string;
  colour: string;
  onChange: (value: string) => void;
}) {
  const safeColour = /^#[0-9a-f]{6}$/i.test(colour) ? colour : '#000000';
  return (
    <label>
      {label}
      <div>
        <input
          className="colour-picker"
          data-testid={`branding-${name}-picker`}
          type="color"
          value={safeColour}
          onChange={(event) => onChange(event.target.value.toUpperCase())}
        />
        <i style={{ background: safeColour }} />
        <input
          data-testid={`branding-${name}`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </label>
  );
}
function ToggleRowConnected({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="toggle-row">
      <span>{label}</span>
      <button
        type="button"
        className={checked ? 'on' : ''}
        onClick={onChange}
        aria-label={label}
        aria-pressed={checked}
      >
        <i />
      </button>
    </div>
  );
}
