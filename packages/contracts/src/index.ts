export interface DocumentTemplateItem {
  description: string;
  quantity: string;
  unit: string;
  unitPrice: string;
}

export interface DocumentTemplateContent {
  companyName: string;
  branchName: string;
  companyPhone: string;
  companyEmail: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  billToName: string;
  billToAddress: string;
  billToPhone: string;
  paymentTerms: string;
  notes: string;
  items: DocumentTemplateItem[];
  discountPercent: string;
  vatPercent: string;
  amountPaid: string;
}

export interface DocumentTemplateStyles {
  headingFontFamily: string;
  headingFontSize: string;
  headingColor: string;
  headingBold: boolean;
  logoWidth: string;
  logoHeight: string;
  logoOffsetX: string;
  logoOffsetY: string;
}

export interface DocumentTemplateSettings {
  selectedDocument: string;
  layoutStyle: string;
  pageSize: string;
  showCompanyLogo: boolean;
  showCompanyDetails: boolean;
  showBranchInformation: boolean;
  showFooterMessage: boolean;
  footerMessage: string;
  templateId: string;
  templateName: string;
  version: number;
  content: DocumentTemplateContent;
  styles: DocumentTemplateStyles;
  templates?: Record<string, DocumentTemplateStoredState>;
}
export type DocumentTemplateStoredState = Omit<
  DocumentTemplateSettings,
  'templates'
>;
export interface CompanyRegistration {
  registeredName: string;
  tradingName: string;
  category: string;
  email: string;
  phone: string;
  country: string;
  address: string;
  currency: string;
  timezone: string;
  brandColor: string;
  tagline: string;
  logoRef: string;
  secondaryColor: string;
  accentColor: string;
  showLogoReceipts: boolean;
  showLogoInvoices: boolean;
  useBrandColours: boolean;
  documentTemplates: DocumentTemplateSettings;
}
export interface OwnerAccount {
  fullName: string;
  role: string;
  phone: string;
  email: string;
  identificationType: string;
  idNumber: string;
  dateOfBirth: string;
  gender: string;
  photoRef: string;
}
export interface OwnerSecurity {
  username: string;
  email: string;
  passwordSet: boolean;
  twoFactorEnabled: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  recoveryPhone: string;
  recoveryEmail: string;
}
export interface OwnerSession {
  token: string;
  ownerId: number;
  companyId: number;
  fullName: string;
  username: string;
  role: 'OWNER';
}
export interface OwnerActivity {
  id: string;
  activityType: string;
  action: string;
  details: string;
  createdAt: string;
  device: string;
}
export interface SyncStatus {
  branchId: string;
  deviceId: string;
  onlineEnabled: boolean;
  autoSyncEnabled: boolean;
  intervalMinutes: number;
  syncState: string;
  lastSyncAt: string;
  lastAttemptAt: string;
  lastError: string;
  pendingCount: number;
  updatedAt: string;
}
export interface Branch {
  id: string;
  name: string;
  code: string;
  location: string;
  phone: string;
  manager: string;
  status: string;
  usersCount: number;
  branchType?: string;
  email?: string;
  managerContact?: string;
}
export type BranchRole =
  | 'BRANCH_MANAGER'
  | 'STOCK_MANAGER'
  | 'SALES_OFFICER'
  | 'CASHIER'
  | 'SALES_CASHIER';
export interface AuthSession {
  userId: string;
  companyId: number;
  branchId: string;
  branchName: string;
  username: string;
  fullName: string;
  role: BranchRole;
  permissions: string[];
}
export interface StaffAccount {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: BranchRole;
  branchId: string;
  branchName?: string;
  active: boolean;
  createdAt: string;
  lastLogin: string;
  permissions: string[];
}

export interface SalesProduct {
  sku: string;
  barcode: string;
  name: string;
  category: string;
  brand: string;
  productType: string;
  variant: string;
  stock: number;
  unit: string;
  price: number;
}
export interface PurchaseItem {
  sku: string;
  name: string;
  quantity: number;
  unit: string;
  unitCost: number;
  amount: number;
}
export interface PurchaseRecord {
  id: string;
  purchaseNumber: string;
  branchId: string;
  supplier: string;
  purchaseDate: string;
  reference: string;
  paymentType: string;
  subtotal: number;
  discount: number;
  total: number;
  notes: string;
  items: PurchaseItem[];
  createdAt: string;
}

export interface SaleLineItem {
  sku: string;
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discountPercent: number;
  amount: number;
}

export interface SaleRecord {
  id: string;
  saleNumber: string;
  documentType: 'SALE' | 'QUOTATION' | 'INVOICE';
  branchId: string;
  actorUserId?: string;
  customerName: string;
  status: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  amountPaid: number;
  paymentStatus: 'UNPAID' | 'PARTIALLY_PAID' | 'PAID' | 'REFUNDED';
  fulfilmentStatus:
    'AWAITING_PAYMENT' | 'AWAITING_RELEASE' | 'PARTIALLY_RELEASED' | 'RELEASED';
  createdAt: string;
  templateId?: string;
  templateName?: string;
  templateVersion?: number;
  templateSnapshot?: DocumentTemplateSettings;
  items: SaleLineItem[];
}

export interface PaymentRecord {
  id: string;
  saleId: string;
  branchId: string;
  amount: number;
  method: 'CASH' | 'MOBILE_MONEY' | 'BANK_TRANSFER' | 'CARD';
  reference: string;
  verificationStatus: string;
  evidenceNote: string;
  receiptNumber: string;
  createdAt: string;
}

export interface ReceiptRecord {
  id: string;
  saleId: string;
  paymentId: string;
  receiptNumber: string;
  amount: number;
  createdAt: string;
  branchId: string;
}

export interface MaterialReleaseItem {
  sku: string;
  name: string;
  quantity: number;
  unit: string;
  remainingQuantity?: number;
  stock?: number;
}

export interface MaterialReleaseRecord {
  id: string;
  saleId: string;
  branchId: string;
  releaseNumber: string;
  status: 'PARTIALLY_RELEASED' | 'RELEASED';
  items: MaterialReleaseItem[];
  createdAt: string;
}
