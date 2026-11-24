from pathlib import Path
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]
REPORTS = ROOT / 'Validation Reports'
PDF = REPORTS / 'Phase1_Branch_Login_UI_Validation.pdf'

def clean(value): return value.encode('ascii', 'ignore').decode()
def esc(value): return clean(value).replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')
def wrap(value, width=92):
    words = clean(value).split(); lines = []; line = ''
    for word in words:
        if line and len(line) + len(word) + 1 > width: lines.append(line); line = word
        else: line = word if not line else f'{line} {word}'
    return lines + ([line] if line else [])

objects = []
def obj(data): objects.append(data); return len(objects)
font = obj(b'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>')

def image_object(filename):
    source = REPORTS / filename; converted = Path('/private/tmp') / filename.replace('.png', '.jpg')
    subprocess.run(['sips', '-s', 'format', 'jpeg', str(source), '--out', str(converted)], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    metadata = subprocess.check_output(['sips', '-g', 'pixelWidth', '-g', 'pixelHeight', str(converted)], text=True)
    width, height = [int(value) for value in re.findall(r'pixel(?:Width|Height): (\d+)', metadata)]
    data = converted.read_bytes()
    return obj(f'<< /Type /XObject /Subtype /Image /Width {width} /Height {height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length {len(data)} >>\nstream\n'.encode() + data + b'\nendstream')

def text_page(title, sections):
    lines = [title, 'Phase 1 Branch Login UI | Validation date: 22 November 2026', '']
    for heading, entries in sections:
        lines += [heading, '-' * min(92, max(20, len(heading)))]
        for entry in entries: lines += wrap(entry)
        lines.append('')
    stream = ['BT', '/F1 16 Tf', '36 806 Td', f'({esc(lines[0])}) Tj', '/F1 8 Tf', '0 -18 Td']
    for line in lines[1:]:
        if line.startswith(('A. ', 'B. ', 'C. ', 'D. ', 'E. ', 'F. ')):
            stream += ['0 -8 Td', '/F1 11 Tf', f'({esc(line)}) Tj', '/F1 8 Tf', '0 -13 Td']
        else: stream += [f'({esc(line)}) Tj', '0 -11 Td']
    return '\n'.join(stream + ['ET']).encode()

def image_page(title, image_ref, image_name):
    image = image_object(image_name)
    body = text_page(title, [('E. Proof of Validation', ['Screenshot captured from the running Electron application through the live Playwright/CDP test. It is evidence of the rendered application, not a mockup.'])])
    body += f'\nq\n523 0 0 330 36 390 cm\n/Im1 Do\nQ\n'.encode()
    return obj(f'<< /Length {len(body)} /Resources << /Font << /F1 {font} 0 R >> /XObject << /Im1 {image} 0 R >> >> >>\nstream\n'.encode() + body + b'\nendstream')

p1 = obj(b'')
p1_body = text_page('Phase 1 Branch Login UI Validation', [
    ('A. Page Information', ['Page: Branch Login and pre-authentication sidebar. Implementation summary: reused the existing Dashboard sidebar and routing, placed Branch Login as a separate first navigation item, kept Company Setup expandable below it, and removed the duplicate promotional Branch Operations shell.', 'Relevant source files: apps/desktop/src/renderer/Dashboard.tsx; apps/desktop/src/renderer/BranchLoginPage.tsx; apps/desktop/src/renderer/styles.css; apps/desktop/src/renderer/api.ts.']),
    ('B. Functionality Checklist', ['Standalone Branch Login navigation item appears first when a configured branch exists | PASS', 'Company Setup remains below the divider and expands/collapses | PASS', 'Business Information, Branding, Branches, Users & Roles, Owner Account, Device Activation and System Settings remain accessible | PASS', 'Branch Login shows loaded branch and company data | PASS', 'Login As selector includes Branch Manager, Stock Manager and Sales / Cashier | PASS', 'Username or Email, Password visibility toggle, Remember Me, Forgot Password and Log In are present | PASS', 'No duplicate sidebar or green promotional panel is rendered | PASS', 'No activated branch shows a clear activation message and disables Log In | IMPLEMENTED']),
    ('C. Backend Integration', ['Branch Login loads active branch records from GET /api/branches and authenticates through POST /api/auth/login. The selected role is checked against the stored account role; it does not grant permissions independently. Credentials are stored as PBKDF2-HMAC-SHA256 verifiers and are never returned in API responses.', 'Company Setup data remains in the existing SQLite-backed local API. No destructive migration was introduced.']),
])
objects[p1-1] = f'<< /Length {len(p1_body)} /Resources << /Font << /F1 {font} 0 R >> >> >>\nstream\n'.encode() + p1_body + b'\nendstream'

p2_body = text_page('Phase 1 Branch Login UI Validation', [
    ('D. Test Results', ['PH1-01 | Sidebar order | Launch Electron with configured branch | Branch Login first, Company Setup below divider | PASS', 'PH1-02 | Protected navigation | Inspect sidebar before branch authentication | Dashboard, Sales, Inventory, Purchasing, Customers, Reports, Branch Operations and Staff Accounts absent | PASS', 'PH1-03 | Setup collapse | Click Company Setup twice | Submenu hides then returns | PASS', 'PH1-04 | Setup navigation | Open all seven setup pages | Each page opens successfully | PASS', 'PH1-05 | Cross-page visibility | Open every setup page without branch session | Branch Operations and protected operational items remain absent | PASS', 'PH1-06 | Shell reuse | Inspect running DOM | One dashboard sidebar, no branch-login hero, one Branch Login content region | PASS', 'PH1-07 | Branch data | Open login page | Stored Live Oyarifa Branch and company name displayed | PASS', 'PH1-08 | Invalid login | Submit incorrect credentials | Useful alert is shown | PASS', 'PH1-09 | Build and regression | npm build, lint, pytest | Build/lint pass; 8 backend tests pass | PASS']),
    ('F. Outstanding Issues', ['Cloud PostgreSQL synchronization and signed owner authentication remain future work. Phase 1 intentionally stops at the sidebar/login UI and pre-authentication visibility rules; no new branch workspace design was added in this phase.', 'The current local API authorization boundary is suitable for the offline MVP test environment but should be replaced with signed session/token validation before production deployment.']),
])
p2 = obj(f'<< /Length {len(p2_body)} /Resources << /Font << /F1 {font} 0 R >> >> >>\nstream\n'.encode() + p2_body + b'\nendstream')

p3 = image_page('Phase 1 Evidence: corrected Branch Login', 'Im1', '24_phase1_branch_login_final.png')
p4 = image_page('Phase 1 Evidence: setup page remains protected', 'Im1', '25_phase1_business_information_no_ops.png')
pages = obj(b'')
page_refs = [obj(f'<< /Type /Page /Parent {pages} 0 R /MediaBox [0 0 595 842] /Contents {ref} 0 R >>'.encode()) for ref in [p1, p2, p3, p4]]
objects[pages - 1] = f'<< /Type /Pages /Kids [{" ".join(f"{ref} 0 R" for ref in page_refs)}] /Count 4 >>'.encode()
catalog = obj(f'<< /Type /Catalog /Pages {pages} 0 R >>'.encode())

with PDF.open('wb') as handle:
    handle.write(b'%PDF-1.4\n'); offsets = [0]
    for number, data in enumerate(objects, 1): offsets.append(handle.tell()); handle.write(f'{number} 0 obj\n'.encode() + data + b'\nendobj\n')
    xref = handle.tell(); handle.write(f'xref\n0 {len(objects) + 1}\n0000000000 65535 f \n'.encode())
    for offset in offsets[1:]: handle.write(f'{offset:010d} 00000 n \n'.encode())
    handle.write(f'trailer\n<< /Size {len(objects) + 1} /Root {catalog} 0 R >>\nstartxref\n{xref}\n%%EOF\n'.encode())
print(PDF)
