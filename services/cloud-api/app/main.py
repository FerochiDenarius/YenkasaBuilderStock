"""Central cloud API foundation for Supabase PostgreSQL.

The desktop application continues to use the local FastAPI/SQLite service for
offline work. This service owns the central PostgreSQL connection and is the
boundary for future synchronization. No renderer code receives database
credentials.
"""

from typing import Optional

from fastapi import FastAPI
from fastapi.responses import JSONResponse
from pydantic_settings import BaseSettings, SettingsConfigDict
from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', extra='ignore')

    database_url: str = ''
    cloud_database_url: str = ''
    supabase_url: str = ''
    supabase_publishable_key: str = ''

    @property
    def resolved_database_url(self) -> str:
        return (self.database_url or self.cloud_database_url).strip()


settings = Settings()


def build_engine() -> Optional[Engine]:
    url = settings.resolved_database_url
    if not url:
        return None
    connect_args = {}
    if url.startswith('postgresql') and 'sslmode=' not in url:
        connect_args['sslmode'] = 'require'
    return create_engine(
        url,
        connect_args=connect_args,
        pool_pre_ping=True,
        pool_size=5,
        max_overflow=10,
    )


engine = build_engine()
app = FastAPI(title='YenkasaBuildersStock Cloud API')


@app.get('/health')
def health() -> JSONResponse:
    if engine is None:
        return JSONResponse(
            status_code=503,
            content={
                'status': 'configuration_required',
                'service': 'cloud-api',
                'supabaseProject': 'xwyblizsmfeulyykufwg',
                'message': 'Set DATABASE_URL in the backend environment.',
            },
        )
    try:
        with engine.connect() as connection:
            connection.execute(text('SELECT 1'))
        return JSONResponse(
            content={
                'status': 'ok',
                'service': 'cloud-api',
                'database': 'postgresql',
                'supabaseProject': 'xwyblizsmfeulyykufwg',
            }
        )
    except Exception as exc:  # pragma: no cover - external service dependent
        return JSONResponse(
            status_code=503,
            content={'status': 'unavailable', 'service': 'cloud-api', 'error': str(exc)},
        )


@app.get('/api/cloud/configuration')
def configuration() -> dict[str, object]:
    """Safe diagnostics; never returns the database URL or secret keys."""

    return {
        'supabaseProject': 'xwyblizsmfeulyykufwg',
        'region': 'eu-west-1',
        'databaseConfigured': engine is not None,
        'rendererDatabaseAccess': False,
        'offlineLocalDatabaseRemainsEnabled': True,
    }
