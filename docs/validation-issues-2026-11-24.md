# Validation Issues Backlog — 24 November 2026

This backlog records issues found during live application testing. Each item must be implemented, tested against the running desktop application, documented, and committed before the next item is started.

## Ordered work queue

- [ ] 01 — Database synchronization: cloud-connected installations must not report `CLOUD_NOT_CONFIGURED`; verify Sync Now, offline behavior, local SQLite safety, and truthful status reporting.
- [ ] 02 — Branch Manager role and permissions: expose permission assignment during staff creation and verify grant/revoke behavior at the backend and navigation layers.
- [ ] 03 — Invoice, receipt and release printing: native operating-system print actions must open the print dialog directly and print the correct document without requiring manual PDF printing.
- [ ] 04 — Branch editing: Company Setup → Branches must allow the owner to edit persisted branch details and status.
- [ ] 05 — Branding propagation: selected company logo must reload from SQLite and appear in application previews, invoice previews/PDFs, receipts and release documents according to the saved switches.
- [ ] 06 — Staff password visibility: initial and reset password fields need a show/hide control without exposing passwords through API responses or logs.
- [ ] 07 — Application icon: add an authorized application-icon upload field, validate PNG input, persist it, use it for the runtime desktop icon where supported, and replace the Electron default in distributable branding assets.
- [ ] 08 — Owner Setup lock: after owner credentials exist, hide Company Setup until a valid owner session unlocks it; branch staff and owner logout must relock setup.
- [ ] 09 — Brand palette propagation: saved primary, secondary and accent colors must apply to the shared application UI after save and reload, not only to branding previews.

## Validation rule

Do not mark an item complete from a mocked React event. Record the actual API result, database persistence check, restart check, and running Electron evidence in the relevant validation report.
