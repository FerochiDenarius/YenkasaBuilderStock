from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REPORTS = ROOT / 'Validation Reports'
REPORTS.mkdir(exist_ok=True)
PDF = REPORTS / 'Cloud_Database_Configuration_Validation.pdf'
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
    page('Cloud Database Configuration Validation', [
        ('A. Page information', [
            'Scope: Company Setup -> Cloud Database (Supabase), based on the supplied installation-screen design.',
            'Implementation: project URL, project reference, database host, port, database name, database user and masked password fields; secure Test Connection and Save and Continue actions; installation instructions and deployment security guidance.',
            'Lifecycle implementation: after a successful cloud configuration, /api/installation/status determines whether the connected database is unregistered or already has a company. InstallationWelcomePage presents Owner Login, Branch / Staff Login and Set Up New Company without rendering protected setup navigation before authentication.',
            'Relevant source files: apps/desktop/src/renderer/CloudDatabaseSetupPage.tsx; apps/desktop/src/renderer/InstallationWelcomePage.tsx; apps/desktop/src/renderer/Dashboard.tsx; apps/desktop/src/main/index.ts; apps/desktop/src/preload/index.ts; apps/desktop/src/renderer/desktop.d.ts; apps/desktop/src/renderer/api.ts; services/local-api/app/main.py; services/local-api/requirements.txt; docs/distribution.md.',
        ]),
        ('B. Security checklist', [
            'Password is never returned by the renderer-facing configuration response | PASS by IPC return type and backend response shape.',
            'Password is encrypted with Electron safeStorage and written under the protected app user-data directory | IMPLEMENTED; OS credential-store behavior requires packaged macOS/Windows interactive validation.',
            'Previous configuration is not overwritten before a new connection test succeeds | PASS by save handler ordering.',
            'Saved password is cleared from the form after save | PASS in renderer state.',
            'Local API test errors use a generic message and do not include the connection string or password | PASS by implementation and unit test.',
            'Customer installations should use the hosted backend rather than receive central PostgreSQL administrator credentials | documented; deployment policy required.',
        ]),
    ]),
    page('Cloud Database Configuration Validation', [
        ('C. Backend integration', [
            'The renderer calls a narrow Electron preload bridge. The trusted Electron main process calls the loopback FastAPI /api/cloud/test endpoint with the submitted secret and returns only success or a generic failure.',
            'Test Connection is a read-only installation operation and is explicitly separated from saving configuration. On successful Save and Continue, Electron encrypts the password with safeStorage, stores sanitized nonsecret metadata and passes the decrypted value only to the trusted local backend process. React never receives the password back.',
            'Saving or replacing a cloud configuration is independent of company owner authentication. Electron sends no owner session or HQ role header for these IPC calls; it validates the connection first, then encrypts and stores the credentials with safeStorage.',
            'The FastAPI endpoint validates HTTPS project URL, project reference and individual PostgreSQL connection fields, forces SSL mode, connects with psycopg and executes SELECT 1. It returns no driver exception details.',
            'The local API requirements now include psycopg[binary]==3.2.3 so the connection-test driver is included in future PyInstaller backend builds.',
        ]),
        ('D. Test results', [
            'CLOUD-01 | Invalid project URL | POST cloud test with malformed URL and secret | HTTP 422 useful validation error, no secret in response | PASS',
            'CLOUD-02 | Fresh installation access | Request cloud configuration before a company record exists | HTTP 200 without owner credentials | PASS',
            'CLOUD-02A | Entry screen gate | Start with no saved cloud configuration | Welcome screen is shown first; Owner Login, Staff Login and New Company remain disabled until Database Configuration succeeds | PASS by renderer build and lifecycle logic',
            'CLOUD-02B | Post-configuration handoff | Test and save cloud configuration, then return to the application entry screen | Welcome screen is shown again with the three access choices enabled according to company status | PASS by renderer build and source validation; packaged interactive screenshot pending',
            'CLOUD-03 | Fresh installation validation | Submit malformed cloud-test payload before company registration | HTTP 422 useful validation error, not owner-auth failure | PASS',
            'CLOUD-04 | Post-setup independence | Create a company record, then request cloud configuration without an owner session | HTTP 200; connectivity configuration remains independent of owner authentication | PASS',
            'CLOUD-05 | Authentication separation | Call /api/cloud/test and /api/cloud/configuration without an owner session | Read-only cloud operations are available without owner authentication | PASS',
            'CLOUD-06 | Save/update authorization separation | Invoke Electron cloud:save-config with an existing saved configuration and no owner session | Connection is revalidated and replacement is encrypted and saved; no owner-auth error | PASS by source/build validation; interactive safeStorage test pending',
            'CLOUD-07 | Secret disclosure | Inspect invalid cloud-test response | Submitted password absent from response body | PASS',
            'CLOUD-08 | Backend regression | Run services/local-api pytest | 19 passed | PASS',
            'CLOUD-09 | Renderer lint | Run npm run lint | Clean | PASS',
            'CLOUD-10 | Desktop build | Run npm run build:desktop | Electron Vite production build completed | PASS',
            'CLOUD-11 | Packaged API build | Build the bundled local-api with the updated lifecycle endpoint | PyInstaller build completed and produced the packaged local-api executable | PASS',
            'CLOUD-12 | Protected navigation gate | Start renderer with no owner or branch session after cloud status is available | Installation Welcome is shown; Company Setup pages are not rendered or listed until initial setup is explicitly selected or owner login succeeds | PASS by renderer build and source inspection; packaged interactive screenshot pending',
            'CLOUD-13 | Existing env connection | Test the configured backend DATABASE_URL without printing the secret | Direct db host could not be resolved before authentication | FAIL; use the exact Session Pooler host, username and port 5432 from Supabase Connect.',
            'CLOUD-14 | Secure persistence restart | Save valid configuration, restart packaged app, reopen page | Metadata restored and password remains masked | NOT TESTED interactively.',
        ]),
    ]),
    page('Cloud Database Configuration Validation', [
        ('E. Proof of validation', [
            'The actual backend test suite executed 19 passing tests, including fresh-install cloud access, post-company owner authorization, lifecycle status and password non-disclosure checks for the cloud configuration endpoint.',
            'The actual bundled local API build completed after adding the lifecycle status endpoint. The renderer production build and lint completed after adding the access-selection view and protected-navigation gate.',
            'The packaged macOS DMG was rebuilt at apps/desktop/release/YenkasaBuildersStock-0.1.0.dmg. It is unsigned in this development environment and requires interactive packaged safeStorage/first-install testing before release.',
            'No fabricated Supabase success is reported. The configured env was tested with the password withheld; the direct db host failed DNS resolution before authentication. The Session Pooler URI remains to be tested.',
        ]),
        ('F. Outstanding issues', [
            'The reference welcome/access selection is implemented inside the existing application shell; the separate multi-step installer shell shown in the reference image is not yet a distinct installer product.',
            'Actual cloud migration and SQLite-to-Supabase synchronization remain separate deployment phases. A customer build must not ship central PostgreSQL administrator credentials.',
            'Before production release, replace the direct db host with the exact Supabase Session Pooler details from Supabase Connect (normally port 5432), then run a packaged macOS and Windows interactive safeStorage test and the actual Supabase migration.',
        ]),
    ]),
]

pages = obj(b'')
refs = [obj(f'<< /Type /Page /Parent {pages} 0 R /MediaBox [0 0 595 842] /Contents {ref} 0 R >>'.encode()) for ref in content]
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
