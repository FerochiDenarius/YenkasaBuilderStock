import { useEffect, useState, type ReactNode } from 'react';
import {
  Bell,
  Boxes,
  Building2,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  Cloud,
  Crown,
  Image,
  LayoutDashboard,
  LockKeyhole,
  Menu,
  Monitor,
  Package,
  Palette,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Store,
  Upload,
  UserCircle,
  Users,
  Wifi,
  type LucideIcon,
} from 'lucide-react';
import { ConnectedBranding } from './ConnectedSetup';
import { BusinessInfoPage as ValidatedBusinessInfoPage } from './BusinessInfoPage';
import { OwnerAccountPage as ConnectedOwnerAccountPage } from './OwnerAccountPage';
import { BranchesPage as ConnectedBranchesPage } from './BranchesPage';
import { BranchLoginPage } from './BranchLoginPage';
import { OwnerLoginPage } from './OwnerLoginPage';
import { StaffAccountsPage } from './StaffAccountsPage';
import { DeviceActivationPage as ConnectedDeviceActivationPage } from './DeviceActivationPage';
import { SalesPage } from './SalesPage';
import { CashierPage } from './CashierPage';
import { MaterialReleasePage } from './MaterialReleasePage';
import { InventoryPage } from './InventoryPage';
import { PurchasingPage } from './PurchasingPage';
import { SyncSettingsPage } from './SyncSettingsPage';
import { CloudDatabaseSetupPage } from './CloudDatabaseSetupPage';
import { companyApi, installationApi, salesApi, type InstallationStatus } from './api';
import { InstallationWelcomePage } from './InstallationWelcomePage';
import type { AuthSession, OwnerSession, SaleRecord, SalesProduct } from '@yenkasa/contracts';

const inventory = [
  {
    sku: 'BLK-001',
    name: '6-inch Building Block',
    category: 'Blocks',
    stock: 2480,
    unit: 'pieces',
    price: 'GHS 4.50',
    status: 'In stock',
  },
  {
    sku: 'CEM-042',
    name: 'Ghacem 42.5R Cement',
    category: 'Cement',
    stock: 186,
    unit: 'bags',
    price: 'GHS 98.00',
    status: 'In stock',
  },
  {
    sku: 'IRO-012',
    name: '12mm Reinforcement Bar',
    category: 'Steel',
    stock: 42,
    unit: 'lengths',
    price: 'GHS 62.00',
    status: 'Low stock',
  },
  {
    sku: 'SAN-020',
    name: 'Washed River Sand',
    category: 'Aggregates',
    stock: 0,
    unit: 'trips',
    price: 'GHS 1,250.00',
    status: 'Out of stock',
  },
  {
    sku: 'ROO-004',
    name: 'Aluzinc Roofing Sheet',
    category: 'Roofing',
    stock: 96,
    unit: 'sheets',
    price: 'GHS 145.00',
    status: 'In stock',
  },
];
const navItems: Array<[LucideIcon, string]> = [
  [LayoutDashboard, 'Dashboard'],
  [ShoppingCart, 'Sales & Invoices'],
  [ClipboardList, 'Cashier & Payments'],
  [Package, 'Inventory'],
  [Package, 'Material Release'],
  [ClipboardList, 'Purchasing'],
  [Users, 'Customers'],
  [Boxes, 'Suppliers'],
  [Boxes, 'Reports'],
];
const setupItems: Array<[LucideIcon, string]> = [
  [Cloud, 'Cloud Database'],
  [Building2, 'Business Information'],
  [Palette, 'Business Branding'],
  [Building2, 'Branches'],
  [Users, 'Users & Roles'],
  [Crown, 'Owner Account'],
  [Monitor, 'Device Activation'],
  [Settings, 'System Settings'],
];
const roleNavigation: Record<string, string[]> = {
  BRANCH_MANAGER: [
    'Dashboard',
    'Sales & Invoices',
    'Cashier & Payments',
    'Inventory',
    'Material Release',
    'Purchasing',
    'Customers',
    'Suppliers',
    'Reports',
  ],
  SALES_OFFICER: ['Dashboard', 'Sales & Invoices', 'Inventory', 'Customers'],
  CASHIER: ['Dashboard', 'Cashier & Payments', 'Reports'],
  STOCK_MANAGER: [
    'Dashboard',
    'Inventory',
    'Material Release',
    'Purchasing',
    'Suppliers',
    'Reports',
  ],
  SALES_CASHIER: [
    'Dashboard',
    'Sales & Invoices',
    'Cashier & Payments',
    'Customers',
    'Inventory',
  ],
};
const protectedOperationalLabels = new Set([
  ...navItems.map(([, label]) => label),
  'Staff Accounts',
  'Dashboard Preferences',
  'Owner Login',
  'Sync Settings',
]);
const navigationPermission: Record<string, string | undefined> = {
  'Sales & Invoices': 'sales',
  'Cashier & Payments': 'payments',
  Inventory: 'inventory_view',
  'Material Release': 'material_release',
  Purchasing: 'purchases',
  Customers: 'customers',
  Suppliers: 'suppliers',
};

