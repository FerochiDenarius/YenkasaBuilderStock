import { useEffect, useMemo, useState } from 'react';
import {
  Barcode,
  ClipboardList,
  FileText,
  Minus,
  Plus,
  Search,
  Trash2,
  UserCircle,
} from 'lucide-react';
import type {
  AuthSession,
  CompanyRegistration,
  DocumentTemplateSettings,
  SaleLineItem,
  SaleRecord,
  SalesProduct,
} from '@yenkasa/contracts';
import { companyApi, salesApi } from './api';

const fallbackProducts: SalesProduct[] = [
  {
    sku: 'CEM-001',
    barcode: '615110000003',
    name: 'Dangote Cement (50kg)',
    category: 'Cement',
    brand: 'Dangote',
    productType: 'Rapid Strength Cement',
    variant: '42.5R · 50kg bag',
    stock: 320,
    unit: 'Bag',
    price: 90,
  },
  {
    sku: 'IRO-012',
    barcode: '615110000012',
    name: 'Iron Rod 12mm (12m)',
    category: 'Iron Rods',
    brand: 'TOR',
    productType: 'High Yield Reinforcement Bar',
    variant: '12mm · 12m length',
    stock: 150,
    unit: 'Piece',
    price: 185,
  },
  {
    sku: 'BLO-006',
    barcode: '615110000021',
    name: 'Hollow Block (6 inch)',
    category: 'Blocks',
    brand: 'Local Manufacture',
    productType: 'Hollow Concrete Block',
    variant: '6 inch · standard',
    stock: 4200,
    unit: 'Piece',
    price: 8.5,
  },
  {
    sku: 'PAI-020',
    barcode: '615110000031',
    name: 'Paint (Emulsion) 20L - White',
    category: 'Paints',
    brand: 'ABC Paints',
    productType: 'Emulsion Paint',
    variant: '20L · White',
    stock: 28,
    unit: 'Tin',
    price: 460,
  },
  {
    sku: 'PVC-002',
    barcode: '615110000041',
    name: 'PVC Pipe 2" (6m)',
    category: 'Plumbing',
    brand: 'WAVIN',
    productType: 'uPVC Pressure Pipe',
    variant: '2 inch · 6m length',
    stock: 85,
    unit: 'Piece',
    price: 75,
  },
  {
    sku: 'ROO-035',
    barcode: '615110000051',
    name: 'Roofing Sheet 0.35mm',
    category: 'Roofing',
    brand: 'Aluzinc',
    productType: 'Corrugated Roofing Sheet',
    variant: '0.35mm · 3m length',
    stock: 120,
    unit: 'Sheet',
    price: 230,
  },
  {
    sku: 'BWI-025',
    barcode: '615110000061',
    name: 'Binding Wire (25kg)',
    category: 'Hardware',
    brand: 'Local Manufacture',
    productType: 'Binding Wire',
    variant: '25kg roll',
    stock: 42,
    unit: 'Roll',
    price: 320,
  },
  {
    sku: 'TIL-060',
    barcode: '615110000071',
    name: 'Ceramic Tile (60 × 60)',
    category: 'Tiles',
    brand: 'MaxTile',
    productType: 'Ceramic Floor Tile',
    variant: '60 × 60cm · assorted',
    stock: 310,
    unit: 'Box',
    price: 95,
  },
];

type Mode = 'QUOTATION' | 'INVOICE';
type SalesView = 'CREATE' | 'HISTORY';
type CartItem = SaleLineItem & { product: SalesProduct };

