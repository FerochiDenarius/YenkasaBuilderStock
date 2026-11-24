from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REPORTS = ROOT / 'Validation Reports'
REPORTS.mkdir(exist_ok=True)
PDF = REPORTS / 'Sync_Settings_and_Branch_Status_Validation.pdf'
objects: list[bytes] = []


def esc(value: str) -> str:
    return value.encode('ascii', 'ignore').decode().replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')


def wrap(value: str, width: int = 94) -> list[str]:
    words = value.split()
    lines: list[str] = []
    line = ''
    for word in words:
        if line and len(line) + len(word) + 1 > width:
            lines.append(line)
            line = word
        else:
            line = word if not line else f'{line} {word}'
    if line:
        lines.append(line)
    return lines


def obj(data: bytes) -> int:
    objects.append(data)
    return len(objects)


font = obj(b'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>')


def page(title: str, sections: list[tuple[str, list[str]]]) -> int:
    lines = [title, 'YenkasaBuildersStock | Validation date: 24 November 2026', '']
    for heading, entries in sections:
        lines += [heading, '-' * min(94, max(20, len(heading)))]
        for entry in entries:
            lines.extend(wrap(entry))
        lines.append('')
    commands = ['BT', '/F1 15 Tf', '36 806 Td']
    for index, line in enumerate(lines):
        if index == 1:
            commands += ['/F1 8 Tf', '0 -18 Td']
        elif line[:3] in {'A. ', 'B. ', 'C. ', 'D. ', 'E. ', 'F. '}:
            commands += ['0 -8 Td', '/F1 10 Tf']
        elif index > 1:
            commands += ['/F1 8 Tf']
        commands += [f'({esc(line)}) Tj', '0 -11 Td']
    commands.append('ET')
    stream = '\n'.join(commands).encode()
    return obj(f'<< /Length {len(stream)} /Resources << /Font << /F1 {font} 0 R >> >> >>\nstream\n'.encode() + stream + b'\nendstream')


