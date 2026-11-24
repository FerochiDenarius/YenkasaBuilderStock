from pathlib import Path
from typing import Optional
import hashlib
import hmac
import json
import os
import secrets
import shutil
from urllib.parse import quote, urlsplit, urlunsplit
from datetime import datetime, timezone
from decimal import Decimal, ROUND_HALF_UP
from uuid import uuid4
from fastapi import FastAPI, HTTPException, Request
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr
from sqlalchemy import String, Text, create_engine, select, inspect, text
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column
from sqlalchemy.pool import StaticPool
from pydantic_settings import BaseSettings, SettingsConfigDict

BRANCH_ROLES = {'BRANCH_MANAGER', 'STOCK_MANAGER', 'SALES_OFFICER', 'CASHIER', 'SALES_CASHIER'}
SALES_ROLES = {'BRANCH_MANAGER', 'SALES_OFFICER', 'SALES_CASHIER'}
CASHIER_ROLES = {'BRANCH_MANAGER', 'CASHIER', 'SALES_CASHIER'}
STOCK_ROLES = {'BRANCH_MANAGER', 'STOCK_MANAGER'}
ASSIGNABLE_PERMISSIONS = {
    'sales', 'quotations', 'invoices', 'customers', 'suppliers', 'inventory_view', 'inventory',
    'stock_receipts', 'purchases', 'stock_adjustments', 'material_release',
    'invoice_view', 'payments', 'receipts', 'payment_reports', 'stock_reports', 'limited_reports',
}

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', extra='ignore')
    local_database_url: str = 'sqlite:///./data/yenkasa-local.db'

settings = Settings()
packaged_data_dir = os.getenv('YENKASA_DATA_DIR', '').strip()
if packaged_data_dir:
    packaged_path = Path(packaged_data_dir)
    packaged_path.mkdir(parents=True, exist_ok=True)
    settings.local_database_url = f'sqlite:///{packaged_path / "yenkasa-local.db"}'
if settings.local_database_url.startswith('sqlite:///./'):
    Path('data').mkdir(exist_ok=True)
engine_options = {'connect_args': {'check_same_thread': False} if settings.local_database_url.startswith('sqlite') else {}}
if settings.local_database_url in {'sqlite://', 'sqlite:///:memory:'}:
    engine_options['poolclass'] = StaticPool
engine = create_engine(settings.local_database_url, **engine_options)
owner_sessions: dict[str, int] = {}

class Base(DeclarativeBase): pass
class Company(Base):
    __tablename__ = 'companies'
    id: Mapped[int] = mapped_column(primary_key=True)
    registered_name: Mapped[str] = mapped_column(String(200))
    trading_name: Mapped[str] = mapped_column(String(200))
    category: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(320))
    phone: Mapped[str] = mapped_column(String(50))
    country: Mapped[str] = mapped_column(String(100))
    address: Mapped[str] = mapped_column(String(500))
    currency: Mapped[str] = mapped_column(String(20))
    timezone: Mapped[str] = mapped_column(String(100))
    brand_color: Mapped[str] = mapped_column(String(20))
    tagline: Mapped[str] = mapped_column(String(300), default='')
    logo_ref: Mapped[str] = mapped_column(Text, default='')
    secondary_color: Mapped[str] = mapped_column(String(20), default='#F7B500')
    accent_color: Mapped[str] = mapped_column(String(20), default='#D7263D')
    show_logo_receipts: Mapped[bool] = mapped_column(default=True)
    show_logo_invoices: Mapped[bool] = mapped_column(default=True)
    use_brand_colours: Mapped[bool] = mapped_column(default=True)
    document_templates_json: Mapped[str] = mapped_column(Text, default='{}')

class Owner(Base):
    __tablename__ = 'owners'
    id: Mapped[int] = mapped_column(primary_key=True)
    company_id: Mapped[int] = mapped_column(default=1, index=True)
    full_name: Mapped[str] = mapped_column(String(200))
    role: Mapped[str] = mapped_column(String(100))
    phone: Mapped[str] = mapped_column(String(50))
    email: Mapped[str] = mapped_column(String(320))
    identification_type: Mapped[str] = mapped_column(String(100), default='')
    id_number: Mapped[str] = mapped_column(String(100), default='')
    date_of_birth: Mapped[str] = mapped_column(String(30), default='')
    gender: Mapped[str] = mapped_column(String(30), default='')
    photo_ref: Mapped[str] = mapped_column(Text, default='')
    username: Mapped[str] = mapped_column(String(120), default='brightkofi')
    password_hash: Mapped[str] = mapped_column(Text, default='')
    two_factor_enabled: Mapped[bool] = mapped_column(default=True)
    email_notifications: Mapped[bool] = mapped_column(default=True)
    sms_notifications: Mapped[bool] = mapped_column(default=False)
    recovery_phone: Mapped[str] = mapped_column(String(50), default='')
    recovery_email: Mapped[str] = mapped_column(String(320), default='')

class Branch(Base):
    __tablename__ = 'branches'
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    company_id: Mapped[int] = mapped_column(default=1, index=True)
    name: Mapped[str] = mapped_column(String(200))
    code: Mapped[str] = mapped_column(String(30))
    location: Mapped[str] = mapped_column(String(300))
    phone: Mapped[str] = mapped_column(String(50), default='')
    manager: Mapped[str] = mapped_column(String(200))
    status: Mapped[str] = mapped_column(String(30), default='Active')
    users_count: Mapped[int] = mapped_column(default=0)
    branch_type: Mapped[str] = mapped_column(String(100), default='Sales & Warehouse')
    email: Mapped[str] = mapped_column(String(320), default='')
    manager_contact: Mapped[str] = mapped_column(String(50), default='')
    manager_user_id: Mapped[str] = mapped_column(String(36), default='')
    permissions_json: Mapped[str] = mapped_column(Text, default='{}')

class UserAccount(Base):
    __tablename__ = 'user_accounts'
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    company_id: Mapped[int] = mapped_column(default=1, index=True)
    branch_id: Mapped[str] = mapped_column(String(36), index=True)
    username: Mapped[str] = mapped_column(String(120), index=True)
    email: Mapped[str] = mapped_column(String(320), default='')
    full_name: Mapped[str] = mapped_column(String(200))
    role: Mapped[str] = mapped_column(String(40))
    password_hash: Mapped[str] = mapped_column(Text)
    active: Mapped[bool] = mapped_column(default=True)
    created_at: Mapped[str] = mapped_column(String(40), default='')
    last_login: Mapped[str] = mapped_column(String(40), default='')
    device_id: Mapped[str] = mapped_column(String(100), default='')
    permissions_json: Mapped[str] = mapped_column(Text, default='[]')

class AuditLog(Base):
    __tablename__ = 'audit_logs'
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    company_id: Mapped[int] = mapped_column(default=1, index=True)
    branch_id: Mapped[str] = mapped_column(String(36), default='', index=True)
    actor_user_id: Mapped[str] = mapped_column(String(36), default='')
    action: Mapped[str] = mapped_column(String(120))
    target_user_id: Mapped[str] = mapped_column(String(36), default='')
    created_at: Mapped[str] = mapped_column(String(40), default='')

class SyncOutboxModel(Base):
    """Durable local hand-off for the future SQLite-to-cloud sync worker.

    Phase 1 creates the structure only. Existing offline workflows remain
    local and no untested automatic synchronization is enabled yet.
    """
    __tablename__ = 'sync_outbox'
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    company_id: Mapped[int] = mapped_column(default=1, index=True)
    branch_id: Mapped[str] = mapped_column(String(36), default='', index=True)
    entity_type: Mapped[str] = mapped_column(String(100))
    entity_id: Mapped[str] = mapped_column(String(36))
    operation: Mapped[str] = mapped_column(String(20))
    payload_json: Mapped[str] = mapped_column(Text, default='{}')
    idempotency_key: Mapped[str] = mapped_column(String(160), unique=True)
    status: Mapped[str] = mapped_column(String(30), default='PENDING', index=True)
    conflict_status: Mapped[str] = mapped_column(String(30), default='NONE')
    created_at: Mapped[str] = mapped_column(String(40), default='')
    processed_at: Mapped[str] = mapped_column(String(40), default='')

class SyncStatusModel(Base):
    """Per-branch sync policy and last-attempt status.

    This records truthful local state. A branch is never marked synced unless a
    configured central sync service confirms the operation.
    """
    __tablename__ = 'sync_status'
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    company_id: Mapped[int] = mapped_column(default=1, index=True)
    branch_id: Mapped[str] = mapped_column(String(36), index=True, unique=True)
    device_id: Mapped[str] = mapped_column(String(100), default='local-device')
    online_enabled: Mapped[bool] = mapped_column(default=True)
    auto_sync_enabled: Mapped[bool] = mapped_column(default=True)
    interval_minutes: Mapped[int] = mapped_column(default=15)
    sync_state: Mapped[str] = mapped_column(String(40), default='NEVER_SYNCED')
    last_sync_at: Mapped[str] = mapped_column(String(40), default='')
    last_attempt_at: Mapped[str] = mapped_column(String(40), default='')
    last_error: Mapped[str] = mapped_column(Text, default='')
    updated_at: Mapped[str] = mapped_column(String(40), default='')

class DeviceActivation(Base):
    __tablename__ = 'device_activations'
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    company_id: Mapped[int] = mapped_column(default=1, index=True)
    branch_id: Mapped[str] = mapped_column(String(36), index=True)
    device_name: Mapped[str] = mapped_column(String(160))
    activation_code: Mapped[str] = mapped_column(String(40), default='')
    device_type: Mapped[str] = mapped_column(String(80), default='Desktop')
    validity: Mapped[str] = mapped_column(String(80), default='Permanent')
    active: Mapped[bool] = mapped_column(default=True)
    created_at: Mapped[str] = mapped_column(String(40), default='')

class SaleRecordModel(Base):
    __tablename__ = 'sales_records'
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    company_id: Mapped[int] = mapped_column(default=1, index=True)
    branch_id: Mapped[str] = mapped_column(String(36), index=True)
    actor_user_id: Mapped[str] = mapped_column(String(36), default='')
    sale_number: Mapped[str] = mapped_column(String(60), index=True)
    document_type: Mapped[str] = mapped_column(String(20), default='SALE')
    customer_name: Mapped[str] = mapped_column(String(200), default='Walk-in Customer')
    status: Mapped[str] = mapped_column(String(30), default='DRAFT')
    subtotal: Mapped[float] = mapped_column(default=0)
    discount: Mapped[float] = mapped_column(default=0)
    tax: Mapped[float] = mapped_column(default=0)
    total: Mapped[float] = mapped_column(default=0)
    amount_paid: Mapped[float] = mapped_column(default=0)
    payment_status: Mapped[str] = mapped_column(String(30), default='UNPAID')
    fulfilment_status: Mapped[str] = mapped_column(String(30), default='AWAITING_PAYMENT')
    payload_json: Mapped[str] = mapped_column(Text, default='{}')
    created_at: Mapped[str] = mapped_column(String(40), default='')

class ProductCatalogItem(Base):
    __tablename__ = 'product_catalog_items'
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    company_id: Mapped[int] = mapped_column(default=1, index=True)
    branch_id: Mapped[str] = mapped_column(String(36), index=True)
    sku: Mapped[str] = mapped_column(String(60), index=True)
    barcode: Mapped[str] = mapped_column(String(80), default='')
    name: Mapped[str] = mapped_column(String(200))
    category: Mapped[str] = mapped_column(String(100), index=True)
    brand: Mapped[str] = mapped_column(String(100), default='')
    product_type: Mapped[str] = mapped_column(String(120), default='')
    variant: Mapped[str] = mapped_column(String(160), default='')
    unit: Mapped[str] = mapped_column(String(40), default='Piece')
    stock: Mapped[float] = mapped_column(default=0)
    selling_price: Mapped[float] = mapped_column(default=0)
    active: Mapped[bool] = mapped_column(default=True)
    created_at: Mapped[str] = mapped_column(String(40), default='')

class PurchaseRecordModel(Base):
    __tablename__ = 'purchase_records'
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    company_id: Mapped[int] = mapped_column(default=1, index=True)
    branch_id: Mapped[str] = mapped_column(String(36), index=True)
    actor_user_id: Mapped[str] = mapped_column(String(36), index=True)
    purchase_number: Mapped[str] = mapped_column(String(80), index=True)
    supplier: Mapped[str] = mapped_column(String(200))
    purchase_date: Mapped[str] = mapped_column(String(30))
    reference: Mapped[str] = mapped_column(String(120), default='')
    payment_type: Mapped[str] = mapped_column(String(40), default='Cash')
    subtotal: Mapped[float] = mapped_column(default=0)
    discount: Mapped[float] = mapped_column(default=0)
    total: Mapped[float] = mapped_column(default=0)
    payload_json: Mapped[str] = mapped_column(Text, default='{}')
    created_at: Mapped[str] = mapped_column(String(40), default='')

