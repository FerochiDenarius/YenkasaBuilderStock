# Architecture Decisions

## ADR-001: Offline-first branch database

Each branch uses local SQLite so core work can continue without connectivity. Future synchronization will use retries, idempotency keys, and explicit conflict policies.

## ADR-002: Separate local and cloud APIs

The local API isolates desktop persistence from the renderer. The cloud API remains independently deployable and is not deployed in Phase 0.

## ADR-003: Secure Electron defaults

Context isolation, sandboxing, disabled renderer Node integration, and a restricted preload bridge are mandatory defaults.