content = [
    page('Branch Synchronization Controls Validation', [
        ('A. Page and implementation information', [
            'Scope: Branch Operations -> Branch Settings -> Database Synchronization and Owner Account -> Activity Log branch status visibility.',
            'Implementation: persisted sync_status local SQLite model, branch-manager-only settings and run endpoints, truthful OFFLINE/CLOUD_NOT_CONFIGURED states, and owner activity rows for every company branch.',
            'Relevant source files: services/local-api/app/main.py; services/cloud-api/alembic/versions/0002_sync_status.py; apps/desktop/src/renderer/SyncSettingsPage.tsx; apps/desktop/src/renderer/Dashboard.tsx; apps/desktop/src/renderer/OwnerAccountPage.tsx; apps/desktop/src/renderer/api.ts; packages/contracts/src/index.ts; styles.css.',
        ]),
        ('B. Functionality checklist', [
            'Branch Settings exposes Database Synchronization only to a Branch Manager | PASS by navigation condition and backend role check.',
            'Online synchronization switch persists per company and branch device | PASS through PUT /api/sync/settings and sync_status table.',
            'Automatic sync preference and interval persist with validation from 5 to 1440 minutes | PASS.',
            'Sync Now records an attempt and reports the actual state without claiming a cloud sync that did not occur | PASS.',
            'Owner Activity Log includes one Branch Sync row per company branch, including never-synced and pending counts | PASS.',
            'Central PostgreSQL migration includes sync_status with company/branch foreign keys and unique isolation constraint | IMPLEMENTED; actual Supabase migration remains pending.',
        ]),
    ]),
    page('Branch Synchronization Controls Validation', [
        ('C. Backend integration and authorization', [
            'GET /api/sync/status requires an active BRANCH_MANAGER account scoped to the requested branch.',
            'PUT /api/sync/settings persists online_enabled, auto_sync_enabled, interval_minutes and an audit event in local SQLite.',
            'POST /api/sync/run records last_attempt_at and returns OFFLINE when disabled, CLOUD_NOT_CONFIGURED when no central service is configured, or PENDING_CLOUD when a service is configured but the worker is not enabled.',
            'Owner GET /api/owner/activity remains headquarters-only and adds branch sync status rows from the company-scoped branches and sync_outbox tables.',
            'Cloud migration 0002_sync_status adds company_id and branch_id foreign keys, device identity, policy, state, timestamps and error details.',
        ]),
        ('D. Test results', [
            'SYNC-01 | Initial status | Branch Manager requests status | NEVER_SYNCED returned | PASS',
            'SYNC-02 | Disable online mode | Save onlineEnabled=false and autoSyncEnabled=false | Settings persist | PASS',
            'SYNC-03 | Offline Sync Now | Run sync while disabled | OFFLINE and synced=false; no false success | PASS',
            'SYNC-04 | Re-enable | Save onlineEnabled=true and interval=15 | Settings persist | PASS',
            'SYNC-05 | Missing central service | Run sync without DATABASE_URL/SYNC_BACKEND_URL | CLOUD_NOT_CONFIGURED and synced=false | PASS',
            'SYNC-06 | Role protection | Sales Officer requests sync status | HTTP 403 | PASS',
            'SYNC-07 | Owner visibility | HQ requests activity log | Branch Sync row shows branch state and pending count | PASS',
            'SYNC-08 | Regression | Run local API pytest | 14 passed | PASS',
            'SYNC-09 | Renderer | Run npm run lint | Clean | PASS',
            'SYNC-10 | Desktop build | Run npm run build:desktop | Production build completed | PASS',
        ]),
    ]),
    page('Branch Synchronization Controls Validation', [
        ('E. Proof of validation', [
            'The backend test test_branch_manager_controls_sync_settings_and_owner_sees_branch_status creates a real branch manager, changes persisted settings, exercises offline and cloud-not-configured Sync Now states, rejects a sales officer, and reads the owner activity result.',
            'The local API test suite completed with 14 passed. The desktop lint and Electron Vite production build completed after the sync UI was added.',
            'No fabricated cloud success is reported. The current release intentionally leaves actual SQLite-to-Supabase outbox delivery pending until the cloud endpoint and credentials are validated.',
        ]),
        ('F. Outstanding issues', [
            'The Sync Now action currently prepares and records the request but does not send outbox records to Supabase. Phase 2 must implement an authenticated sync worker, retries, idempotency and conflict handling.',
            'The supplied Supabase project has not yet passed an authenticated connection/migration test in this environment. Configure the exact Supabase Connect PostgreSQL URI in the cloud backend before enabling cloud delivery.',
            'A live Electron screenshot test for the new sync page and a clean restart persistence test should be added to the next branch-operations validation run.',
        ]),
    ]),
]

pages = obj(b'')
refs = [obj(f'<< /Type /Page /Parent {pages} 0 R /MediaBox [0 0 595 842] /Contents {content_ref} 0 R >>'.encode()) for content_ref in content]
objects[pages - 1] = f"<< /Type /Pages /Kids [{' '.join(f'{ref} 0 R' for ref in refs)}] /Count {len(refs)} >>".encode()
catalog = obj(f'<< /Type /Catalog /Pages {pages} 0 R >>'.encode())

with PDF.open('wb') as handle:
    handle.write(b'%PDF-1.4\n')
    offsets = [0]
    for number, data in enumerate(objects, 1):
        offsets.append(handle.tell())
        handle.write(f'{number} 0 obj\n'.encode() + data + b'\nendobj\n')
    xref = handle.tell()
    handle.write(f'xref\n0 {len(objects) + 1}\n0000000000 65535 f \n'.encode())
    for offset in offsets[1:]:
        handle.write(f'{offset:010d} 00000 n \n'.encode())
    handle.write(f'trailer\n<< /Size {len(objects) + 1} /Root {catalog} 0 R >>\nstartxref\n{xref}\n%%EOF\n'.encode())
print(PDF)
