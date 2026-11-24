from alembic import op
import sqlalchemy as sa

revision = '0002_company_branding'
down_revision = '0001_initial'
branch_labels = None
depends_on = None

def upgrade():
    op.add_column('companies', sa.Column('tagline', sa.String(300), nullable=False, server_default=''))
    op.add_column('companies', sa.Column('logo_ref', sa.String(500), nullable=False, server_default=''))
    op.add_column('companies', sa.Column('secondary_color', sa.String(20), nullable=False, server_default='#F7B500'))
    op.add_column('companies', sa.Column('accent_color', sa.String(20), nullable=False, server_default='#D7263D'))
    op.add_column('companies', sa.Column('show_logo_receipts', sa.Boolean(), nullable=False, server_default=sa.true()))
    op.add_column('companies', sa.Column('show_logo_invoices', sa.Boolean(), nullable=False, server_default=sa.true()))
    op.add_column('companies', sa.Column('use_brand_colours', sa.Boolean(), nullable=False, server_default=sa.true()))

def downgrade():
    for column in ['use_brand_colours', 'show_logo_invoices', 'show_logo_receipts', 'accent_color', 'secondary_color', 'logo_ref', 'tagline']:
        op.drop_column('companies', column)