class PaymentRecordModel(Base):
    __tablename__ = 'payment_records'
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    company_id: Mapped[int] = mapped_column(default=1, index=True)
    branch_id: Mapped[str] = mapped_column(String(36), index=True)
    sale_id: Mapped[str] = mapped_column(String(36), index=True)
    cashier_user_id: Mapped[str] = mapped_column(String(36), index=True)
    amount: Mapped[float] = mapped_column(default=0)
    method: Mapped[str] = mapped_column(String(30))
    reference: Mapped[str] = mapped_column(String(160), default='')
    verification_status: Mapped[str] = mapped_column(String(30), default='PENDING_VERIFICATION')
    evidence_note: Mapped[str] = mapped_column(Text, default='')
    receipt_number: Mapped[str] = mapped_column(String(80), default='', index=True)
    idempotency_key: Mapped[str] = mapped_column(String(120), default='', index=True)
    created_at: Mapped[str] = mapped_column(String(40), default='')

class ReceiptRecordModel(Base):
    __tablename__ = 'receipt_records'
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    company_id: Mapped[int] = mapped_column(default=1, index=True)
    branch_id: Mapped[str] = mapped_column(String(36), index=True)
    sale_id: Mapped[str] = mapped_column(String(36), index=True)
    payment_id: Mapped[str] = mapped_column(String(36), index=True)
    receipt_number: Mapped[str] = mapped_column(String(80), unique=True, index=True)
    amount: Mapped[float] = mapped_column(default=0)
    created_at: Mapped[str] = mapped_column(String(40), default='')

class MaterialReleaseModel(Base):
    __tablename__ = 'material_releases'
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    company_id: Mapped[int] = mapped_column(default=1, index=True)
    branch_id: Mapped[str] = mapped_column(String(36), index=True)
    sale_id: Mapped[str] = mapped_column(String(36), index=True)
    storekeeper_user_id: Mapped[str] = mapped_column(String(36), index=True)
    release_number: Mapped[str] = mapped_column(String(80), unique=True, index=True)
    status: Mapped[str] = mapped_column(String(30), default='PARTIALLY_RELEASED')
    payload_json: Mapped[str] = mapped_column(Text, default='{}')
    created_at: Mapped[str] = mapped_column(String(40), default='')

class MaterialReleaseItemModel(Base):
    __tablename__ = 'material_release_items'
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    company_id: Mapped[int] = mapped_column(default=1, index=True)
    branch_id: Mapped[str] = mapped_column(String(36), index=True)
    release_id: Mapped[str] = mapped_column(String(36), index=True)
    sale_id: Mapped[str] = mapped_column(String(36), index=True)
    sku: Mapped[str] = mapped_column(String(60), index=True)
    name: Mapped[str] = mapped_column(String(200))
    quantity: Mapped[float] = mapped_column(default=0)
    unit: Mapped[str] = mapped_column(String(40), default='Piece')

class CompanyPayload(BaseModel):
    registeredName: str
    tradingName: str
    category: str
    email: EmailStr
    phone: str
    country: str
    address: str
    currency: str
    timezone: str
    brandColor: str
    tagline: str = ''
    logoRef: str = ''
    secondaryColor: str = '#F7B500'
    accentColor: str = '#D7263D'
    showLogoReceipts: bool = True
    showLogoInvoices: bool = True
    useBrandColours: bool = True
    documentTemplates: dict = {}

class OwnerPayload(BaseModel):
    fullName: str
    role: str
    phone: str
    email: EmailStr
    identificationType: str = ''
    idNumber: str = ''
    dateOfBirth: str = ''
    gender: str = ''
    photoRef: str = ''

class OwnerSecurityPayload(BaseModel):
    username: str
    email: EmailStr
    password: str = ''
    twoFactorEnabled: bool = True
    emailNotifications: bool = True
    smsNotifications: bool = False
    recoveryPhone: str = ''
    recoveryEmail: str = ''

class OwnerLoginPayload(BaseModel):
    username: str
    password: str

class BranchPayload(BaseModel):
    name: str
    code: str
    location: str
    phone: str = ''
    manager: str
    branchType: str = 'Sales & Warehouse'
    email: str = ''
    managerContact: str = ''
    managerUsername: str = ''
    managerPassword: str = ''
    managerRole: str = 'BRANCH_MANAGER'
    deviceName: str = ''
    activateDevice: bool = False
    permissions: dict = {}

class BranchUpdatePayload(BaseModel):
    name: str
    code: str
    location: str
    phone: str = ''
    manager: str
    branchType: str = 'Sales & Warehouse'
    email: str = ''
    managerContact: str = ''
    status: str = 'Active'

class LoginPayload(BaseModel):
    branchId: str
    username: str
    password: str
    loginRole: str
    deviceId: str = ''

class StaffPayload(BaseModel):
    branchId: str = ''
    username: str
    email: str = ''
    fullName: str
    role: str
    password: str
    permissions: Optional[list[str]] = None

class StaffUpdatePayload(BaseModel):
    fullName: Optional[str] = None
    email: Optional[str] = None
    active: Optional[bool] = None
    permissions: Optional[list[str]] = None

class PasswordResetPayload(BaseModel):
    password: str

class DevicePayload(BaseModel):
    branchId: str
    deviceName: str
    deviceType: str = 'Desktop'
    validity: str = 'Permanent'

class SaleItemPayload(BaseModel):
    sku: str
    name: str
    quantity: float
    unit: str
    unitPrice: float
    discountPercent: float = 0

class SalePayload(BaseModel):
    branchId: str
    documentType: str = 'SALE'
    customerName: str = 'Walk-in Customer'
    vatPercent: float = 15
    notes: str = ''
    items: list[SaleItemPayload]

class ProductPayload(BaseModel):
    branchId: str
    sku: str
    barcode: str = ''
    name: str
    category: str
    brand: str = ''
    productType: str = ''
    variant: str = ''
    unit: str = 'Piece'
    stock: float = 0
    price: float = 0

class StockAdjustmentPayload(BaseModel):
    branchId: str
    quantity: float
    reason: str

class PaymentPayload(BaseModel):
    branchId: str
    saleId: str
    amount: float
    method: str
    reference: str = ''
    evidenceNote: str = ''
    idempotencyKey: str = ''

class PaymentVerificationPayload(BaseModel):
    evidenceNote: str

class MaterialReleaseItemPayload(BaseModel):
    sku: str
    quantity: float

class MaterialReleasePayload(BaseModel):
    branchId: str
    saleId: str
    items: list[MaterialReleaseItemPayload]

class PurchaseItemPayload(BaseModel):
    sku: str
    name: str
    quantity: float
    unit: str
    unitCost: float

class PurchasePayload(BaseModel):
    branchId: str
    supplier: str
    purchaseDate: str
    reference: str = ''
    paymentType: str = 'Cash'
    discount: float = 0
    notes: str = ''
    items: list[PurchaseItemPayload]

class CloudConnectionPayload(BaseModel):
    projectUrl: str
    projectRef: str
    databaseHost: str
    databasePort: int = 5432
    databaseName: str = 'postgres'
    databaseUser: str = 'postgres'
    databasePassword: str = ''

class SyncSettingsPayload(BaseModel):
    branchId: str
    onlineEnabled: bool = True
    autoSyncEnabled: bool = True
    intervalMinutes: int = 15

class SyncRunPayload(BaseModel):
    branchId: str

