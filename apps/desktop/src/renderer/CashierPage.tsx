import { useEffect, useMemo, useState } from 'react';
import {
  Banknote,
  CheckCircle2,
  CreditCard,
  Eye,
  FileText,
  History,
  Landmark,
  Printer,
  Receipt,
  Search,
  Smartphone,
  WalletCards,
  X,
} from 'lucide-react';
import type {
  AuthSession,
  CompanyRegistration,
  DocumentTemplateSettings,
  PaymentRecord,
  ReceiptRecord,
  SaleRecord,
} from '@yenkasa/contracts';
import { companyApi, paymentsApi } from './api';

type PaymentMethod = PaymentRecord['method'];

const money = (value: number) =>
  `GH₵ ${value.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const methodOptions: Array<[PaymentMethod, string, typeof Banknote]> = [
  ['CASH', 'Cash', Banknote],
  ['MOBILE_MONEY', 'Mobile Money', Smartphone],
  ['BANK_TRANSFER', 'Bank Transfer', Landmark],
  ['CARD', 'Card (Optional)', CreditCard],
];

function ReceiptDocument({
  receipt,
  sale,
  company,
  session,
  template,
  method,
  print = false,
}: {
  receipt: ReceiptRecord;
  sale: SaleRecord;
  company: CompanyRegistration | null;
  session: AuthSession;
  template: DocumentTemplateSettings | null;
  method: PaymentMethod;
  print?: boolean;
}) {
  const content = template?.content;
  const styles = template?.styles;
  const amountDue = Math.max(0, sale.total - sale.amountPaid);
  return (
    <article
      className={`${print ? 'cashier-receipt-print' : 'cashier-template-receipt'} ${template?.layoutStyle?.toLowerCase() ?? 'classic'}`}
    >
      {template?.showCompanyLogo && company?.logoRef && (
        <img className="cashier-receipt-logo" src={company.logoRef} alt="Company logo" />
      )}
      {template?.showCompanyDetails !== false && (
        <header className="cashier-receipt-header">
          <strong
            style={{
              fontFamily: styles?.headingFontFamily,
              color: styles?.headingColor,
              fontSize: `${styles?.headingFontSize || 18}px`,
              fontWeight: styles?.headingBold ? 800 : 400,
            }}
          >
            {content?.companyName || company?.tradingName || company?.registeredName || 'YenkasaBuildersStock'}
          </strong>
          <span>{content?.companyEmail || company?.email} · {content?.companyPhone || company?.phone}</span>
        </header>
      )}
      <div className="cashier-receipt-heading">PAYMENT RECEIPT</div>
      <div className="cashier-receipt-meta">
        <div><span>Receipt No.</span><b>{receipt.receiptNumber}</b></div>
        <div><span>Invoice No.</span><b>{sale.saleNumber}</b></div>
        <div><span>Date</span><b>{new Date(receipt.createdAt).toLocaleDateString('en-GH')}</b></div>
        {template?.showBranchInformation !== false && <div><span>Branch</span><b>{session.branchName}</b></div>}
      </div>
      <div className="cashier-receipt-customer">
        <strong>Received from</strong>
        <b>{sale.customerName}</b>
      </div>
      <table className="cashier-receipt-items">
        <thead><tr><th>Item</th><th>Qty</th><th>Unit</th><th>Amount</th></tr></thead>
        <tbody>{sale.items.map((item, index) => <tr key={`${item.sku}-${index}`}><td>{item.name}</td><td>{item.quantity}</td><td>{item.unit}</td><td>{money(item.amount)}</td></tr>)}</tbody>
      </table>
      <div className="cashier-receipt-totals">
        <div><span>Invoice total</span><b>{money(sale.total)}</b></div>
        <div><span>Amount received</span><b>{money(receipt.amount)}</b></div>
        <div><span>Paid to date</span><b>{money(sale.amountPaid)}</b></div>
        <div><span>Balance due</span><b>{money(amountDue)}</b></div>
        <div><span>Payment method</span><b>{method.replaceAll('_', ' ')}</b></div>
      </div>
      <p className="cashier-receipt-notes">{content?.paymentTerms || 'Payment confirmed.'}</p>
      {template?.showFooterMessage !== false && <footer>{template?.footerMessage || 'Thank you for your business!'}</footer>}
    </article>
  );
}

function InvoiceDocument({
  sale,
  company,
  session,
  template,
  print = false,
}: {
  sale: SaleRecord;
  company: CompanyRegistration | null;
  session: AuthSession;
  template: DocumentTemplateSettings | null;
  print?: boolean;
}) {
  const content = template?.content;
  const styles = template?.styles;
  const balance = Math.max(0, sale.total - sale.amountPaid);
  return (
    <article className={`cashier-invoice-document ${print ? 'cashier-invoice-print' : ''}`}>
      {template?.showCompanyLogo && company?.logoRef && <img className="cashier-invoice-logo" src={company.logoRef} alt="Company logo" />}
      {template?.showCompanyDetails !== false && <header className="cashier-invoice-header">
        <div>
          <h1 style={{ fontFamily: styles?.headingFontFamily, color: styles?.headingColor, fontSize: `${styles?.headingFontSize || 20}px`, fontWeight: styles?.headingBold ? 800 : 400 }}>{content?.companyName || company?.tradingName || company?.registeredName || 'YenkasaBuildersStock'}</h1>
          <p>{content?.companyEmail || company?.email} · {content?.companyPhone || company?.phone}</p>
          {template?.showBranchInformation !== false && <p>{session.branchName} · {content?.branchName || ''}</p>}
        </div>
        <div className="cashier-invoice-number"><strong>INVOICE</strong><span>{sale.saleNumber}</span><span>{new Date(sale.createdAt).toLocaleString('en-GH')}</span></div>
      </header>}
      <div className="cashier-invoice-meta"><div><span>Bill To</span><b>{sale.customerName}</b></div><div><span>Issued By</span><b>{sale.actorUserName || sale.actorUserId || 'Sales Officer'}</b></div><div><span>Payment Status</span><b>{sale.paymentStatus.replaceAll('_', ' ')}</b></div></div>
      <table className="cashier-invoice-items"><thead><tr><th>#</th><th>Item / Code</th><th>Qty</th><th>Unit</th><th>Unit Price</th><th>Amount</th></tr></thead><tbody>{sale.items.map((item, index) => <tr key={`${item.sku}-${index}`}><td>{index + 1}</td><td><b>{item.name}</b><small>{item.sku}</small></td><td>{item.quantity}</td><td>{item.unit}</td><td>{money(item.unitPrice)}</td><td>{money(item.amount)}</td></tr>)}</tbody></table>
      <div className="cashier-invoice-totals"><div><span>Subtotal</span><b>{money(sale.subtotal)}</b></div><div><span>Discount</span><b>− {money(sale.discount)}</b></div><div><span>Tax</span><b>{money(sale.tax)}</b></div><div className="grand"><span>Total</span><b>{money(sale.total)}</b></div><div><span>Paid to date</span><b>{money(sale.amountPaid)}</b></div><div><span>Balance due</span><b>{money(balance)}</b></div></div>
      <footer>{content?.paymentTerms || 'Payment is due according to the agreed terms.'}{template?.showFooterMessage !== false && <strong>{template?.footerMessage || 'Thank you for your business!'}</strong>}</footer>
    </article>
  );
}

export function CashierPage({ session }: { session: AuthSession }) {
  const [invoices, setInvoices] = useState<SaleRecord[]>([]);
  const [selected, setSelected] = useState<SaleRecord | null>(null);
  const [query, setQuery] = useState('');
  const [method, setMethod] = useState<PaymentMethod>('CASH');
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [evidence, setEvidence] = useState('');
  const [history, setHistory] = useState<PaymentRecord[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyQuery, setHistoryQuery] = useState('');
  const [historyMethod, setHistoryMethod] = useState('');
  const [historyDate, setHistoryDate] = useState('');
  const [invoicePreviewOpen, setInvoicePreviewOpen] = useState(false);
  const [invoicePreview, setInvoicePreview] = useState<SaleRecord | null>(null);
  const [receiptPreviewOpen, setReceiptPreviewOpen] = useState(false);
  const [receipt, setReceipt] = useState<ReceiptRecord | null>(null);
  const [pendingPayment, setPendingPayment] = useState<PaymentRecord | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [company, setCompany] = useState<CompanyRegistration | null>(null);

  useEffect(() => {
    companyApi.get().then(setCompany).catch(() => setCompany(null));
  }, []);

  const receiptTemplate =
    company?.documentTemplates?.templates?.['Receipt Template'] ??
    company?.documentTemplates ??
    null;
  const invoiceTemplate = invoicePreview?.templateSnapshot?.templates?.['Invoice Template'] ?? invoicePreview?.templateSnapshot ?? company?.documentTemplates?.templates?.['Invoice Template'] ?? company?.documentTemplates ?? null;

  const loadInvoices = async (search = query) => {
    setLoading(true);
    try {
      const [list, payments] = await Promise.all([
        paymentsApi.invoices(session.branchId, session.userId, search),
        paymentsApi.history(session.branchId, session.userId),
      ]);
      setInvoices(list);
      setHistory(payments);
      setSelected(
        (current) =>
          list.find((item) => item.id === current?.id) ?? list[0] ?? null,
      );
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : 'Unable to load invoices.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadInvoices('');
  }, [session.branchId, session.userId]);

  useEffect(() => {
    if (selected)
      setAmount(Math.max(0, selected.total - selected.amountPaid).toFixed(2));
  }, [selected?.id, selected?.amountPaid, selected?.total]);

  const outstanding = selected
    ? Math.max(0, selected.total - selected.amountPaid)
    : 0;
  const filtered = useMemo(
    () => invoices.filter((invoice) => invoice.paymentStatus !== 'PAID'),
    [invoices],
  );

  const recordPayment = async () => {
    if (!selected) {
      setError('Search for and select an invoice first.');
      return;
    }
    const parsed = Number(amount);
    if (!Number.isFinite(parsed) || parsed <= 0 || parsed > outstanding) {
      setError(
        'Enter a payment amount greater than zero and no more than the outstanding balance.',
      );
      return;
    }
    if (method !== 'CASH' && !reference.trim()) {
      setError(
        'Electronic payments require a transaction reference and verification.',
      );
      return;
    }
    setSaving(true);
    setError('');
    setStatus(
      method === 'CASH'
        ? 'Recording cash payment…'
        : 'Saving payment as pending verification…',
    );
    try {
      const result = await paymentsApi.record(
        {
          branchId: session.branchId,
          saleId: selected.id,
          amount: parsed,
          method,
          reference,
          evidenceNote: evidence,
          // A new cashier submission is a new transaction.  The API still
          // accepts an idempotency key so a retry can be made explicit, but
          // repeating a legitimate partial cash payment must not collide with
          // the previous payment just because the amount is the same.
          idempotencyKey: `${selected.id}-${method}-${Date.now()}`,
        },
        session.userId,
      );
      setSelected(result.invoice);
      setReceipt(result.receipt);
      setPendingPayment(
        result.payment.verificationStatus === 'PENDING_VERIFICATION'
          ? result.payment
          : null,
      );
      setStatus(
        result.receipt
          ? `Payment confirmed. Receipt ${result.receipt.receiptNumber} is ready.`
          : 'Payment recorded and awaiting authorized verification.',
      );
      await loadInvoices(query);
    } catch (reason) {
      setStatus('');
      setError(
        reason instanceof Error ? reason.message : 'Unable to record payment.',
      );
    } finally {
      setSaving(false);
    }
  };

  const verifyPending = async () => {
    if (!pendingPayment || !evidence.trim()) {
      setError(
        'Add verification evidence before confirming an electronic payment.',
      );
      return;
    }
    setSaving(true);
    setError('');
    try {
      const result = await paymentsApi.verify(
        pendingPayment.id,
        session.branchId,
        session.userId,
        evidence,
      );
      setSelected(result.invoice);
      setReceipt(result.receipt);
      setPendingPayment(null);
      setStatus(
        `Payment verified. Receipt ${result.receipt.receiptNumber} is ready.`,
      );
      await loadInvoices(query);
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : 'Unable to verify payment.',
      );
    } finally {
      setSaving(false);
    }
  };

  const printReceipt = async () => {
    setError('');
    if (window.desktopBridge?.print) {
      setStatus('Opening the system print dialog…');
      const printed = await window.desktopBridge.print().catch(() => false);
      if (!printed) {
        window.print();
        setStatus('System print dialog opened.');
        return;
      }
      setStatus(
        'Receipt sent to the system print dialog.',
      );
      return;
    }
    window.print();
    setStatus('Print dialog opened.');
  };

  const printInvoice = async () => {
    if (window.desktopBridge?.print) {
      setStatus('Opening the system print dialog…');
      const printed = await window.desktopBridge.print().catch(() => false);
      if (!printed) window.print();
      return;
    }
    window.print();
  };

  const openInvoicePreview = (invoice: SaleRecord) => {
    setSelected(invoice);
    setInvoicePreview(invoice);
    setInvoicePreviewOpen(true);
  };

  const openReceiptFromHistory = (
    payment: PaymentRecord,
    invoice: SaleRecord | undefined,
    shouldPrint = false,
  ) => {
    if (!invoice || !payment.receiptNumber) return;
    const historyReceipt: ReceiptRecord = {
      id: `history-${payment.id}`,
      saleId: payment.saleId,
      paymentId: payment.id,
      receiptNumber: payment.receiptNumber,
      amount: payment.amount,
      createdAt: payment.createdAt,
      branchId: payment.branchId,
    };
    setSelected(invoice);
    setReceipt(historyReceipt);
    setMethod(payment.method);
    if (shouldPrint) {
      window.setTimeout(() => void printReceipt(), 0);
    } else {
      setReceiptPreviewOpen(true);
    }
  };

  const historyRows = useMemo(() => history.filter((payment) => {
    const searchable = `${payment.receiptNumber} ${payment.invoiceNumber || ''} ${payment.customerName || ''}`.toLowerCase();
    const methodMatches = !historyMethod || payment.method === historyMethod;
    const dateMatches = !historyDate || (payment.createdAt || '').slice(0, 10) === historyDate;
    return searchable.includes(historyQuery.toLowerCase()) && methodMatches && dateMatches;
  }), [history, historyDate, historyMethod, historyQuery]);

  return (
    <div className="cashier-page">
      <div className="cashier-title-row">
        <div className="cashier-title">
          <div className="cashier-title-icon">
            <WalletCards size={31} />
          </div>
          <div>
            <h2>Cashier &amp; Payments</h2>
            <p>Receive payments and issue receipts.</p>
          </div>
        </div>
        <button
          className="outline"
          type="button"
          onClick={() => setHistoryOpen(true)}
        >
          <History size={16} /> Payment History
        </button>
      </div>
      <div className="cashier-grid">
        <section className="cashier-left">
          <div className="panel cashier-search-panel">
            <h3>
              <Search size={21} /> Find Invoice
            </h3>
            <div className="cashier-search-row">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') void loadInvoices();
                }}
                placeholder="Enter invoice number or customer..."
              />
              <button
                className="primary-button"
                type="button"
                onClick={() => void loadInvoices()}
              >
                Search
              </button>
            </div>
            <div className="cashier-invoice-list">
              {loading ? (
                <small>Loading invoices…</small>
              ) : filtered.length ? (
                filtered.map((invoice) => (
                  <div
                    className={`cashier-invoice-row ${selected?.id === invoice.id ? 'selected' : ''}`}
                    key={invoice.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelected(invoice)}
                    onKeyDown={(event) => { if (event.key === 'Enter') setSelected(invoice); }}
                  >
                    <span>
                      <strong>{invoice.saleNumber}</strong>
                      <small>{invoice.customerName}</small>
                    </span>
                    <b>{money(invoice.total - invoice.amountPaid)}</b>
                    <button className="compact-outline" type="button" onClick={(event) => { event.stopPropagation(); openInvoicePreview(invoice); }}><Eye size={14} /> View Invoice</button>
                  </div>
                ))
              ) : (
                <small>No unpaid invoices found.</small>
              )}
            </div>
          </div>
          <div className="panel cashier-summary-panel">
            <h3>
              <Receipt size={21} /> Invoice Summary
            </h3>
            {selected ? (
              <>
                <div className="cashier-summary-actions"><button className="compact-outline" type="button" onClick={() => openInvoicePreview(selected)}><Eye size={14} /> View Invoice</button></div>
                <dl className="cashier-summary-list">
                  <dt>Invoice No:</dt>
                  <dd>{selected.saleNumber}</dd>
                  <dt>Customer:</dt>
                  <dd>{selected.customerName}</dd>
                  <dt>Issued By:</dt>
                  <dd>{selected.actorUserName || selected.actorUserId || 'Sales Officer'}</dd>
                  <dt>Payment Status:</dt>
                  <dd>
                    <span
                      className={`cashier-status ${selected.paymentStatus.toLowerCase()}`}
                    >
                      {selected.paymentStatus.replace('_', ' ')}
                    </span>
                  </dd>
                  <dt>Fulfilment Status:</dt>
                  <dd>
                    <span className="cashier-fulfilment">
                      {selected.fulfilmentStatus.replaceAll('_', ' ')}
                    </span>
                  </dd>
                </dl>
                <div className="cashier-items-title">Items Purchased</div>
                <div className="cashier-items">
                  {selected.items.map((item, index) => (
                    <div className="cashier-item" key={`${item.sku}-${index}`}>
                      <span>{index + 1}</span>
                      <strong>{item.name}</strong>
                      <span>
                        {item.quantity} {item.unit}
                      </span>
                      <span>{money(item.amount)}</span>
                    </div>
                  ))}
                </div>
                <div className="cashier-total">
                  <b>Total Amount</b>
                  <strong>{money(selected.total)}</strong>
                </div>
                <div className="cashier-balance">
                  <span>Already Paid</span>
                  <strong>{money(selected.amountPaid)}</strong>
                  <span>Balance Due</span>
                  <strong>{money(outstanding)}</strong>
                </div>
              </>
            ) : (
              <p className="cashier-empty">
                Select an unpaid invoice to collect payment.
              </p>
            )}
          </div>
        </section>
        <section className="panel cashier-payment-panel">
          <h3>
            <CreditCard size={21} /> Payment Collection
          </h3>
          <div className="cashier-methods">
            {methodOptions.map(([value, label, Icon]) => (
              <button
                key={value}
                type="button"
                className={method === value ? 'selected' : ''}
                onClick={() => setMethod(value)}
              >
                <Icon size={28} />
                <span>{label}</span>
              </button>
            ))}
          </div>
          <label className="cashier-field">
            Amount Received (GH₵)
            <input
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              inputMode="decimal"
            />
          </label>
          <div className="cashier-balance-card">
            <span>Balance Due (GH₵)</span>
            <strong>{money(outstanding)}</strong>
          </div>
          {method !== 'CASH' && (
            <label className="cashier-field">
              Payment Reference
              <input
                value={reference}
                onChange={(event) => setReference(event.target.value)}
                placeholder="Enter transaction reference..."
              />
            </label>
          )}
          {method !== 'CASH' && (
            <label className="cashier-field">
              Verification Evidence
              <textarea
                value={evidence}
                onChange={(event) => setEvidence(event.target.value)}
                placeholder="Provider confirmation or authorized manual verification note..."
              />
            </label>
          )}
          {method !== 'CASH' && (
            <div className="cashier-info">
              Electronic payments remain pending until authorized verification.
              Do not release materials from an unverified payment.
            </div>
          )}
          <button
            className="cashier-confirm"
            type="button"
            disabled={saving || !selected || outstanding <= 0}
            onClick={() =>
              void (pendingPayment ? verifyPending() : recordPayment())
            }
          >
            {saving
              ? 'Saving…'
              : pendingPayment
                ? 'Verify Payment & Print Receipt'
                : selected && outstanding <= 0
                  ? 'Invoice Fully Paid'
                : method === 'CASH'
                  ? 'Confirm Payment & Print Receipt'
                  : 'Record Pending Payment'}
          </button>
          {status && (
            <small className="cashier-status-message" role="status">
              {status}
            </small>
          )}
          {error && (
            <small className="cashier-error" role="alert">
              {error}
            </small>
          )}
        </section>
      </div>
      {receipt && (
        <div className="cashier-success">
          <CheckCircle2 size={34} />
          <div>
            <strong>Payment Successful!</strong>
            <span>
              Receipt No: {receipt.receiptNumber} ·{' '}
              {new Date(receipt.createdAt).toLocaleString('en-GH')}
            </span>
          </div>
          <button className="outline" type="button" onClick={() => setReceiptPreviewOpen(true)}>
            <Eye size={17} /> Preview Receipt
          </button>
          <button className="outline" type="button" onClick={printReceipt}>
            <Printer size={17} /> Print Receipt
          </button>
        </div>
      )}
      {receiptPreviewOpen && receipt && selected && (
        <div className="cashier-modal-backdrop" role="presentation">
          <section className="cashier-receipt-preview" role="dialog" aria-modal="true" aria-label="Receipt preview">
            <div className="cashier-preview-header">
              <div>
                <h3><Receipt size={20} /> Receipt Preview</h3>
                <small>
                  Owner template: {receiptTemplate?.templateName || 'Company receipt template'} · v{receiptTemplate?.version || 1}
                </small>
              </div>
              <button type="button" aria-label="Close receipt preview" onClick={() => setReceiptPreviewOpen(false)}><X size={20} /></button>
            </div>
            <ReceiptDocument
              receipt={receipt}
              sale={selected}
              company={company}
              session={session}
              template={receiptTemplate}
              method={method}
            />
            <div className="cashier-preview-actions">
              <button className="outline" type="button" onClick={() => setReceiptPreviewOpen(false)}>Close</button>
              <button className="primary-button" type="button" onClick={() => void printReceipt()}><Printer size={17} /> Print Receipt</button>
            </div>
          </section>
        </div>
      )}
      {invoicePreviewOpen && invoicePreview && (
        <div className="cashier-modal-backdrop" role="presentation">
          <section className="cashier-invoice-preview-modal" role="dialog" aria-modal="true" aria-label="Invoice preview">
            <div className="cashier-preview-header"><div><h3><FileText size={20} /> Invoice Preview</h3><small>Read-only owner template · {invoicePreview.templateName || 'Company invoice template'} · v{invoicePreview.templateVersion || 1}</small></div><button type="button" aria-label="Close invoice preview" onClick={() => setInvoicePreviewOpen(false)}><X size={20} /></button></div>
            <InvoiceDocument sale={invoicePreview} company={company} session={session} template={invoiceTemplate} />
            <div className="cashier-preview-actions"><button className="outline" type="button" onClick={() => setInvoicePreviewOpen(false)}>Close</button><button className="primary-button" type="button" onClick={() => void printInvoice()}><Printer size={17} /> Print Invoice</button></div>
          </section>
        </div>
      )}
      {historyOpen && (
        <div className="cashier-modal-backdrop">
          <section className="cashier-history-modal">
            <div>
              <h3>
                <History size={20} /> Payment History
              </h3>
              <button type="button" onClick={() => setHistoryOpen(false)}>
                ×
              </button>
            </div>
            <div className="cashier-history-filters"><input value={historyQuery} onChange={(event) => setHistoryQuery(event.target.value)} placeholder="Search invoice, receipt or customer..." /><input type="date" value={historyDate} onChange={(event) => setHistoryDate(event.target.value)} /><select value={historyMethod} onChange={(event) => setHistoryMethod(event.target.value)}><option value="">All payment methods</option>{methodOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
            {historyRows.length ? <div className="cashier-history-table-wrap"><table className="cashier-history-table"><thead><tr><th>Receipt / Invoice</th><th>Customer</th><th>Cashier</th><th>Date</th><th>Method</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead><tbody>{historyRows.map((payment) => { const linked = invoices.find((invoice) => invoice.id === payment.saleId); return <tr key={payment.id}><td><strong>{payment.receiptNumber || 'Pending verification'}</strong><small>{payment.invoiceNumber || 'Invoice unavailable'}</small></td><td>{payment.customerName || '—'}</td><td>{payment.cashierName || '—'}</td><td>{new Date(payment.createdAt).toLocaleString('en-GH')}</td><td>{payment.method.replaceAll('_', ' ')}</td><td>{money(payment.amount)}</td><td><span className={`cashier-status ${(payment.verificationStatus || '').toLowerCase()}`}>{payment.verificationStatus.replaceAll('_', ' ')}</span></td><td><div className="cashier-history-actions"><button className="compact-outline" type="button" disabled={!linked} onClick={() => linked && openInvoicePreview(linked)}><Eye size={13} /> Invoice</button><button className="compact-outline" type="button" disabled={!linked || !payment.receiptNumber} onClick={() => openReceiptFromHistory(payment, linked)}><Receipt size={13} /> Receipt</button><button className="compact-outline" type="button" disabled={!linked || !payment.receiptNumber} onClick={() => openReceiptFromHistory(payment, linked, true)}><Printer size={13} /> Reprint</button></div></td></tr>; })}</tbody></table></div> : <small>No payments recorded.</small>}
          </section>
        </div>
      )}
      {invoicePreview && <InvoiceDocument sale={invoicePreview} company={company} session={session} template={invoiceTemplate} print />}
      {receipt && selected && (
        <ReceiptDocument
          receipt={receipt}
          sale={selected}
          company={company}
          session={session}
          template={receiptTemplate}
          method={method}
          print
        />
      )}
    </div>
  );
}
