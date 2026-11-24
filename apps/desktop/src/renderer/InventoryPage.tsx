import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Boxes, PackagePlus, RefreshCw, Search, SlidersHorizontal, X } from 'lucide-react';
import type { AuthSession, SalesProduct } from '@yenkasa/contracts';
import { inventoryApi } from './api';

const money = (value: number) =>
  `GH₵ ${value.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

type ProductForm = {
  sku: string;
  barcode: string;
  name: string;
  category: string;
  brand: string;
  productType: string;
  variant: string;
  unit: string;
  stock: string;
  price: string;
};

const emptyForm: ProductForm = {
  sku: '', barcode: '', name: '', category: '', brand: '', productType: '',
  variant: '', unit: 'Piece', stock: '0', price: '0',
};

export function InventoryPage({ session }: { session: AuthSession }) {
  const [products, setProducts] = useState<SalesProduct[]>([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [adjustment, setAdjustment] = useState({ quantity: '', reason: '' });
  const [modal, setModal] = useState<'create' | 'adjust' | null>(null);
  const [selected, setSelected] = useState<SalesProduct | null>(null);
  const canManage = session.role === 'BRANCH_MANAGER' || session.role === 'STOCK_MANAGER';

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setProducts(await inventoryApi.list(session.branchId, session.userId));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to load branch inventory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, [session.branchId, session.userId]);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(products.map((item) => item.category))).sort()],
    [products],
  );
  const filtered = useMemo(() => products.filter((item) => {
    const text = `${item.name} ${item.sku} ${item.barcode} ${item.brand} ${item.productType}`.toLowerCase();
    const itemStatus = item.stock === 0 ? 'Out of Stock' : item.stock <= 30 ? 'Low Stock' : 'In Stock';
    return text.includes(query.toLowerCase()) &&
      (category === 'All' || item.category === category) &&
      (statusFilter === 'All' || itemStatus === statusFilter);
  }), [category, products, query, statusFilter]);
  const totals = useMemo(() => ({
    value: products.reduce((sum, item) => sum + item.stock * item.price, 0),
    inStock: products.filter((item) => item.stock > 0).length,
    lowStock: products.filter((item) => item.stock > 0 && item.stock <= 30).length,
    outOfStock: products.filter((item) => item.stock === 0).length,
  }), [products]);

  const submitCreate = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      const created = await inventoryApi.create(session.branchId, session.userId, {
        ...form,
        stock: Number(form.stock),
        price: Number(form.price),
      });
      setProducts((current) => [...current, created].sort((a, b) => a.name.localeCompare(b.name)));
      setModal(null);
      setForm(emptyForm);
      setStatus(`${created.name} added to the branch catalogue.`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to add inventory item.');
    }
  };

  const submitAdjustment = async (event: FormEvent) => {
    event.preventDefault();
    if (!selected) return;
    setError('');
    try {
      const updated = await inventoryApi.adjustStock(
        session.branchId,
        session.userId,
        selected.sku,
        Number(adjustment.quantity),
        adjustment.reason,
      );
      setProducts((current) => current.map((item) => item.sku === updated.sku ? updated : item));
      setModal(null);
      setAdjustment({ quantity: '', reason: '' });
      setStatus(`${updated.name} stock updated to ${updated.stock} ${updated.unit}.`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to adjust stock.');
    }
  };

  return (
    <div className="inventory-page">
      <div className="inventory-heading">
        <div className="inventory-heading-title">
          <div className="inventory-heading-icon"><Boxes size={27} /></div>
          <div><h2>Inventory (Stock Items)</h2><p>Manage branch building materials, stock levels and selling prices.</p></div>
        </div>
        <div className="inventory-heading-actions">
          <button className="outline compact-button" type="button" onClick={() => void load()} disabled={loading}><RefreshCw size={15} /> Refresh</button>
          {canManage && <button className="primary-button compact-button" type="button" onClick={() => { setError(''); setModal('create'); }}><PackagePlus size={15} /> Add Item</button>}
        </div>
      </div>
      <div className="inventory-summary-grid">
        <div><span>Total Items</span><strong>{products.length}</strong></div>
        <div><span>Total Stock Value</span><strong>{money(totals.value)}</strong></div>
        <div><span>In Stock</span><strong>{totals.inStock}</strong></div>
        <div><span>Low Stock</span><strong>{totals.lowStock}</strong></div>
        <div><span>Out of Stock</span><strong>{totals.outOfStock}</strong></div>
      </div>
      <section className="panel inventory-list-panel">
        <div className="inventory-category-tabs" role="tablist">
          {categories.map((item) => <button key={item} type="button" className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>)}
        </div>
        <div className="inventory-filters">
          <label className="inventory-search"><Search size={16} /><input data-testid="inventory-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search item, SKU or barcode..." /></label>
          <label><SlidersHorizontal size={15} /><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option>All</option><option>In Stock</option><option>Low Stock</option><option>Out of Stock</option></select></label>
        </div>
        {loading ? <p className="inventory-empty">Loading branch inventory…</p> : filtered.length ? <div className="inventory-list" data-testid="inventory-list">
          <div className="inventory-list-head"><span>Item</span><span>SKU / Details</span><span>Unit</span><span>Stock</span><span>Price</span><span>Status</span><span /></div>
          {filtered.map((item) => {
            const itemStatus = item.stock === 0 ? 'Out of Stock' : item.stock <= 30 ? 'Low Stock' : 'In Stock';
            return <div className="inventory-list-row" key={item.sku}>
              <div><strong>{item.name}</strong><small>{item.brand || 'Unbranded'} · {item.productType || 'General material'}</small></div>
              <div><b>{item.sku}</b><small>{item.variant || item.barcode || 'No variant recorded'}</small></div>
              <span>{item.unit}</span><strong>{item.stock.toLocaleString()}</strong><span>{money(item.price)}</span>
              <span className={`inventory-status ${itemStatus.toLowerCase().replaceAll(' ', '-')}`}>{itemStatus}</span>
              {canManage ? <button className="outline compact-button" type="button" onClick={() => { setSelected(item); setAdjustment({ quantity: '', reason: '' }); setError(''); setModal('adjust'); }}>Adjust</button> : <span />}
            </div>;
          })}
        </div> : <p className="inventory-empty">No inventory items match the current filters.</p>}
        {error && <p className="inventory-error" role="alert">{error}</p>}
        {status && <p className="inventory-status-message" role="status">{status}</p>}
      </section>
      {modal === 'create' && <div className="inventory-modal-backdrop"><form className="inventory-modal" onSubmit={submitCreate}><div className="inventory-modal-heading"><h3>Add Inventory Item</h3><button type="button" aria-label="Close" onClick={() => setModal(null)}><X size={18} /></button></div><div className="inventory-form-grid">
        {(['sku', 'name', 'category', 'brand', 'productType', 'variant', 'unit', 'stock', 'price', 'barcode'] as const).map((field) => <label key={field}>{field === 'productType' ? 'Product type' : field.charAt(0).toUpperCase() + field.slice(1)}<input required={['sku', 'name', 'category'].includes(field)} type={['stock', 'price'].includes(field) ? 'number' : 'text'} min={['stock', 'price'].includes(field) ? '0' : undefined} step="any" value={form[field]} onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))} /></label>)}
      </div><div className="inventory-modal-actions"><button className="outline compact-button" type="button" onClick={() => setModal(null)}>Cancel</button><button className="primary-button compact-button" type="submit">Save Item</button></div></form></div>}
      {modal === 'adjust' && selected && <div className="inventory-modal-backdrop"><form className="inventory-modal inventory-adjust-modal" onSubmit={submitAdjustment}><div className="inventory-modal-heading"><h3>Adjust Stock</h3><button type="button" aria-label="Close" onClick={() => setModal(null)}><X size={18} /></button></div><p><strong>{selected.name}</strong><br />Current stock: {selected.stock} {selected.unit}</p><label>Adjustment quantity<input required type="number" step="any" value={adjustment.quantity} onChange={(event) => setAdjustment((current) => ({ ...current, quantity: event.target.value }))} placeholder="Use a negative number to remove stock" /></label><label>Reason<textarea required value={adjustment.reason} onChange={(event) => setAdjustment((current) => ({ ...current, reason: event.target.value }))} placeholder="e.g. Physical stock count" /></label><div className="inventory-modal-actions"><button className="outline compact-button" type="button" onClick={() => setModal(null)}>Cancel</button><button className="primary-button compact-button" type="submit">Save Adjustment</button></div></form></div>}
    </div>
  );
}
