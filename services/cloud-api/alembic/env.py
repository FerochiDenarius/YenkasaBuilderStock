import os
import sys
from pathlib import Path

from alembic import context

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

database_url = (os.getenv('DATABASE_URL') or os.getenv('CLOUD_DATABASE_URL') or '').strip()
if not database_url:
    raise RuntimeError('DATABASE_URL is required to run the Supabase migration.')

context.config.set_main_option('sqlalchemy.url', database_url.replace('%', '%%'))
target_metadata = None


def run_migrations_online() -> None:
    from sqlalchemy import engine_from_config, pool

    configuration = context.config.get_section(context.config.config_ini_section, {})
    connect_args = {}
    if database_url.startswith('postgresql') and 'sslmode=' not in database_url:
        connect_args['sslmode'] = 'require'
    connectable = engine_from_config(
        configuration,
        prefix='sqlalchemy.',
        poolclass=pool.NullPool,
        connect_args=connect_args,
    )
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()


run_migrations_online()
