from alembic import op
import sqlalchemy as sa

revision = '0003_logo_data'
down_revision = '0002_company_branding'
branch_labels = None
depends_on = None

def upgrade():
    op.alter_column('companies', 'logo_ref', existing_type=sa.String(length=500), type_=sa.Text(), existing_nullable=False)

def downgrade():
    op.alter_column('companies', 'logo_ref', existing_type=sa.Text(), type_=sa.String(length=500), existing_nullable=False)
