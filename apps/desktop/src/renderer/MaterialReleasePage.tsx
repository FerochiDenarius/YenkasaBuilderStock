import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, CheckCircle2, ClipboardCheck, Download, Eye, PackageCheck, Plus, Printer, RotateCcw, Search, Truck, X } from 'lucide-react';
import type { AuthSession, MaterialReleaseHistoryRecord, MaterialReleaseRecord, SaleRecord } from '@yenkasa/contracts';
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
  const [screen, setScreen] = useState<'history' | 'pending'>('pending');
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

  if (screen === 'history') {
    return <MaterialReleaseHistory session={session} onPending={() => setScreen('pending')} />;
  }

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
        <div className="release-title-actions"><div className="release-branch-badge"><Truck size={17} /> {session.branchName}</div></div>
      </div>
      <MaterialReleaseTabs active="pending" pendingCount={invoices.length} onPending={() => setScreen('pending')} onHistory={() => setScreen('history')} />
      <div className="release-grid">
        <section className="panel release-search-panel">
          <h3><Search size={21} /> Pending materials to release</h3>
          <div className="release-search-row">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => { if (event.key === 'Enter') void load(); }}
              placeholder="Receipt number, invoice or customer..."
            />
            <button className="primary-button" type="button" onClick={() => void load()}>Search</button>
          </div>
          <small className="release-help">All fully paid invoices awaiting collection are listed automatically. Search only filters this list.</small>
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
              {release.items.map((item) => <div key={item.sku}><span>{item.name}</span><b>{item.quantity} {item.unit}</b></div>)}
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
          {release.items.map((item) => <p key={item.sku}>{item.name} — {item.quantity} {item.unit}</p>)}
          <p>Payment verified: {releasedInvoice.paymentStatus}</p>
          <p>Customer collection: {release.status.replaceAll('_', ' ')}</p>
          <footer>Released by {session.fullName} · {new Date(release.createdAt).toLocaleString('en-GH')}</footer>
        </article>
      )}
    </div>
  );
}

