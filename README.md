# YenkasaBuildersStock

Offline-first inventory and business management foundation for branch desktops and a headquarters dashboard.

## Phase 0 commands

```sh
npm install
npm run dev:desktop
npm run build:desktop
npm test
```

Run the cloud API separately with `uvicorn app.main:app --app-dir services/cloud-api --reload`.

No credentials, local databases, cloud deployments, or paid services belong in this repository.
