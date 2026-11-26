const base = process.env.LOCAL_API_URL || 'http://127.0.0.1:8765';
const request = async (path, init = {}) => {
  const response = await fetch(`${base}${path}`, { ...init, headers: { 'Content-Type': 'application/json', ...(init.headers ?? {}) } });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`${path} ${response.status}: ${JSON.stringify(body)}`);
  return body;
};

(async () => {
  const ownerStatus = await request('/api/owner/status');
  let ownerHeaders = { 'X-Role': 'HQ_ADMIN' };
  if (ownerStatus.ownerExists && ownerStatus.passwordSet) {
    const existing = await request('/api/owner/login', { method: 'POST', body: JSON.stringify({ username: 'validation.owner', password: 'ValidationOwner123' }) });
    ownerHeaders = { 'X-Owner-Session': existing.token };
  }
  await request('/api/company', { method: 'PUT', headers: ownerHeaders, body: JSON.stringify({
    registeredName: 'Permissions Validation Builders Ltd', tradingName: 'Permissions Validation', category: 'Building Materials',
    email: 'permissions.validation@example.com', phone: '+233 20 000 0000', country: 'Ghana', address: 'Accra', currency: 'GHS',
    timezone: 'Africa/Accra', brandColor: '#0B9438', tagline: '', logoRef: '', secondaryColor: '#F7B500', accentColor: '#D7263D',
    showLogoReceipts: true, showLogoInvoices: true, useBrandColours: true,
  }) });
  const security = await request('/api/owner/security', { method: 'PUT', headers: ownerHeaders, body: JSON.stringify({
    username: 'validation.owner', email: 'validation.owner@example.com', password: 'ValidationOwner123', twoFactorEnabled: true,
    emailNotifications: true, smsNotifications: false, recoveryPhone: '+233 20 000 0000', recoveryEmail: 'validation.owner@example.com',
  }) });
  ownerHeaders = { 'X-Owner-Session': security.ownerSession?.token || ownerHeaders['X-Owner-Session'] };
  const branch = await request('/api/branches', { method: 'POST', headers: ownerHeaders, body: JSON.stringify({
    name: 'Permissions Validation Branch', code: 'PVAL', location: 'Accra', manager: 'Validation Manager', phone: '',
    managerUsername: 'permissions.manager', managerPassword: 'PermissionsManager123', managerRole: 'BRANCH_MANAGER',
  }) });
  await request('/api/company-users', { method: 'POST', headers: ownerHeaders, body: JSON.stringify({
    branchId: branch.id, username: 'permissions.cashier', fullName: 'Permissions Cashier', email: 'cashier@example.com',
    role: 'CASHIER', password: 'PermissionsCashier123', permissions: ['invoice_view', 'payments', 'receipts'],
  }) });
  await request('/api/company-users', { method: 'POST', headers: ownerHeaders, body: JSON.stringify({
    branchId: branch.id, username: 'permissions.sales', fullName: 'Permissions Sales', email: 'sales@example.com',
    role: 'SALES_OFFICER', password: 'PermissionsSales123', permissions: ['sales', 'quotations', 'invoices', 'inventory_view'],
  }) });
  console.log(JSON.stringify({ branchId: branch.id, owner: security.ownerSession, managerUsername: 'permissions.manager' }));
})().catch((error) => { console.error(error); process.exit(1); });