function MaterialReleaseHistory({ session, onPending }: { session: AuthSession; onPending: () => void }) {
  const [rows, setRows] = useState<MaterialReleaseHistoryRecord[]>([]);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selected, setSelected] = useState<MaterialReleaseHistoryRecord | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    setLoading(true);
    setError('');
    try {
      setRows(await materialReleaseApi.history(session.branchId, session.userId, startDate, endDate));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to load material release history.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { void loadHistory(); }, [session.branchId, session.userId]);
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return rows.filter((row) => (!statusFilter || row.status === statusFilter) && (!term || [row.releaseNumber, row.invoiceNumber, row.receiptNumber, row.customerName].some((value) => value.toLowerCase().includes(term))));
  }, [rows, query, statusFilter]);
  const released = rows.filter((row) => row.status === 'RELEASED').length;
  const partial = rows.filter((row) => row.status === 'PARTIALLY_RELEASED').length;
  const print = async () => { if (window.desktopBridge?.print) await window.desktopBridge.print(); else window.print(); };
  const download = async () => { await window.desktopBridge?.exportPdf?.(`Material-Release-${selected?.releaseNumber ?? 'History'}.pdf`, 'A4'); };

  return <div className="release-page release-history-page">
    <div className="release-title-row">
      <div className="release-title"><div className="release-title-icon"><PackageCheck size={30} /></div><div><h2>Material Release History</h2><p>View and manage material releases against their exact invoices and customer orders.</p></div></div>
      <button className="primary-button release-new-button" type="button" onClick={onPending}><Plus size={20} /> Pending Materials</button>
    </div>
    <MaterialReleaseTabs active="history" onPending={onPending} onHistory={() => undefined} />
    <section className="release-history-filters panel">
      <label className="release-history-search"><Search size={18} /><input aria-label="Search material releases" placeholder="Search release no., invoice no. or customer..." value={query} onChange={(event) => setQuery(event.target.value)} /></label>
      <label><span>From</span><div><CalendarDays size={16} /><input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} /></div></label>
      <label><span>To</span><div><CalendarDays size={16} /><input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} /></div></label>
      <label><span>Status</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="">All Statuses</option><option value="RELEASED">Released</option><option value="PARTIALLY_RELEASED">Partially Released</option></select></label>
      <button className="outline" type="button" onClick={() => { setQuery(''); setStatusFilter(''); setStartDate(''); setEndDate(''); }}><RotateCcw size={16} /> Reset</button>
      <button className="primary-button" type="button" onClick={() => void loadHistory()}><Search size={16} /> Search</button>
    </section>
    <div className="release-history-stats"><div><span>Total Releases</span><strong>{rows.length}</strong></div><div className="green"><span>Released</span><strong>{released}</strong></div><div className="amber"><span>Partially Released</span><strong>{partial}</strong></div></div>
    <section className="panel release-history-table-wrap">
      <table className="release-history-table"><thead><tr><th>#</th><th>Release Slip Number</th><th>Invoice Number</th><th>Customer</th><th>Released By</th><th>Release Date &amp; Time</th><th>Items</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>{filtered.length ? filtered.map((row, index) => <tr key={row.id}><td>{index + 1}</td><td><strong>{row.releaseNumber}</strong></td><td>{row.invoiceNumber}</td><td>{row.customerName}</td><td>{row.releasedBy}</td><td>{new Date(row.createdAt).toLocaleString('en-GH')}</td><td>{row.items.length}</td><td><span className={`release-history-status ${row.status === 'RELEASED' ? 'released' : 'partial'}`}>{row.status.replaceAll('_', ' ')}</span></td><td><div className="release-history-actions"><button aria-label="View release slip" onClick={() => setSelected(row)}><Eye size={16} /></button><button aria-label="Print release slip" onClick={() => { setSelected(row); setTimeout(() => void print(), 0); }}><Printer size={16} /></button><button aria-label="Download release slip" onClick={() => { setSelected(row); setTimeout(() => void download(), 0); }}><Download size={16} /></button></div></td></tr>) : <tr><td colSpan={9} className="reports-no-data">{loading ? 'Loading material releases...' : 'No material releases match these filters.'}</td></tr>}</tbody></table>
    </section>
    {error && <small className="release-error" role="alert">{error}</small>}
    {selected && <div className="cashier-modal-backdrop"><section className="release-slip-preview" role="dialog" aria-modal="true"><div className="cashier-preview-header"><div><h3><PackageCheck size={20} /> Release Slip Preview</h3><small>{selected.invoiceNumber} · {selected.customerName}</small></div><button aria-label="Close release preview" onClick={() => setSelected(null)}><X size={20} /></button></div><div className="release-slip-card"><strong>YenkasaBuildersStock</strong><span>MATERIAL RELEASE SLIP</span><hr /><div><span>Release No.</span><b>{selected.releaseNumber}</b></div><div><span>Receipt No.</span><b>{selected.receiptNumber || '—'}</b></div><div><span>Invoice No.</span><b>{selected.invoiceNumber}</b></div><div><span>Customer</span><b>{selected.customerName}</b></div><hr />{selected.items.map((item) => <div key={`${selected.id}-${item.sku}`}><span>{item.name}</span><b>{item.quantity} {item.unit}</b></div>)}<p>Released by {selected.releasedBy} · {new Date(selected.createdAt).toLocaleString('en-GH')}</p></div><div className="cashier-preview-actions"><button className="outline" onClick={() => setSelected(null)}>Close</button><button className="outline" onClick={() => void download()}><Download size={17} /> Download PDF</button><button className="primary-button" onClick={() => void print()}><Printer size={17} /> Print Slip</button></div></section></div>}
  </div>;
}

function MaterialReleaseTabs({ active, pendingCount, onPending, onHistory }: { active: 'pending' | 'history'; pendingCount?: number; onPending: () => void; onHistory: () => void }) {
  return <div className="release-tabs" role="tablist" aria-label="Material release views">
    <button type="button" role="tab" aria-selected={active === 'pending'} className={active === 'pending' ? 'active' : ''} onClick={onPending}>
      <ClipboardCheck size={18} /> Pending Materials{pendingCount !== undefined && <span>{pendingCount}</span>}
    </button>
    <button type="button" role="tab" aria-selected={active === 'history'} className={active === 'history' ? 'active' : ''} onClick={onHistory}>
      <PackageCheck size={18} /> Release History
    </button>
  </div>;
}