const money = (value: number) =>
  `GH₵ ${value.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function SalesPage({ session }: { session: AuthSession }) {
  const [mode, setMode] = useState<Mode>('INVOICE');
  const [view, setView] = useState<SalesView>('CREATE');
  const [products, setProducts] = useState<SalesProduct[]>(fallbackProducts);
  const [selectedProduct, setSelectedProduct] = useState(fallbackProducts[0]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [brand, setBrand] = useState('All');
  const [productType, setProductType] = useState('All');
  const [customer, setCustomer] = useState('Walk-in Customer');
  const [notes, setNotes] = useState('');
  const [vatEnabled, setVatEnabled] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([
    {
      product: fallbackProducts[0],
      sku: fallbackProducts[0].sku,
      name: fallbackProducts[0].name,
      quantity: 10,
      unit: fallbackProducts[0].unit,
      unitPrice: fallbackProducts[0].price,
      discountPercent: 0,
      amount: fallbackProducts[0].price * 10,
    },
    {
      product: fallbackProducts[1],
      sku: fallbackProducts[1].sku,
      name: fallbackProducts[1].name,
      quantity: 5,
      unit: fallbackProducts[1].unit,
      unitPrice: fallbackProducts[1].price,
      discountPercent: 0,
      amount: fallbackProducts[1].price * 5,
    },
    {
      product: fallbackProducts[2],
      sku: fallbackProducts[2].sku,
      name: fallbackProducts[2].name,
      quantity: 50,
      unit: fallbackProducts[2].unit,
      unitPrice: fallbackProducts[2].price,
      discountPercent: 0,
      amount: fallbackProducts[2].price * 50,
    },
  ]);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [catalogStatus, setCatalogStatus] = useState(
    'Loading branch catalogue…',
  );
  const [invoiceTemplate, setInvoiceTemplate] = useState({
    name: 'Classic Invoice',
    version: 1,
    id: 'invoice-classic-default',
  });
  const [companyProfile, setCompanyProfile] =
    useState<CompanyRegistration | null>(null);
  const [savedInvoice, setSavedInvoice] = useState<SaleRecord | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [invoiceHistory, setInvoiceHistory] = useState<SaleRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    let active = true;
    salesApi
      .products(session.branchId, session.userId)
      .then((items) => {
        if (!active) return;
        if (items.length) {
          setProducts(items);
          setSelectedProduct(items[0]);
          setCart((current) =>
            current.map((line) => {
              const sizeToken =
                line.name
                  .match(/\d+(?:\.\d+)?\s?(?:mm|inch|in|kg|l|L)/i)?.[0]
                  ?.toLowerCase()
                  .replace(/\s+/g, '') ?? '';
              const product =
                items.find((item) => item.sku === line.sku) ??
                items.find((item) =>
                  item.name
                    .toLowerCase()
                    .includes(line.name.split(' ')[0].toLowerCase()),
                ) ??
                items.find(
                  (item) =>
                    item.category === line.product.category &&
                    !!sizeToken &&
                    `${item.name} ${item.variant}`
                      .toLowerCase()
                      .replace(/\s+/g, '')
                      .includes(sizeToken),
                );
              return product
                ? {
                    ...line,
                    product,
                    sku: product.sku,
                    name: product.name,
                    unit: product.unit,
                    unitPrice: product.price,
                    amount: line.quantity * product.price,
                  }
                : line;
            }),
          );
          setCatalogStatus(`${items.length} structured products available`);
        } else setCatalogStatus('No active products in this branch catalogue.');
      })
      .catch(() => {
        if (active)
          setCatalogStatus('Using the offline catalogue until sync returns.');
      });
    companyApi
      .get()
      .then((company) => {
        const template = company?.documentTemplates;
        if (active && template) {
          setCompanyProfile(company);
          setInvoiceTemplate({
            id: template.templateId || 'invoice-classic-default',
            name: template.templateName || 'Classic Invoice',
            version: template.version || 1,
          });
        }
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [session.branchId, session.userId]);

  const categories = [
    'All',
    ...Array.from(new Set(products.map((product) => product.category))),
  ];
  const brands = [
    'All',
    ...Array.from(new Set(products.map((product) => product.brand))),
  ];
  const productTypes = [
    'All',
    ...Array.from(new Set(products.map((product) => product.productType))),
  ];
  const visibleProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchesCategory =
          category === 'All' || product.category === category;
        const matchesBrand = brand === 'All' || product.brand === brand;
        const matchesType =
          productType === 'All' || product.productType === productType;
        const text = `${product.name} ${product.sku}`.toLowerCase();
        return (
          matchesCategory &&
          matchesBrand &&
          matchesType &&
          text.includes(query.toLowerCase())
        );
      }),
    [brand, category, productType, products, query],
  );
  const subtotal = cart.reduce(
    (sum, item) =>
      sum + item.quantity * item.unitPrice * (1 - item.discountPercent / 100),
    0,
  );
  const discount = cart.reduce(
    (sum, item) =>
      sum + (item.quantity * item.unitPrice * item.discountPercent) / 100,
    0,
  );
  const vat = vatEnabled ? subtotal * 0.15 : 0;
  const total = subtotal + vat;

  const addToCart = (product: SalesProduct = selectedProduct, quantity = 1) => {
    setCart((current) => {
      const existing = current.find((item) => item.sku === product.sku);
      if (existing)
        return current.map((item) =>
          item.sku === product.sku
            ? {
                ...item,
                quantity: item.quantity + quantity,
                amount: (item.quantity + quantity) * item.unitPrice,
              }
            : item,
        );
      return [
        ...current,
        {
          product,
          sku: product.sku,
          name: product.name,
          quantity,
          unit: product.unit,
          unitPrice: product.price,
          discountPercent: 0,
          amount: quantity * product.price,
        },
      ];
    });
    setStatus(`${product.name} added to ${mode.toLowerCase()}.`);
    setError('');
  };
  const updateQuantity = (sku: string, quantity: number) =>
    setCart((current) =>
      current.map((item) =>
        item.sku === sku
          ? {
              ...item,
              quantity: Math.max(1, quantity),
              amount: Math.max(1, quantity) * item.unitPrice,
            }
          : item,
      ),
    );
  const removeItem = (sku: string) =>
    setCart((current) => current.filter((item) => item.sku !== sku));
  const saveDocument = async () => {
    if (!cart.length) {
      setError('Add at least one item before saving.');
      return;
    }
    if (!customer.trim()) {
      setError('Select or enter a customer before saving.');
      return;
    }
    setSaving(true);
    setError('');
    setStatus('Saving locally…');
    try {
      const documentType: Mode = mode;
      const saved = await salesApi.create(
        {
          branchId: session.branchId,
          documentType,
          customerName: customer,
          vatPercent: vatEnabled ? 15 : 0,
          notes,
          items: cart.map(
            ({ product: _product, amount: _amount, ...item }) => item,
          ),
        },
        session.userId,
      );
      setStatus(
        `${documentType === 'QUOTATION' ? 'Quotation' : 'Invoice'} ${saved.saleNumber} saved to SQLite${documentType === 'INVOICE' ? ` using ${saved.templateName || invoiceTemplate.name} v${saved.templateVersion || invoiceTemplate.version}.` : '.'}`,
      );
      if (documentType === 'INVOICE') {
        setSavedInvoice(saved);
        setPreviewOpen(true);
      }
    } catch (reason) {
      setStatus('');
      setError(
        reason instanceof Error ? reason.message : 'Unable to save document.',
      );
    } finally {
      setSaving(false);
    }
  };
  const printableTemplate: DocumentTemplateSettings | null =
    savedInvoice?.templateSnapshot ?? companyProfile?.documentTemplates ?? null;
  const printableContent = printableTemplate?.content;
  const printableStyles = printableTemplate?.styles;
  const printInvoice = async () => {
    if (window.desktopBridge?.print) {
      setStatus('Opening the system print dialog…');
      const printed = await window.desktopBridge.print();
      setStatus(
        printed
          ? 'Invoice sent to the system print dialog.'
          : 'Print dialog closed without sending the invoice.',
      );
      return;
    }
    window.print();
    setStatus('Print dialog opened.');
  };
  const exportInvoicePdf = async () => {
    if (window.desktopBridge?.exportPdf) {
      const path = await window.desktopBridge.exportPdf(
        undefined,
        printableTemplate?.pageSize,
      );
      setStatus(
        path
          ? `Invoice PDF saved to ${path}.`
          : 'Invoice PDF export cancelled.',
      );
    } else {
      window.print();
      setStatus('Choose “Save as PDF” in the print dialog.');
    }
  };
  const previewDraftInvoice = () => {
    if (!cart.length) {
      setError('Add at least one item before previewing the invoice.');
      return;
    }
    setSavedInvoice({
      id: 'draft-preview',
      saleNumber: 'PREVIEW',
      documentType: 'INVOICE',
      branchId: session.branchId,
      customerName: customer,
      status: 'DRAFT',
      subtotal,
      discount,
      tax: vat,
      total,
      createdAt: new Date().toISOString(),
      items: cart.map(({ product: _product, ...item }) => item),
      templateId: invoiceTemplate.id,
      templateName: invoiceTemplate.name,
      templateVersion: invoiceTemplate.version,
      templateSnapshot: companyProfile?.documentTemplates,
    });
    setPreviewOpen(true);
  };

  const openInvoiceHistory = async () => {
    setView('HISTORY');
    setHistoryLoading(true);
    setError('');
    try {
      const records = await salesApi.list(session.branchId, session.userId);
      setInvoiceHistory(records.filter((record) => record.documentType === 'INVOICE'));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to load invoice history.');
    } finally {
      setHistoryLoading(false);
    }
  };

  return (
    <div className="sales-page">
      <div className="sales-page-toolbar">
        <div className="sales-mode-tabs" role="tablist">
          {([
            ['QUOTATION', 'Quotation'],
            ['INVOICE', 'Invoice'],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={view === 'CREATE' && mode === value}
              className={view === 'CREATE' && mode === value ? 'active' : ''}
              onClick={() => {
                setView('CREATE');
                setMode(value);
                setStatus('');
              }}
            >
              {label}
            </button>
          ))}
          <button
            type="button"
            role="tab"
            aria-selected={view === 'HISTORY'}
            className={view === 'HISTORY' ? 'active' : ''}
            onClick={() => void openInvoiceHistory()}
          >
            Invoice History
          </button>
        </div>
        <div className="sales-context-row">
          <span>{catalogStatus}</span>
          {mode === 'INVOICE' && view === 'CREATE' && (
            <span className="sales-template-status">
              Owner invoice template: <strong>{invoiceTemplate.name}</strong> · v
              {invoiceTemplate.version}
            </span>
          )}
        </div>
      </div>
      {view === 'HISTORY' ? (
        <section className="panel sales-history-panel">
          <div className="sales-history-heading">
            <div>
              <h2>Invoice History</h2>
              <p>Review saved invoices and reopen their owner-branded preview.</p>
            </div>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search invoice or customer..."
            />
          </div>
          {historyLoading ? (
            <p className="sales-empty">Loading invoice history…</p>
          ) : invoiceHistory.filter((record) => `${record.saleNumber} ${record.customerName}`.toLowerCase().includes(query.toLowerCase())).length ? (
            <div className="sales-history-list">
              {invoiceHistory
                .filter((record) => `${record.saleNumber} ${record.customerName}`.toLowerCase().includes(query.toLowerCase()))
                .map((record) => (
                  <div className="sales-history-row" key={record.id}>
                    <div><strong>{record.saleNumber}</strong><span>{record.customerName}</span></div>
                    <div><span>{new Date(record.createdAt).toLocaleDateString('en-GH')}</span><b>{money(record.total)}</b></div>
                    <span className={`sales-history-status ${record.paymentStatus.toLowerCase()}`}>{record.paymentStatus.replaceAll('_', ' ')}</span>
                    <button className="outline" type="button" onClick={() => { setSavedInvoice(record); setPreviewOpen(true); }}>Preview Invoice</button>
                  </div>
                ))}
            </div>
          ) : <p className="sales-empty">No saved invoices found.</p>}
        </section>
      ) : <div className="sales-workspace">
        <section className="panel sales-products-panel">
          <div className="sales-segmented">
            <button className="active" type="button">
              ▣ Products
            </button>
            <button type="button">☆ Favorites</button>
            <button type="button">◷ Recent</button>
          </div>
          <div className="sales-search-row">
            <label className="sales-search">
              <Search size={17} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by product name, code or barcode..."
              />
            </label>
            <button className="sales-scan" type="button">
              <Barcode size={17} /> Scan Barcode
            </button>
          </div>
          <div className="sales-category-row">
            {categories.map((item) => (
              <button
                type="button"
                key={item}
                className={category === item ? 'active' : ''}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="sales-catalog-filters">
            <label>
              Brand
              <select
                value={brand}
                onChange={(event) => setBrand(event.target.value)}
              >
                {brands.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label>
              Product type
              <select
                value={productType}
                onChange={(event) => setProductType(event.target.value)}
              >
                {productTypes.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="sales-product-grid">
            {visibleProducts.map((product) => (
              <button
                className="sales-product-card"
                type="button"
                key={product.sku}
                onClick={() => {
                  setSelectedProduct(product);
                  addToCart(product);
                }}
              >
                <span className="sales-product-details">
                  <strong>{product.name}</strong>
                  <small>
                    {product.brand} · {product.productType} · {product.variant}
                  </small>
                  <small>
                    SKU: {product.sku} · Unit: {product.unit} · In stock: {product.stock}
                  </small>
                </span>
                <span className="sales-product-action">
                  <b>{money(product.price)}</b>
                  <i aria-hidden="true">
                    <Plus size={16} />
                  </i>
                </span>
              </button>
            ))}
          </div>
          {!visibleProducts.length && (
            <p className="sales-empty">No products match this search.</p>
          )}
        </section>
        <section className="panel sales-cart-panel">
          <div className="sales-cart-heading">
            <h3>
              <ClipboardList size={20} />{' '}
              {mode === 'QUOTATION' ? 'Current Quotation' : 'Current Invoice'}{' '}
              ({cart.length} Items)
            </h3>
            <button type="button" onClick={() => setCart([])}>
              <Trash2 size={16} /> Clear
            </button>
          </div>
          <div className="sales-details">
            <label>
              Customer
              <select
                value={customer}
                onChange={(event) => setCustomer(event.target.value)}
              >
                <option>Walk-in Customer</option>
                <option>BuildRight Construction Ltd</option>
                <option>Temа Construction Ltd.</option>
                <option>Adom Builders</option>
              </select>
            </label>
            <label>
              Document Type
              <select
                value={mode}
                onChange={() => undefined}
              >
                <option>{mode}</option>
              </select>
            </label>
          </div>
          <div className="sales-cart-table">
            <div className="sales-cart-head">
              <span>#</span>
              <span>Item</span>
              <span>Qty</span>
              <span>Unit Price</span>
              <span>Discount</span>
              <span>Total</span>
              <span />
            </div>
            {cart.map((item, index) => (
              <div className="sales-cart-row" key={item.sku}>
                <span>{index + 1}</span>
                <div>
                  <strong>{item.name}</strong>
                  <small>{item.sku}</small>
                </div>
                <div className="quantity-control">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.sku, item.quantity - 1)}
                  >
                    <Minus size={13} />
                  </button>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={item.quantity}
                    aria-label={`Quantity for ${item.name}`}
                    onChange={(event) =>
                      updateQuantity(item.sku, Number(event.target.value))
                    }
                  />
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                  >
                    <Plus size={13} />
                  </button>
                </div>
                <span>{money(item.unitPrice)}</span>
                <select
                  value={item.discountPercent}
                  onChange={(event) =>
                    setCart((current) =>
                      current.map((line) =>
                        line.sku === item.sku
                          ? {
                              ...line,
                              discountPercent: Number(event.target.value),
                            }
                          : line,
                      ),
                    )
                  }
                >
                  <option value="0">0%</option>
                  <option value="5">5%</option>
                  <option value="10">10%</option>
                </select>
                <strong>
                  {money(
                    item.quantity *
                      item.unitPrice *
                      (1 - item.discountPercent / 100),
                  )}
                </strong>
                <button
                  className="sales-remove"
                  type="button"
                  aria-label={`Remove ${item.name}`}
                  onClick={() => removeItem(item.sku)}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
          <label className="sales-notes">
            <FileText size={17} /> Add Notes (Optional)
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="e.g. Site delivery, customer reference, etc."
            />
          </label>
          <div className="sales-summary">
            <div>
              <span>Subtotal</span>
              <strong>{money(subtotal)}</strong>
              <span>
                VAT (15%){' '}
                <button
                  type="button"
                  className={`sales-toggle ${vatEnabled ? 'on' : ''}`}
                  onClick={() => setVatEnabled((current) => !current)}
                >
                  <i />
                </button>
              </span>
              <strong>{money(vat)}</strong>
              <span>Discount</span>
              <strong className="discount-total">− {money(discount)}</strong>
            </div>
            <div className="sales-total">
              <b>Total Payable</b>
              <strong>{money(total)}</strong>
            </div>
          </div>
          <div className="sales-actions">
            <button
              className="outline"
              type="button"
              onClick={() => setCart([])}
            >
              <Trash2 size={16} /> Clear Cart
            </button>
            <button
              className="outline"
              type="button"
              onClick={() => {
                setMode('QUOTATION');
                setStatus('Cart prepared as a quotation.');
              }}
            >
              ▱ Save as Quote
            </button>
            <button
              className="primary-button"
              type="button"
              disabled={saving}
              onClick={() => void saveDocument()}
            >
              {saving
                ? 'Saving…'
                : mode === 'QUOTATION'
                  ? 'Generate Quotation →'
                  : 'Generate Invoice →'}
            </button>
            {mode === 'INVOICE' && (
              <button
                className="outline"
                type="button"
                onClick={previewDraftInvoice}
              >
                Preview Invoice
              </button>
            )}
          </div>
          {status && (
            <small className="sales-status" role="status">
              {status}
            </small>
          )}
          {error && (
            <small className="sales-error" role="alert">
              {error}
            </small>
          )}
          {savedInvoice && mode === 'INVOICE' && !previewOpen && (
            <button
              className="sales-reopen-preview"
              type="button"
              onClick={() => setPreviewOpen(true)}
            >
              Open saved invoice preview
            </button>
          )}
        </section>
      </div>}
      <div className="sales-role-note">
        <UserCircle size={17} /> Sales workspace is scoped to{' '}
        <strong>{session.branchName}</strong> and authenticated as{' '}
        {session.fullName}. Backend permissions protect every save operation.
      </div>
      {previewOpen && savedInvoice && printableContent && (
        <div
          className="sales-print-preview-shell"
          role="dialog"
          aria-label="Invoice preview"
        >
          <div className="sales-print-toolbar">
            <strong>
              {savedInvoice.saleNumber} ·{' '}
              {savedInvoice.templateName || invoiceTemplate.name} v
              {savedInvoice.templateVersion || invoiceTemplate.version}
            </strong>
            <div>
              <button className="outline" type="button" onClick={() => void printInvoice()}>
                Print invoice
              </button>
              <button
                className="outline"
                type="button"
                onClick={() => void exportInvoicePdf()}
              >
                Save PDF
              </button>
              <button
                className="outline"
                type="button"
                onClick={() => setPreviewOpen(false)}
              >
                Close preview
              </button>
            </div>
          </div>
          <article
            className={`sales-print-invoice ${printableTemplate?.layoutStyle?.toLowerCase() || 'classic'}`}
          >
            {printableTemplate?.showCompanyLogo && companyProfile?.logoRef && (
              <img
                className="sales-print-logo"
                src={companyProfile.logoRef}
                alt="Company logo"
              />
            )}
            <header className="sales-print-header">
              <div>
                {printableTemplate?.showCompanyDetails && (
                  <>
                    <h1
                      style={{
                        fontFamily: printableStyles?.headingFontFamily,
                        color: printableStyles?.headingColor,
                        fontSize: `${printableStyles?.headingFontSize || 20}px`,
                      }}
                    >
                      {printableContent.companyName ||
                        companyProfile?.registeredName}
                    </h1>
                    <p>
                      {printableContent.companyEmail} ·{' '}
                      {printableContent.companyPhone}
                    </p>
                  </>
                )}
                {printableTemplate?.showBranchInformation && (
                  <p>
                    {session.branchName} · {printableContent.branchName}
                  </p>
                )}
              </div>
              <div className="sales-print-document-meta">
                <strong>INVOICE</strong>
                <span>No. {savedInvoice.saleNumber}</span>
                <span>
                  Date:{' '}
                  {new Date(savedInvoice.createdAt).toLocaleDateString('en-GH')}
                </span>
              </div>
            </header>
            <section className="sales-print-bill-to">
              <strong>Bill To</strong>
              <span>{savedInvoice.customerName}</span>
              {printableContent.billToAddress && (
                <small>{printableContent.billToAddress}</small>
              )}
              {printableContent.billToPhone && (
                <small>{printableContent.billToPhone}</small>
              )}
            </section>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Item Description</th>
                  <th>Qty</th>
                  <th>Unit</th>
                  <th>Unit Price</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {savedInvoice.items.map((item, index) => (
                  <tr key={`${item.sku}-${index}`}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>{item.unit}</td>
                    <td>{money(item.unitPrice)}</td>
                    <td>{money(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="sales-print-totals">
              <span>Subtotal</span>
              <strong>{money(savedInvoice.subtotal)}</strong>
              <span>Discount</span>
              <strong>− {money(savedInvoice.discount)}</strong>
              <span>VAT ({savedInvoice.vatPercent || 0}%)</span>
              <strong>{money(savedInvoice.tax)}</strong>
              <b>Total (GH₵)</b>
              <b>{money(savedInvoice.total)}</b>
            </div>
            <p className="sales-print-notes">
              <strong>Payment Terms:</strong> {printableContent.paymentTerms}
              <br />
              {savedInvoice.notes || printableContent.notes}
            </p>
            {printableTemplate?.showFooterMessage && (
              <footer>{printableTemplate.footerMessage}</footer>
            )}
          </article>
        </div>
      )}
    </div>
  );
}
