from pathlib import Path
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]
REPORTS = ROOT / 'Validation Reports'
PDF = REPORTS / '05_Users_and_Roles_Validation.pdf'

def esc(value):
    return value.encode('ascii', 'ignore').decode().replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')

def wrap(value, width=92):
    words = value.encode('ascii', 'ignore').decode().split(); lines=[]; line=''
    for word in words:
        if line and len(line)+len(word)+1 > width: lines.append(line); line=word
        else: line = word if not line else line+' '+word
    return lines + ([line] if line else [])

objects=[]
def obj(data):
    objects.append(data)
    return len(objects)

font=obj(b'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>')

def make_body(title, sections):
    lines=[title, 'Users & Roles | Validation date: 22 November 2026', '']
    for heading, items in sections:
        lines += [heading, '-'*88]
        for item in items: lines += wrap(item)
        lines.append('')
    stream=['BT','/F1 16 Tf','36 806 Td',f'({esc(lines[0])}) Tj','/F1 8 Tf','0 -18 Td']
    for line in lines[1:]: stream += [f'({esc(line)}) Tj','0 -11 Td']
    return '\n'.join(stream+['ET']).encode()

def text_page(title, sections):
    data=make_body(title, sections)
    return obj(f'<< /Length {len(data)} /Resources << /Font << /F1 {font} 0 R >> >> >>\nstream\n'.encode()+data+b'\nendstream')

def evidence_page(title, filename):
    source=REPORTS/filename; converted=Path('/private/tmp')/filename.replace('.png','.jpg')
    subprocess.run(['sips','-s','format','jpeg',str(source),'--out',str(converted)],check=True,stdout=subprocess.PIPE,stderr=subprocess.PIPE)
    meta=subprocess.check_output(['sips','-g','pixelWidth','-g','pixelHeight',str(converted)],text=True)
    width,height=[int(x) for x in re.findall(r'pixel(?:Width|Height): (\d+)',meta)]
    raw=converted.read_bytes(); image=obj(f'<< /Type /XObject /Subtype /Image /Width {width} /Height {height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length {len(raw)} >>\nstream\n'.encode()+raw+b'\nendstream')
    data=make_body(title,[('E. Proof of Validation',['Runtime screenshot captured from Electron with Playwright/CDP during the Users & Roles test flow.'])])+b'\nq\n523 0 0 330 36 390 cm\n/Im1 Do\nQ\n'
    return obj(f'<< /Length {len(data)} /Resources << /Font << /F1 {font} 0 R >> /XObject << /Im1 {image} 0 R >> >> >>\nstream\n'.encode()+data+b'\nendstream')

p1=text_page('Users & Roles Validation',[('A. Page Information',['Implemented headquarters user oversight and branch-manager staff management while preserving the existing sidebar and routing. Sources: StaffAccountsPage.tsx, api.ts, Dashboard.tsx, services/local-api/app/main.py and tests/python/test_local_api.py.']),('B. Functionality Checklist',['Owner user list with branch, role, status and filters | PASS','Owner audit log tab | PASS','Branch Manager creates only Stock Manager and Sales / Cashier accounts | PASS','Edit staff name and email | PASS','Reset staff password without exposing plaintext | PASS','Deactivate and reactivate staff account | PASS','Search, role filter and status filter | PASS'])])
p2=text_page('Users & Roles Validation',[('C. Backend Integration',['GET /api/company-users requires X-Role HQ_ADMIN. Staff reads and writes require authenticated X-User-Id and X-Branch-Id. PATCH /api/staff/{id} and POST /api/staff/{id}/reset-password enforce manager role and branch isolation. Audit events are written to audit_logs.']),('D. Test Results',['USR-01 owner list loads from SQLite | PASS','USR-02 owner audit list loads from API | PASS','USR-03 manager role policy rejects BRANCH_MANAGER staff role | PASS','USR-04 manager edit persists | PASS','USR-05 reset password persists hashed verifier and success status | PASS','USR-06 deactivate prevents login | PASS','USR-07 reactivate restores state | PASS','USR-08 cross-branch operation rejected | PASS','USR-09 build, lint and 8 backend tests | PASS'])])
p3=evidence_page('Users & Roles Evidence: Owner Oversight','35_users_roles_owner.png')
p4=evidence_page('Users & Roles Evidence: Branch Manager Controls','37_users_roles_manager_controls.png')
pages=obj(b'')
refs=[]
for page_ref in [p1,p2,p3,p4]: refs.append(obj(f'<< /Type /Page /Parent {pages} 0 R /MediaBox [0 0 595 842] /Contents {page_ref} 0 R >>'.encode()))
objects[pages-1]=f'<< /Type /Pages /Kids [{" ".join(str(r)+" 0 R" for r in refs)}] /Count 4 >>'.encode()
catalog=obj(f'<< /Type /Catalog /Pages {pages} 0 R >>'.encode())
with PDF.open('wb') as handle:
    handle.write(b'%PDF-1.4\n'); offsets=[0]
    for number,data in enumerate(objects,1): offsets.append(handle.tell()); handle.write(f'{number} 0 obj\n'.encode()+data+b'\nendobj\n')
    xref=handle.tell(); handle.write(f'xref\n0 {len(objects)+1}\n0000000000 65535 f \n'.encode())
    for offset in offsets[1:]: handle.write(f'{offset:010d} 00000 n \n'.encode())
    handle.write(f'trailer\n<< /Size {len(objects)+1} /Root {catalog} 0 R >>\nstartxref\n{xref}\n%%EOF\n'.encode())
print(PDF)