export function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [active, setActive] = useState('Branch Login');
  const [setupExpanded, setSetupExpanded] = useState(true);
  const [branchSession, setBranchSession] = useState<AuthSession | null>(() => {
    try {
      return JSON.parse(sessionStorage.getItem('yenkasa-session') ?? 'null');
    } catch {
      return null;
    }
  });
  const [ownerSession, setOwnerSession] = useState<OwnerSession | null>(() => {
    try {
      const token = sessionStorage.getItem('yenkasa-owner-session');
      return token ? JSON.parse(sessionStorage.getItem('yenkasa-owner-session-data') ?? 'null') : null;
    } catch {
      return null;
    }
  });
  const [ownerStatusLoaded, setOwnerStatusLoaded] = useState(false);
  const [installationStatus, setInstallationStatus] = useState<InstallationStatus | null>(null);
  const [initialSetupMode, setInitialSetupMode] = useState(false);
  useEffect(() => {
    window.desktopBridge?.cloud.getConfig()
      .then((config) => {
        if (!config.passwordConfigured && !branchSession && !ownerSession) {
          setInstallationStatus({
            state: 'DATABASE_NOT_CONFIGURED',
            databaseConfigured: false,
            cloudConnected: false,
            companyFound: false,
          });
          setActive('Installation Welcome');
          return;
        }
        return installationApi.status().then((status) => {
          setInstallationStatus(status);
          if (!branchSession && !ownerSession) {
            setActive(status.state === 'CLOUD_UNAVAILABLE' ? 'Cloud Database' : 'Installation Welcome');
          }
        });
      })
      .catch(() => undefined);
    companyApi.get().then((company) => {
      const root = document.documentElement;
      if (!company?.useBrandColours) {
        root.style.setProperty('--brand-primary', '#0b9438');
        root.style.setProperty('--brand-primary-dark', '#147536');
        root.style.setProperty('--brand-secondary', '#f7b500');
        root.style.setProperty('--brand-accent', '#d7263d');
        return;
      }
      root.style.setProperty('--brand-primary', company?.brandColor || '#0b9438');
      root.style.setProperty('--brand-primary-dark', company?.brandColor || '#147536');
      root.style.setProperty('--brand-secondary', company?.secondaryColor || '#f7b500');
      root.style.setProperty('--brand-accent', company?.accentColor || '#d7263d');
    }).catch(() => undefined);
  }, [branchSession, ownerSession]);
  useEffect(() => {
    const sync = () => {
      try {
        setBranchSession(
          JSON.parse(sessionStorage.getItem('yenkasa-session') ?? 'null'),
        );
      } catch {
        setBranchSession(null);
      }
    };
    sync();
    const ownerSync = () => {
      try {
        const token = sessionStorage.getItem('yenkasa-owner-session');
        setOwnerSession(token ? JSON.parse(sessionStorage.getItem('yenkasa-owner-session-data') ?? 'null') : null);
      } catch {
        setOwnerSession(null);
      }
    };
    ownerSync();
    fetch(`${window.desktopBridge?.apiBaseUrl ?? import.meta.env.VITE_LOCAL_API_URL ?? 'http://127.0.0.1:8765'}/api/owner/status`)
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('Unable to read owner setup status')))
      .then(() => undefined)
      .catch(() => undefined)
      .finally(() => setOwnerStatusLoaded(true));
    window.addEventListener('yenkasa-session-changed', sync);
    window.addEventListener('yenkasa-owner-session-changed', ownerSync);
    return () => {
      window.removeEventListener('yenkasa-session-changed', sync);
      window.removeEventListener('yenkasa-owner-session-changed', ownerSync);
    };
  }, []);
  const hasBranchAccess = (label: string) => {
    if (!branchSession) return false;
    if (label === 'Dashboard') return true;
    if (label === 'Reports') {
      return branchSession.permissions.some((permission) => permission.endsWith('_reports') || permission === 'financial_reports');
    }
    if (label === 'Sync Settings') return branchSession.role === 'BRANCH_MANAGER';
    if (label === 'Dashboard Preferences') return true;
    if (label === 'Staff Accounts') return branchSession.role === 'BRANCH_MANAGER';
    const required = navigationPermission[label];
    if (required) return branchSession.permissions.includes(required);
    return roleNavigation[branchSession.role]?.includes(label) ?? false;
  };
  const visibleNav = branchSession
    ? navItems.filter(([, label]) => hasBranchAccess(label))
    : [];
  // Cloud configuration is an installation step and must remain available
  // before the first company record is created. After that, Company Setup is
  // owner-authenticated once owner credentials have been configured.
  const setupUnlocked = !!ownerSession || (initialSetupMode && installationStatus?.companyFound === false);
  const visibleSetup = !branchSession && setupUnlocked ? setupItems : [];
  const branchSetup =
    branchSession?.role === 'BRANCH_MANAGER'
      ? [[Users, 'Staff Accounts'] as [LucideIcon, string]]
      : [];
  const branchSettings =
    branchSession?.role === 'BRANCH_MANAGER'
      ? ['Dashboard Preferences', 'Sync Settings']
      : ['Dashboard Preferences'];
  const logout = () => {
    const userId = branchSession?.userId;
    sessionStorage.removeItem('yenkasa-session');
    sessionStorage.removeItem('yenkasa-owner-session');
    sessionStorage.removeItem('yenkasa-owner-session-data');
    setBranchSession(null);
    setOwnerSession(null);
    setActive('Branch Login');
    if (userId)
      fetch(
        `${window.desktopBridge?.apiBaseUrl ?? import.meta.env.VITE_LOCAL_API_URL ?? 'http://127.0.0.1:8765'}/api/auth/logout`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        },
      ).catch(() => undefined);
  };
  const ownerLogout = () => {
    void fetch(`${window.desktopBridge?.apiBaseUrl ?? import.meta.env.VITE_LOCAL_API_URL ?? 'http://127.0.0.1:8765'}/api/owner/logout`, {
      method: 'POST',
      headers: { 'X-Owner-Session': sessionStorage.getItem('yenkasa-owner-session') ?? '' },
    }).catch(() => undefined);
    sessionStorage.removeItem('yenkasa-owner-session');
    sessionStorage.removeItem('yenkasa-owner-session-data');
    setOwnerSession(null);
    setActive('Branch Login');
  };
  const navigate = (page: string) => {
    if (!ownerStatusLoaded) return;
    if (page === 'Installation Welcome') {
      setActive(page);
      setSidebarOpen(false);
      return;
    }
    if (page === 'Owner Login' && branchSession) {
      sessionStorage.removeItem('yenkasa-session');
      setBranchSession(null);
    }
    if (setupItems.some(([, label]) => label === page) && (!setupUnlocked || !!branchSession)) {
      setActive(installationStatus ? 'Installation Welcome' : 'Owner Login');
      return;
    }
    setActive(page);
    setSidebarOpen(false);
  };
  const canRenderSetup =
    (!branchSession && setupUnlocked && setupItems.some(([, label]) => label === active)) ||
    (branchSession && active === 'Staff Accounts' && branchSession.role === 'BRANCH_MANAGER');
  return (
    <div
      className={`dashboard-shell ${active === 'Branch Login' && !branchSession ? 'branch-login-shell' : ''} ${active === 'Installation Welcome' && !branchSession && !ownerSession ? 'installation-shell' : ''}`}
    >
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="dashboard-brand">
          <div className="dashboard-logo">
            <Store size={32} />
          </div>
          <div>
            <strong>YenkasaBuildersStock</strong>
            <small>
              {branchSession?.branchName?.toUpperCase() ?? 'HEADQUARTERS'}
            </small>
          </div>
        </div>
        <nav className="dashboard-nav">
          {branchSession && (
            <div className="nav-section-label">BRANCH OPERATIONS</div>
          )}
          {visibleNav.map(([Icon, label]) => (
            <button
              className={active === label ? 'selected' : ''}
              key={label}
              onClick={() => navigate(label)}
            >
              <Icon size={19} />
              <span>{label}</span>
            </button>
          ))}
          {!branchSession && (
            <button
              className={`branch-login-nav ${active === 'Branch Login' ? 'selected' : ''}`}
              onClick={() => navigate('Branch Login')}
            >
              <LockKeyhole size={19} />
              <span>Branch Login</span>
            </button>
          )}
          <div className="nav-divider" />
          {branchSession ? (
            <>
              <button className="setup-parent">
                <Settings size={19} />
                <span>Branch Operations</span>
                <ChevronDown size={15} />
              </button>
              <div className="setup-subnav">
                {branchSetup.map(([Icon, label]) => (
                  <button
                    className={active === label ? 'selected' : ''}
                    key={label}
                    onClick={() => navigate(label)}
                  >
                    <Icon size={16} />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
              <div className="nav-section-label">BRANCH SETTINGS</div>
              <div className="setup-subnav">
                {branchSettings.map((label) => (
                  <button
                    className={active === label ? 'selected' : ''}
                    key={label}
                    onClick={() => navigate(label)}
                  >
                    {label === 'Sync Settings' ? <Cloud size={16} /> : <Settings size={16} />}
                    <span>{label}</span>
                  </button>
                ))}
              </div>
              <div className="nav-section-label">OWNER ACCOUNT</div>
              <div className="setup-subnav">
                <button
                  className={active === 'Owner Login' ? 'selected' : ''}
                  onClick={() => navigate('Owner Login')}
                >
                  <Crown size={16} />
                  <span>Owner Login</span>
                </button>
              </div>
            </>
          ) : !setupUnlocked ? (
            <>
              <div className="nav-section-label">OWNER ACCOUNT</div>
              <div className="setup-subnav">
                <button
                  className={active === 'Owner Login' ? 'selected' : ''}
                  onClick={() => navigate('Owner Login')}
                >
                  <Crown size={16} />
                  <span>Owner Login</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                className="setup-parent"
                onClick={() => setSetupExpanded((current) => !current)}
              >
                <Settings size={19} />
                <span>Company Setup</span>
                <ChevronDown
                  className={setupExpanded ? '' : 'collapsed-chevron'}
                  size={15}
                />
              </button>
              {setupExpanded && (
                <div className="setup-subnav">
                  {visibleSetup.map(([Icon, label]) => (
                    <button
                      className={active === label ? 'selected' : ''}
                      key={label}
                      onClick={() => navigate(label)}
                    >
                      <Icon size={16} />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </nav>
        <div className="sidebar-status">
          <Cloud size={18} />
          <div>
            <strong>Offline ready</strong>
            <small>Last synced just now</small>
          </div>
        </div>
          <button
          className="user-card"
          type="button"
          onClick={branchSession ? logout : ownerSession ? ownerLogout : undefined}
        >
          <div className="avatar">
            {branchSession
              ? branchSession.fullName
                  .split(/\s+/)
                  .map((part) => part[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()
              : ownerSession
                ? ownerSession.fullName.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase()
                : 'KO'}
          </div>
          <div>
            <strong>{branchSession?.fullName ?? ownerSession?.fullName ?? 'Kofi Osei'}</strong>
            <small>
              {branchSession
                ? branchSession.role.replaceAll('_', ' ')
                : ownerSession ? 'OWNER · Sign out' : 'Setup locked'}
            </small>
          </div>
          <ChevronDown size={16} />
        </button>
      </aside>
      <main className="dashboard-main">
        <header className="dashboard-header">
          <button
            className="mobile-menu"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu />
          </button>
          <div>
            <p className="eyebrow">Thursday, 20 November 2026</p>
            <h1>{active === 'Dashboard' ? 'Good morning, Kofi' : active}</h1>
          </div>
          <div className="header-actions">
            <div className="connectivity">
              <Wifi size={16} />
              Connected
            </div>
            <button className="icon-button">
              <Bell size={19} />
              <i />
            </button>
            <div className="header-avatar">KO</div>
          </div>
        </header>
        {active === 'Installation Welcome' && !branchSession && !ownerSession && installationStatus ? (
          <InstallationWelcomePage
            status={installationStatus}
            onOwnerLogin={() => navigate('Owner Login')}
            onStaffLogin={() => navigate('Branch Login')}
            onNewCompany={() => {
              setInitialSetupMode(true);
              setActive('Business Information');
            }}
            onDatabase={() => setActive('Cloud Database')}
          />
        ) : active === 'Branch Login' && !branchSession ? (
          <BranchLoginPage
            onAuthenticated={(session) => {
              sessionStorage.removeItem('yenkasa-owner-session');
              sessionStorage.removeItem('yenkasa-owner-session-data');
              setOwnerSession(null);
              setBranchSession(session);
              setActive('Dashboard');
            }}
          />
        ) : active === 'Owner Login' && !branchSession ? (
          <OwnerLoginPage
            onAuthenticated={(session) => {
              sessionStorage.setItem('yenkasa-owner-session-data', JSON.stringify(session));
              sessionStorage.removeItem('yenkasa-session');
              setBranchSession(null);
              setOwnerSession(session);
              setActive('Owner Account');
            }}
          />
        ) : active === 'Dashboard' ? (
          branchSession ? (
            <DashboardHome session={branchSession} onNavigate={navigate} />
          ) : (
            <DashboardHome />
          )
        ) : branchSession && protectedOperationalLabels.has(active) && !hasBranchAccess(active) ? (
          <section className="placeholder-page" role="alert">
            <div className="placeholder-icon"><LockKeyhole /></div>
            <h2>Access restricted</h2>
            <p>Your Branch Manager has not assigned this module to your account.</p>
          </section>
        ) : active === 'Sales & Invoices' && branchSession && hasBranchAccess('Sales & Invoices') ? (
          <SalesPage session={branchSession} />
        ) : active === 'Cashier & Payments' && branchSession && hasBranchAccess('Cashier & Payments') ? (
          <CashierPage session={branchSession} />
        ) : active === 'Inventory' && branchSession && hasBranchAccess('Inventory') ? (
          <InventoryPage session={branchSession} />
        ) : active === 'Purchasing' && branchSession && hasBranchAccess('Purchasing') ? (
          <PurchasingPage session={branchSession} />
        ) : active === 'Material Release' && branchSession && hasBranchAccess('Material Release') ? (
          <MaterialReleasePage session={branchSession} />
        ) : active === 'Sync Settings' && branchSession && branchSession.role === 'BRANCH_MANAGER' ? (
          <SyncSettingsPage session={branchSession} />
        ) : protectedOperationalLabels.has(active) && !branchSession ? (
          <section className="placeholder-page" role="alert">
            <div className="placeholder-icon">
              <LockKeyhole />
            </div>
            <h2>Branch login required</h2>
            <p>
              Sign in to an authorized branch account before opening branch
              operations.
            </p>
            <button
              className="primary-button"
              type="button"
              onClick={() => navigate('Branch Login')}
            >
              Open Branch Login
            </button>
          </section>
        ) : active === 'Cloud Database' ? (
          <CloudDatabaseSetupPage
            onSaved={() => {
              void installationApi.status().then((status) => {
                setInstallationStatus(status);
                setActive('Installation Welcome');
              });
            }}
          />
        ) : canRenderSetup ? (
          <SetupPage page={active} onNavigate={setActive} />
        ) : setupItems.some(([, label]) => label === active) && (branchSession || !setupUnlocked) ? (
          <section className="placeholder-page" role="alert">
            <div className="placeholder-icon"><LockKeyhole /></div>
            <h2>Owner login required</h2>
            <p>Company Setup is locked after owner credentials are created. Sign in as the owner to continue.</p>
            <button className="primary-button" type="button" onClick={() => navigate('Owner Login')}>Open Owner Login</button>
          </section>
        ) : (
          <section className="placeholder-page">
            <div className="placeholder-icon">
              <Settings />
            </div>
            <h2>{active}</h2>
            <p>
              This module is reserved for the next approved development
              milestone.
            </p>
            <span>Sample navigation state</span>
          </section>
        )}
      </main>
    </div>
  );
}

function DashboardHome({
  session,
  onNavigate,
}: {
  session?: AuthSession;
  onNavigate?: (page: string) => void;
}) {
  const [branchProducts, setBranchProducts] = useState<SalesProduct[]>([]);
  const [branchSales, setBranchSales] = useState<SaleRecord[]>([]);
  useEffect(() => {
    if (!session) return;
    Promise.all([
      salesApi.products(session.branchId, session.userId),
      salesApi.list(session.branchId, session.userId),
    ])
      .then(([products, sales]) => {
        setBranchProducts(products);
        setBranchSales(sales);
      })
      .catch(() => undefined);
  }, [session?.branchId, session?.userId]);
  const branchRows = branchProducts.map((item) => ({
    ...item,
    price: `GH₵ ${item.price.toLocaleString('en-GH', { minimumFractionDigits: 2 })}`,
    status: item.stock === 0 ? 'Out of stock' : item.stock <= 30 ? 'Low stock' : 'In stock',
  }));
  const rows = branchRows.length ? branchRows : inventory;
  const salesTotal = branchSales
    .filter((record) => record.documentType === 'INVOICE')
    .reduce((sum, record) => sum + record.total, 0);
  const stockValue = branchProducts.reduce((sum, item) => sum + item.stock * item.price, 0);
  const pendingInvoices = branchSales.filter((record) => record.documentType === 'INVOICE' && record.paymentStatus !== 'PAID').length;
  const customerCount = new Set(branchSales.map((record) => record.customerName)).size;
  return (
    <div className="dashboard-content">
      <section className="summary-grid">
        <Summary
          icon={ShoppingCart}
          label="Today's sales"
          value={session ? `GH₵ ${salesTotal.toLocaleString('en-GH', { minimumFractionDigits: 2 })}` : 'GHS 12,480.00'}
          detail={session ? `${branchSales.filter((record) => record.documentType === 'INVOICE').length} invoices` : '12 transactions'}
          tone="teal"
        />
        <Summary
          icon={Package}
          label="Inventory value"
          value={session ? `GH₵ ${stockValue.toLocaleString('en-GH', { minimumFractionDigits: 2 })}` : 'GHS 248,920.00'}
          detail={session ? `${branchProducts.length} products` : '328 products'}
          tone="blue"
        />
        <Summary
          icon={ClipboardList}
          label="Pending orders"
          value={session ? String(pendingInvoices) : '18'}
          detail={session ? 'unpaid invoices' : '6 need attention'}
          tone="orange"
        />
        <Summary
          icon={Users}
          label="Active customers"
          value={session ? String(customerCount) : '142'}
          detail={session ? 'customers on invoices' : '+8 this month'}
          tone="purple"
        />
      </section>
      <div className="dashboard-grid">
        <section className="panel inventory-panel">
          <div className="panel-heading">
            <div>
              <h2>Inventory overview</h2>
                <p>{session ? `${session.branchName} live stock levels` : 'Sample branch stock levels'}</p>
            </div>
            <button className="primary-button" type="button" onClick={() => onNavigate?.('Inventory')}>
              <Plus size={17} />
              Add product
            </button>
          </div>
          <div className="table-toolbar">
            <div className="search-box">
              <Search size={17} />
              <input placeholder="Search inventory" />
            </div>
            <button className="filter-button">
              All categories <ChevronDown size={15} />
            </button>
          </div>
          <div className="inventory-table">
            <div className="table-row table-head">
              <span>Product</span>
              <span>Category</span>
              <span>Stock level</span>
              <span>Unit price</span>
              <span>Status</span>
            </div>
            {rows.map((item) => (
              <div className="table-row" key={item.sku}>
                <div className="product-cell">
                  <div className="product-icon">
                    <Package size={16} />
                  </div>
                  <div>
                    <strong>{item.name}</strong>
                    <small>{item.sku}</small>
                  </div>
                </div>
                <span className="muted">{item.category}</span>
                <span>
                  {item.stock.toLocaleString()}{' '}
                  <small className="muted">{item.unit}</small>
                </span>
                <span>{item.price}</span>
                <span
                  className={`status ${item.status.toLowerCase().replaceAll(' ', '-')}`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
          <button className="text-button" type="button" onClick={() => onNavigate?.('Inventory')}>
            View all inventory <span>→</span>
          </button>
        </section>
        <section className="side-panels">
          <section className="panel">
            <div className="panel-heading">
              <div>
                <h2>Quick actions</h2>
                <p>Common tasks for today</p>
              </div>
            </div>
            <div className="quick-actions">
              <QuickAction icon={ShoppingCart} label="Create invoice" onClick={() => onNavigate?.('Sales & Invoices')} />
              <QuickAction icon={Package} label="Open inventory" onClick={() => onNavigate?.('Inventory')} />
              <QuickAction icon={Users} label="Add customer" onClick={() => onNavigate?.('Customers')} />
              <QuickAction icon={ClipboardList} label="New purchase order" onClick={() => onNavigate?.('Purchasing')} />
            </div>
          </section>
          <section className="panel activity">
            <div className="panel-heading">
              <div>
                <h2>Recent activity</h2>
                <p>Latest branch updates</p>
              </div>
            </div>
            <Activity
              color="teal"
              title="Sale completed"
              detail="Invoice #INV-00428 · GHS 1,240.00"
              time="8 min ago"
            />
            <Activity
              color="blue"
              title="Stock received"
              detail="50 bags of Ghacem Cement"
              time="35 min ago"
            />
            <Activity
              color="orange"
              title="Low stock alert"
              detail="12mm Reinforcement Bar"
              time="1 hr ago"
            />
          </section>
        </section>
      </div>
    </div>
  );
}
function Summary({
  icon: Icon,
  label,
  value,
  detail,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
  tone: string;
}) {
  return (
    <div className="summary-card">
      <div className={`summary-icon ${tone}`}>
        <Icon size={21} />
      </div>
      <p>{label}</p>
      <strong>{value}</strong>
      <small>{detail}</small>
    </div>
  );
}
function QuickAction({
  icon: Icon,
  label,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button className="quick-action" type="button" onClick={onClick}>
      <span>
        <Icon size={19} />
      </span>
      {label}
      <b>→</b>
    </button>
  );
}
function Activity({
  color,
  title,
  detail,
  time,
}: {
  color: string;
  title: string;
  detail: string;
  time: string;
}) {
  return (
    <div className="activity-row">
      <i className={color} />
      <div>
        <strong>{title}</strong>
        <small>{detail}</small>
      </div>
      <time>{time}</time>
    </div>
  );
}

function SetupPage({
  page,
  onNavigate,
}: {
  page: string;
  onNavigate: (page: string) => void;
}) {
  if (page === 'Business Information') return <ValidatedBusinessInfoPage />;
  if (page === 'Business Branding') return <ConnectedBranding />;
  if (page === 'Users & Roles') return <StaffAccountsPage />;
  if (page === 'Staff Accounts') return <StaffAccountsPage />;
  if (page === 'Device Activation') return <ConnectedDeviceActivationPage />;
  if (page === 'Owner Account')
    return <ConnectedOwnerAccountPage onNavigate={onNavigate} />;
  if (page === 'Branches') return <ConnectedBranchesPage />;
  if (page === 'Branch Login')
    return <BranchLoginPage onAuthenticated={() => undefined} />;
  if (page === 'Business Branding') return <BrandingPage />;
  if (page === 'Branches') return <BranchesPage />;
  if (page === 'Device Activation') return <DevicesPage />;
  if (page === 'Business Information') return <BusinessInfoPage />;
  const config: Record<
    string,
    { icon: LucideIcon; title: string; description: string; fields: string[] }
  > = {
    'Business Information': {
      icon: Building2,
      title: 'Business Information',
      description:
        'Manage your registered company details and business profile.',
      fields: [
        'Registered Company Name',
        'Trading / Business Name',
        'Business Category',
        'Business Email',
        'Phone Number',
        'Business Address',
      ],
    },
    'Business Branding': {
      icon: Palette,
      title: 'Business Branding',
      description:
        'Customise your business identity, logo and visual appearance across the application.',
      fields: [
        'Business Name',
        'Business Tagline (optional)',
        'Primary Colour',
        'Secondary Colour',
        'Accent Colour',
      ],
    },
    Branches: {
      icon: Building2,
      title: 'Branch Setup',
      description:
        'Create and manage company branches, branch accounts and access from headquarters.',
      fields: [
        'Branch Name',
        'Branch Code / ID',
        'Location / Address',
        'Phone Number',
        'Branch Manager (Admin)',
      ],
    },
    'Users & Roles': {
      icon: Users,
      title: 'Users & Roles',
      description:
        'Manage users, administrators and role-based access for your business.',
      fields: ['Full Name', 'Email Address', 'Role', 'Branch Scope'],
    },
    'Owner Account': {
      icon: Crown,
      title: 'Owner Account',
      description:
        'Manage the primary owner profile, contact details, security and account preferences.',
      fields: [
        'Full Name',
        'Role / Position',
        'Phone Number',
        'Email Address',
        'Identification Type',
        'ID Number',
      ],
    },
    'Device Activation': {
      icon: Monitor,
      title: 'Device Activation',
      description:
        'Authorise and manage devices that can run YenkasaBuildersStock for your company and branches.',
      fields: [
        'Select Branch',
        'Device Name',
        'Device Type',
        'Activation Validity',
      ],
    },
    'System Settings': {
      icon: Settings,
      title: 'System Settings',
      description:
        'Configure application preferences for this company and branch environment.',
      fields: [
        'Default Currency',
        'Timezone',
        'Receipt Format',
        'Offline Sync Interval',
      ],
    },
  };
  const selected = config[page];
  const Icon = selected.icon;
  return (
    <div className="setup-page">
      <div className="setup-breadcrumb">
        ⌂ &nbsp;›&nbsp; Company Setup &nbsp;›&nbsp;{' '}
        <strong>{selected.title}</strong>
      </div>
      <section className="setup-title">
        <div className="setup-title-icon">
          <Icon size={31} />
        </div>
        <div>
          <h2>{selected.title}</h2>
          <p>{selected.description}</p>
        </div>
      </section>
      <div className="setup-grid">
        <section className="panel setup-form">
          <div className="panel-heading">
            <div>
              <h2>{page === 'Business Branding' ? 'Brand Identity' : page}</h2>
              <p>Sample data for UI review</p>
            </div>
          </div>
          <div className="setup-fields">
            {selected.fields.map((field, index) => (
              <label key={field}>
                {field}
                {index < 2 && <em> *</em>}
                <input
                  defaultValue={
                    index === 0
                      ? page === 'Branches'
                        ? 'Oyarifa Branch'
                        : page === 'Business Branding'
                          ? 'Yenkasa Builders Supplies Ltd'
                          : 'Yenkasa Builders Limited'
                      : index === 1
                        ? 'Yenkasa Builders'
                        : ''
                  }
                  placeholder={`Enter ${field.toLowerCase()}`}
                />
              </label>
            ))}
          </div>
          <div className="setup-actions">
            <button className="outline">Reset</button>
            <button className="primary-button">
              <Settings size={16} />
              Save Changes
            </button>
          </div>
        </section>
        <section className="setup-side">
          <section className="panel">
            <div className="panel-heading">
              <div>
                <h2>
                  {page === 'Branches'
                    ? 'Branches'
                    : page === 'Device Activation'
                      ? 'Registered Devices'
                      : page === 'Owner Account'
                        ? 'Account Status'
                        : 'Preview'}
                </h2>
                <p>Approved reference layout</p>
              </div>
            </div>
            <div className="setup-preview">
              <div className="setup-preview-bar">
                <Store size={20} />
                YenkasaBuildersStock
              </div>
              <h3>{selected.title}</h3>
              <p>{selected.description}</p>
              <div className="preview-lines">
                <span />
                <span />
                <span />
              </div>
            </div>
          </section>
          <section className="info-callout">
            <UserCircle size={21} />
            <div>
              <strong>Offline ready</strong>
              <p>
                Changes are prepared locally and can synchronize when
                connectivity returns.
              </p>
            </div>
          </section>
        </section>
      </div>
    </div>
  );
}

function BusinessInfoPage() {
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
            <label>
              Registered Company Name <em>*</em>
              <input defaultValue="Yenkasa Builders Supplies Ltd" />
            </label>
            <label>
              Trading / Business Name <em>*</em>
              <input defaultValue="Yenkasa Builders" />
            </label>
            <label>
              Business Category <em>*</em>
              <input defaultValue="Building Materials" />
            </label>
            <label>
              Business Email <em>*</em>
              <input defaultValue="info@yenkasa.xyz" />
            </label>
            <label>
              Phone Number <em>*</em>
              <input defaultValue="+233 24 567 8900" />
            </label>
            <label>
              Country <em>*</em>
              <input defaultValue="Ghana" />
            </label>
            <label className="wide-field">
              Business Address <em>*</em>
              <textarea defaultValue="Oyarifa Main Road, Accra, Greater Accra Region, Ghana" />
            </label>
            <label>
              Currency <em>*</em>
              <input defaultValue="GHS – Ghana Cedi (GH₵)" />
            </label>
            <label>
              Timezone <em>*</em>
              <input defaultValue="Africa/Accra (GMT+00:00)" />
            </label>
          </div>
          <div className="setup-actions">
            <button className="outline">Reset Changes</button>
            <button className="primary-button">
              <Settings size={16} />
              Save Changes
            </button>
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
            <h3>Yenkasa Builders Supplies Ltd</h3>
            <p>Building Materials · Ghana</p>
            <span>GHS · Africa/Accra</span>
          </div>
        </section>
      </div>
    </div>
  );
}

function BranchesPage() {
  const branches = [
    [
      'Headquarters (HQ)',
      'HQ',
      'Accra (Main)',
      'Bright K. Menya',
      '6',
      'Active',
    ],
    ['Oyarifa Branch', 'OY', 'Oyarifa, Accra', 'Elorm Wisdom', '5', 'Active'],
    ['Dodowa Branch', 'DD', 'Dodowa', 'Ruth Awini', '4', 'Active'],
    ['Tema Branch', 'TA', 'Tema, Accra', 'Arhinful Hudson', '3', 'Suspended'],
  ];
  return (
    <div className="setup-page branch-page">
      <div className="setup-breadcrumb">
        ⌂ &nbsp;›&nbsp; Company Setup &nbsp;›&nbsp; <strong>Branches</strong>
      </div>
      <section className="setup-title">
        <div className="setup-title-icon">
          <Building2 size={31} />
        </div>
        <div>
          <h2>Branch Setup</h2>
          <p>
            Create and manage company branches, branch accounts and access from
            headquarters.
          </p>
        </div>
      </section>
      <div className="branch-stats">
        <Summary
          icon={Building2}
          label="Total Branches"
          value="4"
          detail=""
          tone="blue"
        />
        <Summary
          icon={Building2}
          label="Active Branches"
          value="3"
          detail=""
          tone="teal"
        />
        <Summary
          icon={Building2}
          label="Suspended"
          value="1"
          detail=""
          tone="orange"
        />
        <Summary
          icon={Users}
          label="Branch Users"
          value="18"
          detail=""
          tone="purple"
        />
      </div>
      <div className="branch-grid">
        <section className="panel branch-form">
          <div className="panel-heading">
            <div>
              <h2>
                <Plus size={19} /> Add New Branch
              </h2>
              <p>Create a new branch under your company.</p>
            </div>
          </div>
          <div className="setup-fields one-column">
            <label>
              Branch Name <em>*</em>
              <input defaultValue="Oyarifa Branch" />
            </label>
            <label>
              Branch Code / ID <em>*</em>
              <input defaultValue="OY" />
            </label>
            <label>
              Location / Address <em>*</em>
              <input defaultValue="Oyarifa, Accra" />
            </label>
            <label>
              Phone Number
              <input defaultValue="+233 24 456 7890" />
            </label>
            <label>
              Branch Manager (Admin) <em>*</em>
              <input defaultValue="Create New Branch Account" />
            </label>
          </div>
          <div className="branch-note">
            ⓘ &nbsp; A branch administrator account will be created for this
            branch. The login details will be issued by headquarters.
          </div>
          <div className="setup-actions">
            <button className="outline">Reset</button>
            <button className="primary-button">
              <Building2 size={16} />
              Create Branch
            </button>
          </div>
        </section>
        <section className="panel branch-list">
          <div className="panel-heading">
            <div>
              <h2>Branches</h2>
              <p>All company branches registered under your headquarters.</p>
            </div>
            <div className="search-box">
              <Search size={15} />
              <input placeholder="Search branches..." />
            </div>
          </div>
          <div className="branch-table">
            <div className="branch-row branch-head">
              <span>#</span>
              <span>Branch Name</span>
              <span>Branch Code</span>
              <span>Location</span>
              <span>Manager</span>
              <span>Users</span>
              <span>Status</span>
            </div>
            {branches.map((branch, index) => (
              <div className="branch-row" key={branch[1]}>
                <span>{index + 1}</span>
                <strong>▥ &nbsp;{branch[0]}</strong>
                <span>{branch[1]}</span>
                <span>{branch[2]}</span>
                <span>{branch[3]}</span>
                <span>{branch[4]}</span>
                <span
                  className={`status ${branch[5] === 'Active' ? 'in-stock' : 'low-stock'}`}
                >
                  {branch[5]}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function DevicesPage() {
  const devices = [
    ['HQ-PC-01', 'Headquarters', 'Windows', '01 Nov 2026', 'Active'],
    ['OY-PC-01', 'Oyarifa Branch', 'Windows', '02 Nov 2026', 'Active'],
    ['OY-PC-02', 'Oyarifa Branch', 'Windows', '02 Nov 2026', 'Active'],
    ['DD-PC-01', 'Dodowa Branch', 'Windows', '03 Nov 2026', 'Active'],
    ['TA-PC-01', 'Tema Branch', 'Windows', '03 Nov 2026', 'Pending'],
    ['OY-LAP-01', 'Oyarifa Branch', 'macOS', '28 Oct 2026', 'Revoked'],
  ];
  return (
    <div className="setup-page device-page">
      <div className="setup-breadcrumb">
        ⌂ &nbsp;›&nbsp; Company Setup &nbsp;›&nbsp;{' '}
        <strong>Device Activation</strong>
      </div>
      <section className="setup-title">
        <div className="setup-title-icon">
          <Monitor size={31} />
        </div>
        <div>
          <h2>Device Activation</h2>
          <p>
            Authorize and manage devices (computers) that can run
            YenkasaBuildersStock for your company and branches.
          </p>
        </div>
      </section>
      <div className="device-stats">
        <Summary
          icon={Monitor}
          label="Total Devices"
          value="12"
          detail=""
          tone="blue"
        />
        <Summary
          icon={Monitor}
          label="Active Devices"
          value="10"
          detail=""
          tone="teal"
        />
        <Summary
          icon={Monitor}
          label="Pending Activation"
          value="1"
          detail=""
          tone="orange"
        />
        <Summary
          icon={Monitor}
          label="Revoked / Inactive"
          value="1"
          detail=""
          tone="purple"
        />
      </div>
      <div className="device-grid">
        <section className="panel device-form">
          <div className="panel-heading">
            <div>
              <h2>
                <Plus size={19} /> Activate New Device
              </h2>
              <p>Generate an activation code for a new computer at a branch.</p>
            </div>
          </div>
          <div className="setup-fields one-column">
            <label>
              Select Branch <em>*</em>
              <input defaultValue="Oyarifa Branch (OY)" />
            </label>
            <label>
              Device Name <em>*</em>
              <input defaultValue="Oyarifa-PC-02" />
            </label>
            <label>
              Device Type
              <input defaultValue="Windows PC" />
            </label>
            <label>
              Activation Validity
              <input defaultValue="Permanent (Recommended)" />
            </label>
          </div>
          <p className="device-help">
            The code will be used on the branch computer to activate the
            application.
          </p>
          <button className="primary-button full-button">
            ⌕ &nbsp; Generate Activation Code
          </button>
          <div className="how-it-works">
            <strong>ⓘ &nbsp; How It Works</strong>
            <p>❶ Select the branch and enter a device name.</p>
            <p>❷ Generate an activation code.</p>
            <p>
              ❸ On the branch computer, open the app and choose “Activate
              Device”.
            </p>
            <p>❹ Enter the code to register the device.</p>
          </div>
        </section>
        <section className="panel device-list">
          <div className="panel-heading">
            <div>
              <h2>Registered Devices</h2>
              <p>All devices linked to your company.</p>
            </div>
            <div className="search-box">
              <Search size={15} />
              <input placeholder="Search devices..." />
            </div>
          </div>
          <div className="device-table">
            <div className="device-row device-head">
              <span>#</span>
              <span>Device Name</span>
              <span>Branch</span>
              <span>Device Type</span>
              <span>Activated On</span>
              <span>Status</span>
            </div>
            {devices.map((device, index) => (
              <div className="device-row" key={device[0]}>
                <span>{index + 1}</span>
                <strong>{device[0]}</strong>
                <span>{device[1]}</span>
                <span>{device[2]}</span>
                <span>{device[3]}</span>
                <span
                  className={`status ${device[4] === 'Active' ? 'in-stock' : device[4] === 'Pending' ? 'low-stock' : 'out-of-stock'}`}
                >
                  {device[4]}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function BrandingPage() {
  const [tab, setTab] = useState('Application');
  const [receipts, setReceipts] = useState(true);
  const [invoices, setInvoices] = useState(true);
  const [appColours, setAppColours] = useState(true);
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
      <div className="branding-grid">
        <section className="panel brand-identity">
          <div className="brand-section">
            <h3>
              <Building2 size={20} />
              Brand Identity
            </h3>
            <label>
              Business Name <em>*</em>
              <input defaultValue="Yenkasa Builders Supplies Ltd" />
            </label>
            <label>
              Business Tagline <small>(optional)</small>
              <input defaultValue="Quality Building Materials for Every Project" />
            </label>
            <h3>
              <Image size={20} />
              Logo
            </h3>
            <div className="brand-logo-row">
              <div className="brand-logo-box">
                <div className="brand-logo-mark">⌂</div>
                <strong>Yenkasa</strong>
                <small>Builders Supplies Ltd</small>
              </div>
              <div>
                <button className="brand-outline">
                  <Upload size={16} />
                  Change Logo
                </button>
                <button className="outline brand-remove">
                  ▣ &nbsp; Remove
                </button>
              </div>
            </div>
            <p className="brand-help">
              Recommended: PNG or JPG, at least 512 × 512 px
              <br />
              (transparent background preferred)
            </p>
            <hr />
            <h3>
              <Palette size={20} />
              Brand Colours
            </h3>
            <div className="colour-fields">
              <label>
                Primary Colour <em>*</em>
                <div>
                  <i style={{ background: '#0B2D6B' }} />
                  <input defaultValue="#0B2D6B" />
                </div>
              </label>
              <label>
                Secondary Colour <em>*</em>
                <div>
                  <i style={{ background: '#F7B500' }} />
                  <input defaultValue="#F7B500" />
                </div>
              </label>
              <label>
                Accent Colour
                <div>
                  <i style={{ background: '#D7263D' }} />
                  <input defaultValue="#D7263D" />
                </div>
              </label>
            </div>
            <h3>
              <Boxes size={20} />
              Business Assets
            </h3>
            <ToggleRow
              label="Show logo on receipts"
              checked={receipts}
              onChange={() => setReceipts(!receipts)}
            />
            <ToggleRow
              label="Show logo on invoices"
              checked={invoices}
              onChange={() => setInvoices(!invoices)}
            />
            <ToggleRow
              label="Use brand colours in the application"
              checked={appColours}
              onChange={() => setAppColours(!appColours)}
            />
          </div>
        </section>
        <section className="brand-right">
          <section className="panel branding-preview">
            <div className="brand-panel-heading">
              <h3>
                <Monitor size={20} />
                Branding Preview
              </h3>
            </div>
            <div className="preview-tabs">
              {['Application', 'Receipt', 'Invoice', 'Report'].map((item) => (
                <button
                  className={tab === item ? 'active' : ''}
                  key={item}
                  onClick={() => setTab(item)}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="brand-mock">
              <aside>
                <div className="mock-logo">
                  ⌂{' '}
                  <strong>
                    Yenkasa
                    <br />
                    BuildersStock
                  </strong>
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
                <h3>{tab} preview</h3>
                <p>Overview of your business performance</p>
                <div className="mock-cards">
                  <b>
                    Total Stock Value
                    <br />
                    <strong>GHS 1,245,300.00</strong>
                  </b>
                  <b>
                    Today's Sales
                    <br />
                    <strong>GHS 85,240.00</strong>
                  </b>
                  <b>
                    Low Stock Items
                    <br />
                    <strong className="red">12</strong>
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
      </div>
      <div className="brand-actions">
        <button className="outline">↶ &nbsp; Reset to Default</button>
        <button className="primary-button">
          <Settings size={17} />
          Save Branding
        </button>
      </div>
    </div>
  );
}

function ToggleRow({
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
        className={checked ? 'on' : ''}
        onClick={onChange}
        aria-label={label}
      >
        <i />
      </button>
    </div>
  );
}

// Legacy reference layout retained for comparison; the connected page is rendered above.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function OwnerAccountPage() {
  const permissions = [
    'Manage company information',
    'Manage business branding',
    'Create and manage branches',
    'Create and manage user roles',
    'Access all branches and reports',
    'Configure system settings',
    'Approve critical changes',
  ];
  return (
    <div className="setup-page owner-page">
      <div className="setup-breadcrumb">
        ⌂ &nbsp;›&nbsp; Company Setup &nbsp;›&nbsp;{' '}
        <strong>Owner Account</strong>
      </div>
      <section className="setup-title">
        <div className="setup-title-icon">
          <Crown size={31} />
        </div>
        <div>
          <h2>Owner Account</h2>
          <p>
            Manage the primary owner profile, contact details, security and
            account preferences for the business.
          </p>
        </div>
      </section>
      <div className="owner-grid">
        <section className="owner-profile panel">
          <div className="owner-cover">
            <div className="owner-avatar">
              BO
              <button aria-label="Change profile photo">
                <Upload size={14} />
              </button>
            </div>
          </div>
          <div className="owner-summary">
            <h3>Bright Kofi Ofosu Menya</h3>
            <span className="owner-badge">
              <Crown size={14} />
              Business Owner
            </span>
            <p>Yenkasa Builders Supplies Ltd</p>
          </div>
          <div className="owner-sections">
            {[
              ['Profile Information', UserCircle],
              ['Security & Login', LockKeyhole],
              ['Activity Log', Monitor],
            ].map(([label, Icon], index) => (
              <button
                className={index === 0 ? 'active' : ''}
                key={label as string}
              >
                <Icon size={19} />
                <span>{label as string}</span>
                {index === 0 && <b>›</b>}
              </button>
            ))}
          </div>
        </section>
        <section className="owner-form panel">
          <div className="owner-panel-title">
            <UserCircle size={23} />
            <div>
              <h3>Profile Information</h3>
              <p>Update the owner's personal and business details.</p>
            </div>
          </div>
          <div className="owner-fields">
            <OwnerField
              label="Full Name"
              required
              value="Bright Kofi Ofosu Menya"
            />
            <OwnerField
              label="Role / Position"
              required
              value="Business Owner"
            />
            <OwnerField
              label="Phone Number"
              required
              value="+233 24 123 4567"
              prefix="🇬🇭"
            />
            <OwnerField
              label="Email Address"
              required
              value="bright@yenkasa.xyz"
            />
            <OwnerField label="Identification Type" value="Ghana Card" select />
            <OwnerField label="ID Number" value="GHA-123456789-0" />
            <OwnerField
              label="Date of Birth"
              value="12 Jan 1989"
              icon={<CalendarDays size={17} />}
            />
            <OwnerField label="Gender" value="Male" select />
          </div>
          <div className="owner-photo">
            <div className="owner-panel-title">
              <Image size={23} />
              <div>
                <h3>Profile Photo</h3>
              </div>
            </div>
            <div className="photo-row">
              <div className="photo-preview">BO</div>
              <div>
                <button className="photo-button">
                  <Upload size={16} />
                  Change Photo
                </button>
                <button className="outline photo-remove">Remove Photo</button>
              </div>
            </div>
            <small>Recommended: JPG or PNG, at least 256 × 256 px</small>
          </div>
        </section>
        <aside className="owner-aside">
          <section className="account-status">
            <div className="status-check">✓</div>
            <div>
              <strong>Account Status</strong>
              <small>Active and in good standing</small>
            </div>
            <b>Active</b>
          </section>
          <section className="panel ownership-card">
            <div className="owner-panel-title">
              <Building2 size={22} />
              <h3>Business Ownership</h3>
            </div>
            <OwnershipRow
              label="Company"
              value="Yenkasa Builders Supplies Ltd"
            />
            <OwnershipRow label="Owner Since" value="01 Nov 2026" />
            <OwnershipRow label="Ownership Type" value="Primary Owner" />
            <OwnershipRow label="Account Scope" value="Full Access" badge />
          </section>
          <section className="panel permissions-card">
            <div className="owner-panel-title">
              <ShieldCheck size={22} />
              <h3>Owner Permissions</h3>
            </div>
            {permissions.map((permission) => (
              <div className="permission-row" key={permission}>
                <span>✓</span>
                {permission}
              </div>
            ))}
          </section>
        </aside>
      </div>
      <div className="owner-actions">
        <button className="outline">↶ &nbsp;Reset Changes</button>
        <button className="primary-button">
          <Settings size={17} />
          Save Changes
        </button>
      </div>
    </div>
  );
}

function OwnerField({
  label,
  required,
  value,
  prefix,
  select,
  icon,
}: {
  label: string;
  required?: boolean;
  value: string;
  prefix?: string;
  select?: boolean;
  icon?: ReactNode;
}) {
  return (
    <label className="owner-field">
      {label}
      {required && <em> *</em>}
      <div className="owner-input">
        {prefix && <span>{prefix}</span>}
        <input defaultValue={value} />
        {select && <ChevronDown size={16} />}
        {icon}
      </div>
    </label>
  );
}
function OwnershipRow({
  label,
  value,
  badge,
}: {
  label: string;
  value: string;
  badge?: boolean;
}) {
  return (
    <div className="ownership-row">
      <span>{label}</span>
      {badge ? <b>{value}</b> : <strong>{value}</strong>}
    </div>
  );
}

// Legacy static reference retained below for comparison; the connected staff page is rendered above.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function UsersRolesPage() {
  const users = [
    [
      'BO',
      'Bright Kofi Ofosu Menya',
      'bright@yenkasa.xyz',
      'Owner',
      'Headquarters (HQ)',
      'Active',
    ],
    [
      'EW',
      'Elorm Wisdom',
      'elorm@yenkasa.xyz',
      'HQ Administrator',
      'Headquarters (HQ)',
      'Active',
    ],
    [
      'RA',
      'Ruth Awini',
      'ruth@yenkasa.xyz',
      'HQ Administrator',
      'Headquarters (HQ)',
      'Active',
    ],
    [
      'AH',
      'Arhinful Hudson',
      'hudson@yenkasa.xyz',
      'Branch Administrator',
      'Oyarifa Branch (OY)',
      'Active',
    ],
    [
      'JO',
      'Joana Amoquandoh',
      'joana@yenkasa.xyz',
      'Staff',
      'Oyarifa Branch (OY)',
      'Active',
    ],
    [
      'KA',
      'Kwame Adjei',
      'kwame@yenkasa.xyz',
      'Branch Administrator',
      'Dodowa Branch (DD)',
      'Active',
    ],
    [
      'MA',
      'Mavis Asante',
      'mavis@yenkasa.xyz',
      'Staff',
      'Dodowa Branch (DD)',
      'Inactive',
    ],
    [
      'EA',
      'Emmanuel Agyeman',
      'emmanuel@yenkasa.xyz',
      'Staff',
      'Tema Branch (TA)',
      'Active',
    ],
  ];
  return (
    <div className="setup-page users-page">
      <div className="setup-breadcrumb">
        ⌂ &nbsp;›&nbsp; Company Setup &nbsp;›&nbsp;{' '}
        <strong>Users & Roles</strong>
      </div>
      <section className="setup-title">
        <div className="setup-title-icon">
          <Users size={31} />
        </div>
        <div>
          <h2>Users & Roles</h2>
          <p>
            Create and manage user accounts, assign roles and control access
            across headquarters and branches.
          </p>
        </div>
        <button className="primary-button title-action">
          <Plus size={17} />
          Add User
        </button>
      </section>
      <section className="user-stats">
        <Summary
          icon={Users}
          label="Total Users"
          value="18"
          detail=""
          tone="blue"
        />
        <Summary
          icon={Users}
          label="Active Users"
          value="16"
          detail=""
          tone="teal"
        />
        <Summary
          icon={Users}
          label="Inactive Users"
          value="2"
          detail=""
          tone="orange"
        />
        <Summary icon={Boxes} label="Roles" value="4" detail="" tone="purple" />
      </section>
      <section className="panel users-panel">
        <div className="user-tabs">
          <button className="active-tab">
            <Users size={16} />
            Users
          </button>
          <button>
            <Settings size={16} />
            Roles & Permissions
          </button>
          <div className="user-filters">
            <div className="search-box">
              <Search size={16} />
              <input placeholder="Search users by name or email..." />
            </div>
            <button className="filter-button">
              All Branches <ChevronDown size={14} />
            </button>
            <button className="filter-button">
              All Status <ChevronDown size={14} />
            </button>
          </div>
        </div>
        <div className="users-table">
          <div className="users-row users-head">
            <span>#</span>
            <span>Name</span>
            <span>Email</span>
            <span>Role</span>
            <span>Branch</span>
            <span>Status</span>
            <span>Last Login</span>
            <span>Actions</span>
          </div>
          {users.map((user, index) => (
            <div className="users-row" key={user[2]}>
              <span>{index + 1}</span>
              <span className="user-name">
                <i>{user[0]}</i>
                <strong>{user[1]}</strong>
              </span>
              <span>{user[2]}</span>
              <span className="role-pill">{user[3]}</span>
              <span>{user[4]}</span>
              <span
                className={`status ${user[5] === 'Active' ? 'in-stock' : 'out-of-stock'}`}
              >
                {user[5]}
              </span>
              <span>{index % 2 ? 'Today, 8:17 AM' : 'Today, 9:42 AM'}</span>
              <span>
                <button className="row-action">⋯</button>
              </span>
            </div>
          ))}
        </div>
        <div className="table-footer">
          Showing 1–8 of 18 users{' '}
          <span>
            Rows per page:{' '}
            <button className="filter-button">
              8 <ChevronDown size={13} />
            </button>{' '}
            &nbsp;‹ &nbsp; <b>1</b> &nbsp;2&nbsp; 3 &nbsp;›
          </span>
        </div>
      </section>
    </div>
  );
}
