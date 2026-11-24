# Database foundation

The local service currently owns the SQLite `companies` table through SQLAlchemy and Alembic. The cloud service defines the initial `companies` and `branches` model boundary without connecting to or provisioning PostgreSQL in Phase 0.

Future business tables must carry `company_id` and, where branch-scoped, `branch_id`. Synchronization records should additionally carry an idempotency key, origin device, operation timestamp, and conflict status.
