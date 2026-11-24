from pathlib import Path
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]; REPORTS = ROOT / "Validation Reports"; PDF = REPORTS / "04_Branch_Setup_Validation.pdf"
def clean(s): return s.encode("ascii", "ignore").decode()
def esc(s): return clean(s).replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")
def wrap(s, width=96):
    words = clean(s).split(); lines=[]; line=""
    for word in words:
        if line and len(line)+len(word)+1 > width: lines.append(line); line=word
        else: line=word if not line else f"{line} {word}"
    return lines + ([line] if line else [])
objects=[]
def obj(data): objects.append(data); return len(objects)
font=obj(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>")
name="04_branch_setup_saved.png"; out=Path("/private/tmp/04_branch_setup_saved.jpg")
subprocess.run(["sips","-s","format","jpeg",str(REPORTS/name),"--out",str(out)],check=True,stdout=subprocess.PIPE,stderr=subprocess.PIPE)
info=subprocess.check_output(["sips","-g","pixelWidth","-g","pixelHeight",str(out)],text=True); width,height=[int(x) for x in re.findall(r"pixel(?:Width|Height): (\d+)",info)]; data=out.read_bytes(); image=obj(f"<< /Type /XObject /Subtype /Image /Width {width} /Height {height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length {len(data)} >>\nstream\n".encode()+data+b"\nendstream")
def content(title, sections):
    lines=[title,"Branch Setup | Validation date: 21 November 2026 | PAGE VALIDATED",""]
    for heading,items in sections:
        lines += [heading,"-"*min(92,max(len(heading),20))]
        for item in items: lines += wrap(item)
        lines.append("")
    stream=["BT","/F1 16 Tf","36 806 Td",f"({esc(lines[0])}) Tj","/F1 8 Tf","0 -18 Td"]
    for line in lines[1:]:
        if line.startswith(("A. ","B. ","C. ","D. ","E. ","F. ")): stream += ["0 -8 Td","/F1 11 Tf",f"({esc(line)}) Tj","/F1 8 Tf","0 -13 Td"]
        else: stream += [f"({esc(line)}) Tj","0 -11 Td"]
    return "\n".join(stream+["ET"]).encode()
def page(body, xobject=False):
    resources=f"<< /Font << /F1 {font} 0 R >>"+(f" /XObject << /Im1 {image} 0 R >>" if xobject else "")+" >>"
    return obj(f"<< /Length {len(body)} /Resources {resources} >>\nstream\n".encode()+body+b"\nendstream")
p1=content("Branch Setup Validation Report",[("A. Page Information",["Implementation summary: replaced static sample rows with controlled branch form state, HQ-authorized POST /api/branches, SQLite persistence, dynamic statistics, search, reset, and validation.","Relevant source files: apps/desktop/src/renderer/BranchesPage.tsx; apps/desktop/src/renderer/api.ts; services/local-api/app/main.py; services/local-api/alembic/versions/0004_branches.py; tests/python/test_local_api.py."]),("B. Functionality Checklist",["Branch Name, Code, Location, Manager | Required inputs | PASS","Phone Number | Optional controlled input | PASS","Create Branch | HQ role header, API write, list refresh | PASS","Reset | Clears unsaved form | PASS","Search branches | Filters list by name/code/location/manager | PASS","Stats | Recompute total, active, suspended, users | PASS"])])
p2=content("Branch Setup Validation Report",[("C. Backend Integration",["GET /api/branches lists company_id=1 records. POST /api/branches requires X-Role: HQ_ADMIN, validates required fields, rejects duplicate codes with 409, and stores the branch in SQLite.","Branches carry company_id and status/users_count fields. Unauthorized mutation is rejected at the backend boundary."]),("D. Test Results",["BR-UI-01 | Required validation | Click Create with empty form | Error | Branch name, code, location and manager are required | PASS","BR-UI-02 | Create | Fill valid form; Create Branch | Row and success status | Validation Branch created locally in SQLite | PASS","BR-UI-03 | Search | Enter Validation | Matching row only | Validation Branch displayed | PASS","BR-UI-04 | Reset | Change form; Reset | Clear form | Form reset | PASS","BR-API-01 | Unauthorized mutation | POST without X-Role | 403 | Headquarters administrator permission required | PASS","BR-API-02 | Duplicate code | POST VB twice | 409 | Branch code already exists | PASS","BR-DB-01 | Persistence | GET after API restart | Saved row reloads | SQLite-backed list | PASS","BR-REG-01 | Regression | Build, pytest, lint | No regressions | Build passed; 6 backend tests; lint passed | PASS","BR-CLOUD-01 | PostgreSQL sync | Inspect architecture | Central sync | Not implemented for this page | NOT TESTED"])])
p3=content("Branch Setup Validation Report",[("E. Proof of Validation",["Original screenshot captured from running Electron after creating and searching a branch. Live API log showed GET /api/branches 200 and POST /api/branches 200."]),("F. Outstanding Issues",["Branch authentication/session context and central PostgreSQL synchronization remain pending. HQ-only mutation is enforced by the current X-Role boundary and must later be replaced with signed authorization."])])+b"\nq\n523 0 0 330 36 390 cm\n/Im1 Do\nQ\n"
p1,p2,p3=page(p1),page(p2),page(p3,True); pages=obj(b""); page_objects=[obj(f"<< /Type /Page /Parent {pages} 0 R /MediaBox [0 0 595 842] /Contents {p} 0 R >>".encode()) for p in (p1,p2,p3)]; objects[pages-1]=f"<< /Type /Pages /Kids [{' '.join(f'{p} 0 R' for p in page_objects)}] /Count 3 >>".encode(); catalog=obj(f"<< /Type /Catalog /Pages {pages} 0 R >>".encode())
with PDF.open("wb") as handle:
    handle.write(b"%PDF-1.4\n"); offsets=[0]
    for number,data in enumerate(objects,1): offsets.append(handle.tell()); handle.write(f"{number} 0 obj\n".encode()+data+b"\nendobj\n")
    xref=handle.tell(); handle.write(f"xref\n0 {len(objects)+1}\n0000000000 65535 f \n".encode()); [handle.write(f"{offset:010d} 00000 n \n".encode()) for offset in offsets[1:]]; handle.write(f"trailer\n<< /Size {len(objects)+1} /Root {catalog} 0 R >>\nstartxref\n{xref}\n%%EOF\n".encode())
print(PDF)
