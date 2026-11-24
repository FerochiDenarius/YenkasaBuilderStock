from alembic import op
import sqlalchemy as sa

revision = '0001_initial'; down_revision = None; branch_labels = None; depends_on = None
def upgrade():
    op.create_table('companies', sa.Column('id', sa.Integer(), primary_key=True), sa.Column('registered_name', sa.String(200), nullable=False), sa.Column('trading_name', sa.String(200), nullable=False), sa.Column('category', sa.String(100), nullable=False), sa.Column('email', sa.String(320), nullable=False), sa.Column('phone', sa.String(50), nullable=False), sa.Column('country', sa.String(100), nullable=False), sa.Column('address', sa.String(500), nullable=False), sa.Column('currency', sa.String(20), nullable=False), sa.Column('timezone', sa.String(100), nullable=False), sa.Column('brand_color', sa.String(20), nullable=False))
def downgrade(): op.drop_table('companies')
