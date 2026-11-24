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
            'Implementation: project URL, project reference, Session Pooler URI and masked password fields; secure Test Connection and Save and Continue actions; installation instructions and deployment security guidance.',
            'Relevant source files: apps/desktop/src/renderer/CloudDatabaseSetupPage.tsx; apps/desktop/src/renderer/Dashboard.tsx; apps/desktop/src/main/index.ts; apps/desktop/src/preload/index.ts; apps/desktop/src/renderer/desktop.d.ts; services/local-api/app/main.py; services/local-api/requirements.txt; docs/distribution.md.',
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
            'On successful Save and Continue, Electron encrypts the password with safeStorage, stores sanitized nonsecret metadata and restarts the local backend with the decrypted value in its trusted process environment. React never receives the password back.',
            'The FastAPI endpoint validates HTTPS project URL, project reference and PostgreSQL URI, requires SSL mode, connects with psycopg and executes SELECT 1. It returns no driver exception details.',
            'The local API requirements now include psycopg[binary]==3.2.3 so the connection-test driver is included in future PyInstaller backend builds.',
        ]),
        ('D. Test results', [
            'CLOUD-01 | Invalid project URL | POST cloud test with malformed URL and secret | HTTP 422 useful validation error, no secret in response | PASS',
            'CLOUD-02 | Authorization | Request cloud configuration without HQ role | HTTP 403 | PASS',
            'CLOUD-03 | Secret disclosure | Inspect invalid cloud-test response | Submitted password absent from response body | PASS',
            'CLOUD-04 | Backend regression | Run services/local-api pytest | 15 passed | PASS',
            'CLOUD-05 | Renderer lint | Run npm run lint | Clean | PASS',
            'CLOUD-06 | Desktop build | Run npm run build:desktop | Electron Vite production build completed | PASS',
            'CLOUD-07 | Valid Supabase connection | Enter real project credentials and click Test Connection in packaged app | SELECT 1 succeeds | NOT TESTED; no authenticated connection succeeded in this environment.',
            'CLOUD-08 | Secure persistence restart | Save valid configuration, restart packaged app, reopen page | Metadata restored and password remains masked | NOT TESTED interactively.',
        ]),
    ]),
    page('Cloud Database Configuration Validation', [
        ('E. Proof of validation', [
            'The actual backend test suite executed 15 passing tests, including headquarters authorization and password non-disclosure checks for the cloud configuration endpoint.',
            'The actual desktop lint and production build completed after adding the Supabase configuration UI, preload bridge and main-process secure storage path.',
            'No fabricated Supabase success is reported. The valid-credential connection test remains pending until the exact working Supabase Session Pooler URI and password are entered in the installed application.',
        ]),
        ('F. Outstanding issues', [
            'This repository does not yet contain the separate multi-step installer shell shown in the reference image; the feature is available in the existing Company Setup shell as Cloud Database (Supabase).',
            'Actual cloud migration and SQLite-to-Supabase synchronization remain separate deployment phases. A customer build must not ship central PostgreSQL administrator credentials.',
            'Before production release, run a packaged macOS and Windows interactive test of safeStorage, then run the actual Supabase migration using the tested backend-only configuration.',
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
