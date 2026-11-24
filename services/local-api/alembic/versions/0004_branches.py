from alembic import op
import sqlalchemy as sa

revision = '0004_branches'
down_revision = '0003_logo_data'
branch_labels = None
depends_on = None

def upgrade():
    op.create_table('branches', sa.Column('id', sa.String(36), primary_key=True), sa.Column('company_id', sa.Integer(), nullable=False, index=True), sa.Column('name', sa.String(200), nullable=False), sa.Column('code', sa.String(30), nullable=False), sa.Column('location', sa.String(300), nullable=False), sa.Column('phone', sa.String(50), nullable=False), sa.Column('manager', sa.String(200), nullable=False), sa.Column('status', sa.String(30), nullable=False), sa.Column('users_count', sa.Integer(), nullable=False))

def downgrade():
    op.drop_table('branches')
