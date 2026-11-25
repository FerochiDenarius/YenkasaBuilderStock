import type {
  AuthSession,
  Branch,
  CompanyRegistration,
  OwnerAccount,
  OwnerActivity,
  OwnerSecurity,
  OwnerSession,
  PaymentRecord,
  PurchaseRecord,
  ReceiptRecord,
  MaterialReleaseRecord,
  SaleRecord,
  SalesProduct,
  StaffAccount,
  SyncStatus,
} from '@yenkasa/contracts';
export interface DeviceRecord {
  id: string;
  branchId: string;
  branchName: string;
  deviceName: string;
  activationCode: string;
  deviceType: string;
  validity: string;
  active: boolean;
  createdAt: string;
}

export const LOCAL_API_URL =
  window.desktopBridge?.apiBaseUrl ?? import.meta.env.VITE_LOCAL_API_URL ?? 'http://127.0.0.1:8765';

function ownerHeaders(): HeadersInit {
  const token = sessionStorage.getItem('yenkasa-owner-session');
  return token ? { 'X-Owner-Session': token } : { 'X-Role': 'HQ_ADMIN' };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${LOCAL_API_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => undefined);
    throw new Error(
      body?.error?.message ?? `Local API request failed (${response.status})`,
    );
  }
  return response.json() as Promise<T>;
}

export const companyApi = {
  get: () => request<CompanyRegistration | null>('/api/company'),
  save: (company: CompanyRegistration) =>
    request<CompanyRegistration>('/api/company', {
      method: 'PUT',
      headers: ownerHeaders(),
      body: JSON.stringify(company),
    }),
};

export type InstallationStatus = {
  state: 'DATABASE_NOT_CONFIGURED' | 'CLOUD_CONNECTED_SCHEMA_PENDING' | 'COMPANY_NOT_REGISTERED' | 'COMPANY_REGISTERED' | 'CLOUD_UNAVAILABLE';
  databaseConfigured: boolean;
  cloudConnected: boolean;
  companyFound: boolean;
  schemaReady?: boolean;
  companyId?: string;
  registeredName?: string;
  tradingName?: string;
};

export const installationApi = {
  status: () => request<InstallationStatus>('/api/installation/status'),
};

