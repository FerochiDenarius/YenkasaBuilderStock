import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Edit3, FileText, Plus, Search, Trash2, Users, X } from 'lucide-react';
import type { AuthSession } from '@yenkasa/contracts';
import { customersApi, type CustomerRecord } from './api';

type Form = { name: string; phone: string; email: string; address: string; customerType: string; creditLimit: string; active: boolean };
const blank: Form = { name: '', phone: '', email: '', address: '', customerType: 'Retail', creditLimit: '0', active: true };
const money = (value: number) => `GHS ${value.toLocaleString('en-GH', { minimumFractionDigits: 2 })}`;

export function CustomersPage({ session }: { session: AuthSession }) {
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [form, setForm] = useState<Form>(blank);
  const [editing, setEditing] = useState<CustomerRecord | null>(null);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [open, setOpen] = useState(true);
  const load = async () => {
    try { setCustomers(await customersApi.list(session.branchId, session.userId, query)); } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to load customers.'); }
  };
  useEffect(() => { void load(); }, [session.branchId, session.userId, query]);
  const activeCustomers = useMemo(() => customers.filter((customer) => customer.active).length, [customers]);
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setError('');
    if (!form.name.trim()) { setError('Customer name is required.'); return; }
    try {
      const payload = { branchId: session.branchId, name: form.name, phone: form.phone, email: form.email, address: form.address, customerType: form.customerType, creditLimit: Number(form.creditLimit), active: form.active };
      const saved = editing ? await customersApi.update(editing.id, session.branchId, session.userId, payload) : await customersApi.create(session.branchId, session.userId, payload);
      setCustomers((current) => editing ? current.map((item) => item.id === saved.id ? saved : item) : [...current, saved].sort((a, b) => a.name.localeCompare(b.name)));
      setEditing(null); setForm(blank); setOpen(false); setStatus(editing ? 'Customer updated.' : 'Customer saved.');
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to save customer.'); }
  };
  const edit = (customer: CustomerRecord) => { setEditing(customer); setForm({ name: customer.name, phone: customer.phone, email: customer.email, address: customer.address, customerType: customer.customerType, creditLimit: String(customer.creditLimit), active: customer.active }); setOpen(true); setError(''); };
  const remove = async (customer: CustomerRecord) => {
    if (!window.confirm(`Deactivate ${customer.name}?`)) return;
    try { const updated = await customersApi.remove(customer.id, session.branchId, session.userId); setCustomers((current) => current.map((item) => item.id === updated.id ? updated : item)); setStatus('Customer deactivated.'); } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to deactivate customer.'); }
  };
  return <div className="customers-page">
    <header className="customers-heading"><div className="customers-heading-icon"><Users size={25} /></div><div><h2>Customers</h2><p>Manage customer records for invoices, payments and branch collection.</p></div><button className="compact-primary" type="button" onClick={() => { setEditing(null); setForm(blank); setOpen(true); }}><Plus size={15} /> New Customer</button></header>
    <div className="customers-layout">
      {open && <form className="panel customer-form" onSubmit={submit}><div className="panel-heading"><div><h3>{editing ? 'Edit Customer' : 'Add New Customer'}</h3><p>Cashier and Branch Manager customer access</p></div><button className="icon-button" type="button" onClick={() => setOpen(false)} aria-label="Close"><X size={17} /></button></div>
        <CustomerField label="Customer Name" required value={form.name} onChange={(value) => setForm({ ...form, name: value })} />
        <CustomerField label="Phone Number" value={form.phone} onChange={(value) => setForm({ ...form, phone: value })} />
        <CustomerField label="Email (optional)" type="email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} />
        <label className="customer-field">Address<textarea value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} /></label>
        <label className="customer-field">Customer Type<select value={form.customerType} onChange={(event) => setForm({ ...form, customerType: event.target.value })}><option>Retail</option><option>Business</option><option>Contractor</option></select></label>
        <CustomerField label="Credit Limit (GHS)" type="number" min="0" value={form.creditLimit} onChange={(value) => setForm({ ...form, creditLimit: value })} />
        <label className="customer-check"><input type="checkbox" checked={form.active} onChange={(event) => setForm({ ...form, active: event.target.checked })} /> Active</label>
        <div className="customer-form-actions"><button className="compact-outline" type="button" onClick={() => { setEditing(null); setForm(blank); setOpen(false); }}>Cancel</button><button className="compact-primary" type="submit"><FileText size={15} /> {editing ? 'Save Changes' : 'Save Customer'}</button></div>
      </form>}
      <section className="panel customer-list"><div className="panel-heading"><div><h3>Customers List</h3><p>{activeCustomers} active customer{activeCustomers === 1 ? '' : 's'} in this branch</p></div></div><div className="customer-search"><Search size={16} /><input placeholder="Search customers..." value={query} onChange={(event) => setQuery(event.target.value)} /></div><div className="customer-table-wrap"><table className="customer-table"><thead><tr><th>#</th><th>Customer Name</th><th>Phone</th><th>Type</th><th>Credit Limit</th><th>Status</th><th>Actions</th></tr></thead><tbody>{customers.length ? customers.map((customer, index) => <tr key={customer.id}><td>{index + 1}</td><td><strong>{customer.name}</strong><small>{customer.email || customer.address}</small></td><td>{customer.phone || '—'}</td><td>{customer.customerType}</td><td>{money(customer.creditLimit)}</td><td><span className={`customer-status ${customer.active ? 'active' : 'inactive'}`}>{customer.active ? 'Active' : 'Inactive'}</span></td><td><button className="table-icon-button" type="button" onClick={() => edit(customer)} aria-label={`Edit ${customer.name}`}><Edit3 size={14} /></button><button className="table-icon-button danger" type="button" onClick={() => void remove(customer)} aria-label={`Deactivate ${customer.name}`} disabled={!customer.active}><Trash2 size={14} /></button></td></tr>) : <tr><td colSpan={7} className="customer-empty">No customers found.</td></tr>}</tbody></table></div></section>
    </div>
    {status && <small className="save-status" role="status">{status}</small>}{error && <small className="save-error" role="alert">{error}</small>}
  </div>;
}
function CustomerField({ label, value, onChange, type = 'text', required = false, min }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean; min?: string }) { return <label className="customer-field">{label}{required && <em> *</em>}<input required={required} type={type} min={min} value={value} onChange={(event) => onChange(event.target.value)} /></label>; }
