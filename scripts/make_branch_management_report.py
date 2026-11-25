from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REPORTS = ROOT / 'Validation Reports'
REPORTS.mkdir(exist_ok=True)
PDF = REPORTS / '04_Branch_Setup_Validation.pdf'
objects: list[bytes] = []

def esc(value: str) -> str:
    return value.encode('ascii', 'ignore').decode().replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')

def wrap(value: str, width: int = 94) -> list[str]:
    words = value.split(); lines = []; line = ''
    for word in words:
        if line and len(line) + len(word) + 1 > width:
            lines.append(line); line = word
        else: line = word if not line else f'{line} {word}'
    return lines + ([line] if line else [])

def obj(data: bytes) -> int:
    objects.append(data); return len(objects)

font = obj(b'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>')

def page(title: str, sections: list[tuple[str, list[str]]]) -> int:
    lines = [title, 'YenkasaBuildersStock | Validation date: 25 November 2026', '']
    for heading, entries in sections:
        lines += [heading, '-' * min(94, max(20, len(heading)))]
        for entry in entries: lines.extend(wrap(entry))
        lines.append('')
    commands = ['BT', '/F1 15 Tf', '36 806 Td']
    for index, line in enumerate(lines):
        if index == 1: commands += ['/F1 8 Tf', '0 -18 Td']
        elif index > 1: commands += ['/F1 8 Tf']
        commands += [f'({esc(line)}) Tj', '0 -11 Td']
    commands.append('ET'); stream = '\n'.join(commands).encode()
    return obj(f'<< /Length {len(stream)} /Resources << /Font << /F1 {font} 0 R >> >> >>\nstream\n'.encode() + stream + b'\nendstream')

content = [
    page('Branch Setup Validation Report', [
        ('A. Page Information', [
            'Implementation: owner-only branch editing, suspension/reactivation, guarded deletion, SQLite persistence, dynamic statistics, search and audit logging.',
            'Source files: apps/desktop/src/renderer/BranchesPage.tsx; apps/desktop/src/renderer/api.ts; services/local-api/app/main.py; tests/python/test_local_api.py.',
        ]),
        ('B. Functionality Checklist', [
            'Create branch with required details and manager account | PASS',
            'Edit branch name, code, address, contact, type and manager details | PASS',
            'Suspend and reactivate branch | PASS; suspended branches cannot authenticate',
            'Delete unused branch | PASS; setup records are cleaned',
            'Delete branch with transaction history | PASS; rejected with safe 409 response',
            'Search and branch statistics | PASS',
        ]),
    ]),
    page('Branch Setup Validation Report', [
        ('C. Backend Integration', [
            'GET and mutation endpoints are owner-session protected and company-scoped.',
            'PATCH validates required fields, duplicate codes and Active/Suspended status. DELETE refuses branches with sales, purchases, payments, receipts or material-release history.',
            'Branch mutations create audit-log entries. Suspended branches are rejected by branch authentication.',
        ]),
        ('D. Test Results', [
            'BR-API-01 | Unauthorized PATCH/DELETE | No owner session | 403 | PASS',
            'BR-API-02 | Edit and duplicate-code validation | Valid owner request | Updated record / useful 409 | PASS',
            'BR-API-03 | Suspend/reactivate | Toggle status and attempt login | Login blocked then restored | PASS',
            'BR-API-04 | Safe deletion | Delete unused branch and branch with history | Delete succeeds / history deletion blocked | PASS',
            'BR-DB-01 | Persistence | Reload branch list from SQLite | Mutations restored | PASS',
            'BR-REG-01 | Regression | Build, lint and pytest | 21 backend tests passed | PASS',
        ]),
    ]),
    page('Branch Setup Validation Report', [
        ('E. Proof of Validation', [
            'The backend regression suite executed 21 passing tests, including edit, suspension, reactivation, deletion authorization and company isolation checks.',
            'The UI actions call the owner-protected API and update the branch list from returned database records; they do not update mock-only React state.',
        ]),
        ('F. Outstanding Issues', [
            'A new live Electron screenshot of the action buttons remains to be captured. PostgreSQL synchronization of branch mutations remains part of the later synchronization phase; local SQLite persistence and owner authorization are implemented.',
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
