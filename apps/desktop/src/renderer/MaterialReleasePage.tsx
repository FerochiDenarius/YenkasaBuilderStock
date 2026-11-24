import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, ClipboardCheck, Eye, PackageCheck, Printer, Search, Truck, X } from 'lucide-react';
import type { AuthSession, MaterialReleaseRecord, SaleRecord } from '@yenkasa/contracts';
import { materialReleaseApi } from './api';

type ReleaseInvoice = SaleRecord & {
  receiptNumber: string;
  releaseableItems: Array<{
    sku: string;
    name: string;
    quantity: number;
    unit: string;
    remainingQuantity: number;
    stock: number;
  }>;
};

export function MaterialReleasePage({ session }: { session: AuthSession }) {
  const [invoices, setInvoices] = useState<ReleaseInvoice[]>([]);
  const [selected, setSelected] = useState<ReleaseInvoice | null>(null);
  const [quantities, setQuantities] = useState<Record<string, string>>({});
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [release, setRelease] = useState<MaterialReleaseRecord | null>(null);
  const [releasedInvoice, setReleasedInvoice] = useState<ReleaseInvoice | null>(null);
  const [releasePreviewOpen, setReleasePreviewOpen] = useState(false);

  const load = async (search = query) => {
    setLoading(true);
    try {
      const list = await materialReleaseApi.invoices(
        session.branchId,
        session.userId,
        search,
      );
      setInvoices(list);
      setSelected((current) => list.find((item) => item.id === current?.id) ?? list[0] ?? null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to load paid invoices.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load('');
  }, [session.branchId, session.userId]);

  useEffect(() => {
    if (!selected) {
      setQuantities({});
      return;
    }
    setQuantities(
      Object.fromEntries(
        selected.releaseableItems.map((item) => [item.sku, String(item.remainingQuantity)]),
      ),
    );
  }, [selected?.id, selected?.fulfilmentStatus]);

  const requestedItems = useMemo(
    () =>
      selected?.releaseableItems
        .map((item) => ({ sku: item.sku, quantity: Number(quantities[item.sku] ?? 0) }))
        .filter((item) => Number.isFinite(item.quantity) && item.quantity > 0) ?? [],
    [quantities, selected],
  );

  const submit = async () => {
    if (!selected) {
      setError('Select a paid invoice first.');
      return;
    }
    if (!requestedItems.length) {
      setError('Enter at least one quantity to release.');
      return;
    }
    setSaving(true);
    setError('');
    setStatus('Validating stock and recording the release…');
    try {
      const result = await materialReleaseApi.create(
        session.branchId,
        session.userId,
        selected.id,
        requestedItems,
      );
      setRelease(result.release);
      // Keep the pre-release item list for the slip. The API response's
      // remainingItems becomes empty after a full release, but the customer
      // slip must still show every item that was paid for.
      setReleasedInvoice({ ...selected, ...result.invoice });
      setStatus(`Material release ${result.release.releaseNumber} recorded.`);
      await load(query);
      setSelected(null);
    } catch (reason) {
      setStatus('');
      setError(reason instanceof Error ? reason.message : 'Unable to record material release.');
    } finally {
      setSaving(false);
    }
  };

  const printRelease = async () => {
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
        'Release slip sent to the system print dialog.',
      );
      return;
    }
    window.print();
    setStatus('Print dialog opened.');
  };

  return (
    <div className="release-page">
      <div className="release-title-row">
        <div className="release-title">
          <div className="release-title-icon"><PackageCheck size={30} /></div>
          <div>
            <h2>Material Release</h2>
            <p>Verify payment and release purchased materials from the branch store.</p>
          </div>
        </div>
        <div className="release-branch-badge"><Truck size={17} /> {session.branchName}</div>
      </div>
      <div className="release-grid">
        <section className="panel release-search-panel">
          <h3><Search size={21} /> Find paid invoice</h3>
          <div className="release-search-row">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => { if (event.key === 'Enter') void load(); }}
              placeholder="Receipt number, invoice or customer..."
            />
            <button className="primary-button" type="button" onClick={() => void load()}>Search</button>
          </div>
          <small className="release-help">Only fully paid invoices awaiting collection are shown.</small>
          <div className="release-invoice-list">
            {loading ? <small>Loading paid invoices…</small> : invoices.length ? invoices.map((invoice) => (
              <button
                type="button"
                key={invoice.id}
                className={`release-invoice-row ${selected?.id === invoice.id ? 'selected' : ''}`}
                onClick={() => { setRelease(null); setReleasedInvoice(null); setReleasePreviewOpen(false); setSelected(invoice); }}
              >
                <span><strong>{invoice.receiptNumber || invoice.saleNumber}</strong><small>{invoice.customerName}</small></span>
                <b>{invoice.fulfilmentStatus.replaceAll('_', ' ')}</b>
              </button>
            )) : <small>No paid invoices awaiting release.</small>}
          </div>
        </section>
        <section className="panel release-summary-panel">
          <h3><ClipboardCheck size={21} /> Release Summary</h3>
          {selected ? (
            <>
              <dl className="release-summary-list">
                <dt>Receipt No:</dt><dd>{selected.receiptNumber || 'Not found'}</dd>
                <dt>Invoice No:</dt><dd>{selected.saleNumber}</dd>
                <dt>Customer:</dt><dd>{selected.customerName}</dd>
                <dt>Payment:</dt><dd><span className="release-paid">PAID</span></dd>
                <dt>Release:</dt><dd><span className="release-awaiting">{selected.fulfilmentStatus.replaceAll('_', ' ')}</span></dd>
              </dl>
              <div className="release-items-title">Materials to release</div>
              <div className="release-items">
                {selected.releaseableItems.map((item) => (
                  <div className="release-item" key={item.sku}>
                    <div><strong>{item.name}</strong><small>{item.sku} · {item.unit} · Stock: {item.stock}</small></div>
                    <label>Qty<input value={quantities[item.sku] ?? ''} onChange={(event) => setQuantities((current) => ({ ...current, [item.sku]: event.target.value }))} inputMode="decimal" /></label>
                  </div>
                ))}
              </div>
              <button className="release-confirm" type="button" disabled={saving} onClick={() => void submit()}>
                <CheckCircle2 size={19} /> {saving ? 'Recording…' : 'Confirm Material Release'}
              </button>
              {status && <small className="release-status" role="status">{status}</small>}
              {error && <small className="release-error" role="alert">{error}</small>}
            </>
          ) : <p className="release-empty">Select a paid invoice to verify and release materials.</p>}
        </section>
      </div>
      {release && releasedInvoice && (
        <div className="release-success">
          <CheckCircle2 size={31} />
          <div><strong>Release recorded</strong><span>{release.releaseNumber} · {release.status.replaceAll('_', ' ')}</span></div>
          <button className="outline" type="button" onClick={() => setReleasePreviewOpen(true)}><Eye size={17} /> Preview Slip</button>
          <button className="outline" type="button" onClick={printRelease}><Printer size={17} /> Print Release Slip</button>
        </div>
      )}
      {releasePreviewOpen && release && releasedInvoice && (
        <div className="cashier-modal-backdrop" role="presentation">
          <section className="release-slip-preview" role="dialog" aria-modal="true" aria-label="Material release slip preview">
            <div className="cashier-preview-header">
              <div>
                <h3><PackageCheck size={20} /> Release Slip Preview</h3>
                <small>This is the release slip that will be sent to print.</small>
              </div>
              <button type="button" aria-label="Close release preview" onClick={() => setReleasePreviewOpen(false)}><X size={20} /></button>
            </div>
            <div className="release-slip-card">
              <strong>YenkasaBuildersStock</strong>
              <span>MATERIAL RELEASE SLIP</span>
              <hr />
              <div><span>Release No.</span><b>{release.releaseNumber}</b></div>
              <div><span>Receipt No.</span><b>{releasedInvoice.receiptNumber}</b></div>
              <div><span>Invoice No.</span><b>{releasedInvoice.saleNumber}</b></div>
              <div><span>Customer</span><b>{releasedInvoice.customerName}</b></div>
              <hr />
              {releasedInvoice.releaseableItems.map((item) => {
                const releasedQuantity = release.items.find((releasedItem) => releasedItem.sku === item.sku)?.quantity ?? 0;
                return <div key={item.sku}><span>{item.name}</span><b>{releasedQuantity} of {item.quantity} {item.unit}</b></div>;
              })}
              <div><span>Payment verified</span><b>{releasedInvoice.paymentStatus}</b></div>
              <div><span>Customer collection</span><b>{release.status.replaceAll('_', ' ')}</b></div>
              <p>Released to customer and verified by {session.fullName}</p>
            </div>
            <div className="cashier-preview-actions">
              <button className="outline" type="button" onClick={() => setReleasePreviewOpen(false)}>Close</button>
              <button className="primary-button" type="button" onClick={() => void printRelease()}><Printer size={17} /> Print Release Slip</button>
            </div>
          </section>
        </div>
      )}
      {release && releasedInvoice && (
        <article className="release-slip-print">
          <h1>MATERIAL RELEASE SLIP</h1>
          <strong>{release.releaseNumber}</strong>
          <p>Receipt: {releasedInvoice.receiptNumber}</p><p>Invoice: {releasedInvoice.saleNumber}</p><p>Customer: {releasedInvoice.customerName}</p>
          <hr />
          {releasedInvoice.releaseableItems.map((item) => {
            const releasedQuantity = release.items.find((releasedItem) => releasedItem.sku === item.sku)?.quantity ?? 0;
            return <p key={item.sku}>{item.name} — {releasedQuantity} of {item.quantity} {item.unit}</p>;
          })}
          <p>Payment verified: {releasedInvoice.paymentStatus}</p>
          <p>Customer collection: {release.status.replaceAll('_', ' ')}</p>
          <footer>Released by {session.fullName} · {new Date(release.createdAt).toLocaleString('en-GH')}</footer>
        </article>
      )}
    </div>
  );
}
