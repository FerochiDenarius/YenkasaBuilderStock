"""Create the company-scoped central Supabase schema.

The cloud schema uses UUID-shaped strings so it can accept identifiers already
created by the local SQLite service. Synchronization is intentionally not
implemented by this migration; sync_outbox is the durable hand-off boundary.
"""

from alembic import op
import sqlalchemy as sa

revision = '0001_central_schema'
down_revision = None
branch_labels = None
depends_on = None


def common_columns():
    return [
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('record_version', sa.BigInteger(), nullable=False, server_default='1'),
        sa.Column('sync_status', sa.String(30), nullable=False, server_default='PENDING'),
        sa.Column('origin_device_id', sa.String(100), nullable=False, server_default=''),
    ]


def upgrade():
    op.create_table(
        'companies',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('registered_name', sa.String(200), nullable=False),
        sa.Column('trading_name', sa.String(200), nullable=False),
        sa.Column('category', sa.String(100), nullable=False),
        sa.Column('email', sa.String(320), nullable=False),
        sa.Column('phone', sa.String(50), nullable=False),
        sa.Column('country', sa.String(100), nullable=False),
        sa.Column('address', sa.String(500), nullable=False),
        sa.Column('currency', sa.String(20), nullable=False),
        sa.Column('timezone', sa.String(100), nullable=False),
        sa.Column('brand_color', sa.String(20), nullable=False),
        sa.Column('tagline', sa.String(300), nullable=False, server_default=''),
        sa.Column('logo_ref', sa.Text(), nullable=False, server_default=''),
        sa.Column('secondary_color', sa.String(20), nullable=False, server_default='#F7B500'),
        sa.Column('accent_color', sa.String(20), nullable=False, server_default='#D7263D'),
        sa.Column('document_templates_json', sa.Text(), nullable=False, server_default='{}'),
        *common_columns(),
    )
    op.create_table(
        'owners',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('company_id', sa.String(36), sa.ForeignKey('companies.id', ondelete='CASCADE'), nullable=False),
        sa.Column('full_name', sa.String(200), nullable=False),
        sa.Column('role', sa.String(100), nullable=False),
        sa.Column('phone', sa.String(50), nullable=False, server_default=''),
        sa.Column('email', sa.String(320), nullable=False, server_default=''),
        sa.Column('username', sa.String(120), nullable=False),
        sa.Column('password_hash', sa.Text(), nullable=False, server_default=''),
        sa.Column('security_json', sa.Text(), nullable=False, server_default='{}'),
        *common_columns(),
        sa.UniqueConstraint('company_id', 'username', name='uq_owner_company_username'),
    )
    op.create_table(
        'branches',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('company_id', sa.String(36), sa.ForeignKey('companies.id', ondelete='CASCADE'), nullable=False),
        sa.Column('name', sa.String(200), nullable=False),
        sa.Column('code', sa.String(30), nullable=False),
        sa.Column('location', sa.String(300), nullable=False),
        sa.Column('phone', sa.String(50), nullable=False, server_default=''),
        sa.Column('manager', sa.String(200), nullable=False),
        sa.Column('status', sa.String(30), nullable=False, server_default='Active'),
        sa.Column('manager_user_id', sa.String(36), nullable=True),
        sa.Column('permissions_json', sa.Text(), nullable=False, server_default='{}'),
        *common_columns(),
        sa.UniqueConstraint('company_id', 'code', name='uq_branch_company_code'),
    )
    op.create_index('ix_branches_company_id', 'branches', ['company_id'])
    op.create_table(
        'roles',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('company_id', sa.String(36), sa.ForeignKey('companies.id', ondelete='CASCADE'), nullable=False),
        sa.Column('name', sa.String(60), nullable=False),
        sa.Column('description', sa.String(300), nullable=False, server_default=''),
        *common_columns(),
        sa.UniqueConstraint('company_id', 'name', name='uq_role_company_name'),
    )
    op.create_table(
        'role_permissions',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('role_id', sa.String(36), sa.ForeignKey('roles.id', ondelete='CASCADE'), nullable=False),
        sa.Column('permission', sa.String(100), nullable=False),
        *common_columns(),
        sa.UniqueConstraint('role_id', 'permission', name='uq_role_permission'),
    )
    op.create_table(
        'user_accounts',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('company_id', sa.String(36), sa.ForeignKey('companies.id', ondelete='CASCADE'), nullable=False),
        sa.Column('branch_id', sa.String(36), sa.ForeignKey('branches.id', ondelete='CASCADE'), nullable=False),
        sa.Column('username', sa.String(120), nullable=False),
        sa.Column('email', sa.String(320), nullable=False, server_default=''),
        sa.Column('full_name', sa.String(200), nullable=False),
        sa.Column('role', sa.String(60), nullable=False),
        sa.Column('password_hash', sa.Text(), nullable=False),
        sa.Column('active', sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column('permissions_json', sa.Text(), nullable=False, server_default='{}'),
        sa.Column('last_login_at', sa.DateTime(timezone=True), nullable=True),
        *common_columns(),
        sa.UniqueConstraint('company_id', 'username', name='uq_user_company_username'),
    )
    op.create_index('ix_user_accounts_company_branch', 'user_accounts', ['company_id', 'branch_id'])
    op.create_table(
        'user_permission_overrides',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('user_id', sa.String(36), sa.ForeignKey('user_accounts.id', ondelete='CASCADE'), nullable=False),
        sa.Column('permission', sa.String(100), nullable=False),
        sa.Column('granted', sa.Boolean(), nullable=False),
        *common_columns(),
        sa.UniqueConstraint('user_id', 'permission', name='uq_user_permission_override'),
    )
    op.create_table(
        'device_activations',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('company_id', sa.String(36), sa.ForeignKey('companies.id', ondelete='CASCADE'), nullable=False),
        sa.Column('branch_id', sa.String(36), sa.ForeignKey('branches.id', ondelete='CASCADE'), nullable=False),
        sa.Column('device_name', sa.String(160), nullable=False),
        sa.Column('activation_code', sa.String(40), nullable=False, server_default=''),
        sa.Column('active', sa.Boolean(), nullable=False, server_default=sa.true()),
        *common_columns(),
    )
    op.create_table(
        'product_catalog_items',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('company_id', sa.String(36), sa.ForeignKey('companies.id', ondelete='CASCADE'), nullable=False),
        sa.Column('branch_id', sa.String(36), sa.ForeignKey('branches.id', ondelete='CASCADE'), nullable=False),
        sa.Column('sku', sa.String(80), nullable=False),
        sa.Column('barcode', sa.String(100), nullable=False, server_default=''),
        sa.Column('name', sa.String(240), nullable=False),
        sa.Column('category', sa.String(120), nullable=False),
        sa.Column('brand', sa.String(120), nullable=False, server_default=''),
        sa.Column('product_type', sa.String(120), nullable=False, server_default=''),
        sa.Column('variant', sa.String(120), nullable=False, server_default=''),
        sa.Column('stock', sa.Numeric(14, 3), nullable=False, server_default='0'),
        sa.Column('unit', sa.String(40), nullable=False, server_default='Piece'),
        sa.Column('selling_price', sa.Numeric(14, 2), nullable=False, server_default='0'),
        sa.Column('active', sa.Boolean(), nullable=False, server_default=sa.true()),
        *common_columns(),
        sa.UniqueConstraint('company_id', 'branch_id', 'sku', name='uq_product_branch_sku'),
    )
    op.create_table(
        'stock_movements',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('company_id', sa.String(36), sa.ForeignKey('companies.id', ondelete='CASCADE'), nullable=False),
        sa.Column('branch_id', sa.String(36), sa.ForeignKey('branches.id', ondelete='CASCADE'), nullable=False),
        sa.Column('sku', sa.String(80), nullable=False),
        sa.Column('movement_type', sa.String(50), nullable=False),
        sa.Column('quantity', sa.Numeric(14, 3), nullable=False),
        sa.Column('reference_id', sa.String(36), nullable=False, server_default=''),
        sa.Column('actor_user_id', sa.String(36), nullable=False, server_default=''),
        *common_columns(),
    )
    op.create_table(
        'suppliers',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('company_id', sa.String(36), sa.ForeignKey('companies.id', ondelete='CASCADE'), nullable=False),
        sa.Column('branch_id', sa.String(36), sa.ForeignKey('branches.id', ondelete='CASCADE'), nullable=True),
        sa.Column('name', sa.String(240), nullable=False),
        sa.Column('contact_json', sa.Text(), nullable=False, server_default='{}'),
        *common_columns(),
    )
    op.create_table(
        'customers',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('company_id', sa.String(36), sa.ForeignKey('companies.id', ondelete='CASCADE'), nullable=False),
        sa.Column('branch_id', sa.String(36), sa.ForeignKey('branches.id', ondelete='CASCADE'), nullable=True),
        sa.Column('name', sa.String(240), nullable=False),
        sa.Column('contact_json', sa.Text(), nullable=False, server_default='{}'),
        *common_columns(),
    )
    op.create_table(
        'purchase_records',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('company_id', sa.String(36), sa.ForeignKey('companies.id', ondelete='CASCADE'), nullable=False),
        sa.Column('branch_id', sa.String(36), sa.ForeignKey('branches.id', ondelete='CASCADE'), nullable=False),
        sa.Column('purchase_number', sa.String(80), nullable=False),
        sa.Column('actor_user_id', sa.String(36), nullable=False),
        sa.Column('supplier_id', sa.String(36), nullable=True),
        sa.Column('payload_json', sa.Text(), nullable=False),
        sa.Column('total', sa.Numeric(14, 2), nullable=False),
        *common_columns(),
        sa.UniqueConstraint('company_id', 'branch_id', 'purchase_number', name='uq_purchase_number'),
    )
    op.create_table(
        'sales_records',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('company_id', sa.String(36), sa.ForeignKey('companies.id', ondelete='CASCADE'), nullable=False),
        sa.Column('branch_id', sa.String(36), sa.ForeignKey('branches.id', ondelete='CASCADE'), nullable=False),
        sa.Column('sale_number', sa.String(80), nullable=False),
        sa.Column('document_type', sa.String(30), nullable=False),
        sa.Column('actor_user_id', sa.String(36), nullable=False),
        sa.Column('customer_id', sa.String(36), nullable=True),
        sa.Column('customer_name', sa.String(240), nullable=False, server_default=''),
        sa.Column('payload_json', sa.Text(), nullable=False),
        sa.Column('subtotal', sa.Numeric(14, 2), nullable=False),
        sa.Column('discount', sa.Numeric(14, 2), nullable=False),
        sa.Column('tax', sa.Numeric(14, 2), nullable=False),
        sa.Column('total', sa.Numeric(14, 2), nullable=False),
        sa.Column('amount_paid', sa.Numeric(14, 2), nullable=False, server_default='0'),
        sa.Column('payment_status', sa.String(30), nullable=False, server_default='UNPAID'),
        sa.Column('fulfilment_status', sa.String(30), nullable=False, server_default='AWAITING_PAYMENT'),
        *common_columns(),
        sa.UniqueConstraint('company_id', 'branch_id', 'sale_number', name='uq_sale_number'),
    )
    op.create_table(
        'payment_records',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('company_id', sa.String(36), sa.ForeignKey('companies.id', ondelete='CASCADE'), nullable=False),
        sa.Column('branch_id', sa.String(36), sa.ForeignKey('branches.id', ondelete='CASCADE'), nullable=False),
        sa.Column('sale_id', sa.String(36), sa.ForeignKey('sales_records.id', ondelete='RESTRICT'), nullable=False),
        sa.Column('cashier_user_id', sa.String(36), nullable=False),
        sa.Column('amount', sa.Numeric(14, 2), nullable=False),
        sa.Column('method', sa.String(40), nullable=False),
        sa.Column('reference', sa.String(160), nullable=False, server_default=''),
        sa.Column('verification_status', sa.String(40), nullable=False),
        sa.Column('receipt_number', sa.String(80), nullable=False, server_default=''),
        sa.Column('idempotency_key', sa.String(160), nullable=False),
        *common_columns(),
        sa.UniqueConstraint('company_id', 'branch_id', 'idempotency_key', name='uq_payment_idempotency'),
    )
    op.create_table(
        'receipt_records',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('company_id', sa.String(36), sa.ForeignKey('companies.id', ondelete='CASCADE'), nullable=False),
        sa.Column('branch_id', sa.String(36), sa.ForeignKey('branches.id', ondelete='CASCADE'), nullable=False),
        sa.Column('sale_id', sa.String(36), sa.ForeignKey('sales_records.id', ondelete='RESTRICT'), nullable=False),
        sa.Column('payment_id', sa.String(36), sa.ForeignKey('payment_records.id', ondelete='RESTRICT'), nullable=False),
        sa.Column('receipt_number', sa.String(80), nullable=False),
        sa.Column('amount', sa.Numeric(14, 2), nullable=False),
        sa.Column('payload_json', sa.Text(), nullable=False, server_default='{}'),
        *common_columns(),
        sa.UniqueConstraint('company_id', 'branch_id', 'receipt_number', name='uq_receipt_number'),
    )
    op.create_table(
        'material_releases',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('company_id', sa.String(36), sa.ForeignKey('companies.id', ondelete='CASCADE'), nullable=False),
        sa.Column('branch_id', sa.String(36), sa.ForeignKey('branches.id', ondelete='CASCADE'), nullable=False),
        sa.Column('sale_id', sa.String(36), sa.ForeignKey('sales_records.id', ondelete='RESTRICT'), nullable=False),
        sa.Column('storekeeper_user_id', sa.String(36), nullable=False),
        sa.Column('release_number', sa.String(80), nullable=False),
        sa.Column('status', sa.String(30), nullable=False),
        sa.Column('payload_json', sa.Text(), nullable=False),
        *common_columns(),
        sa.UniqueConstraint('company_id', 'branch_id', 'release_number', name='uq_release_number'),
    )
    op.create_table(
        'material_release_items',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('company_id', sa.String(36), sa.ForeignKey('companies.id', ondelete='CASCADE'), nullable=False),
        sa.Column('branch_id', sa.String(36), sa.ForeignKey('branches.id', ondelete='CASCADE'), nullable=False),
        sa.Column('release_id', sa.String(36), sa.ForeignKey('material_releases.id', ondelete='CASCADE'), nullable=False),
        sa.Column('sale_id', sa.String(36), sa.ForeignKey('sales_records.id', ondelete='RESTRICT'), nullable=False),
        sa.Column('sku', sa.String(80), nullable=False),
        sa.Column('name', sa.String(240), nullable=False),
        sa.Column('quantity', sa.Numeric(14, 3), nullable=False),
        sa.Column('unit', sa.String(40), nullable=False),
        *common_columns(),
    )
    op.create_table(
        'document_templates',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('company_id', sa.String(36), sa.ForeignKey('companies.id', ondelete='CASCADE'), nullable=False),
        sa.Column('document_type', sa.String(30), nullable=False),
        sa.Column('name', sa.String(200), nullable=False),
        sa.Column('paper_size', sa.String(30), nullable=False),
        sa.Column('version', sa.Integer(), nullable=False, server_default='1'),
        sa.Column('is_default', sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column('configuration_json', sa.Text(), nullable=False),
        *common_columns(),
        sa.UniqueConstraint('company_id', 'document_type', 'name', 'version', name='uq_template_version'),
    )
    op.create_table(
        'audit_logs',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('company_id', sa.String(36), sa.ForeignKey('companies.id', ondelete='CASCADE'), nullable=False),
        sa.Column('branch_id', sa.String(36), sa.ForeignKey('branches.id', ondelete='SET NULL'), nullable=True),
        sa.Column('actor_user_id', sa.String(36), nullable=False, server_default=''),
        sa.Column('action', sa.String(160), nullable=False),
        sa.Column('target_id', sa.String(36), nullable=False, server_default=''),
        sa.Column('details_json', sa.Text(), nullable=False, server_default='{}'),
        *common_columns(),
    )
    op.create_table(
        'sync_outbox',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('company_id', sa.String(36), sa.ForeignKey('companies.id', ondelete='CASCADE'), nullable=False),
        sa.Column('branch_id', sa.String(36), sa.ForeignKey('branches.id', ondelete='SET NULL'), nullable=True),
        sa.Column('entity_type', sa.String(100), nullable=False),
        sa.Column('entity_id', sa.String(36), nullable=False),
        sa.Column('operation', sa.String(20), nullable=False),
        sa.Column('payload_json', sa.Text(), nullable=False),
        sa.Column('idempotency_key', sa.String(160), nullable=False),
        sa.Column('status', sa.String(30), nullable=False, server_default='PENDING'),
        sa.Column('conflict_status', sa.String(30), nullable=False, server_default='NONE'),
        sa.Column('processed_at', sa.DateTime(timezone=True), nullable=True),
        *common_columns(),
        sa.UniqueConstraint('idempotency_key', name='uq_sync_outbox_idempotency'),
    )
    op.create_index('ix_sync_outbox_pending', 'sync_outbox', ['company_id', 'branch_id', 'status', 'created_at'])


def downgrade():
    for table in [
        'sync_outbox', 'audit_logs', 'document_templates', 'material_release_items',
        'material_releases', 'receipt_records', 'payment_records', 'sales_records',
        'purchase_records', 'customers', 'suppliers', 'stock_movements',
        'product_catalog_items', 'device_activations', 'user_permission_overrides',
        'user_accounts', 'role_permissions', 'roles', 'branches', 'owners', 'companies',
    ]:
        op.drop_table(table)
