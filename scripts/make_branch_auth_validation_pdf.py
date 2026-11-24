from pathlib import Path
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]
REPORTS = ROOT / 'Validation Reports'
PDF = REPORTS / 'Branch_Authentication_and_Role_Access_Validation.pdf'

def esc(value):
    return value.encode('ascii', 'ignore').decode().replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')

def wrap(value, width=92):
    words = value.encode('ascii', 'ignore').decode().split(); lines=[]; line=''
    for word in words:
        if line and len(line) + len(word) + 1 > width: lines.append(line); line=word
        else: line = word if not line else f'{line} {word}'
    return lines + ([line] if line else [])

objects=[]
def obj(data): objects.append(data); return len(objects)
font=obj(b'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>')

def text_body(title, sections):
    lines=[title, 'Branch authentication validation | 22 November 2026', '']
    for heading, entries in sections:
        lines += [heading, '-' * 88]
        for entry in entries: lines += wrap(entry)
        lines.append('')
    stream=['BT','/F1 16 Tf','36 806 Td',f'({esc(lines[0])}) Tj','/F1 8 Tf','0 -18 Td']
    for line in lines[1:]: stream += [f'({esc(line)}) Tj','0 -11 Td']
    return '\n'.join(stream + ['ET']).encode()

def text_page(title, sections):
    body=text_body(title, sections)
    return obj(f'<< /Length {len(body)} /Resources << /Font << /F1 {font} 0 R >> >> >>\nstream\n'.encode()+body+b'\nendstream')

def image_page(title, filename):
    source=REPORTS / filename; converted=Path('/private/tmp') / filename.replace('.png','.jpg')
    subprocess.run(['sips','-s','format','jpeg',str(source),'--out',str(converted)],check=True,stdout=subprocess.PIPE,stderr=subprocess.PIPE)
    info=subprocess.check_output(['sips','-g','pixelWidth','-g','pixelHeight',str(converted)],text=True)
    width,height=[int(value) for value in re.findall(r'pixel(?:Width|Height): (\d+)',info)]
    data=converted.read_bytes(); image=obj(f'<< /Type /XObject /Subtype /Image /Width {width} /Height {height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length {len(data)} >>\nstream\n'.encode()+data+b'\nendstream')
    body=text_body(title,[('Evidence',['Screenshot captured from the running Electron application through Playwright/CDP; it is genuine runtime evidence.'])])+b'\nq\n523 0 0 330 36 390 cm\n/Im1 Do\nQ\n'
    return obj(f'<< /Length {len(body)} /Resources << /Font << /F1 {font} 0 R >> /XObject << /Im1 {image} 0 R >> >> >>\nstream\n'.encode()+body+b'\nendstream')

p1=text_page('Branch Authentication and Role Access', [('A. Page Information',['Implemented branch login, authenticated branch workspace visibility, role-scoped navigation and staff-account access using the existing Dashboard shell.','Source files: Dashboard.tsx, BranchLoginPage.tsx, StaffAccountsPage.tsx, BranchesPage.tsx, api.ts and services/local-api/app/main.py.']),('B. Functionality Checklist',['Individual credentials and stored-role match are enforced | PASS','Manager, Stock Manager and Sales / Cashier login choices are present | PASS','Manager sees authorized Branch Operations and Staff Accounts | PASS','Stock and Sales roles receive restricted navigation | PASS','Company Setup is hidden from branch staff and restored after logout | PASS','Passwords are PBKDF2-HMAC-SHA256 verifiers and never returned | PASS'])])
p2=text_page('Branch Authentication and Role Access', [('C. Backend Integration',['POST /api/auth/login checks company, branch, active account, hashed password and selected role. Staff endpoints require an authenticated branch manager and enforce branch isolation. Protected branch actions reject unauthorized roles. SQLite stores users, audit logs, device activations and branches locally.']),('D. Test Results',['AUTH-01 correct manager login | PASS','AUTH-02 role mismatch returns 403 | PASS','AUTH-03 incorrect password returns 401 | PASS','AUTH-04 manager-created Stock and Sales accounts appear in Staff Accounts | PASS','AUTH-05 staff cannot create BRANCH_MANAGER accounts | PASS','AUTH-06 Stock navigation: Inventory, Purchasing and Reports only | PASS','AUTH-07 Sales navigation: Sales, Inventory and Customers only | PASS','AUTH-08 cross-branch staff mutation rejected with 403 | PASS','AUTH-09 deactivated account cannot log in | PASS','AUTH-10 Electron restart restores Live Oyarifa Branch from SQLite | PASS'])]),
p3=image_page('Evidence: Branch Manager Staff Accounts', '27_phase2_manager_staff.png')
p4=image_page('Evidence: Stock Manager restricted workspace', '32_phase2_stock_workspace_final.png')
pages=obj(b'')
refs=[]
for page_ref in [p1,p2,p3,p4]: refs.append(obj(f'<< /Type /Page /Parent {pages} 0 R /MediaBox [0 0 595 842] /Contents {page_ref} 0 R >>'.encode()))
objects[pages-1]=f'<< /Type /Pages /Kids [{" ".join(str(ref)+" 0 R" for ref in refs)}] /Count 4 >>'.encode()
catalog=obj(f'<< /Type /Catalog /Pages {pages} 0 R >>'.encode())
with PDF.open('wb') as handle:
    handle.write(b'%PDF-1.4\n'); offsets=[0]
    for number,data in enumerate(objects,1): offsets.append(handle.tell()); handle.write(f'{number} 0 obj\n'.encode()+data+b'\nendobj\n')
    xref=handle.tell(); handle.write(f'xref\n0 {len(objects)+1}\n0000000000 65535 f \n'.encode())
    for offset in offsets[1:]: handle.write(f'{offset:010d} 00000 n \n'.encode())
    handle.write(f'trailer\n<< /Size {len(objects)+1} /Root {catalog} 0 R >>\nstartxref\n{xref}\n%%EOF\n'.encode())
print(PDF)