export const ownerApi = {
  get: () => request<OwnerAccount | null>('/api/owner', { headers: ownerHeaders() }),
  save: (owner: OwnerAccount) =>
    request<OwnerAccount>('/api/owner', {
      method: 'PUT',
      headers: ownerHeaders(),
      body: JSON.stringify(owner),
    }),
  status: () => request<{ ownerExists: boolean; passwordSet: boolean }>('/api/owner/status'),
  login: (username: string, password: string) =>
    request<OwnerSession>('/api/owner/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  logout: () =>
    request<{ ok: boolean }>('/api/owner/logout', { method: 'POST', headers: ownerHeaders() }),
  getSecurity: () =>
    request<OwnerSecurity & { ownerSession?: OwnerSession }>('/api/owner/security', {
      headers: ownerHeaders(),
    }),
  saveSecurity: (security: {
    username: string;
    email: string;
    password?: string;
    twoFactorEnabled: boolean;
    emailNotifications: boolean;
    smsNotifications: boolean;
    recoveryPhone: string;
    recoveryEmail: string;
  }) =>
    request<OwnerSecurity & { ownerSession?: OwnerSession }>('/api/owner/security', {
      method: 'PUT',
      headers: ownerHeaders(),
      body: JSON.stringify(security),
    }),
  activity: () =>
    request<OwnerActivity[]>('/api/owner/activity', {
      headers: ownerHeaders(),
    }),
};

export const branchApi = {
  list: () => request<Branch[]>('/api/branches', { headers: ownerHeaders() }),
  activatedList: () => request<Branch[]>('/api/activated-branches'),
  create: (branch: Record<string, unknown>) =>
    request<Branch>('/api/branches', {
      method: 'POST',
      headers: ownerHeaders(),
      body: JSON.stringify(branch),
    }),
  update: (id: string, branch: Record<string, unknown>) =>
    request<Branch>(`/api/branches/${id}`, {
      method: 'PATCH',
      headers: ownerHeaders(),
      body: JSON.stringify(branch),
    }),
  remove: (id: string) =>
    request<{ ok: boolean; id: string }>(`/api/branches/${id}`, {
      method: 'DELETE',
      headers: ownerHeaders(),
    }),
};

export const deviceApi = {
  list: () =>
    request<DeviceRecord[]>('/api/devices', {
      headers: ownerHeaders(),
    }),
  create: (payload: {
    branchId: string;
    deviceName: string;
    deviceType: string;
    validity: string;
  }) =>
    request<DeviceRecord>('/api/devices', {
      method: 'POST',
      headers: ownerHeaders(),
      body: JSON.stringify(payload),
    }),
  update: (id: string, active: boolean) =>
    request<DeviceRecord>(`/api/devices/${id}`, {
      method: 'PATCH',
      headers: ownerHeaders(),
      body: JSON.stringify({ active }),
    }),
};

export const authApi = {
  login: (payload: {
    branchId: string;
    username: string;
    password: string;
    loginRole: string;
    deviceId?: string;
  }) =>
    request<AuthSession>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  logout: (userId: string) =>
    request<{ ok: boolean }>('/api/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    }),
};

export const syncApi = {
  status: (branchId: string, userId: string) =>
    request<SyncStatus>(
      `/api/sync/status?branchId=${encodeURIComponent(branchId)}`,
      { headers: { 'X-User-Id': userId, 'X-Branch-Id': branchId } },
    ),
  saveSettings: (
    branchId: string,
    userId: string,
    payload: {
      onlineEnabled: boolean;
      autoSyncEnabled: boolean;
      intervalMinutes: number;
    },
  ) =>
    request<SyncStatus>('/api/sync/settings', {
      method: 'PUT',
      headers: { 'X-User-Id': userId, 'X-Branch-Id': branchId },
      body: JSON.stringify({ branchId, ...payload }),
    }),
  run: (branchId: string, userId: string) =>
    request<SyncStatus & { message: string; synced: boolean }>(
      '/api/sync/run',
      {
        method: 'POST',
        headers: { 'X-User-Id': userId, 'X-Branch-Id': branchId },
        body: JSON.stringify({ branchId }),
      },
    ),
};

export const staffApi = {
  companyUsers: () =>
    request<StaffAccount[]>('/api/company-users', {
      headers: ownerHeaders(),
    }),
  list: (branchId: string, userId: string) =>
    request<StaffAccount[]>(
      `/api/staff?branchId=${encodeURIComponent(branchId)}`,
      { headers: { 'X-User-Id': userId, 'X-Branch-Id': branchId } },
    ),
  create: (
    branchId: string,
    userId: string,
    payload: {
      username: string;
      email: string;
      fullName: string;
      role: string;
      password: string;
      permissions?: string[];
    },
  ) =>
    request<StaffAccount>('/api/staff', {
      method: 'POST',
      headers: { 'X-User-Id': userId, 'X-Branch-Id': branchId },
      body: JSON.stringify({ ...payload, branchId }),
    }),
  update: (
    id: string,
    branchId: string,
    userId: string,
    payload: {
      fullName?: string;
      email?: string;
      role?: string;
      active?: boolean;
      permissions?: string[];
    },
  ) =>
    request<StaffAccount>(`/api/staff/${id}`, {
      method: 'PATCH',
      headers: { 'X-User-Id': userId, 'X-Branch-Id': branchId },
      body: JSON.stringify(payload),
    }),
  resetPassword: (
    id: string,
    branchId: string,
    userId: string,
    password: string,
  ) =>
    request<StaffAccount>(`/api/staff/${id}/reset-password`, {
      method: 'POST',
      headers: { 'X-User-Id': userId, 'X-Branch-Id': branchId },
      body: JSON.stringify({ password }),
    }),
  audit: (branchId?: string, userId?: string) =>
    request<
      Array<{
        id: string;
        action: string;
        actorUserId: string;
        targetUserId: string;
        createdAt: string;
      }>
    >(
      branchId
        ? `/api/audit-log?branchId=${encodeURIComponent(branchId)}`
        : '/api/company-audit-log',
      {
        headers: branchId
          ? { 'X-User-Id': userId ?? '', 'X-Branch-Id': branchId }
          : ownerHeaders(),
      },
    ),
};

export type CustomerRecord = {
  id: string;
  branchId: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  customerType: string;
  creditLimit: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export const customersApi = {
  list: (branchId: string, userId: string, search = '') =>
    request<CustomerRecord[]>(`/api/customers?branchId=${encodeURIComponent(branchId)}&search=${encodeURIComponent(search)}`, {
      headers: { 'X-User-Id': userId, 'X-Branch-Id': branchId },
    }),
  create: (branchId: string, userId: string, payload: Omit<CustomerRecord, 'id' | 'createdAt' | 'updatedAt' | 'branchId'>) =>
    request<CustomerRecord>('/api/customers', {
      method: 'POST', headers: { 'X-User-Id': userId, 'X-Branch-Id': branchId }, body: JSON.stringify({ branchId, ...payload }),
    }),
  update: (id: string, branchId: string, userId: string, payload: Omit<CustomerRecord, 'id' | 'createdAt' | 'updatedAt' | 'branchId'>) =>
    request<CustomerRecord>(`/api/customers/${encodeURIComponent(id)}`, {
      method: 'PATCH', headers: { 'X-User-Id': userId, 'X-Branch-Id': branchId }, body: JSON.stringify({ branchId, ...payload }),
    }),
  remove: (id: string, branchId: string, userId: string) =>
    request<CustomerRecord>(`/api/customers/${encodeURIComponent(id)}?branchId=${encodeURIComponent(branchId)}`, {
      method: 'DELETE', headers: { 'X-User-Id': userId, 'X-Branch-Id': branchId },
    }),
};

export type CashierReportRow = {
  date: string;
  cashierId: string;
  cashierName: string;
  transactions: number;
  salesAmount: number;
  paymentMethods: string[];
};
export type CashierTransactionRow = {
  id: string;
  transactionNumber: string;
  time: string;
  date: string;
  cashierId: string;
  cashierName: string;
  saleId: string;
  customerName: string;
  items: number;
  totalAmount: number;
  paymentMethod: string;
  verificationStatus: string;
};
export type TransactionDetails = {
  payment: PaymentRecord;
  invoice: SaleRecord;
  cashierName: string;
  transactionNumber: string;
};

export const reportsApi = {
  cashierSummary: (
    branchId: string,
    userId: string,
    filters: { startDate: string; endDate: string; cashierUserId?: string; paymentMethod?: string },
  ) => {
    const params = new URLSearchParams({ branchId, startDate: filters.startDate, endDate: filters.endDate });
    if (filters.cashierUserId) params.set('cashierUserId', filters.cashierUserId);
    if (filters.paymentMethod) params.set('paymentMethod', filters.paymentMethod);
    return request<{
      branchId: string;
      startDate: string;
      endDate: string;
      totalTransactions: number;
      totalPaid: number;
      cashTotal: number;
      electronicTotal: number;
      rows: CashierReportRow[];
    }>(`/api/reports/cashier-summary?${params.toString()}`, {
      headers: { 'X-User-Id': userId, 'X-Branch-Id': branchId },
    });
  },
  cashierTransactions: (
    branchId: string,
    userId: string,
    filters: { date: string; cashierUserId?: string; startTime?: string; endTime?: string; paymentMethod?: string },
  ) => {
    const params = new URLSearchParams({ branchId, date: filters.date });
    if (filters.cashierUserId) params.set('cashierUserId', filters.cashierUserId);
    if (filters.startTime) params.set('startTime', filters.startTime);
    if (filters.endTime) params.set('endTime', filters.endTime);
    if (filters.paymentMethod) params.set('paymentMethod', filters.paymentMethod);
    return request<{ date: string; transactions: CashierTransactionRow[]; totalTransactions: number; totalPaid: number }>(
      `/api/reports/cashier-transactions?${params.toString()}`,
      { headers: { 'X-User-Id': userId, 'X-Branch-Id': branchId } },
    );
  },
  transactionDetails: (paymentId: string, branchId: string, userId: string) =>
    request<TransactionDetails>(
      `/api/reports/transactions/${encodeURIComponent(paymentId)}?branchId=${encodeURIComponent(branchId)}`,
      { headers: { 'X-User-Id': userId, 'X-Branch-Id': branchId } },
    ),
};

export const salesApi = {
  products: (branchId: string, userId: string) =>
    request<SalesProduct[]>(
      `/api/products?branchId=${encodeURIComponent(branchId)}`,
      { headers: { 'X-User-Id': userId, 'X-Branch-Id': branchId } },
    ),
  list: (branchId: string, userId: string) =>
    request<SaleRecord[]>(
      `/api/sales?branchId=${encodeURIComponent(branchId)}`,
      { headers: { 'X-User-Id': userId, 'X-Branch-Id': branchId } },
    ),
  create: (
    payload: {
      branchId: string;
      documentType: 'SALE' | 'QUOTATION' | 'INVOICE';
      customerName: string;
      vatPercent: number;
      notes: string;
      items: Array<{
        sku: string;
        name: string;
        quantity: number;
        unit: string;
        unitPrice: number;
        discountPercent: number;
      }>;
    },
    userId: string,
  ) =>
    request<SaleRecord>('/api/sales', {
      method: 'POST',
      headers: { 'X-User-Id': userId, 'X-Branch-Id': payload.branchId },
      body: JSON.stringify(payload),
    }),
};

export const inventoryApi = {
  list: (branchId: string, userId: string) => salesApi.products(branchId, userId),
  create: (
    branchId: string,
    userId: string,
    payload: {
      sku: string;
      barcode: string;
      name: string;
      category: string;
      brand: string;
      productType: string;
      variant: string;
      unit: string;
      stock: number;
      price: number;
    },
  ) =>
    request<SalesProduct>('/api/products', {
      method: 'POST',
      headers: { 'X-User-Id': userId, 'X-Branch-Id': branchId },
      body: JSON.stringify({ branchId, ...payload }),
    }),
  adjustStock: (
    branchId: string,
    userId: string,
    sku: string,
    quantity: number,
    reason: string,
  ) =>
    request<SalesProduct>(`/api/products/${encodeURIComponent(sku)}/stock`, {
      method: 'PATCH',
      headers: { 'X-User-Id': userId, 'X-Branch-Id': branchId },
      body: JSON.stringify({ branchId, quantity, reason }),
    }),
};

export const purchasingApi = {
  list: (branchId: string, userId: string) =>
    request<PurchaseRecord[]>(`/api/purchases?branchId=${encodeURIComponent(branchId)}`, {
      headers: { 'X-User-Id': userId, 'X-Branch-Id': branchId },
    }),
  create: (
    branchId: string,
    userId: string,
    payload: {
      supplier: string;
      purchaseDate: string;
      reference: string;
      paymentType: string;
      discount: number;
      notes: string;
      items: Array<{ sku: string; name: string; quantity: number; unit: string; unitCost: number }>;
    },
  ) =>
    request<PurchaseRecord>('/api/purchases', {
      method: 'POST',
      headers: { 'X-User-Id': userId, 'X-Branch-Id': branchId },
      body: JSON.stringify({ branchId, ...payload }),
    }),
};

export const paymentsApi = {
  invoices: (branchId: string, userId: string, search = '') =>
    request<SaleRecord[]>(
      `/api/cashier/invoices?branchId=${encodeURIComponent(branchId)}&search=${encodeURIComponent(search)}`,
      { headers: { 'X-User-Id': userId, 'X-Branch-Id': branchId } },
    ),
  history: (branchId: string, userId: string) =>
    request<PaymentRecord[]>(
      `/api/payments/history?branchId=${encodeURIComponent(branchId)}`,
      { headers: { 'X-User-Id': userId, 'X-Branch-Id': branchId } },
    ),
  record: (
    payload: {
      branchId: string;
      saleId: string;
      amount: number;
      method: PaymentRecord['method'];
      reference: string;
      evidenceNote: string;
      idempotencyKey: string;
    },
    userId: string,
  ) =>
    request<{
      payment: PaymentRecord;
      invoice: SaleRecord;
      receipt: ReceiptRecord | null;
    }>('/api/payments', {
      method: 'POST',
      headers: { 'X-User-Id': userId, 'X-Branch-Id': payload.branchId },
      body: JSON.stringify(payload),
    }),
  verify: (
    paymentId: string,
    branchId: string,
    userId: string,
    evidenceNote: string,
  ) =>
    request<{
      payment: PaymentRecord;
      invoice: SaleRecord;
      receipt: ReceiptRecord;
    }>(`/api/payments/${paymentId}/verify`, {
      method: 'POST',
      headers: { 'X-User-Id': userId, 'X-Branch-Id': branchId },
      body: JSON.stringify({ evidenceNote }),
    }),
};

export const materialReleaseApi = {
  invoices: (branchId: string, userId: string, search = '') =>
    request<
      Array<SaleRecord & { receiptNumber: string; releaseableItems: Array<{
        sku: string;
        name: string;
        quantity: number;
        unit: string;
        remainingQuantity: number;
        stock: number;
      }> }>
    >(
      `/api/material-release/invoices?branchId=${encodeURIComponent(branchId)}&search=${encodeURIComponent(search)}`,
      { headers: { 'X-User-Id': userId, 'X-Branch-Id': branchId } },
    ),
  create: (
    branchId: string,
    userId: string,
    saleId: string,
    items: Array<{ sku: string; quantity: number }>,
  ) =>
    request<{
      release: MaterialReleaseRecord;
      invoice: SaleRecord;
      remainingItems: Array<{
        sku: string;
        name: string;
        quantity: number;
        unit: string;
        remainingQuantity: number;
        stock: number;
      }>;
    }>('/api/material-releases', {
      method: 'POST',
      headers: { 'X-User-Id': userId, 'X-Branch-Id': branchId },
      body: JSON.stringify({ branchId, saleId, items }),
    }),
};