app = FastAPI(title='YenkasaBuildersStock Local API')
app.add_middleware(CORSMiddleware, allow_origins=['null', 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://127.0.0.1:5174', 'file://'], allow_methods=['GET', 'PUT', 'POST', 'PATCH', 'OPTIONS'], allow_headers=['Content-Type', 'X-Role', 'X-User-Id', 'X-Branch-Id', 'X-Device-Id'])

def backup_sqlite_before_startup_changes() -> None:
    if not settings.local_database_url.startswith('sqlite:///'):
        return
    raw_path = settings.local_database_url.removeprefix('sqlite:///')
    database_path = Path(raw_path).resolve()
    if not database_path.exists() or database_path.name == ':memory:':
        return
    backup_dir = database_path.parent / 'backups'
    backup_dir.mkdir(parents=True, exist_ok=True)
    backup_path = backup_dir / f'{database_path.stem}.pre-startup-{datetime.now().strftime("%Y%m%d-%H%M%S")}.db'
    shutil.copy2(database_path, backup_path)

backup_sqlite_before_startup_changes()
Base.metadata.create_all(engine)

def ensure_branch_columns() -> None:
    if not settings.local_database_url.startswith('sqlite'):
        return
    columns = {column['name'] for column in inspect(engine).get_columns('branches')}
    additions = {'branch_type': "VARCHAR(100) DEFAULT 'Sales & Warehouse'", 'email': "VARCHAR(320) DEFAULT ''", 'manager_contact': "VARCHAR(50) DEFAULT ''", 'manager_user_id': "VARCHAR(36) DEFAULT ''", 'permissions_json': "TEXT DEFAULT '{}'"}
    with engine.begin() as connection:
        for name, definition in additions.items():
            if name not in columns:
                connection.execute(text(f'ALTER TABLE branches ADD COLUMN {name} {definition}'))

def ensure_device_columns() -> None:
    if not settings.local_database_url.startswith('sqlite'):
        return
    columns = {column['name'] for column in inspect(engine).get_columns('device_activations')}
    additions = {'activation_code': "VARCHAR(40) DEFAULT ''", 'device_type': "VARCHAR(80) DEFAULT 'Desktop'", 'validity': "VARCHAR(80) DEFAULT 'Permanent'"}
    with engine.begin() as connection:
        for name, definition in additions.items():
            if name not in columns:
                connection.execute(text(f'ALTER TABLE device_activations ADD COLUMN {name} {definition}'))

def ensure_user_columns() -> None:
    if not settings.local_database_url.startswith('sqlite'):
        return
    columns = {column['name'] for column in inspect(engine).get_columns('user_accounts')}
    with engine.begin() as connection:
        if 'permissions_json' not in columns:
            connection.execute(text("ALTER TABLE user_accounts ADD COLUMN permissions_json TEXT DEFAULT '[]'"))

def ensure_owner_columns() -> None:
    if not settings.local_database_url.startswith('sqlite'):
        return
    columns = {column['name'] for column in inspect(engine).get_columns('owners')}
    additions = {
        'username': "VARCHAR(120) DEFAULT 'brightkofi'",
        'password_hash': "TEXT DEFAULT ''",
        'two_factor_enabled': 'BOOLEAN DEFAULT 1',
        'email_notifications': 'BOOLEAN DEFAULT 1',
        'sms_notifications': 'BOOLEAN DEFAULT 0',
        'recovery_phone': "VARCHAR(50) DEFAULT ''",
        'recovery_email': "VARCHAR(320) DEFAULT ''",
    }
    with engine.begin() as connection:
        for name, definition in additions.items():
            if name not in columns:
                connection.execute(text(f'ALTER TABLE owners ADD COLUMN {name} {definition}'))

def ensure_company_columns() -> None:
    if not settings.local_database_url.startswith('sqlite'):
        return
    columns = {column['name'] for column in inspect(engine).get_columns('companies')}
    with engine.begin() as connection:
        if 'document_templates_json' not in columns:
            connection.execute(text("ALTER TABLE companies ADD COLUMN document_templates_json TEXT DEFAULT '{}'"))

def ensure_sales_columns() -> None:
    if not settings.local_database_url.startswith('sqlite') or 'sales_records' not in inspect(engine).get_table_names():
        return
    columns = {column['name'] for column in inspect(engine).get_columns('sales_records')}
    additions = {
        'amount_paid': 'FLOAT DEFAULT 0',
        'payment_status': "VARCHAR(30) DEFAULT 'UNPAID'",
        'fulfilment_status': "VARCHAR(30) DEFAULT 'AWAITING_PAYMENT'",
    }
    with engine.begin() as connection:
        for name, definition in additions.items():
            if name not in columns:
                connection.execute(text(f'ALTER TABLE sales_records ADD COLUMN {name} {definition}'))

ensure_branch_columns()
ensure_device_columns()
ensure_user_columns()
ensure_owner_columns()
ensure_company_columns()
ensure_sales_columns()

CATALOG_SEED = [
    {'sku': 'CEM-GHA-325N', 'barcode': '615110000001', 'name': 'Ghacem Super Strong 32.5N (50kg)', 'category': 'Cement', 'brand': 'Ghacem', 'product_type': 'General Purpose Cement', 'variant': '32.5N · 50kg bag', 'unit': 'Bag', 'stock': 480, 'selling_price': 85},
    {'sku': 'CEM-GHA-425R', 'barcode': '615110000002', 'name': 'Ghacem Super Strong 42.5R (50kg)', 'category': 'Cement', 'brand': 'Ghacem', 'product_type': 'Rapid Strength Cement', 'variant': '42.5R · 50kg bag', 'unit': 'Bag', 'stock': 260, 'selling_price': 92},
    {'sku': 'CEM-DAN-425R', 'barcode': '615110000003', 'name': 'Dangote Cement 42.5R (50kg)', 'category': 'Cement', 'brand': 'Dangote', 'product_type': 'Rapid Strength Cement', 'variant': '42.5R · 50kg bag', 'unit': 'Bag', 'stock': 320, 'selling_price': 90},
    {'sku': 'CEM-CBI-325N', 'barcode': '615110000004', 'name': 'CBI Ghana 32.5N (50kg)', 'category': 'Cement', 'brand': 'CBI', 'product_type': 'General Purpose Cement', 'variant': '32.5N · 50kg bag', 'unit': 'Bag', 'stock': 180, 'selling_price': 83},
    {'sku': 'IRO-TOR-012', 'barcode': '615110000012', 'name': 'Tor Steel Reinforcement Bar 12mm (12m)', 'category': 'Iron Rods', 'brand': 'TOR', 'product_type': 'High Yield Reinforcement Bar', 'variant': '12mm · 12m length', 'unit': 'Piece', 'stock': 150, 'selling_price': 185},
    {'sku': 'IRO-TOR-016', 'barcode': '615110000016', 'name': 'Tor Steel Reinforcement Bar 16mm (12m)', 'category': 'Iron Rods', 'brand': 'TOR', 'product_type': 'High Yield Reinforcement Bar', 'variant': '16mm · 12m length', 'unit': 'Piece', 'stock': 90, 'selling_price': 320},
    {'sku': 'BLO-HOL-006', 'barcode': '615110000021', 'name': 'Hollow Block 6 inch', 'category': 'Blocks', 'brand': 'Local Manufacture', 'product_type': 'Hollow Concrete Block', 'variant': '6 inch · standard', 'unit': 'Piece', 'stock': 4200, 'selling_price': 8.5},
    {'sku': 'PAI-ABC-020', 'barcode': '615110000031', 'name': 'ABC Emulsion Paint 20L - White', 'category': 'Paints', 'brand': 'ABC Paints', 'product_type': 'Emulsion Paint', 'variant': '20L · White', 'unit': 'Tin', 'stock': 28, 'selling_price': 460},
    {'sku': 'PVC-WAV-002', 'barcode': '615110000041', 'name': 'WAVIN PVC Pipe 2 inch (6m)', 'category': 'Plumbing', 'brand': 'WAVIN', 'product_type': 'uPVC Pressure Pipe', 'variant': '2 inch · 6m length', 'unit': 'Piece', 'stock': 85, 'selling_price': 75},
    {'sku': 'ROO-ALU-035', 'barcode': '615110000051', 'name': 'Aluzinc Roofing Sheet 0.35mm', 'category': 'Roofing', 'brand': 'Aluzinc', 'product_type': 'Corrugated Roofing Sheet', 'variant': '0.35mm · 3m length', 'unit': 'Sheet', 'stock': 120, 'selling_price': 230},
    {'sku': 'BWI-LOC-025', 'barcode': '615110000061', 'name': 'Binding Wire 25kg', 'category': 'Hardware', 'brand': 'Local Manufacture', 'product_type': 'Binding Wire', 'variant': '25kg roll', 'unit': 'Roll', 'stock': 42, 'selling_price': 320},
    {'sku': 'TIL-MAX-6060', 'barcode': '615110000071', 'name': 'MaxTile Ceramic Floor Tile', 'category': 'Tiles', 'brand': 'MaxTile', 'product_type': 'Ceramic Floor Tile', 'variant': '60 × 60cm · assorted', 'unit': 'Box', 'stock': 310, 'selling_price': 95},
]

def ensure_branch_catalog(session: Session, company_id: int, branch_id: str) -> None:
    if session.scalar(select(ProductCatalogItem.id).where(ProductCatalogItem.company_id == company_id, ProductCatalogItem.branch_id == branch_id).limit(1)) is not None:
        return
    for seed in CATALOG_SEED:
        session.add(ProductCatalogItem(id=str(uuid4()), company_id=company_id, branch_id=branch_id, created_at=now_iso(), **seed))
    session.commit()

@app.exception_handler(HTTPException)
async def http_error(_: Request, exc: HTTPException) -> JSONResponse:
    return JSONResponse(status_code=exc.status_code, content={'error': {'message': exc.detail}})

@app.exception_handler(RequestValidationError)
async def validation_error(_: Request, exc: RequestValidationError) -> JSONResponse:
    return JSONResponse(status_code=422, content=jsonable_encoder({'error': {'message': 'Validation failed', 'fields': exc.errors()}}))

@app.get('/health')
def health() -> dict[str, str]: return {'status': 'ok', 'service': 'local-api'}

@app.get('/api/company')
def get_company() -> Optional[dict]:
    with Session(engine) as session:
        company = session.scalar(select(Company).order_by(Company.id))
        if company is None: return None
        return to_payload(company)

@app.put('/api/company')
def save_company(payload: CompanyPayload, request: Request) -> dict:
    require_hq(request, allow_initial_setup=True)
    required_fields = {'registeredName': payload.registeredName, 'tradingName': payload.tradingName, 'category': payload.category, 'phone': payload.phone, 'country': payload.country, 'address': payload.address, 'currency': payload.currency, 'timezone': payload.timezone}
    if any(not value.strip() for value in required_fields.values()): raise HTTPException(422, 'All required company details must be provided')
    if payload.logoRef:
        if len(payload.logoRef) > 3_000_000: raise HTTPException(422, 'Logo data is too large')
        if not payload.logoRef.startswith(('data:image/png;base64,', 'data:image/jpeg;base64,', 'data:image/webp;base64,')): raise HTTPException(422, 'Logo must be PNG, JPG or WebP image data')
    with Session(engine) as session:
        company = session.scalar(select(Company).order_by(Company.id))
        if company is None: company = Company(); session.add(company)
        company.registered_name = payload.registeredName.strip(); company.trading_name = payload.tradingName.strip(); company.category = payload.category; company.email = str(payload.email); company.phone = payload.phone; company.country = payload.country; company.address = payload.address; company.currency = payload.currency; company.timezone = payload.timezone; company.brand_color = payload.brandColor
        company.tagline = payload.tagline; company.logo_ref = payload.logoRef; company.secondary_color = payload.secondaryColor; company.accent_color = payload.accentColor; company.show_logo_receipts = payload.showLogoReceipts; company.show_logo_invoices = payload.showLogoInvoices; company.use_brand_colours = payload.useBrandColours; company.document_templates_json = json.dumps(payload.documentTemplates)
        session.commit(); session.refresh(company); return to_payload(company)

@app.get('/api/owner')
def get_owner(request: Request) -> Optional[dict]:
    require_hq(request, allow_initial_setup=True)
    with Session(engine) as session:
        owner = session.scalar(select(Owner).order_by(Owner.id))
        return None if owner is None else to_owner_payload(owner)

@app.put('/api/owner')
def save_owner(payload: OwnerPayload, request: Request) -> dict:
    require_hq(request, allow_initial_setup=True)
    required_fields = {'fullName': payload.fullName, 'role': payload.role, 'phone': payload.phone}
    if any(not value.strip() for value in required_fields.values()): raise HTTPException(422, 'Full name, role and phone are required')
    if payload.photoRef:
        if len(payload.photoRef) > 3_000_000: raise HTTPException(422, 'Profile photo is too large')
        if not payload.photoRef.startswith(('data:image/png;base64,', 'data:image/jpeg;base64,', 'data:image/webp;base64,')): raise HTTPException(422, 'Profile photo must be PNG, JPG or WebP image data')
    with Session(engine) as session:
        owner = session.scalar(select(Owner).order_by(Owner.id))
        if owner is None: owner = Owner(company_id=1); session.add(owner)
        owner.full_name = payload.fullName.strip(); owner.role = payload.role.strip(); owner.phone = payload.phone.strip(); owner.email = str(payload.email).strip(); owner.identification_type = payload.identificationType.strip(); owner.id_number = payload.idNumber.strip(); owner.date_of_birth = payload.dateOfBirth.strip(); owner.gender = payload.gender.strip(); owner.photo_ref = payload.photoRef
        session.add(AuditLog(id=str(uuid4()), company_id=1, branch_id='', actor_user_id='HQ_OWNER', action='owner_profile_updated', target_user_id='', created_at=now_iso()))
        session.commit(); session.refresh(owner); return to_owner_payload(owner)

@app.get('/api/owner/security')
def get_owner_security(request: Request) -> dict:
    require_hq(request, allow_initial_setup=True)
    with Session(engine) as session:
        owner = session.scalar(select(Owner).order_by(Owner.id))
        if owner is None:
            return {'username': 'brightkofi', 'email': '', 'passwordSet': False, 'twoFactorEnabled': True, 'emailNotifications': True, 'smsNotifications': False, 'recoveryPhone': '', 'recoveryEmail': ''}
        return to_owner_security_payload(owner)

@app.put('/api/owner/security')
def save_owner_security(payload: OwnerSecurityPayload, request: Request) -> dict:
    require_hq(request, allow_initial_setup=True)
    if not payload.username.strip():
        raise HTTPException(422, 'Username is required')
    if payload.password and len(payload.password) < 8:
        raise HTTPException(422, 'Password must be at least 8 characters')
    if payload.recoveryEmail.strip() and '@' not in payload.recoveryEmail:
        raise HTTPException(422, 'Recovery email must be valid')
    with Session(engine) as session:
        owner = session.scalar(select(Owner).order_by(Owner.id))
        if owner is None:
            owner = Owner(company_id=1, full_name='Business Owner', role='Business Owner', phone='', email=str(payload.email).strip())
            session.add(owner)
        was_configured = bool(owner.password_hash)
        owner.username = payload.username.strip().lower()
        owner.email = str(payload.email).strip()
        if payload.password:
            owner.password_hash = hash_password(payload.password)
        owner.two_factor_enabled = payload.twoFactorEnabled
        owner.email_notifications = payload.emailNotifications
        owner.sms_notifications = payload.smsNotifications
        owner.recovery_phone = payload.recoveryPhone.strip()
        owner.recovery_email = payload.recoveryEmail.strip().lower()
        session.add(AuditLog(id=str(uuid4()), company_id=1, branch_id='', actor_user_id='HQ_OWNER', action='owner_security_updated', target_user_id='', created_at=now_iso()))
        session.commit(); session.refresh(owner)
        response = to_owner_security_payload(owner)
        if not was_configured and owner.password_hash:
            response['ownerSession'] = create_owner_session(owner)
        return response

@app.get('/api/owner/status')
def owner_status() -> dict:
    """Return only the lock state needed to choose the initial application shell."""
    with Session(engine) as session:
        owner = session.scalar(select(Owner).order_by(Owner.id))
        return {'ownerExists': owner is not None, 'passwordSet': bool(owner and owner.password_hash)}

@app.post('/api/owner/login')
def owner_login(payload: OwnerLoginPayload, request: Request) -> dict:
    username = payload.username.strip().lower()
    with Session(engine) as session:
        owner = session.scalar(select(Owner).where((Owner.username == username) | (Owner.email == username)).order_by(Owner.id))
        if owner is None or not owner.password_hash or not verify_password(payload.password, owner.password_hash):
            raise HTTPException(401, 'Incorrect owner username/email or password')
        token = secrets.token_urlsafe(32)
        owner_sessions[token] = owner.id
        session.add(AuditLog(id=str(uuid4()), company_id=owner.company_id, branch_id='', actor_user_id='HQ_OWNER', action='login_success', target_user_id=str(owner.id), created_at=now_iso()))
        session.commit()
        return {'token': token, 'ownerId': owner.id, 'companyId': owner.company_id, 'fullName': owner.full_name, 'username': owner.username, 'role': 'OWNER'}

@app.post('/api/owner/logout')
def owner_logout(request: Request) -> dict:
    token = request.headers.get('x-owner-session', '')
    owner_id = owner_sessions.pop(token, None)
    if owner_id is not None:
        with Session(engine) as session:
            owner = session.get(Owner, owner_id)
            if owner:
                session.add(AuditLog(id=str(uuid4()), company_id=owner.company_id, branch_id='', actor_user_id='HQ_OWNER', action='logout', target_user_id=str(owner.id), created_at=now_iso()))
                session.commit()
    return {'ok': True}

@app.get('/api/owner/activity')
def owner_activity(request: Request) -> list[dict]:
    require_hq(request)
    labels = {
        'login_success': 'Login', 'logout': 'Logout', 'owner_profile_updated': 'Profile Update',
        'owner_security_updated': 'Security', 'branch_manager_created': 'Branch',
        'staff_created': 'User Management', 'staff_updated': 'User Management',
        'staff_password_reset': 'User Management', 'device_created': 'Device Activation',
    }
    with Session(engine) as session:
        rows = session.scalars(select(AuditLog).where(AuditLog.company_id == 1).order_by(AuditLog.created_at.desc())).all()
        activities = [{'id': row.id, 'activityType': labels.get(row.action, 'System Settings'), 'action': row.action, 'details': row.action.replace('_', ' ').capitalize(), 'createdAt': row.created_at, 'device': 'Local SQLite · Electron'} for row in rows]
        branches = session.scalars(select(Branch).where(Branch.company_id == 1).order_by(Branch.name)).all()
        for branch in branches:
            status = session.scalar(select(SyncStatusModel).where(SyncStatusModel.company_id == 1, SyncStatusModel.branch_id == branch.id))
            pending = len(session.scalars(select(SyncOutboxModel).where(SyncOutboxModel.company_id == 1, SyncOutboxModel.branch_id == branch.id, SyncOutboxModel.status == 'PENDING')).all())
            state = status.sync_state if status else 'NEVER_SYNCED'
            activities.append({
                'id': f'sync-status-{branch.id}',
                'activityType': 'Branch Sync',
                'action': 'branch_sync_status',
                'details': f'{branch.name}: {state.replace("_", " ").title()} · {pending} pending record(s)',
                'createdAt': (status.last_sync_at or status.last_attempt_at or status.updated_at) if status else '',
                'device': f'{branch.name} · {status.device_id if status else "local device"}',
            })
        return sorted(activities, key=lambda item: item['createdAt'] or '', reverse=True)

@app.get('/api/cloud/configuration')
def local_cloud_configuration(request: Request) -> dict:
    require_hq(request)
    configured = bool(os.getenv('CLOUD_DATABASE_URL', '').strip())
    return {
        'projectUrl': os.getenv('SUPABASE_URL', '').strip(),
        'projectRef': os.getenv('SUPABASE_PROJECT_REF', '').strip(),
        'databaseConfigured': configured,
        'passwordConfigured': configured,
        'rendererDatabaseAccess': False,
    }

@app.post('/api/cloud/test')
def test_cloud_connection(payload: CloudConnectionPayload, request: Request) -> dict:
    require_hq(request)
    project_url = payload.projectUrl.strip()
    project_ref = payload.projectRef.strip()
    parsed_project_url = urlsplit(project_url)
    if parsed_project_url.scheme != 'https' or not parsed_project_url.netloc:
        raise HTTPException(422, 'Project URL must be the HTTPS project URL, for example https://your-project.supabase.co. Do not paste the /rest/v1 URL or a PostgreSQL connection string.')
    if not project_ref:
        raise HTTPException(422, 'Enter the Supabase project reference, for example xwyblizsmfeulyykufwg.')
    hostname = payload.databaseHost.strip()
    username = payload.databaseUser.strip()
    database = payload.databaseName.strip() or 'postgres'
    if not hostname or not username or not database:
        raise HTTPException(422, 'Database host, database name and database user are required.')
    if payload.databasePort < 1 or payload.databasePort > 65535:
        raise HTTPException(422, 'Database port must be between 1 and 65535.')
    password = payload.databasePassword.strip()
    if not password:
        raise HTTPException(422, 'Database password is required for the connection test.')
    dsn = urlunsplit(('postgresql', f'{quote(username, safe="")}:{quote(password, safe="")}@{hostname}:{payload.databasePort}', f'/{quote(database, safe="")}', 'sslmode=require', ''))
    try:
        import psycopg
        with psycopg.connect(dsn, connect_timeout=10) as connection:
            with connection.cursor() as cursor:
                cursor.execute('SELECT 1')
                cursor.fetchone()
        return {'ok': True, 'projectRef': project_ref, 'database': 'postgresql'}
    except Exception as exc:
        # Do not return the driver error because it can contain connection details.
        print(f'[cloud-test] Supabase connection failed: {type(exc).__name__}')
        error_text = str(exc).lower()
        if any(term in error_text for term in ('could not translate host name', 'nodename nor servname', 'name or service not known')):
            safe_message = 'Supabase host could not be resolved. Use the exact Session Pooler URI from Supabase Connect.'
        elif any(term in error_text for term in ('timeout', 'timed out')):
            safe_message = 'Supabase connection timed out. Check the exact pooler host, port 5432 for Session Pooler, and network access.'
        elif any(term in error_text for term in ('password authentication failed', 'authentication failed')):
            safe_message = 'Supabase rejected the database credentials. Reset or re-enter the database password.'
        else:
            safe_message = 'Supabase connection failed. Check the project URI, password, network and SSL settings.'
        raise HTTPException(503, safe_message) from None

@app.get('/api/sync/status')
def get_sync_status(request: Request, branchId: str = '') -> dict:
    branch_id = branchId or request.headers.get('x-branch-id', '')
    actor = require_actor(request, {'BRANCH_MANAGER'}, branch_id)
    with Session(engine) as session:
        status = ensure_sync_status(session, actor.company_id, actor.branch_id, request.headers.get('x-device-id', '') or 'local-device')
        session.commit()
        return to_sync_status_payload(session, status)

@app.put('/api/sync/settings')
def save_sync_settings(payload: SyncSettingsPayload, request: Request) -> dict:
    actor = require_actor(request, {'BRANCH_MANAGER'}, payload.branchId)
    if payload.intervalMinutes < 5 or payload.intervalMinutes > 1440:
        raise HTTPException(422, 'Sync interval must be between 5 and 1440 minutes')
    with Session(engine) as session:
        status = ensure_sync_status(session, actor.company_id, actor.branch_id, request.headers.get('x-device-id', '') or 'local-device')
        status.online_enabled = payload.onlineEnabled
        status.auto_sync_enabled = payload.autoSyncEnabled
        status.interval_minutes = payload.intervalMinutes
        status.sync_state = 'READY' if payload.onlineEnabled else 'OFFLINE'
        status.last_error = ''
        status.updated_at = now_iso()
        session.add(AuditLog(id=str(uuid4()), company_id=actor.company_id, branch_id=actor.branch_id, actor_user_id=actor.id, action='sync_settings_updated', target_user_id='', created_at=now_iso()))
        session.commit()
        session.refresh(status)
        return to_sync_status_payload(session, status)

@app.post('/api/sync/run')
def run_sync(payload: SyncRunPayload, request: Request) -> dict:
    actor = require_actor(request, {'BRANCH_MANAGER'}, payload.branchId)
    with Session(engine) as session:
        status = ensure_sync_status(session, actor.company_id, actor.branch_id, request.headers.get('x-device-id', '') or 'local-device')
        status.last_attempt_at = now_iso()
        status.updated_at = status.last_attempt_at
        pending = len(session.scalars(select(SyncOutboxModel).where(SyncOutboxModel.company_id == actor.company_id, SyncOutboxModel.branch_id == actor.branch_id, SyncOutboxModel.status == 'PENDING')).all())
        if not status.online_enabled:
            status.sync_state = 'OFFLINE'
            status.last_error = 'Online synchronization is disabled for this branch device.'
            message = 'Sync skipped because online synchronization is disabled.'
        elif not (os.getenv('SYNC_BACKEND_URL', '').strip() or os.getenv('DATABASE_URL', '').strip() or os.getenv('CLOUD_DATABASE_URL', '').strip()):
            status.sync_state = 'CLOUD_NOT_CONFIGURED'
            status.last_error = 'Central synchronization service is not configured on this installation.'
            message = 'No central synchronization service is configured; local data remains safe in SQLite.'
        else:
            status.sync_state = 'CLOUD_READY'
            status.last_error = 'Cloud connection is configured; pending outbox delivery is not enabled in this release.'
            message = 'Cloud connection is configured. Local records remain safe; central outbox delivery is pending.'
        session.add(AuditLog(id=str(uuid4()), company_id=actor.company_id, branch_id=actor.branch_id, actor_user_id=actor.id, action='sync_attempted', target_user_id='', created_at=now_iso()))
        session.commit()
        session.refresh(status)
        result = to_sync_status_payload(session, status)
        result.update({'message': message, 'pendingCount': pending, 'synced': False})
        return result

@app.get('/api/branches')
def list_branches(request: Request) -> list[dict]:
    require_hq(request)
    with Session(engine) as session:
        return [to_branch_payload(branch) for branch in session.scalars(select(Branch).where(Branch.company_id == 1).order_by(Branch.name))]

@app.get('/api/activated-branches')
def list_activated_branches() -> list[dict]:
    with Session(engine) as session:
        activated_ids = select(DeviceActivation.branch_id).where(DeviceActivation.company_id == 1, DeviceActivation.active == True)
        return [to_branch_payload(branch) for branch in session.scalars(select(Branch).where(Branch.company_id == 1, Branch.status == 'Active', Branch.id.in_(activated_ids)).order_by(Branch.name))]

@app.get('/api/devices')
def list_devices(request: Request) -> list[dict]:
    require_hq(request)
    with Session(engine) as session:
        branches = {branch.id: branch.name for branch in session.scalars(select(Branch).where(Branch.company_id == 1))}
        return [to_device_payload(device, branches.get(device.branch_id, 'Unknown branch')) for device in session.scalars(select(DeviceActivation).where(DeviceActivation.company_id == 1).order_by(DeviceActivation.created_at.desc()))]

@app.post('/api/devices')
def create_device(payload: DevicePayload, request: Request) -> dict:
    require_hq(request)
    if not payload.deviceName.strip(): raise HTTPException(422, 'Device name is required')
    with Session(engine) as session:
        branch = session.scalar(select(Branch).where(Branch.company_id == 1, Branch.id == payload.branchId, Branch.status == 'Active'))
        if branch is None: raise HTTPException(404, 'Active branch not found')
        code = f"YK-{uuid4().hex[:4].upper()}-{uuid4().hex[:4].upper()}"
        device = DeviceActivation(id=str(uuid4()), company_id=1, branch_id=branch.id, device_name=payload.deviceName.strip(), activation_code=code, device_type=payload.deviceType.strip(), validity=payload.validity.strip(), active=True, created_at=now_iso())
        session.add(device); session.commit(); session.refresh(device); return to_device_payload(device, branch.name)

@app.patch('/api/devices/{device_id}')
def update_device(device_id: str, payload: dict, request: Request) -> dict:
    require_hq(request)
    with Session(engine) as session:
        device = session.scalar(select(DeviceActivation).where(DeviceActivation.id == device_id, DeviceActivation.company_id == 1))
        if device is None: raise HTTPException(404, 'Device not found')
        if 'active' not in payload: raise HTTPException(422, 'Device active status is required')
        device.active = bool(payload['active']); session.commit(); session.refresh(device)
        branch = session.get(Branch, device.branch_id); return to_device_payload(device, branch.name if branch else 'Unknown branch')

@app.post('/api/branches')
def create_branch(payload: BranchPayload, request: Request) -> dict:
    require_hq(request)
    required_fields = {'name': payload.name, 'code': payload.code, 'location': payload.location, 'manager': payload.manager}
    if any(not value.strip() for value in required_fields.values()): raise HTTPException(422, 'Branch name, code, location and manager are required')
    with Session(engine) as session:
        duplicate = session.scalar(select(Branch).where(Branch.company_id == 1, Branch.code == payload.code.strip().upper()))
        if duplicate is not None: raise HTTPException(409, 'Branch code already exists')
        if payload.managerRole != 'BRANCH_MANAGER': raise HTTPException(422, 'Only Branch Manager accounts can be created during branch setup')
        if bool(payload.managerUsername) != bool(payload.managerPassword): raise HTTPException(422, 'Manager username and password must be provided together')
        if payload.managerPassword and len(payload.managerPassword) < 8: raise HTTPException(422, 'Manager password must be at least 8 characters')
        branch_id = str(uuid4())
        branch = Branch(id=branch_id, company_id=1, name=payload.name.strip(), code=payload.code.strip().upper(), location=payload.location.strip(), phone=payload.phone.strip(), manager=payload.manager.strip(), status='Active', users_count=0, branch_type=payload.branchType.strip(), email=payload.email.strip(), manager_contact=payload.managerContact.strip(), permissions_json=json.dumps(payload.permissions))
        session.add(branch)
        if payload.managerUsername:
            username = payload.managerUsername.strip().lower()
            if session.scalar(select(UserAccount).where(UserAccount.company_id == 1, UserAccount.username == username)) is not None:
                raise HTTPException(409, 'Username already exists')
            manager_user = UserAccount(id=str(uuid4()), company_id=1, branch_id=branch_id, username=username, email=payload.email.strip(), full_name=payload.manager.strip(), role='BRANCH_MANAGER', password_hash=hash_password(payload.managerPassword), active=True, created_at=now_iso())
            session.add(manager_user)
            branch.manager_user_id = manager_user.id
            session.add(AuditLog(id=str(uuid4()), company_id=1, branch_id=branch_id, actor_user_id='HQ_OWNER', action='branch_manager_created', target_user_id=manager_user.id, created_at=now_iso()))
        if payload.activateDevice and payload.deviceName.strip():
            session.add(DeviceActivation(id=str(uuid4()), company_id=1, branch_id=branch_id, device_name=payload.deviceName.strip(), active=True, created_at=now_iso()))
        session.commit(); session.refresh(branch); return to_branch_payload(branch)

@app.patch('/api/branches/{branch_id}')
def update_branch(branch_id: str, payload: BranchUpdatePayload, request: Request) -> dict:
    require_hq(request)
    required_fields = {'name': payload.name, 'code': payload.code, 'location': payload.location, 'manager': payload.manager}
    if any(not value.strip() for value in required_fields.values()): raise HTTPException(422, 'Branch name, code, location and manager are required')
    if payload.status not in {'Active', 'Suspended'}: raise HTTPException(422, 'Branch status must be Active or Suspended')
    with Session(engine) as session:
        branch = session.scalar(select(Branch).where(Branch.id == branch_id, Branch.company_id == 1))
        if branch is None: raise HTTPException(404, 'Branch not found')
        code = payload.code.strip().upper()
        duplicate = session.scalar(select(Branch).where(Branch.company_id == 1, Branch.code == code, Branch.id != branch_id))
        if duplicate is not None: raise HTTPException(409, 'Branch code already exists')
        branch.name = payload.name.strip(); branch.code = code; branch.location = payload.location.strip(); branch.phone = payload.phone.strip(); branch.manager = payload.manager.strip(); branch.branch_type = payload.branchType.strip(); branch.email = payload.email.strip(); branch.manager_contact = payload.managerContact.strip(); branch.status = payload.status
        if branch.manager_user_id:
            manager = session.scalar(select(UserAccount).where(UserAccount.id == branch.manager_user_id, UserAccount.company_id == 1))
            if manager is not None: manager.full_name = branch.manager; manager.email = branch.email
        session.add(AuditLog(id=str(uuid4()), company_id=1, branch_id=branch.id, actor_user_id='HQ_OWNER', action='branch_updated', target_user_id=branch.id, created_at=now_iso()))
        session.commit(); session.refresh(branch); return to_branch_payload(branch)

@app.post('/api/auth/login')
def login(payload: LoginPayload, request: Request) -> dict:
    with Session(engine) as session:
        branch = session.scalar(select(Branch).where(Branch.company_id == 1, Branch.id == payload.branchId, Branch.status == 'Active'))
        if branch is None: raise HTTPException(401, 'This branch is not active or does not exist')
        user = session.scalar(select(UserAccount).where(UserAccount.company_id == 1, UserAccount.branch_id == payload.branchId, (UserAccount.username == payload.username.strip().lower()) | (UserAccount.email == payload.username.strip().lower())))
        if user is None or not user.active or not verify_password(payload.password, user.password_hash): raise HTTPException(401, 'Incorrect username or password')
        if payload.loginRole not in BRANCH_ROLES or payload.loginRole != user.role: raise HTTPException(403, 'Selected login type does not match this account')
        if payload.deviceId:
            device = session.scalar(select(DeviceActivation).where(DeviceActivation.company_id == 1, DeviceActivation.branch_id == payload.branchId, DeviceActivation.id == payload.deviceId, DeviceActivation.active == True))
            if device is None: raise HTTPException(403, 'This device is not activated for the selected branch')
        user.last_login = now_iso()
        session.add(AuditLog(id=str(uuid4()), company_id=1, branch_id=payload.branchId, actor_user_id=user.id, action='login_success', target_user_id=user.id, created_at=now_iso()))
        session.commit()
        return {'userId': user.id, 'companyId': user.company_id, 'branchId': branch.id, 'branchName': branch.name, 'username': user.username, 'fullName': user.full_name, 'role': user.role, 'permissions': permissions_for(user, branch)}

@app.post('/api/auth/logout')
def logout(payload: dict) -> dict:
    with Session(engine) as session:
        user = session.get(UserAccount, payload.get('userId', ''))
        if user: session.add(AuditLog(id=str(uuid4()), company_id=user.company_id, branch_id=user.branch_id, actor_user_id=user.id, action='logout', target_user_id=user.id, created_at=now_iso())); session.commit()
    return {'ok': True}

@app.get('/api/products')
def list_products(branchId: str, request: Request) -> list[dict]:
    actor = require_actor(request, BRANCH_ROLES, branchId, 'inventory_view')
    with Session(engine) as session:
        ensure_branch_catalog(session, actor.company_id, actor.branch_id)
        rows = session.scalars(select(ProductCatalogItem).where(ProductCatalogItem.company_id == actor.company_id, ProductCatalogItem.branch_id == actor.branch_id, ProductCatalogItem.active == True).order_by(ProductCatalogItem.category, ProductCatalogItem.brand, ProductCatalogItem.name)).all()
        return [to_product_payload(row) for row in rows]

@app.post('/api/products')
def create_product(payload: ProductPayload, request: Request) -> dict:
    actor = require_actor(request, STOCK_ROLES, payload.branchId, 'inventory')
    values = {
        'sku': payload.sku.strip().upper(),
        'barcode': payload.barcode.strip(),
        'name': payload.name.strip(),
        'category': payload.category.strip(),
        'brand': payload.brand.strip(),
        'product_type': payload.productType.strip(),
        'variant': payload.variant.strip(),
        'unit': payload.unit.strip() or 'Piece',
    }
    if not values['sku'] or not values['name'] or not values['category']:
        raise HTTPException(422, 'SKU, item name and category are required')
    if payload.stock < 0 or payload.price < 0:
        raise HTTPException(422, 'Stock and selling price cannot be negative')
    with Session(engine) as session:
        duplicate = session.scalar(select(ProductCatalogItem).where(ProductCatalogItem.company_id == actor.company_id, ProductCatalogItem.branch_id == actor.branch_id, ProductCatalogItem.sku == values['sku']))
        if duplicate is not None:
            raise HTTPException(409, 'This SKU already exists in the branch catalogue')
        product = ProductCatalogItem(id=str(uuid4()), company_id=actor.company_id, branch_id=actor.branch_id, stock=payload.stock, selling_price=payload.price, created_at=now_iso(), **values)
        session.add(product)
        session.add(AuditLog(id=str(uuid4()), company_id=actor.company_id, branch_id=actor.branch_id, actor_user_id=actor.id, action='inventory_item_created', target_user_id=product.id, created_at=now_iso()))
        session.commit(); session.refresh(product)
        return to_product_payload(product)

@app.patch('/api/products/{sku}/stock')
def adjust_product_stock(sku: str, payload: StockAdjustmentPayload, request: Request) -> dict:
    actor = require_actor(request, STOCK_ROLES, payload.branchId, 'stock_adjustments')
    if payload.quantity == 0 or not payload.reason.strip():
        raise HTTPException(422, 'Enter a non-zero adjustment and a reason')
    with Session(engine) as session:
        product = session.scalar(select(ProductCatalogItem).where(ProductCatalogItem.company_id == actor.company_id, ProductCatalogItem.branch_id == actor.branch_id, ProductCatalogItem.sku == sku, ProductCatalogItem.active == True))
        if product is None:
            raise HTTPException(404, 'Inventory item not found in this branch catalogue')
        next_stock = float(product.stock) + payload.quantity
        if next_stock < 0:
            raise HTTPException(422, f'Adjustment would make {product.name} stock negative')
        product.stock = next_stock
        session.add(AuditLog(id=str(uuid4()), company_id=actor.company_id, branch_id=actor.branch_id, actor_user_id=actor.id, action=f'inventory_stock_adjusted:{payload.quantity:g}:{payload.reason.strip()}', target_user_id=product.id, created_at=now_iso()))
        session.commit(); session.refresh(product)
        return to_product_payload(product)

@app.get('/api/purchases')
def list_purchases(branchId: str, request: Request) -> list[dict]:
    actor = require_actor(request, STOCK_ROLES, branchId, 'purchases')
    with Session(engine) as session:
        rows = session.scalars(select(PurchaseRecordModel).where(PurchaseRecordModel.company_id == actor.company_id, PurchaseRecordModel.branch_id == actor.branch_id).order_by(PurchaseRecordModel.created_at.desc())).all()
        return [to_purchase_payload(row) for row in rows]

@app.post('/api/purchases')
def create_purchase(payload: PurchasePayload, request: Request) -> dict:
    actor = require_actor(request, STOCK_ROLES, payload.branchId, 'purchases')
    if not payload.supplier.strip(): raise HTTPException(422, 'Supplier is required')
    if not payload.purchaseDate.strip(): raise HTTPException(422, 'Purchase date is required')
    if not payload.items: raise HTTPException(422, 'Add at least one item to the purchase')
    if payload.discount < 0: raise HTTPException(422, 'Discount cannot be negative')
    with Session(engine) as session:
        subtotal = Decimal('0')
        items: list[dict] = []
        for item in payload.items:
            if item.quantity <= 0 or item.unitCost < 0: raise HTTPException(422, 'Purchase quantities must be greater than zero and unit costs cannot be negative')
            product = session.scalar(select(ProductCatalogItem).where(ProductCatalogItem.company_id == actor.company_id, ProductCatalogItem.branch_id == actor.branch_id, ProductCatalogItem.sku == item.sku.strip(), ProductCatalogItem.active == True))
            if product is None: raise HTTPException(422, f'{item.sku} is not available in this branch catalogue')
            amount = (Decimal(str(item.quantity)) * Decimal(str(item.unitCost))).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
            subtotal += amount
            items.append({'sku': product.sku, 'name': product.name, 'quantity': item.quantity, 'unit': item.unit or product.unit, 'unitCost': item.unitCost, 'amount': float(amount)})
        discount = Decimal(str(payload.discount)).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
        if discount > subtotal: raise HTTPException(422, 'Discount cannot exceed the purchase subtotal')
        total = (subtotal - discount).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
        branch = session.scalar(select(Branch).where(Branch.company_id == actor.company_id, Branch.id == actor.branch_id))
        purchase_number = f'{branch.code if branch else "BR"}-PUR-{uuid4().hex[:6].upper()}'
        record = PurchaseRecordModel(id=str(uuid4()), company_id=actor.company_id, branch_id=actor.branch_id, actor_user_id=actor.id, purchase_number=purchase_number, supplier=payload.supplier.strip(), purchase_date=payload.purchaseDate.strip(), reference=payload.reference.strip(), payment_type=payload.paymentType.strip(), subtotal=float(subtotal), discount=float(discount), total=float(total), payload_json=json.dumps({'items': items, 'notes': payload.notes.strip()}), created_at=now_iso())
        session.add(record)
        for item in items:
            product = session.scalar(select(ProductCatalogItem).where(ProductCatalogItem.company_id == actor.company_id, ProductCatalogItem.branch_id == actor.branch_id, ProductCatalogItem.sku == item['sku'], ProductCatalogItem.active == True))
            product.stock = float(product.stock) + float(item['quantity'])
        session.add(AuditLog(id=str(uuid4()), company_id=actor.company_id, branch_id=actor.branch_id, actor_user_id=actor.id, action='purchase_created', target_user_id=record.id, created_at=now_iso()))
        session.commit(); session.refresh(record)
        return to_purchase_payload(record)

@app.get('/api/sales')
def list_sales(branchId: str, request: Request) -> list[dict]:
    actor = require_any_permission(request, BRANCH_ROLES, branchId, {'sales', 'quotations', 'invoices'})
    with Session(engine) as session:
        rows = session.scalars(select(SaleRecordModel).where(SaleRecordModel.company_id == actor.company_id, SaleRecordModel.branch_id == actor.branch_id).order_by(SaleRecordModel.created_at.desc())).all()
        return [to_sale_payload(row) for row in rows]

@app.post('/api/sales')
def create_sale(payload: SalePayload, request: Request) -> dict:
    document_type = payload.documentType.upper()
    action_by_type = {'SALE': 'sales', 'QUOTATION': 'quotations', 'INVOICE': 'invoices'}
    if document_type not in action_by_type:
        raise HTTPException(422, 'Document type must be SALE, QUOTATION or INVOICE')
    actor = require_actor(request, BRANCH_ROLES, payload.branchId, action_by_type[document_type])
    if not payload.items:
        raise HTTPException(422, 'Add at least one item before saving')
    if not payload.customerName.strip():
        raise HTTPException(422, 'Customer is required')
    if payload.vatPercent < 0 or payload.vatPercent > 100:
        raise HTTPException(422, 'VAT must be between 0 and 100 percent')
    line_items: list[dict] = []
    subtotal = Decimal('0')
    undiscounted = Decimal('0')
    with Session(engine) as session:
        ensure_branch_catalog(session, actor.company_id, actor.branch_id)
        catalog = {row.sku: row for row in session.scalars(select(ProductCatalogItem).where(ProductCatalogItem.company_id == actor.company_id, ProductCatalogItem.branch_id == actor.branch_id, ProductCatalogItem.active == True)).all()}
    for item in payload.items:
        product = catalog.get(item.sku.strip())
        if product is None:
            raise HTTPException(422, f'Product {item.sku} is not available in this branch catalogue')
        if item.quantity <= 0: raise HTTPException(422, f'{item.name or item.sku} quantity must be greater than zero')
        if item.quantity > product.stock: raise HTTPException(422, f'{product.name} has only {product.stock:g} {product.unit.lower()}(s) available')
        if item.discountPercent < 0 or item.discountPercent > 100: raise HTTPException(422, f'{item.name or item.sku} discount must be between 0 and 100 percent')
        unit_price = Decimal(str(product.selling_price))
        base = Decimal(str(item.quantity)) * unit_price
        amount = (base * (Decimal('1') - Decimal(str(item.discountPercent)) / Decimal('100'))).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
        undiscounted += base
        subtotal += amount
        line_items.append({'sku': product.sku, 'name': product.name, 'quantity': item.quantity, 'unit': product.unit, 'unitPrice': round(product.selling_price, 2), 'discountPercent': item.discountPercent, 'amount': float(amount), 'brand': product.brand, 'productType': product.product_type, 'variant': product.variant})
    discount = (undiscounted - subtotal).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
    tax = (subtotal * Decimal(str(payload.vatPercent)) / Decimal('100')).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
    total = (subtotal + tax).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
    with Session(engine) as session:
        branch = session.scalar(select(Branch).where(Branch.company_id == actor.company_id, Branch.id == actor.branch_id))
        company = session.scalar(select(Company).where(Company.id == actor.company_id))
        try:
            document_templates = json.loads(company.document_templates_json or '{}') if company else {}
        except json.JSONDecodeError:
            document_templates = {}
        invoice_template = template_for_document(document_templates, document_type)
        template_meta = {'templateId': invoice_template.get('templateId', 'invoice-classic-default'), 'templateName': invoice_template.get('templateName', 'Classic Invoice'), 'templateVersion': int(invoice_template.get('version', 1) or 1)}
        sale_id = str(uuid4())
        prefix = {'SALE': 'SAL', 'QUOTATION': 'QT', 'INVOICE': 'INV'}[document_type]
        sale_number = f'{branch.code if branch else "BR"}-{prefix}-{uuid4().hex[:6].upper()}'
        record = SaleRecordModel(id=sale_id, company_id=actor.company_id, branch_id=actor.branch_id, actor_user_id=actor.id, sale_number=sale_number, document_type=document_type, customer_name=payload.customerName.strip(), status='DRAFT' if document_type == 'QUOTATION' else 'PENDING_PAYMENT', subtotal=float(subtotal), discount=float(discount), tax=float(tax), total=float(total), amount_paid=0, payment_status='UNPAID', fulfilment_status='AWAITING_PAYMENT', payload_json=json.dumps({'items': line_items, 'vatPercent': payload.vatPercent, 'notes': payload.notes.strip(), 'template': invoice_template, **template_meta}), created_at=now_iso())
        session.add(record)
        session.add(AuditLog(id=str(uuid4()), company_id=actor.company_id, branch_id=actor.branch_id, actor_user_id=actor.id, action=f'{document_type.lower()}_created', target_user_id=sale_id, created_at=now_iso()))
        session.commit(); session.refresh(record)
        return to_sale_payload(record)

@app.get('/api/cashier/invoices')
def cashier_invoices(branchId: str, request: Request, search: str = '') -> list[dict]:
    actor = require_any_permission(request, BRANCH_ROLES, branchId, {'invoice_view', 'invoices'})
    with Session(engine) as session:
        rows = session.scalars(select(SaleRecordModel).where(SaleRecordModel.company_id == actor.company_id, SaleRecordModel.branch_id == actor.branch_id, SaleRecordModel.document_type == 'INVOICE').order_by(SaleRecordModel.created_at.desc())).all()
        query = search.strip().lower()
        if query:
            rows = [row for row in rows if query in row.sale_number.lower() or query in row.customer_name.lower()]
        return [to_sale_payload(row) for row in rows]

@app.get('/api/payments/history')
def payment_history(branchId: str, request: Request) -> list[dict]:
    actor = require_actor(request, BRANCH_ROLES, branchId, 'payments')
    with Session(engine) as session:
        return [to_payment_payload(row) for row in session.scalars(select(PaymentRecordModel).where(PaymentRecordModel.company_id == actor.company_id, PaymentRecordModel.branch_id == actor.branch_id).order_by(PaymentRecordModel.created_at.desc())).all()]

@app.post('/api/payments')
def record_payment(payload: PaymentPayload, request: Request) -> dict:
    actor = require_actor(request, BRANCH_ROLES, payload.branchId, 'payments')
    method = payload.method.strip().upper().replace(' ', '_')
    if method not in {'CASH', 'MOBILE_MONEY', 'BANK_TRANSFER', 'CARD'}:
        raise HTTPException(422, 'Payment method must be CASH, MOBILE_MONEY, BANK_TRANSFER or CARD')
    if payload.amount <= 0:
        raise HTTPException(422, 'Payment amount must be greater than zero')
    if method != 'CASH' and not payload.reference.strip():
        raise HTTPException(422, 'Electronic payments require a transaction reference')
    with Session(engine) as session:
        if payload.idempotencyKey.strip():
            existing = session.scalar(select(PaymentRecordModel).where(PaymentRecordModel.company_id == actor.company_id, PaymentRecordModel.branch_id == actor.branch_id, PaymentRecordModel.idempotency_key == payload.idempotencyKey.strip()))
            if existing is not None:
                sale = session.get(SaleRecordModel, existing.sale_id)
                receipt = session.scalar(select(ReceiptRecordModel).where(ReceiptRecordModel.payment_id == existing.id))
                return {'payment': to_payment_payload(existing), 'invoice': to_sale_payload(sale), 'receipt': to_receipt_payload(receipt) if receipt else None}
        sale = session.scalar(select(SaleRecordModel).where(SaleRecordModel.id == payload.saleId, SaleRecordModel.company_id == actor.company_id, SaleRecordModel.branch_id == actor.branch_id, SaleRecordModel.document_type == 'INVOICE'))
        if sale is None:
            raise HTTPException(404, 'Invoice not found in this branch')
        amount = Decimal(str(payload.amount)).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
        current_paid = Decimal(str(sale.amount_paid or 0))
        if method == 'CASH' and current_paid + amount > Decimal(str(sale.total)):
            raise HTTPException(422, 'Payment amount cannot exceed the outstanding balance')
        verified = method == 'CASH'
        payment_id = str(uuid4())
        receipt_number = ''
        if verified:
            branch = session.scalar(select(Branch).where(Branch.company_id == actor.company_id, Branch.id == actor.branch_id))
            receipt_number = f'{branch.code if branch else "BR"}-RCP-{uuid4().hex[:6].upper()}'
        payment = PaymentRecordModel(id=payment_id, company_id=actor.company_id, branch_id=actor.branch_id, sale_id=sale.id, cashier_user_id=actor.id, amount=float(amount), method=method, reference=payload.reference.strip(), verification_status='VERIFIED' if verified else 'PENDING_VERIFICATION', evidence_note=payload.evidenceNote.strip(), receipt_number=receipt_number, idempotency_key=payload.idempotencyKey.strip(), created_at=now_iso())
        session.add(payment)
        receipt = None
        if verified:
            sale.amount_paid = float(current_paid + amount)
            sale.payment_status = 'PAID' if sale.amount_paid >= sale.total else 'PARTIALLY_PAID'
            sale.fulfilment_status = 'AWAITING_RELEASE' if sale.payment_status == 'PAID' else 'AWAITING_PAYMENT'
            receipt = ReceiptRecordModel(id=str(uuid4()), company_id=actor.company_id, branch_id=actor.branch_id, sale_id=sale.id, payment_id=payment.id, receipt_number=receipt_number, amount=float(amount), created_at=now_iso())
            session.add(receipt)
        session.add(AuditLog(id=str(uuid4()), company_id=actor.company_id, branch_id=actor.branch_id, actor_user_id=actor.id, action='payment_recorded' if verified else 'payment_pending_verification', target_user_id=sale.id, created_at=now_iso()))
        session.commit(); session.refresh(payment); session.refresh(sale)
        return {'payment': to_payment_payload(payment), 'invoice': to_sale_payload(sale), 'receipt': to_receipt_payload(receipt) if receipt else None}

@app.post('/api/payments/{payment_id}/verify')
def verify_payment(payment_id: str, payload: PaymentVerificationPayload, request: Request) -> dict:
    actor = require_actor(request, BRANCH_ROLES, request.headers.get('x-branch-id', ''), 'payments')
    if not payload.evidenceNote.strip():
        raise HTTPException(422, 'Verification evidence is required for manual electronic confirmation')
    with Session(engine) as session:
        payment = session.scalar(select(PaymentRecordModel).where(PaymentRecordModel.id == payment_id, PaymentRecordModel.company_id == actor.company_id, PaymentRecordModel.branch_id == actor.branch_id))
        if payment is None:
            raise HTTPException(404, 'Payment transaction not found')
        if payment.verification_status != 'PENDING_VERIFICATION':
            raise HTTPException(409, 'This payment has already been verified or rejected')
        sale = session.get(SaleRecordModel, payment.sale_id)
        amount = Decimal(str(payment.amount)).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
        current_paid = Decimal(str(sale.amount_paid or 0))
        if current_paid + amount > Decimal(str(sale.total)):
            raise HTTPException(422, 'Verified amount would exceed the invoice balance')
        payment.verification_status = 'VERIFIED_MANUAL'
        payment.evidence_note = payload.evidenceNote.strip()
        branch = session.get(Branch, actor.branch_id)
        payment.receipt_number = f'{branch.code if branch else "BR"}-RCP-{uuid4().hex[:6].upper()}'
        sale.amount_paid = float(current_paid + amount)
        sale.payment_status = 'PAID' if sale.amount_paid >= sale.total else 'PARTIALLY_PAID'
        sale.fulfilment_status = 'AWAITING_RELEASE' if sale.payment_status == 'PAID' else 'AWAITING_PAYMENT'
        receipt = ReceiptRecordModel(id=str(uuid4()), company_id=actor.company_id, branch_id=actor.branch_id, sale_id=sale.id, payment_id=payment.id, receipt_number=payment.receipt_number, amount=float(amount), created_at=now_iso())
        session.add(receipt); session.add(AuditLog(id=str(uuid4()), company_id=actor.company_id, branch_id=actor.branch_id, actor_user_id=actor.id, action='payment_manually_verified', target_user_id=sale.id, created_at=now_iso())); session.commit(); session.refresh(payment); session.refresh(sale)
        return {'payment': to_payment_payload(payment), 'invoice': to_sale_payload(sale), 'receipt': to_receipt_payload(receipt)}

def released_quantities(session: Session, sale_id: str, company_id: int, branch_id: str) -> dict[str, float]:
    rows = session.scalars(select(MaterialReleaseItemModel).where(
        MaterialReleaseItemModel.sale_id == sale_id,
        MaterialReleaseItemModel.company_id == company_id,
        MaterialReleaseItemModel.branch_id == branch_id,
    )).all()
    quantities: dict[str, float] = {}
    for row in rows:
        quantities[row.sku] = quantities.get(row.sku, 0) + float(row.quantity)
    return quantities

def releaseable_items(session: Session, sale: SaleRecordModel, company_id: int, branch_id: str) -> list[dict]:
    try:
        details = json.loads(sale.payload_json or '{}')
    except json.JSONDecodeError:
        details = {}
    released = released_quantities(session, sale.id, company_id, branch_id)
    result = []
    for item in details.get('items', []):
        remaining = max(0, float(item.get('quantity', 0)) - released.get(item.get('sku', ''), 0))
        if remaining <= 0:
            continue
        product = session.scalar(select(ProductCatalogItem).where(
            ProductCatalogItem.company_id == company_id,
            ProductCatalogItem.branch_id == branch_id,
            ProductCatalogItem.sku == item.get('sku', ''),
        ))
        result.append({
            'sku': item.get('sku', ''),
            'name': item.get('name', item.get('sku', '')),
            'quantity': float(item.get('quantity', 0)),
            'unit': item.get('unit', 'Piece'),
            'remainingQuantity': remaining,
            'stock': float(product.stock) if product else 0,
        })
    return result

def to_release_payload(record: MaterialReleaseModel) -> dict:
    try:
        details = json.loads(record.payload_json or '{}')
    except json.JSONDecodeError:
        details = {}
    return {
        'id': record.id,
        'saleId': record.sale_id,
        'branchId': record.branch_id,
        'releaseNumber': record.release_number,
        'status': record.status,
        'items': details.get('items', []),
        'createdAt': record.created_at,
    }

@app.get('/api/material-release/invoices')
def material_release_invoices(branchId: str, request: Request, search: str = '') -> list[dict]:
    actor = require_actor(request, BRANCH_ROLES, branchId, 'material_release')
    with Session(engine) as session:
        rows = session.scalars(select(SaleRecordModel).where(
            SaleRecordModel.company_id == actor.company_id,
            SaleRecordModel.branch_id == actor.branch_id,
            SaleRecordModel.document_type == 'INVOICE',
            SaleRecordModel.payment_status == 'PAID',
            SaleRecordModel.fulfilment_status.in_(['AWAITING_RELEASE', 'PARTIALLY_RELEASED']),
        ).order_by(SaleRecordModel.created_at.desc())).all()
        query = search.strip().lower()
        result = []
        for sale in rows:
            receipts = session.scalars(select(ReceiptRecordModel).where(
                ReceiptRecordModel.sale_id == sale.id,
                ReceiptRecordModel.company_id == actor.company_id,
                ReceiptRecordModel.branch_id == actor.branch_id,
            ).order_by(ReceiptRecordModel.created_at.desc())).all()
            receipt_number = receipts[0].receipt_number if receipts else ''
            if query and query not in sale.sale_number.lower() and query not in sale.customer_name.lower() and query not in receipt_number.lower():
                continue
            result.append({**to_sale_payload(sale), 'receiptNumber': receipt_number, 'releaseableItems': releaseable_items(session, sale, actor.company_id, actor.branch_id)})
        return result

@app.post('/api/material-releases')
def create_material_release(payload: MaterialReleasePayload, request: Request) -> dict:
    actor = require_actor(request, BRANCH_ROLES, payload.branchId, 'material_release')
    if not payload.items:
        raise HTTPException(422, 'Select at least one material to release')
    requested: dict[str, float] = {}
    for item in payload.items:
        sku = item.sku.strip()
        if not sku or item.quantity <= 0:
            raise HTTPException(422, 'Release quantities must be greater than zero')
        if sku in requested:
            raise HTTPException(422, 'Each material may appear only once in a release')
        requested[sku] = float(item.quantity)
    with Session(engine) as session:
        sale = session.scalar(select(SaleRecordModel).where(
            SaleRecordModel.id == payload.saleId,
            SaleRecordModel.company_id == actor.company_id,
            SaleRecordModel.branch_id == actor.branch_id,
            SaleRecordModel.document_type == 'INVOICE',
        ))
        if sale is None:
            raise HTTPException(404, 'Invoice not found in this branch')
        if sale.payment_status != 'PAID':
            raise HTTPException(409, 'Materials cannot be released before verified full payment')
        if sale.fulfilment_status == 'RELEASED':
            raise HTTPException(409, 'All materials on this invoice have already been released')
        available = {item['sku']: item for item in releaseable_items(session, sale, actor.company_id, actor.branch_id)}
        release_items = []
        for sku, quantity in requested.items():
            item = available.get(sku)
            if item is None:
                raise HTTPException(422, f'{sku} has no remaining quantity to release')
            if quantity > item['remainingQuantity']:
                raise HTTPException(422, f'{item["name"]} has only {item["remainingQuantity"]:g} remaining on this invoice')
            product = session.scalar(select(ProductCatalogItem).where(
                ProductCatalogItem.company_id == actor.company_id,
                ProductCatalogItem.branch_id == actor.branch_id,
                ProductCatalogItem.sku == sku,
                ProductCatalogItem.active == True,
            ))
            if product is None:
                raise HTTPException(422, f'{sku} is not available in this branch catalogue')
            if quantity > product.stock:
                raise HTTPException(422, f'{product.name} has only {product.stock:g} {product.unit.lower()}(s) in stock')
            release_items.append({'sku': sku, 'name': item['name'], 'quantity': quantity, 'unit': item['unit']})
        release_id = str(uuid4())
        branch = session.scalar(select(Branch).where(Branch.company_id == actor.company_id, Branch.id == actor.branch_id))
        release_number = f'{branch.code if branch else "BR"}-REL-{uuid4().hex[:6].upper()}'
        remaining_before = released_quantities(session, sale.id, actor.company_id, actor.branch_id)
        for item in release_items:
            remaining_before[item['sku']] = remaining_before.get(item['sku'], 0) + item['quantity']
        complete = True
        try:
            details = json.loads(sale.payload_json or '{}')
        except json.JSONDecodeError:
            details = {}
        for original in details.get('items', []):
            if remaining_before.get(original.get('sku', ''), 0) < float(original.get('quantity', 0)):
                complete = False
                break
        status = 'RELEASED' if complete else 'PARTIALLY_RELEASED'
        record = MaterialReleaseModel(id=release_id, company_id=actor.company_id, branch_id=actor.branch_id, sale_id=sale.id, storekeeper_user_id=actor.id, release_number=release_number, status=status, payload_json=json.dumps({'items': release_items}), created_at=now_iso())
        session.add(record)
        for item in release_items:
            product = session.scalar(select(ProductCatalogItem).where(ProductCatalogItem.company_id == actor.company_id, ProductCatalogItem.branch_id == actor.branch_id, ProductCatalogItem.sku == item['sku'], ProductCatalogItem.active == True))
            product.stock = float(product.stock) - item['quantity']
            session.add(MaterialReleaseItemModel(id=str(uuid4()), company_id=actor.company_id, branch_id=actor.branch_id, release_id=release_id, sale_id=sale.id, sku=item['sku'], name=item['name'], quantity=item['quantity'], unit=item['unit']))
        sale.fulfilment_status = status
        session.add(AuditLog(id=str(uuid4()), company_id=actor.company_id, branch_id=actor.branch_id, actor_user_id=actor.id, action='material_released', target_user_id=sale.id, created_at=now_iso()))
        session.commit(); session.refresh(record); session.refresh(sale)
        return {'release': to_release_payload(record), 'invoice': to_sale_payload(sale), 'remainingItems': releaseable_items(session, sale, actor.company_id, actor.branch_id)}

@app.get('/api/staff')
def list_staff(branchId: str, request: Request) -> list[dict]:
    actor = require_actor(request, {'BRANCH_MANAGER'}, branchId)
    with Session(engine) as session:
        return [to_staff_payload(user) for user in session.scalars(select(UserAccount).where(UserAccount.company_id == actor.company_id, UserAccount.branch_id == branchId, UserAccount.role.in_(['STOCK_MANAGER', 'SALES_OFFICER', 'CASHIER', 'SALES_CASHIER'])).order_by(UserAccount.full_name))]

@app.get('/api/company-users')
def list_company_users(request: Request) -> list[dict]:
    require_hq(request)
    with Session(engine) as session:
        branches = {branch.id: branch.name for branch in session.scalars(select(Branch).where(Branch.company_id == 1))}
        return [dict(to_staff_payload(user), branchName=branches.get(user.branch_id, 'Unassigned')) for user in session.scalars(select(UserAccount).where(UserAccount.company_id == 1).order_by(UserAccount.created_at.desc()))]

@app.post('/api/staff')
def create_staff(payload: StaffPayload, request: Request) -> dict:
    actor = require_actor(request, {'BRANCH_MANAGER'}, payload.branchId)
    if payload.role not in {'STOCK_MANAGER', 'SALES_OFFICER', 'CASHIER', 'SALES_CASHIER'}: raise HTTPException(403, 'Branch Managers may only assign Stock Manager, Sales Officer or Cashier roles')
    if len(payload.password) < 8: raise HTTPException(422, 'Password must be at least 8 characters')
    if payload.permissions is not None and any(permission not in ASSIGNABLE_PERMISSIONS for permission in payload.permissions): raise HTTPException(422, 'One or more assigned permissions are not allowed')
    with Session(engine) as session:
        username = payload.username.strip().lower()
        if session.scalar(select(UserAccount).where(UserAccount.company_id == actor.company_id, UserAccount.username == username)) is not None: raise HTTPException(409, 'Username already exists')
        permissions_json = json.dumps({'custom': True, 'permissions': sorted(set(payload.permissions))}) if payload.permissions is not None else '[]'
        user = UserAccount(id=str(uuid4()), company_id=actor.company_id, branch_id=payload.branchId, username=username, email=payload.email.strip().lower(), full_name=payload.fullName.strip(), role=payload.role, password_hash=hash_password(payload.password), active=True, permissions_json=permissions_json, created_at=now_iso())
        session.add(user); session.add(AuditLog(id=str(uuid4()), company_id=actor.company_id, branch_id=payload.branchId, actor_user_id=actor.id, action='staff_created', target_user_id=user.id, created_at=now_iso())); session.commit(); session.refresh(user)
        return to_staff_payload(user)

@app.patch('/api/staff/{user_id}')
def update_staff(user_id: str, payload: StaffUpdatePayload, request: Request) -> dict:
    actor = require_actor(request, {'BRANCH_MANAGER'}, request.headers.get('x-branch-id', ''))
    with Session(engine) as session:
        user = session.scalar(select(UserAccount).where(UserAccount.id == user_id, UserAccount.company_id == actor.company_id, UserAccount.branch_id == actor.branch_id, UserAccount.role.in_(['STOCK_MANAGER', 'SALES_OFFICER', 'CASHIER', 'SALES_CASHIER'])))
        if user is None: raise HTTPException(404, 'Staff account not found in this branch')
        if payload.fullName is not None: user.full_name = payload.fullName.strip()
        if payload.email is not None: user.email = payload.email.strip().lower()
        if payload.active is not None: user.active = payload.active
        if payload.permissions is not None:
            if any(permission not in ASSIGNABLE_PERMISSIONS for permission in payload.permissions): raise HTTPException(422, 'One or more assigned permissions are not allowed')
            user.permissions_json = json.dumps({'custom': True, 'permissions': sorted(set(payload.permissions))})
        session.add(AuditLog(id=str(uuid4()), company_id=actor.company_id, branch_id=actor.branch_id, actor_user_id=actor.id, action='staff_updated', target_user_id=user.id, created_at=now_iso())); session.commit(); session.refresh(user); return to_staff_payload(user)

@app.post('/api/staff/{user_id}/reset-password')
def reset_staff_password(user_id: str, payload: PasswordResetPayload, request: Request) -> dict:
    actor = require_actor(request, {'BRANCH_MANAGER'}, request.headers.get('x-branch-id', ''))
    if len(payload.password) < 8: raise HTTPException(422, 'Password must be at least 8 characters')
    with Session(engine) as session:
        user = session.scalar(select(UserAccount).where(UserAccount.id == user_id, UserAccount.company_id == actor.company_id, UserAccount.branch_id == actor.branch_id, UserAccount.role.in_(['STOCK_MANAGER', 'SALES_OFFICER', 'CASHIER', 'SALES_CASHIER'])))
        if user is None: raise HTTPException(404, 'Staff account not found in this branch')
        user.password_hash = hash_password(payload.password); session.add(AuditLog(id=str(uuid4()), company_id=actor.company_id, branch_id=actor.branch_id, actor_user_id=actor.id, action='staff_password_reset', target_user_id=user.id, created_at=now_iso())); session.commit(); session.refresh(user); return to_staff_payload(user)

@app.get('/api/audit-log')
def audit_log(request: Request, branchId: str = '') -> list[dict]:
    actor = require_actor(request, {'BRANCH_MANAGER'}, branchId)
    with Session(engine) as session:
        rows = session.scalars(select(AuditLog).where(AuditLog.company_id == actor.company_id, AuditLog.branch_id == actor.branch_id).order_by(AuditLog.created_at.desc())).all()
        return [{'id': row.id, 'action': row.action, 'actorUserId': row.actor_user_id, 'targetUserId': row.target_user_id, 'createdAt': row.created_at} for row in rows]

@app.get('/api/company-audit-log')
def company_audit_log(request: Request) -> list[dict]:
    require_hq(request)
    with Session(engine) as session:
        rows = session.scalars(select(AuditLog).where(AuditLog.company_id == 1).order_by(AuditLog.created_at.desc())).all()
        return [{'id': row.id, 'action': row.action, 'actorUserId': row.actor_user_id, 'targetUserId': row.target_user_id, 'createdAt': row.created_at} for row in rows]

@app.post('/api/branch-actions/{action}')
def protected_branch_action(action: str, request: Request) -> dict:
    actor = require_actor(request, BRANCH_ROLES, request.headers.get('x-branch-id', ''))
    allowed = {
        'BRANCH_MANAGER': {'sales', 'quotations', 'invoices', 'payments', 'receipts', 'inventory_view', 'inventory', 'stock_receipts', 'purchases', 'stock_adjustments', 'material_release', 'financial_reports', 'system_settings', 'staff_management', 'edit_selling_prices'},
        'SALES_OFFICER': {'sales', 'quotations', 'invoices', 'inventory_view', 'customers', 'limited_reports'},
        'CASHIER': {'invoice_view', 'payments', 'receipts', 'payment_reports'},
        'STOCK_MANAGER': {'inventory_view', 'inventory', 'stock_receipts', 'purchases', 'stock_adjustments', 'material_release', 'stock_reports'},
        # Kept for existing installations; new accounts should use separate roles.
        'SALES_CASHIER': {'sales', 'quotations', 'invoices', 'payments', 'receipts', 'inventory_view'},
    }
    with Session(engine) as session:
        branch = session.scalar(select(Branch).where(Branch.id == actor.branch_id, Branch.company_id == actor.company_id))
    if branch is None or action not in permissions_for(actor, branch):
        raise HTTPException(403, f'Permission {action} is not assigned to this account')
    return {'allowed': True, 'action': action, 'role': actor.role, 'branchId': actor.branch_id}

def to_payload(company: Company) -> dict:
    try: document_templates = json.loads(company.document_templates_json or '{}')
    except json.JSONDecodeError: document_templates = {}
    return {'registeredName': company.registered_name, 'tradingName': company.trading_name, 'category': company.category, 'email': company.email, 'phone': company.phone, 'country': company.country, 'address': company.address, 'currency': company.currency, 'timezone': company.timezone, 'brandColor': company.brand_color, 'tagline': company.tagline, 'logoRef': company.logo_ref, 'secondaryColor': company.secondary_color, 'accentColor': company.accent_color, 'showLogoReceipts': company.show_logo_receipts, 'showLogoInvoices': company.show_logo_invoices, 'useBrandColours': company.use_brand_colours, 'documentTemplates': document_templates}

def to_owner_payload(owner: Owner) -> dict:
    return {'fullName': owner.full_name, 'role': owner.role, 'phone': owner.phone, 'email': owner.email, 'identificationType': owner.identification_type, 'idNumber': owner.id_number, 'dateOfBirth': owner.date_of_birth, 'gender': owner.gender, 'photoRef': owner.photo_ref}

def to_owner_security_payload(owner: Owner) -> dict:
    return {'username': owner.username, 'email': owner.email, 'passwordSet': bool(owner.password_hash), 'twoFactorEnabled': owner.two_factor_enabled, 'emailNotifications': owner.email_notifications, 'smsNotifications': owner.sms_notifications, 'recoveryPhone': owner.recovery_phone, 'recoveryEmail': owner.recovery_email}

def to_branch_payload(branch: Branch) -> dict:
    return {'id': branch.id, 'name': branch.name, 'code': branch.code, 'location': branch.location, 'phone': branch.phone, 'manager': branch.manager, 'status': branch.status, 'usersCount': branch.users_count, 'branchType': branch.branch_type, 'email': branch.email, 'managerContact': branch.manager_contact}

def to_staff_payload(user: UserAccount) -> dict:
    try: permissions = json.loads(user.permissions_json or '[]')
    except json.JSONDecodeError: permissions = []
    if isinstance(permissions, dict): permissions = permissions.get('permissions', [])
    return {'id': user.id, 'username': user.username, 'email': user.email, 'fullName': user.full_name, 'role': user.role, 'branchId': user.branch_id, 'active': user.active, 'createdAt': user.created_at, 'lastLogin': user.last_login, 'permissions': permissions if isinstance(permissions, list) else []}

def to_product_payload(product: ProductCatalogItem) -> dict:
    return {'sku': product.sku, 'barcode': product.barcode, 'name': product.name, 'category': product.category, 'brand': product.brand, 'productType': product.product_type, 'variant': product.variant, 'stock': product.stock, 'unit': product.unit, 'price': product.selling_price}

def to_purchase_payload(record: PurchaseRecordModel) -> dict:
    try: details = json.loads(record.payload_json or '{}')
    except json.JSONDecodeError: details = {}
    return {'id': record.id, 'purchaseNumber': record.purchase_number, 'branchId': record.branch_id, 'supplier': record.supplier, 'purchaseDate': record.purchase_date, 'reference': record.reference, 'paymentType': record.payment_type, 'subtotal': record.subtotal, 'discount': record.discount, 'total': record.total, 'notes': details.get('notes', ''), 'items': details.get('items', []), 'createdAt': record.created_at}

def to_payment_payload(payment: PaymentRecordModel) -> dict:
    return {'id': payment.id, 'saleId': payment.sale_id, 'branchId': payment.branch_id, 'amount': payment.amount, 'method': payment.method, 'reference': payment.reference, 'verificationStatus': payment.verification_status, 'evidenceNote': payment.evidence_note, 'receiptNumber': payment.receipt_number, 'createdAt': payment.created_at}

def to_receipt_payload(receipt: Optional[ReceiptRecordModel]) -> Optional[dict]:
    if receipt is None:
        return None
    return {'id': receipt.id, 'saleId': receipt.sale_id, 'paymentId': receipt.payment_id, 'receiptNumber': receipt.receipt_number, 'amount': receipt.amount, 'createdAt': receipt.created_at, 'branchId': receipt.branch_id}

def template_for_document(document_templates: dict, document_type: str) -> dict:
    if not isinstance(document_templates, dict):
        return {}
    library = document_templates.get('templates') or document_templates.get('library')
    if isinstance(library, dict):
        key = {'INVOICE': 'Invoice Template', 'QUOTATION': 'Quotation Template', 'RECEIPT': 'Receipt Template'}.get(document_type, 'Invoice Template')
        selected = library.get(key) or library.get(key.replace(' Template', '').lower())
        if isinstance(selected, dict):
            return selected
    return document_templates

def to_sale_payload(record: SaleRecordModel) -> dict:
    try: details = json.loads(record.payload_json or '{}')
    except json.JSONDecodeError: details = {}
    return {'id': record.id, 'saleNumber': record.sale_number, 'documentType': record.document_type, 'branchId': record.branch_id, 'actorUserId': record.actor_user_id, 'customerName': record.customer_name, 'status': record.status, 'subtotal': record.subtotal, 'discount': record.discount, 'tax': record.tax, 'total': record.total, 'amountPaid': record.amount_paid or 0, 'paymentStatus': record.payment_status or 'UNPAID', 'fulfilmentStatus': record.fulfilment_status or 'AWAITING_PAYMENT', 'createdAt': record.created_at, 'items': details.get('items', []), 'vatPercent': details.get('vatPercent', 0), 'notes': details.get('notes', ''), 'templateId': details.get('templateId', ''), 'templateName': details.get('templateName', ''), 'templateVersion': details.get('templateVersion', 0), 'templateSnapshot': details.get('template', {})}

def to_device_payload(device: DeviceActivation, branch_name: str) -> dict:
    return {'id': device.id, 'branchId': device.branch_id, 'branchName': branch_name, 'deviceName': device.device_name, 'activationCode': device.activation_code, 'deviceType': device.device_type, 'validity': device.validity, 'active': device.active, 'createdAt': device.created_at}

def ensure_sync_status(session: Session, company_id: int, branch_id: str, device_id: str = 'local-device') -> SyncStatusModel:
    status = session.scalar(select(SyncStatusModel).where(SyncStatusModel.company_id == company_id, SyncStatusModel.branch_id == branch_id))
    if status is None:
        status = SyncStatusModel(id=str(uuid4()), company_id=company_id, branch_id=branch_id, device_id=device_id, sync_state='NEVER_SYNCED', updated_at=now_iso())
        session.add(status)
        session.flush()
    elif device_id and status.device_id != device_id:
        status.device_id = device_id
        status.updated_at = now_iso()
    return status

def to_sync_status_payload(session: Session, status: SyncStatusModel) -> dict:
    pending = len(session.scalars(select(SyncOutboxModel).where(SyncOutboxModel.company_id == status.company_id, SyncOutboxModel.branch_id == status.branch_id, SyncOutboxModel.status == 'PENDING')).all())
    return {
        'branchId': status.branch_id,
        'deviceId': status.device_id,
        'onlineEnabled': status.online_enabled,
        'autoSyncEnabled': status.auto_sync_enabled,
        'intervalMinutes': status.interval_minutes,
        'syncState': status.sync_state,
        'lastSyncAt': status.last_sync_at,
        'lastAttemptAt': status.last_attempt_at,
        'lastError': status.last_error,
        'pendingCount': pending,
        'updatedAt': status.updated_at,
    }

def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()

def hash_password(password: str) -> str:
    salt = os.urandom(16)
    digest = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 210_000)
    return f'pbkdf2_sha256$210000${salt.hex()}${digest.hex()}'

def verify_password(password: str, encoded: str) -> bool:
    try:
        algorithm, iterations, salt_hex, digest_hex = encoded.split('$')
        if algorithm != 'pbkdf2_sha256': return False
        actual = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), bytes.fromhex(salt_hex), int(iterations)).hex()
        return hmac.compare_digest(actual, digest_hex)
    except (ValueError, TypeError):
        return False

