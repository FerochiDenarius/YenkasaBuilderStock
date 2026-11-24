import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { ClipboardList, PackagePlus, Plus, RefreshCw, Search, Trash2 } from 'lucide-react';
import type { AuthSession, PurchaseRecord, SalesProduct } from '@yenkasa/contracts';
import { purchasingApi, salesApi } from './api';

const money = (value: number) => `GH₵ ${value.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
type Line = SalesProduct & { quantity: number; unitCost: number };
const suppliers = ['BuildPro Ghana Ltd', 'Accra Materials Hub', 'Kumasi Cement Depot', 'Other Supplier'];

export function PurchasingPage({ session }: { session: AuthSession }) {
  const [products, setProducts] = useState<SalesProduct[]>([]);
  const [lines, setLines] = useState<Line[]>([]);
  const [supplier, setSupplier] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().slice(0, 10));
  const [reference, setReference] = useState('');
  const [paymentType, setPaymentType] = useState('Cash');
  const [discount, setDiscount] = useState('0');
  const [notes, setNotes] = useState('');
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState<PurchaseRecord[]>([]);
  const [view, setView] = useState<'FORM' | 'HISTORY'>('FORM');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true); setError('');
    try {
      const [catalogue, purchases] = await Promise.all([
        salesApi.products(session.branchId, session.userId),
        purchasingApi.list(session.branchId, session.userId),
      ]);
      setProducts(catalogue); setHistory(purchases);
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to load purchasing data.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, [session.branchId, session.userId]);

  const available = useMemo(() => products.filter((item) => `${item.name} ${item.sku} ${item.barcode}`.toLowerCase().includes(query.toLowerCase())), [products, query]);
  const subtotal = lines.reduce((sum, item) => sum + item.quantity * item.unitCost, 0);
  const total = Math.max(0, subtotal - Number(discount || 0));
  const add = (product: SalesProduct) => setLines((current) => current.some((item) => item.sku === product.sku) ? current : [...current, { ...product, quantity: 1, unitCost: product.price }]);
  const updateLine = (sku: string, field: 'quantity' | 'unitCost', value: number) => setLines((current) => current.map((item) => item.sku === sku ? { ...item, [field]: Math.max(0, value) } : item));

  const save = async (event: FormEvent) => {
    event.preventDefault(); setError('');
    if (!supplier || !lines.length) { setError('Select a supplier and add at least one item.'); return; }
    if (lines.some((item) => item.quantity <= 0 || item.unitCost < 0)) { setError('Every item must have a quantity greater than zero and a valid unit cost.'); return; }
    setSaving(true);
    try {
      const record = await purchasingApi.create(session.branchId, session.userId, { supplier, purchaseDate, reference, paymentType, discount: Number(discount || 0), notes, items: lines.map((item) => ({ sku: item.sku, name: item.name, quantity: item.quantity, unit: item.unit, unitCost: item.unitCost })) });
      setHistory((current) => [record, ...current]); setLines([]); setSupplier(''); setReference(''); setNotes(''); setDiscount('0'); setStatus(`Purchase ${record.purchaseNumber} saved and stock updated.`);
      const catalogue = await salesApi.products(session.branchId, session.userId); setProducts(catalogue);
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to save purchase.'); }
    finally { setSaving(false); }
  };

  return <div className="purchasing-page">
    <div className="purchasing-heading"><div className="purchasing-heading-title"><div className="purchasing-heading-icon"><ClipboardList size={27} /></div><div><h2>Purchases</h2><p>Record stock purchases from suppliers for {session.branchName}.</p></div></div><div className="purchasing-heading-actions"><button className="outline compact-button" type="button" disabled={loading} onClick={() => { setView('HISTORY'); void load(); }}>Purchase History</button><button className="primary-button compact-button" type="button" onClick={() => { setView('FORM'); setStatus(''); }}> <Plus size={15} /> New Purchase</button></div></div>
    {view === 'HISTORY' ? <section className="panel purchasing-history-panel"><div className="purchasing-history-heading"><h3>Purchase History</h3><button className="outline compact-button" type="button" onClick={() => void load()}><RefreshCw size={14} /> Refresh</button></div>{history.length ? <div className="purchasing-history-list">{history.map((record) => <div className="purchasing-history-row" key={record.id}><div><strong>{record.purchaseNumber}</strong><small>{record.supplier} · {record.purchaseDate}</small></div><span>{record.items.length} items</span><strong>{money(record.total)}</strong><span>{record.paymentType}</span></div>)}</div> : <p className="purchasing-empty">No purchases recorded for this branch.</p>}</section> : <form className="purchasing-form" onSubmit={save}>
      <section className="panel purchasing-meta"><label>Supplier *<select required value={supplier} onChange={(event) => setSupplier(event.target.value)}><option value="">Select Supplier</option>{suppliers.map((item) => <option key={item}>{item}</option>)}</select></label><label>Purchase Date *<input required type="date" value={purchaseDate} onChange={(event) => setPurchaseDate(event.target.value)} /></label><label>Reference No.<input value={reference} onChange={(event) => setReference(event.target.value)} placeholder="e.g. PO-001" /></label><label>Payment Type *<select required value={paymentType} onChange={(event) => setPaymentType(event.target.value)}><option>Cash</option><option>Mobile Money</option><option>Bank Transfer</option><option>Credit</option></select></label></section>
      <section className="panel purchasing-items"><div className="purchasing-section-heading"><h3>Select Items</h3><PackagePlus size={18} /></div><label className="purchasing-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search item, name, code or barcode..." /></label><small className="purchasing-catalogue-hint">Choose from the branch catalogue. Cement, iron rods, roofing sheets and other materials are available below.</small><div className="purchasing-product-results">{available.slice(0, 8).map((product) => <button type="button" key={product.sku} onClick={() => { add(product); setQuery(''); }}><span><strong>{product.name}</strong><small>{product.category} · {product.sku} · Current stock {product.stock}</small></span><Plus size={15} /></button>)}{!available.length && <small>No matching catalogue item.</small>}</div><div className="purchasing-table"><div className="purchasing-table-head"><span>#</span><span>Item</span><span>Qty</span><span>Unit</span><span>Unit Cost</span><span>Total</span><span /></div>{lines.map((item, index) => <div className="purchasing-table-row" key={item.sku}><span>{index + 1}</span><div><strong>{item.name}</strong><small>{item.sku}</small></div><input aria-label={`Quantity for ${item.name}`} type="number" min="0.01" step="any" value={item.quantity} onChange={(event) => updateLine(item.sku, 'quantity', Number(event.target.value))} /><span>{item.unit}</span><input aria-label={`Unit cost for ${item.name}`} type="number" min="0" step="0.01" value={item.unitCost} onChange={(event) => updateLine(item.sku, 'unitCost', Number(event.target.value))} /><strong>{money(item.quantity * item.unitCost)}</strong><button type="button" aria-label={`Remove ${item.name}`} onClick={() => setLines((current) => current.filter((line) => line.sku !== item.sku))}><Trash2 size={15} /></button></div>)}</div>{!lines.length && <p className="purchasing-empty">Select an item above to add it to this purchase.</p>}<div className="purchasing-bottom"><label>Notes (optional)<textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Enter purchase notes..." /></label><div className="purchasing-total"><span>Subtotal <strong>{money(subtotal)}</strong></span><label>Discount<input type="number" min="0" max={subtotal} step="0.01" value={discount} onChange={(event) => setDiscount(event.target.value)} /></label><b>Total <strong>{money(total)}</strong></b></div></div></section>
      {error && <p className="purchasing-error" role="alert">{error}</p>}{status && <p className="purchasing-status" role="status">{status}</p>}<div className="purchasing-actions"><button className="outline compact-button" type="button" onClick={() => { setLines([]); setSupplier(''); setReference(''); setNotes(''); setDiscount('0'); }}>Clear</button><button className="primary-button compact-button" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save Purchase'}</button></div>
    </form>}
  </div>;
}
