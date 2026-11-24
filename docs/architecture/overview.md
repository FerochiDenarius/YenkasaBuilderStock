# Architecture Overview

YenkasaBuildersStock is an offline-first monorepo. Each desktop installation owns a branch-local SQLite database and communicates with a loopback-only FastAPI service. The cloud API is a separate FastAPI service backed by PostgreSQL. Company and branch scope are first-class boundaries for future records and synchronization.

The Electron renderer has no Node.js access. The main process owns the local API lifecycle, and the preload exposes only a deliberately small bridge.