def permissions_for(user: UserAccount, branch: Branch) -> list[str]:
    defaults = {
        'BRANCH_MANAGER': ['sales', 'quotations', 'invoices', 'payments', 'receipts', 'inventory_view', 'inventory', 'stock_receipts', 'purchases', 'stock_adjustments', 'material_release', 'financial_reports', 'system_settings', 'staff_management', 'edit_selling_prices'],
        'SALES_OFFICER': ['sales', 'quotations', 'invoices', 'inventory_view', 'customers', 'limited_reports'],
        'CASHIER': ['invoice_view', 'payments', 'receipts', 'payment_reports'],
        'STOCK_MANAGER': ['inventory_view', 'inventory', 'stock_receipts', 'purchases', 'suppliers', 'stock_adjustments', 'material_release', 'stock_reports'],
        'SALES_CASHIER': ['sales', 'quotations', 'invoices', 'payments', 'receipts', 'inventory_view'],
    }
    if user.role != 'BRANCH_MANAGER' and user.permissions_json:
        try:
            configured_user = json.loads(user.permissions_json)
            if isinstance(configured_user, dict) and configured_user.get('custom') is True:
                configured_permissions = configured_user.get('permissions', [])
                return sorted(set(configured_permissions)) if isinstance(configured_permissions, list) else []
            if isinstance(configured_user, list):
                if configured_user:
                    return sorted(set(configured_user))
        except json.JSONDecodeError:
            pass
    if user.role == 'BRANCH_MANAGER' and branch.permissions_json:
        try:
            configured = json.loads(branch.permissions_json)
            if isinstance(configured, dict):
                enabled = [key for key, value in configured.items() if value]
                if enabled:
                    if user.role == 'BRANCH_MANAGER' and 'staff_management' not in enabled: enabled.append('staff_management')
                    return enabled
        except json.JSONDecodeError:
            pass
    return defaults.get(user.role, [])

