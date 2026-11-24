from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REPORTS = ROOT / 'Validation Reports'
REPORTS.mkdir(exist_ok=True)
PDF = REPORTS / 'Supabase_Phase1_Implementation_Validation.pdf'
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
    lines = [title, 'YenkasaBuildersStock | Validation date: 23 November 2026', '']
    for heading, entries in sections:
        lines += [heading, '-' * min(94, max(20, len(heading)))]
        for entry in entries:
            lines.extend(wrap(entry))
        lines.append('')
    commands = ['BT', '/F1 15 Tf', '36 806 Td']
    for index, line in enumerate(lines):
        if index == 1:
            commands += ['/F1 8 Tf', '0 -18 Td']
        elif line.startswith(('A. ', 'B. ', 'C. ', 'D. ', 'E. ')):
            commands += ['0 -8 Td', '/F1 10 Tf']
        elif index > 1:
            commands += ['/F1 8 Tf']
        commands += [f'({esc(line)}) Tj', '0 -11 Td']
    commands.append('ET')
    stream = '\n'.join(commands).encode()
    return obj(f'<< /Length {len(stream)} /Resources << /Font << /F1 {font} 0 R >> >> >>\nstream\n'.encode() + stream + b'\nendstream')


page_one = page('Supabase PostgreSQL Phase 1', [
    ('A. Page Information', [
        'Scope: central PostgreSQL foundation for Supabase project xwyblizsmfeulyykufwg in eu-west-1.',
        'Implementation: backend-only DATABASE_URL configuration, SSL-required PostgreSQL pooling, safe cloud health diagnostics, Alembic migration and retained validation script.',
        'Relevant source files: services/cloud-api/app/main.py; services/cloud-api/alembic/env.py; services/cloud-api/alembic/versions/0001_central_schema.py; scripts/validate_supabase.py; docs/database/supabase-phase-1.md; .env.example.',
    ]),
    ('B. Functionality Checklist', [
        'Cloud service resolves DATABASE_URL or CLOUD_DATABASE_URL without exposing credentials to the renderer | PASS (configuration path)',
        'SSL is required when the PostgreSQL URI does not already specify sslmode | PASS (implementation inspected)',
        'Connection pooling and pre-ping are configured | PASS (implementation inspected)',
        'Central schema includes company/branch-scoped business entities and sync_outbox | PASS (local migration smoke test)',
        'SQLite remains the desktop operational database and now has a local sync_outbox structure | PASS',
        'Actual Supabase PostgreSQL connection | NOT TESTED — DATABASE_URL is not configured in this environment',
    ]),
])
page_two = page('Supabase PostgreSQL Phase 1', [
    ('C. Backend Integration', [
        'The cloud migration creates 22 tables covering companies, owners, branches, roles, permissions, users, devices, products, stock movements, suppliers, customers, purchases, sales, payments, receipts, releases, templates, audit logs and outbox events.',
        'Every branch-owned table includes company_id and branch_id where applicable. Unique constraints cover branch document numbers, role permissions and outbox idempotency keys.',
        'Automatic SQLite-to-PostgreSQL synchronization is intentionally not enabled in Phase 1. sync_outbox is the prepared boundary for Phase 2 conflict and retry work.',
    ]),
    ('D. Test Results', [
        'SUPA-01 | Cloud API import | Import app with no credentials | Service loads without connecting to an unintended database | PASS',
        'SUPA-02 | Missing configuration | GET /health with no DATABASE_URL | 503 configuration_required and no secret disclosure | PASS',
        'SUPA-03 | Migration smoke test | Apply Alembic migration to temporary SQLite | 22 tables created, required table set present | PASS',
        'SUPA-04 | Local regression | Run services/local-api pytest | 13 passed | PASS',
        'SUPA-05 | Desktop regression | Run npm run lint and npm run build:desktop | Both passed | PASS',
        'SUPA-06 | Supabase connection | Connect to supplied project | Requires DATABASE_URL/password | NOT TESTED',
        'SUPA-07 | Cloud insert/isolation | Run scripts/validate_supabase.py | Requires migrated Supabase database | NOT TESTED',
    ]),
])
page_three = page('Supabase PostgreSQL Phase 1', [
    ('E. Proof of Validation', [
        'Evidence generated from actual commands: temporary SQLite migration created 22 tables; local FastAPI regression suite reported 13 passed; Electron renderer lint and production build passed; cloud health returned configuration_required without credentials.',
        'No fabricated Supabase screenshot or query result is included. The cloud connection and cloud record validation remain clearly marked NOT TESTED because the project ID/region alone do not authenticate PostgreSQL.',
    ]),
    ('F. Outstanding Issues', [
        'Required from the owner: configure the Supabase PostgreSQL URI/password in a backend-only services/cloud-api/.env or deployment secret as DATABASE_URL. Do not paste it into the renderer or commit it.',
        'After configuration, run the Alembic upgrade and scripts/validate_supabase.py. The resulting database name, current user, retained validation IDs and isolation check will be the genuine Phase 1 cloud evidence.',
        'Phase 2 remains pending: tested SQLite-to-PostgreSQL outbox processing, retries, conflict handling and synchronization of operational records.',
        'Installer packaging still needs a release build that embeds the local FastAPI executable under resources/local-api; the development build already bundles JavaScript dependencies.',
    ]),
])

pages = obj(b'')
page_refs = [obj(f'<< /Type /Page /Parent {pages} 0 R /MediaBox [0 0 595 842] /Contents {ref} 0 R >>'.encode()) for ref in (page_one, page_two, page_three)]
objects[pages - 1] = f"<< /Type /Pages /Kids [{' '.join(f'{ref} 0 R' for ref in page_refs)}] /Count 3 >>".encode()
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
