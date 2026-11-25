import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  BarChart3,
  CalendarDays,
  ChevronDown,
  Eye,
  FileDown,
  FileText,
  Package,
  Printer,
  Receipt,
  RefreshCw,
  ShoppingCart,
  X,
  type LucideIcon,
} from 'lucide-react';
import type { AuthSession, SaleRecord } from '@yenkasa/contracts';
import { reportsApi, staffApi, type CashierReportRow, type CashierTransactionRow, type TransactionDetails } from './api';

type ReportTab = 'cashier' | 'sales' | 'inventory' | 'release';
const money = (value: number) => `GHS ${value.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const today = () => new Date().toISOString().slice(0, 10);
const previousMonth = () => {
  const value = new Date();
  value.setDate(value.getDate() - 30);
  return value.toISOString().slice(0, 10);
};
const labelDate = (value: string) => new Date(`${value}T12:00:00`).toLocaleDateString('en-GH', { month: 'short', day: 'numeric', year: 'numeric' });

export function ReportsPage({ session }: { session: AuthSession }) {
  const [tab, setTab] = useState<ReportTab>(() => session.permissions.includes('payment_reports') || session.permissions.includes('financial_reports') ? 'cashier' : session.permissions.includes('sales') || session.permissions.includes('limited_reports') ? 'sales' : 'inventory');
  const [startDate, setStartDate] = useState(previousMonth());
  const [endDate, setEndDate] = useState(today());
  const [cashierId, setCashierId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cashiers, setCashiers] = useState<Array<{ id: string; fullName: string }>>([]);
  const [summary, setSummary] = useState<{ totalTransactions: number; totalPaid: number; cashTotal: number; electronicTotal: number; rows: CashierReportRow[] } | null>(null);
  const [transactions, setTransactions] = useState<CashierTransactionRow[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [transactionCashier, setTransactionCashier] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [details, setDetails] = useState<TransactionDetails | null>(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const canCashier = session.permissions.includes('payment_reports') || session.permissions.includes('financial_reports');
  const canSales = session.permissions.includes('sales') || session.permissions.includes('limited_reports') || session.permissions.includes('financial_reports');
  const canInventory = session.permissions.includes('stock_reports') || session.permissions.includes('financial_reports');
  const canRelease = session.permissions.includes('material_release') || session.permissions.includes('financial_reports');

  const loadSummary = async () => {
    setError('');
    try {
      const result = await reportsApi.cashierSummary(session.branchId, session.userId, { startDate, endDate, cashierUserId: cashierId, paymentMethod });
      setSummary(result);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to load cashier reports.');
    }
  };
  useEffect(() => {
    if (canCashier) void loadSummary();
    else if (!canSales && canInventory) setTab('inventory');
    if (session.role === 'BRANCH_MANAGER') {
      staffApi.list(session.branchId, session.userId).then((rows) => setCashiers(rows.filter((row) => row.role === 'CASHIER' || row.role === 'SALES_CASHIER').map((row) => ({ id: row.id, fullName: row.fullName })))).catch(() => undefined);
    } else {
      setCashiers([{ id: session.userId, fullName: session.fullName }]);
      setCashierId(session.role === 'CASHIER' ? session.userId : '');
    }
  }, [session.branchId, session.userId, canCashier, canInventory, canSales]);

  const openDay = async (date: string, row?: CashierReportRow) => {
    setSelectedDate(date);
    setTransactionCashier(row?.cashierId ?? '');
    setStartTime('');
    setEndTime('');
    setError('');
    try {
      const result = await reportsApi.cashierTransactions(session.branchId, session.userId, { date, cashierUserId: row?.cashierId ?? '', paymentMethod });
      setTransactions(result.transactions);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to load transactions.');
    }
  };
  const filterDay = async () => {
    if (!selectedDate) return;
    try {
      const result = await reportsApi.cashierTransactions(session.branchId, session.userId, { date: selectedDate, cashierUserId: transactionCashier, startTime, endTime, paymentMethod });
      setTransactions(result.transactions);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to filter transactions.');
    }
  };
  const openDetails = async (row: CashierTransactionRow) => {
    try {
      setDetails(await reportsApi.transactionDetails(row.id, session.branchId, session.userId));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to load transaction details.');
    }
  };
  const print = async () => {
    setStatus('Opening the system print dialog…');
    try {
      const result = await window.desktopBridge?.print?.();
      setStatus(result === false ? 'Print dialog could not be opened.' : 'Report sent to the system print dialog.');
    } catch {
      setStatus('Print dialog could not be opened.');
    }
  };
  const exportPdf = async () => {
    try {
      const result = await window.desktopBridge?.exportPdf?.('Yenkasa-Cashier-Report.pdf', 'A4');
      setStatus(result ? `PDF saved to ${result}` : 'PDF export cancelled or unavailable.');
    } catch {
      setStatus('PDF export failed.');
    }
  };
  const detailSale = details?.invoice;
  return (
    <div className="reports-page">
      <header className="reports-heading">
        <div className="reports-heading-icon"><BarChart3 size={26} /></div>
        <div><h2>{selectedDate ? 'Cashier Transactions' : 'Reports'}</h2><p>{selectedDate ? `${labelDate(selectedDate)} · payment transactions` : 'Branch payments, sales, stock and material release reports'}</p></div>
        <label className="reports-date-range"><CalendarDays size={17} /><input aria-label="Report start date" type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} /><span>–</span><input aria-label="Report end date" type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} /><ChevronDown size={15} /></label>
      </header>
      <div className="reports-tabs" role="tablist">
        {canCashier && <ReportTabButton active={tab === 'cashier'} icon={Receipt} label="Cashier Reports" onClick={() => { setTab('cashier'); setSelectedDate(''); }} />}
        {canSales && <ReportTabButton active={tab === 'sales'} icon={ShoppingCart} label="Sales Reports" onClick={() => { setTab('sales'); setSelectedDate(''); }} />}
        {canInventory && <ReportTabButton active={tab === 'inventory'} icon={Package} label="Inventory Reports" onClick={() => { setTab('inventory'); setSelectedDate(''); }} />}
        {canRelease && <ReportTabButton active={tab === 'release'} icon={FileText} label="Material Release Reports" onClick={() => { setTab('release'); setSelectedDate(''); }} />}
      </div>
      {selectedDate ? (
        <section className="reports-card reports-detail-page">
          <div className="reports-section-heading"><button className="compact-outline" type="button" onClick={() => setSelectedDate('')}><ArrowLeft size={15} /> Back to Summary</button><div><h3>Cashier Transactions – {labelDate(selectedDate)}</h3><p>Filter by cashier, time range or payment method.</p></div><div className="reports-mini-stat"><span>Transactions</span><strong>{transactions.length}</strong></div></div>
          <div className="reports-filters">
            <select aria-label="Filter cashier" value={transactionCashier} onChange={(event) => setTransactionCashier(event.target.value)}><option value="">All Cashiers</option>{cashiers.map((cashier) => <option key={cashier.id} value={cashier.id}>{cashier.fullName}</option>)}</select>
            <input aria-label="Start time" type="time" value={startTime} onChange={(event) => setStartTime(event.target.value)} />
            <input aria-label="End time" type="time" value={endTime} onChange={(event) => setEndTime(event.target.value)} />
            <select aria-label="Filter payment method" value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}><option value="">All Payment Methods</option><option value="CASH">Cash</option><option value="MOBILE_MONEY">MoMo</option><option value="BANK_TRANSFER">Bank</option><option value="CARD">Card</option></select>
            <button className="compact-primary" type="button" onClick={() => void filterDay()}><RefreshCw size={15} /> Filter</button>
          </div>
          <TransactionTable rows={transactions} onView={openDetails} />
        </section>
      ) : tab === 'cashier' ? (
        <>
          <section className="reports-card">
            <div className="reports-section-heading"><div><h3>Cashier Reports</h3><p>Cashier transactions, payments and receipts</p></div><div className="reports-actions"><select aria-label="Summary cashier" value={cashierId} onChange={(event) => setCashierId(event.target.value)}><option value="">All Cashiers</option>{cashiers.map((cashier) => <option key={cashier.id} value={cashier.id}>{cashier.fullName}</option>)}</select><select aria-label="Summary payment method" value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}><option value="">All Payment Methods</option><option value="CASH">Cash</option><option value="MOBILE_MONEY">MoMo</option><option value="BANK_TRANSFER">Bank</option><option value="CARD">Card</option></select><button className="compact-primary" type="button" onClick={() => void loadSummary()}><RefreshCw size={15} /> Generate</button></div></div>
            <div className="reports-stat-grid"><ReportStat icon={Receipt} label="Total Transactions" value={String(summary?.totalTransactions ?? 0)} tone="blue" /><ReportStat icon={ShoppingCart} label="Total Sales (Paid)" value={money(summary?.totalPaid ?? 0)} tone="green" /><ReportStat icon={Receipt} label="Cash Payments" value={money(summary?.cashTotal ?? 0)} tone="purple" /><ReportStat icon={CalendarDays} label="MoMo / Bank" value={money(summary?.electronicTotal ?? 0)} tone="orange" /></div>
            <SummaryTable rows={summary?.rows ?? []} onView={openDay} />
            <ReportFooter onPrint={() => void print()} onExport={() => void exportPdf()} />
          </section>
        </>
      ) : (
        <section className="reports-card reports-empty"><h3>{tab === 'sales' ? 'Sales Reports' : tab === 'inventory' ? 'Inventory Reports' : 'Material Release Reports'}</h3><p>This report category is available from the same branch reporting workspace. Select Cashier Reports for payment transactions, or continue with the next report implementation.</p></section>
      )}
      {status && <small className="save-status" role="status">{status}</small>}
      {error && <small className="save-error" role="alert">{error}</small>}
      {details && detailSale && <TransactionDetailsModal details={details} onClose={() => setDetails(null)} onPrint={() => void print()} onExport={() => void exportPdf()} />}
    </div>
  );
}

function ReportTabButton({ active, icon: Icon, label, onClick }: { active: boolean; icon: LucideIcon; label: string; onClick: () => void }) {
  return <button className={`reports-tab ${active ? 'active' : ''}`} type="button" role="tab" aria-selected={active} onClick={onClick}><Icon size={22} /><span>{label}</span></button>;
}
function ReportStat({ icon: Icon, label, value, tone }: { icon: LucideIcon; label: string; value: string; tone: string }) {
  return <div className="reports-stat"><span className={`reports-stat-icon ${tone}`}><Icon size={18} /></span><div><small>{label}</small><strong>{value}</strong></div></div>;
}
function SummaryTable({ rows, onView }: { rows: CashierReportRow[]; onView: (date: string, row?: CashierReportRow) => void }) {
  return <div className="reports-table-wrap"><table className="reports-table"><thead><tr><th>Date</th><th>Cashier</th><th>Transactions</th><th>Sales Amount</th><th>Payments</th></tr></thead><tbody>{rows.length ? rows.map((row) => <tr key={`${row.date}-${row.cashierId}`} tabIndex={0} onClick={() => onView(row.date, row)} onKeyDown={(event) => { if (event.key === 'Enter') onView(row.date, row); }}><td>{labelDate(row.date)}</td><td>{row.cashierName}</td><td>{row.transactions}</td><td>{money(row.salesAmount)}</td><td>{row.paymentMethods.map((method) => method.replace('MOBILE_MONEY', 'MoMo').replace('BANK_TRANSFER', 'Bank')).join(', ')}</td></tr>) : <tr><td colSpan={5} className="reports-no-data">No payments found for this date range.</td></tr>}</tbody></table></div>;
}
function TransactionTable({ rows, onView }: { rows: CashierTransactionRow[]; onView: (row: CashierTransactionRow) => void }) {
  return <div className="reports-table-wrap"><table className="reports-table transaction-table"><thead><tr><th>#</th><th>Time</th><th>Cashier</th><th>Transaction No.</th><th>Items</th><th>Total Amount</th><th>Payment Method</th><th>Actions</th></tr></thead><tbody>{rows.length ? rows.map((row, index) => <tr key={row.id}><td>{index + 1}</td><td>{row.time}</td><td>{row.cashierName}</td><td>{row.transactionNumber}</td><td>{row.items}</td><td>{money(row.totalAmount)}</td><td>{row.paymentMethod.replace('MOBILE_MONEY', 'MoMo').replace('BANK_TRANSFER', 'Bank')}</td><td><button className="table-action" type="button" onClick={() => onView(row)}><Eye size={14} /> View</button></td></tr>) : <tr><td colSpan={8} className="reports-no-data">No transactions match these filters.</td></tr>}</tbody></table></div>;
}
function ReportFooter({ onPrint, onExport }: { onPrint: () => void; onExport: () => void }) {
  return <div className="reports-footer"><button className="compact-outline" type="button" onClick={onPrint}><Printer size={15} /> Print</button><button className="compact-outline" type="button" onClick={onExport}><FileDown size={15} /> Export PDF</button></div>;
}
function TransactionDetailsModal({ details, onClose, onPrint, onExport }: { details: TransactionDetails; onClose: () => void; onPrint: () => void; onExport: () => void }) {
  const sale: SaleRecord = details.invoice;
  return <div className="reports-modal-backdrop" role="dialog" aria-modal="true"><section className="reports-modal"><header><div><span className="reports-modal-icon"><FileText size={20} /></span><div><h2>Transaction Details</h2><p>{details.transactionNumber}</p></div></div><button className="icon-button" type="button" onClick={onClose} aria-label="Close"><X size={20} /></button></header><div className="transaction-summary-grid"><div><span>Transaction No.</span><strong>{details.transactionNumber}</strong><span>Date</span><strong>{labelDate(sale.createdAt.slice(0, 10))}</strong><span>Cashier</span><strong>{details.cashierName}</strong><span>Payment Method</span><strong>{details.payment.method.replace('MOBILE_MONEY', 'MoMo').replace('BANK_TRANSFER', 'Bank')}</strong><span>Verification</span><strong>{details.payment.verificationStatus.replaceAll('_', ' ')}</strong></div><div><span>Customer</span><strong>{sale.customerName}</strong><span>Subtotal</span><strong>{money(sale.subtotal)}</strong><span>VAT</span><strong>{money(sale.tax)}</strong><span>Discount</span><strong>{money(sale.discount)}</strong><span>Total Paid</span><strong className="transaction-total">{money(details.payment.amount)}</strong></div></div><h3 className="transaction-items-title"><Package size={18} /> Items ({sale.items.length})</h3><div className="reports-table-wrap"><table className="reports-table"><thead><tr><th>#</th><th>Item</th><th>Qty</th><th>Unit Price</th><th>Amount</th></tr></thead><tbody>{sale.items.map((item, index) => <tr key={`${item.sku}-${index}`}><td>{index + 1}</td><td>{item.name}</td><td>{item.quantity} {item.unit}</td><td>{money(item.unitPrice)}</td><td>{money(item.amount)}</td></tr>)}</tbody></table></div><footer><button className="compact-outline" type="button" onClick={onPrint}><Printer size={15} /> Print Receipt</button><button className="compact-outline" type="button" onClick={onPrint}><FileText size={15} /> Print Invoice</button><button className="compact-outline" type="button" onClick={onExport}><FileDown size={15} /> Export PDF</button><button className="compact-primary" type="button" onClick={onClose}>Close</button></footer></section></div>;
}
