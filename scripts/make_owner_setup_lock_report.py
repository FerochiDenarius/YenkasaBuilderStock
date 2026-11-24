from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REPORTS = ROOT / 'Validation Reports'
REPORTS.mkdir(exist_ok=True)
PDF = REPORTS / '08_Owner_Setup_Lock_and_Brand_Palette_Validation.pdf'
objects: list[bytes] = []

def esc(value: str) -> str:
    return value.encode('ascii', 'ignore').decode().replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')

def wrap(value: str, width: int = 92) -> list[str]:
    words = value.split(); lines: list[str] = []; line = ''
    for word in words:
        if line and len(line) + len(word) + 1 > width:
            lines.append(line); line = word
        else:
            line = word if not line else f'{line} {word}'
    if line: lines.append(line)
    return lines

def obj(data: bytes) -> int:
    objects.append(data); return len(objects)

font = obj(b'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>')

def page(title: str, sections: list[tuple[str, list[str]]]) -> int:
    lines = [title, 'YenkasaBuildersStock | Validation date: 24 November 2026', '']
    for heading, entries in sections:
        lines += [heading, '-' * min(92, max(20, len(heading)))]
        for entry in entries: lines.extend(wrap(entry))
        lines.append('')
    commands = ['BT', '/F1 15 Tf', '36 806 Td']
    for index, line in enumerate(lines):
        if index == 1: commands += ['/F1 8 Tf', '0 -18 Td']
        elif line[:3] in {'A. ', 'B. ', 'C. ', 'D. ', 'E. '}:
            commands += ['0 -8 Td', '/F1 10 Tf']
        elif index > 1: commands += ['/F1 8 Tf']
        commands += [f'({esc(line)}) Tj', '0 -11 Td']
    commands.append('ET')
    stream = '\n'.join(commands).encode()
    return obj(f'<< /Length {len(stream)} /Resources << /Font << /F1 {font} 0 R >> >> >>\nstream\n'.encode() + stream + b'\nendstream')

