# Desktop distribution

YenkasaBuildersStock is packaged as an Electron application with the local FastAPI service frozen into an installer resource. Customer machines do not need Python, Node.js, PostgreSQL, or SQLite developer tools.

## Local data

Packaged builds store the operational SQLite database under Electron's platform user-data directory:

```text
<user-data>/data/yenkasa-local.db
```

The backend creates a `backups/` directory beside the database and makes a startup copy before `create_all` runs. Future schema changes must use versioned migrations and preserve unsynchronized outbox records.

## Build commands

From the repository root:

```bash
npm ci
python3 -m venv services/local-api/.venv
services/local-api/.venv/bin/python -m pip install -r services/local-api/requirements.txt
services/local-api/.venv/bin/python -m pip install -r services/local-api/requirements-build.txt
npm --workspace apps/desktop run dist:mac
```

The macOS command produces a DMG and ZIP in `apps/desktop/release/`. Windows must be built on a Windows runner:

```powershell
python -m venv services/local-api/.venv
services/local-api/.venv\Scripts\python.exe -m pip install -r services/local-api\requirements.txt
services/local-api/.venv\Scripts\python.exe -m pip install -r services/local-api\requirements-build.txt
npm --workspace apps/desktop run dist:win
```

The same Windows build is defined in `.github/workflows/release.yml`. Signing certificates and update-feed credentials are intentionally not stored in the repository.

## Cloud database boundary

Supabase/PostgreSQL is a backend/cloud service dependency, not a customer-installed server. `DATABASE_URL` and any service credentials must be configured only for the cloud backend or deployment environment. Never put them in the Electron renderer or installer.

The desktop Company Setup area now includes **Cloud Database (Supabase)** for an authorized deployment administrator. The form tests the Session Pooler connection through the loopback FastAPI service. Electron stores the nonsecret project metadata beside the app's protected user data and encrypts the database password with Electron `safeStorage` (macOS Keychain or Windows DPAPI). The password is cleared from the form after saving and is never returned by the local API.

For customer deployments that use the hosted central backend, do not give customers the central PostgreSQL administrator credentials. The hosted backend should own `DATABASE_URL`; the customer desktop should use its provisioned activation and backend sync identity instead.

## Release status

The macOS installer path and native Windows CI path are implemented. Automatic signed application updates, notarization/signing credentials, clean-machine installation testing, and actual Supabase migration validation remain release gates and are tracked in `Validation Reports/Installer_Dependency_and_Packaging_Validation.pdf`.
