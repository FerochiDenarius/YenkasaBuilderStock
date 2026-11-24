# Supabase PostgreSQL — Phase 1

## Connection boundary

The Electron renderer never receives a PostgreSQL URL, database password,
service-role key or Supabase secret. The desktop app continues to use the
loopback FastAPI service and its branch-local SQLite database for offline work.
The cloud FastAPI service in `services/cloud-api` is the only component that
opens the central Supabase PostgreSQL connection.

The Supabase project supplied for this installation is:

- Project ID: `xwyblizsmfeulyykufwg`
- Region: `eu-west-1`
- Project URL: `https://xwyblizsmfeulyykufwg.supabase.co`

Set `DATABASE_URL` in a backend-only `.env` file. The recommended connection
is the Supabase pooler URI from Dashboard → Connect → PostgreSQL → URI, with
`sslmode=require`. `CLOUD_DATABASE_URL` remains accepted as a compatibility
alias. `SUPABASE_PUBLISHABLE_KEY` is not required for the database connection.

## Migration

The versioned migration is:

`services/cloud-api/alembic/versions/0001_central_schema.py`

It covers companies, owners, branches, roles, role permissions, user accounts,
permission overrides, device activation, products, stock movements, suppliers,
customers, purchases, sales/invoices, payments, receipts, material releases,
document templates, audit logs and the synchronization outbox. Company and
branch scope is present on every branch-owned record. Unique constraints protect
branch document numbers and idempotency keys.

Apply it only after `DATABASE_URL` is configured:

```sh
cd services/cloud-api
python -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/python -m alembic -c alembic.ini upgrade head
```

## Validation

Run:

```sh
.venv/bin/python ../../scripts/validate_supabase.py
```

The validation records use the explicit `validation-cloud-*` identifiers and
are retained for inspection. Phase 1 does not run automatic SQLite-to-cloud
synchronization. That is intentionally deferred until the outbox contract,
conflict policy and retry behavior are tested in Phase 2.

## Installer behavior

JavaScript/React dependencies are included in the npm lockfile and bundled by
the Electron renderer build. The Python local API must also be packaged as the
installer's `resources/local-api` executable; the existing Electron main process
already looks for that packaged service. A production installer build should
therefore build the local API executable (for example with PyInstaller) and
include it as an Electron resource. Supabase credentials must remain on the
backend deployment, never inside that renderer or installer.
