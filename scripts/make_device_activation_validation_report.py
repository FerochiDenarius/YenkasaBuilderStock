from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PDF = ROOT / 'Validation Reports' / 'Device_Activation_and_Authentication_Validation.pdf'
objects: list[bytes] = []


def esc(value: str) -> str:
    return value.encode('ascii', 'ignore').decode().replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')


def wrap(value: str, width: int = 94) -> list[str]:
    words, lines, line = value.split(), [], ''
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
    lines = [title, 'YenkasaBuildersStock | Validation date: 26 November 2026', '']
    for heading, entries in sections:
        lines += [heading, '-' * min(94, max(20, len(heading)))]
        for entry in entries:
            lines += wrap(entry)
        lines.append('')
    commands = ['BT', '/F1 15 Tf', '36 806 Td']
    for index, line in enumerate(lines):
        if index == 1:
            commands += ['/F1 8 Tf', '0 -18 Td']
        elif line[:3] in {'A. ', 'B. ', 'C. ', 'D. ', 'E. ', 'F. ', 'G. '}:
            commands += ['0 -8 Td', '/F1 10 Tf']
        elif index > 1:
            commands += ['/F1 8 Tf']
        commands += [f'({esc(line)}) Tj', '0 -11 Td']
    commands.append('ET')
    stream = '\n'.join(commands).encode()
    return obj(f'<< /Length {len(stream)} /Resources << /Font << /F1 {font} 0 R >> >> >>\nstream\n'.encode() + stream + b'\nendstream')


contents = [
    page('Device Activation and Authentication Validation', [
        ('A. Root cause', [
            'The desktop stores owner, branch, staff and device activation records in a local SQLite file under the operating-system-specific Electron userData directory. macOS and Windows therefore use different local databases even on the same physical laptop.',
            'The cloud database Configure/Test flow validates PostgreSQL connectivity but does not synchronize authentication or device records. A successful database connection therefore did not make the macOS owner account available in Windows.',
            'Branch login listed only locally activated branches. The renderer did not send a device identifier, while the backend checked activation only when a device identifier happened to be supplied. This blocked a new Windows installation in the UI but did not provide complete production enforcement at the API boundary.',
        ]),
        ('B. Implementation', [
            'Added backend settings APP_ENV and DEVICE_ACTIVATION_REQUIRED. The bypass exists only when APP_ENV is development/dev/test/testing and DEVICE_ACTIVATION_REQUIRED is explicitly false.',
            'Production is fail-closed: every packaged desktop forces APP_ENV=production and DEVICE_ACTIVATION_REQUIRED=true. The backend also enforces activation in production even if a false value is injected.',
            'Development mode exposes active branches without activating them. Valid credentials remain mandatory. Failed passwords and role mismatches are rejected before activation bypass is considered.',
            'Each development bypass creates a device_activation_bypassed AuditLog record and returns a warning rendered non-blockingly in the authenticated dashboard. No DeviceActivation row is created.',
            'Activated branch responses now carry the matching device ID and the login request submits it, so production verifies an active device belonging to the selected branch.',
        ]),
    ]),
    page('Device Activation and Authentication Validation', [
        ('C. Modified files', [
            'services/local-api/app/main.py - settings, fail-closed enforcement, branch visibility, login validation, warning and audit event.',
            'apps/desktop/src/main/index.ts - packaged production environment lock and explicit development configuration forwarding.',
            'apps/desktop/src/renderer/BranchLoginPage.tsx - submits selected device ID and receives the bypass warning.',
            'apps/desktop/src/renderer/Dashboard.tsx - displays the non-blocking development-device warning.',
            'packages/contracts/src/index.ts - typed device and authentication warning fields.',
            '.env.example - documents the explicit development switch.',
            'tests/python/test_local_api.py - development/production, credentials, audit, no auto-registration and online-configured/offline validation.',
            '.github/workflows/release.yml - Windows installer target uses the self-hosted Windows x64 runner.',
        ]),
        ('D. Automated results', [
            'Backend: 28 passed. Includes owner authentication, wrong password, account status, branch manager, stock manager, sales officer, cashier, combined sales/cashier role, RBAC, permission denial and cross-branch isolation.',
            'Development unactivated device: correct credentials PASS; warning PASS; activity audit PASS; no automatic device activation PASS.',
            'Development invalid credentials: rejected with HTTP 401 PASS.',
            'Production unactivated device: rejected with HTTP 403 even with the flag false PASS.',
            'Production activated device: matching active device accepted PASS; missing/wrong device rejected PASS.',
            'Offline and cloud-configured modes: identical local credential and activation policy results PASS. Cloud URL presence does not change local auth state or create synchronization writes.',
            'Desktop Vitest: 1 passed. Electron Vite production build: PASS.',
        ]),
    ]),
    page('Device Activation and Authentication Validation', [
        ('E. Security preservation', [
            'Branch, owner and staff password verification remains unchanged. Role matching and account-active checks occur before bypass evaluation.',
            'Existing permission middleware, branch scope checks, owner-session requirements, company isolation and activity logging remain active and covered by regression tests.',
            'Device Activation UI, tables, APIs, activation codes, registration and revocation remain present. Development bypass never mutates device registration.',
        ]),
        ('F. Owner login finding', [
            'The Windows owner login failure is expected with the current local-first architecture when credentials were created only in the macOS SQLite database. Recreating/restoring the local owner state is required on Windows.',
            'No owner bypass was introduced because that would weaken owner authentication. Cross-device owner identity synchronization is not implemented by the current cloud configuration feature.',
        ]),
        ('G. Outstanding issues and release status', [
            'True online authentication and cross-OS credential/device synchronization remain an architectural gap. Current online-configured validation confirms policy consistency, not a remote identity provider.',
            'The GitHub Actions workflow is configured for [self-hosted, Windows, X64]. The Windows artifact must be downloaded from the completed Build Installers workflow and clean-machine tested before production distribution.',
            'This development bypass is intentionally unavailable in packaged Windows production installers. A development build must explicitly set DEVICE_ACTIVATION_REQUIRED=false.',
        ]),
    ]),
]

pages = obj(b'')
refs = [obj(f'<< /Type /Page /Parent {pages} 0 R /MediaBox [0 0 595 842] /Contents {content} 0 R >>'.encode()) for content in contents]
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