content = [
    page('Owner Setup Lock and Brand Palette', [
        ('A. Page Information', [
            'Scope: Company Setup access after owner credentials are created, owner login/logout session handling, branch-session isolation, and saved branding color propagation.',
            'Implementation: backend owner session tokens with initial-setup exception, owner login/logout endpoints, protected setup API headers, renderer setup lock, Owner Login screen, and shared CSS brand variables applied from the saved company record.',
            'Relevant source files: services/local-api/app/main.py; apps/desktop/src/renderer/Dashboard.tsx; apps/desktop/src/renderer/OwnerLoginPage.tsx; apps/desktop/src/renderer/OwnerAccountPage.tsx; apps/desktop/src/renderer/ConnectedSetup.tsx; apps/desktop/src/renderer/api.ts; apps/desktop/src/renderer/styles.css; packages/contracts/src/index.ts.',
        ]),
        ('B. Functionality Checklist', [
            'Initial setup remains available while no owner password exists | IMPLEMENTED.',
            'Owner credential creation returns a temporary owner session so setup can continue | IMPLEMENTED.',
            'After credentials exist, Company Setup is hidden unless a valid owner session exists | IMPLEMENTED in renderer and backend.',
            'Branch Manager, Sales, Cashier and Stock sessions cannot call owner setup APIs | PASS in backend test.',
            'Owner logout removes local owner session and invalidates the backend token | PASS in backend test.',
            'Saved primary, secondary and accent colors populate shared CSS variables and reload from SQLite | IMPLEMENTED; live visual screenshot pending.',
        ]),
    ]),
    page('Owner Setup Lock and Brand Palette', [
        ('C. Backend Integration and Authorization', [
            'POST /api/owner/login verifies the stored password hash and issues an in-memory owner session token. Plaintext passwords are never returned or stored.',
            'POST /api/owner/logout invalidates the token and records an audit event. Protected owner routes accept X-Owner-Session, not a forged branch role header, after credentials exist.',
            'GET /api/owner/status returns only ownerExists/passwordSet so the shell can choose locked versus initial-setup navigation without disclosing credentials.',
            'Company, owner, branch, device, company-user, audit and cloud setup operations require owner authentication after setup completion. Initial setup is permitted only while no owner password exists.',
            'The renderer loads saved company brandColor, secondaryColor and accentColor and applies them to the shared primary UI color variables. Branding preview and document-specific colors remain controlled by their saved template settings.',
        ]),
        ('D. Test Results', [
            'SEC-01 | First-time owner security save | Save owner credentials during initial setup | Password hash persists and an owner session is returned | PASS',
            'SEC-02 | Owner login | Valid username/password | Owner session token returned; incorrect credentials rejected | PASS',
            'SEC-03 | Role mismatch isolation | Branch manager headers call owner security endpoint | HTTP 403 | PASS',
            'SEC-04 | Forged HQ header | X-Role HQ_ADMIN after owner password exists | HTTP 403 | PASS',
            'SEC-05 | Owner logout | Reuse the prior owner token after logout | HTTP 403 | PASS',
            'SEC-06 | Backend regression | services/local-api/.venv/bin/pytest -q tests/python/test_local_api.py | 17 passed | PASS',
            'SEC-07 | Renderer lint | npm run lint | Clean | PASS',
            'SEC-08 | Desktop build | npm run build:desktop | Electron Vite production build completed | PASS',
            'SEC-09 | Running Electron visual lock check | Attach to existing CDP window and inspect navigation | CDP attachment did not complete in this environment | NOT TESTED',
        ]),
    ]),
    page('Owner Setup Lock and Brand Palette', [
        ('E. Proof of Validation', [
            'The 17-test local API run exercised owner credential creation, owner login, branch login, branch isolation, forged HQ-header rejection and owner-token invalidation. The output was captured from the actual FastAPI TestClient against SQLite.',
            'The renderer lint and Electron Vite production build completed against the modified TypeScript and CSS. The brand propagation implementation is in the compiled renderer bundle.',
            'No screenshot or live Electron result is fabricated. A running Electron CDP target was present, but Playwright attachment stalled; the visual sidebar and color-change check remains explicitly NOT TESTED.',
        ]),
        ('F. Outstanding Issues', [
            'Run the owner lock flow in the installed/running desktop application: branch login, branch logout, verify Company Setup is hidden, Owner Login, verify setup reappears, Owner Logout, verify it locks again.',
            'Change the saved brand colors in Business Branding and capture a before/after screenshot across the sidebar, primary buttons and document preview.',
            'The existing local owner session store is process-memory scoped; restarting the local API intentionally requires owner login again. A production deployment may replace this with a secure OS-backed session mechanism.',
        ]),
    ]),
]

pages = obj(b'')
refs = [obj(f'<< /Type /Page /Parent {pages} 0 R /MediaBox [0 0 595 842] /Contents {ref} 0 R >>'.encode()) for ref in content]
objects[pages - 1] = f"<< /Type /Pages /Kids [{' '.join(f'{ref} 0 R' for ref in refs)}] /Count {len(refs)} >>".encode()
catalog = obj(f'<< /Type /Catalog /Pages {pages} 0 R >>'.encode())

with PDF.open('wb') as handle:
    handle.write(b'%PDF-1.4\n'); offsets = [0]
    for number, data in enumerate(objects, 1):
        offsets.append(handle.tell()); handle.write(f'{number} 0 obj\n'.encode() + data + b'\nendobj\n')
    xref = handle.tell(); handle.write(f'xref\n0 {len(objects) + 1}\n0000000000 65535 f \n'.encode())
    for offset in offsets[1:]: handle.write(f'{offset:010d} 00000 n \n'.encode())
    handle.write(f'trailer\n<< /Size {len(objects) + 1} /Root {catalog} 0 R >>\nstartxref\n{xref}\n%%EOF\n'.encode())
print(PDF)