def require_any_permission(request: Request, allowed_roles: set[str], branch_id: str, permissions: set[str]) -> UserAccount:
    actor = require_actor(request, allowed_roles, branch_id)
    with Session(engine) as session:
        branch = session.scalar(select(Branch).where(Branch.id == branch_id, Branch.company_id == actor.company_id))
    if branch is None or not permissions.intersection(permissions_for(actor, branch)):
        labels = ', '.join(sorted(permissions))
        raise HTTPException(403, f'One of these permissions is required: {labels}')
    return actor

def require_actor(request: Request, allowed_roles: set[str], branch_id: str, permission: Optional[str] = None) -> UserAccount:
    user_id = request.headers.get('x-user-id', '')
    if not user_id or not branch_id: raise HTTPException(401, 'Authenticated branch user and branch are required')
    with Session(engine) as session:
        user = session.scalar(select(UserAccount).where(UserAccount.id == user_id, UserAccount.company_id == 1, UserAccount.branch_id == branch_id, UserAccount.active == True))
        if user is None: raise HTTPException(403, 'User is not authorized for this branch')
        if user.role not in allowed_roles: raise HTTPException(403, 'This role is not authorized for the requested operation')
        if permission:
            branch = session.scalar(select(Branch).where(Branch.id == branch_id, Branch.company_id == user.company_id))
            if branch is None or permission not in permissions_for(user, branch):
                raise HTTPException(403, f'Permission {permission} is not assigned to this account')
        return user

def create_owner_session(owner: Owner) -> dict:
    token = secrets.token_urlsafe(32)
    owner_sessions[token] = owner.id
    return {
        'token': token,
        'ownerId': owner.id,
        'companyId': owner.company_id,
        'fullName': owner.full_name,
        'username': owner.username,
        'role': 'OWNER',
    }

def require_hq(request: Request, allow_initial_setup: bool = False) -> None:
    token = request.headers.get('x-owner-session', '')
    owner_id = owner_sessions.get(token)
    if owner_id is not None:
        with Session(engine) as session:
            owner = session.scalar(select(Owner).where(Owner.id == owner_id, Owner.company_id == 1))
            if owner is not None and owner.password_hash:
                return
        owner_sessions.pop(token, None)
    if allow_initial_setup:
        with Session(engine) as session:
            owner = session.scalar(select(Owner).order_by(Owner.id))
            if owner is None or not owner.password_hash:
                return
    raise HTTPException(403, 'Owner authentication is required to access Company Setup')
