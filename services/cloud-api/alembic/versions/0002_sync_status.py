"""Track branch sync policy and last synchronization status."""

from alembic import op
import sqlalchemy as sa

revision = '0002_sync_status'
down_revision = '0001_central_schema'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'sync_status',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('company_id', sa.String(36), sa.ForeignKey('companies.id', ondelete='CASCADE'), nullable=False),
        sa.Column('branch_id', sa.String(36), sa.ForeignKey('branches.id', ondelete='CASCADE'), nullable=False),
        sa.Column('device_id', sa.String(100), nullable=False, server_default='local-device'),
        sa.Column('online_enabled', sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column('auto_sync_enabled', sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column('interval_minutes', sa.Integer(), nullable=False, server_default='15'),
        sa.Column('sync_state', sa.String(40), nullable=False, server_default='NEVER_SYNCED'),
        sa.Column('last_sync_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('last_attempt_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('last_error', sa.Text(), nullable=False, server_default=''),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.UniqueConstraint('company_id', 'branch_id', name='uq_sync_status_company_branch'),
    )
    op.create_index('ix_sync_status_company_id', 'sync_status', ['company_id'])
    op.create_index('ix_sync_status_branch_id', 'sync_status', ['branch_id'])


def downgrade():
    op.drop_index('ix_sync_status_branch_id', table_name='sync_status')
    op.drop_index('ix_sync_status_company_id', table_name='sync_status')
    op.drop_table('sync_status')
