from pathlib import Path
import re
import subprocess
from typing import Optional

ROOT = Path(__file__).resolve().parents[1]
REPORTS = ROOT / "Validation Reports"
PDF = REPORTS / "02_Business_Branding_Validation.pdf"

def clean(text: str) -> str:
    return text.encode("ascii", "ignore").decode()

def esc(text: str) -> str:
    return clean(text).replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")

def wrap(text: str, width: int = 96):
    words = clean(text).split()
    lines, line = [], ""
    for word in words:
        if len(line) + len(word) + 1 > width and line:
            lines.append(line)
            line = word
        else:
            line = word if not line else f"{line} {word}"
    if line:
        lines.append(line)
    return lines or [""]

objects = []
def obj(data: bytes) -> int:
    objects.append(data)
    return len(objects)

font = obj(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>")
images = {}
for name in ("02_business_branding_saved.png", "02_business_branding_reloaded.png"):
    out = Path("/private/tmp") / f"{Path(name).stem}.jpg"
    subprocess.run(["sips", "-s", "format", "jpeg", str(REPORTS / name), "--out", str(out)], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    info = subprocess.check_output(["sips", "-g", "pixelWidth", "-g", "pixelHeight", str(out)], text=True)
    width, height = [int(x) for x in re.findall(r"pixel(?:Width|Height): (\d+)", info)]
    data = out.read_bytes()
    images[name] = (obj(f"<< /Type /XObject /Subtype /Image /Width {width} /Height {height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length {len(data)} >>\nstream\n".encode() + data + b"\nendstream"), width, height)

def rows(title: str, sections):
    lines = [title, "Business Branding | Validation date: 21 November 2026 | PAGE VALIDATED", ""]
    for heading, items in sections:
        lines += [heading, "-" * min(92, max(len(heading), 20))]
        for item in items:
            lines += wrap(item)
        lines.append("")
    stream = ["BT", "/F1 16 Tf", "36 806 Td", f"({esc(lines[0])}) Tj", "/F1 8 Tf", "0 -18 Td"]
    for line in lines[1:]:
        if line.startswith(("A. ", "B. ", "C. ", "D. ", "E. ", "F. ")):
            stream += ["0 -8 Td", "/F1 11 Tf", f"({esc(line)}) Tj", "/F1 8 Tf", "0 -13 Td"]
        else:
            stream += [f"({esc(line)}) Tj", "0 -11 Td"]
    stream += ["ET"]
    return "\n".join(stream).encode()

def content_page(content: bytes, xobjects: Optional[dict] = None) -> int:
    resources = f"<< /Font << /F1 {font} 0 R >>"
    if xobjects:
        resources += " /XObject << " + " ".join(f"/{key} {value} 0 R" for key, value in xobjects.items()) + " >>"
    resources += " >>"
    return obj(f"<< /Length {len(content)} /Resources {resources} >>\nstream\n".encode() + content + b"\nendstream")

page1 = rows("Business Branding Validation Report", [
    ("A. Page Information", [
        "Implementation summary: wired the real native file picker through an HTML file input, validated PNG/JPG/WebP type and 2 MB size, previewed selected logos, persisted data URLs in SQLite, and reloaded them after restart.",
        "Relevant source files: apps/desktop/src/renderer/ConnectedSetup.tsx; apps/desktop/src/renderer/api.ts; apps/desktop/src/renderer/styles.css; services/local-api/app/main.py; services/local-api/alembic/versions/0003_logo_data.py; tests/python/test_local_api.py.",
    ]),
    ("B. Functionality Checklist", [
        "Change Logo | Opens native file chooser | PASS in running Electron",
        "PNG/JPG/WebP selection | Preview selected image | PASS",
        "Invalid type and over-size file | Useful upload error | PASS",
        "Replace existing logo | New preview replaces previous | PASS",
        "Remove | Clears preview and persists when saved | PASS",
        "Business name and tagline | Controlled state and save | PASS",
        "Primary/secondary/accent colours | Picker and hex input update preview | PASS",
        "Receipt/invoice/application toggles | aria-pressed state and save | PASS",
        "Application/Receipt/Invoice/Report tabs | Preview changes | PASS",
        "Reset to Default | Restores defaults without an API write | PASS",
        "Save Branding | FastAPI/SQLite persistence | PASS",
    ]),
])

page2 = rows("Business Branding Validation Report", [
    ("C. Backend Integration", [
        "API endpoint: PUT /api/company stores branding fields; GET /api/company reloads them; GET /health verifies the local service.",
        "Database: companies.logo_ref is SQLAlchemy Text and migration 0003 expands the old 500-character column for base64 image data. Data flow is React state -> companyApi -> FastAPI/Pydantic -> SQLite -> reload.",
        "Backend logo rules reject data over 3,000,000 characters and data that is not PNG, JPEG, or WebP base64. PostgreSQL synchronization and authenticated headquarters authorization are not implemented yet.",
    ]),
    ("D. Test Results", [
        "Test ID | Feature | Procedure | Expected | Actual | Result",
        "BR-UI-01 | Native picker | Click Change Logo; wait for Electron filechooser | Picker opens | Filechooser event received from running Electron | PASS",
        "BR-UI-02 | Valid image | Select PNG | Preview appears | data:image/png preview rendered | PASS",
        "BR-UI-03 | Invalid type | Select PDF | Error | Choose a PNG, JPG or WebP image | PASS",
        "BR-UI-04 | File size | Select 2 MB + 1 byte PNG | Error | Logo must be 2 MB or smaller | PASS",
        "BR-UI-05 | Preview tabs | Select Report | Report preview shown | Report preview heading shown | PASS",
        "BR-UI-06 | Toggle | Click Show logo on receipts | State changes | aria-pressed false -> true | PASS",
        "BR-UI-07 | Remove/reset | Remove logo; Reset default | Clear and reset | Logo count 0; Yenkasa Builders restored | PASS",
        "BR-UI-08 | Save | Save Branding | Success | Saved branding locally to SQLite | PASS",
        "BR-DB-01 | Restart | Close/relaunch Electron | Logo reloads | data:image/png logo restored | PASS",
        "BR-API-01 | Backend invalid logo | PUT unsupported logo | 422 | Logo format error returned | PASS",
        "BR-REG-01 | Regression | Build, frontend test, pytest, lint | No regressions | Build passed; 1 frontend, 4 backend tests, lint passed | PASS",
        "BR-CLOUD-01 | Central sync/auth | Inspect architecture | Central sync and authorization | Not implemented for this page | NOT TESTED",
    ]),
])

page3 = rows("Business Branding Validation Report", [
    ("E. Proof of Validation", [
        "Screenshots below are original captures from the running Electron application, not generated mockups.",
        "The saved screenshot shows the logo preview and Branding controls after a successful save. The reloaded screenshot shows the persisted logo after closing and restarting Electron.",
    ]),
    ("F. Outstanding Issues", [
        "Central PostgreSQL synchronization, durable outbox, authenticated company/branch context, and headquarters-only authorization remain pending.",
        "Logo data is stored as a base64 data URL in local SQLite for this MVP; a production central media/object-storage strategy is still required.",
    ]),
])

page3 += b"\nq\n523 0 0 320 36 390 cm\n/Im1 Do\nQ\nq\n523 0 0 320 36 45 cm\n/Im2 Do\nQ\n"
p1 = content_page(page1)
p2 = content_page(page2)
p3 = content_page(page3, {"Im1": images["02_business_branding_saved.png"][0], "Im2": images["02_business_branding_reloaded.png"][0]})
pages = obj(b"")
page_objects = [obj(f"<< /Type /Page /Parent {pages} 0 R /MediaBox [0 0 595 842] /Contents {p} 0 R >>".encode()) for p in (p1, p2, p3)]
objects[pages - 1] = f"<< /Type /Pages /Kids [{' '.join(f'{p} 0 R' for p in page_objects)}] /Count 3 >>".encode()
catalog = obj(f"<< /Type /Catalog /Pages {pages} 0 R >>".encode())
with PDF.open("wb") as handle:
    handle.write(b"%PDF-1.4\n")
    offsets = [0]
    for number, data in enumerate(objects, 1):
        offsets.append(handle.tell())
        handle.write(f"{number} 0 obj\n".encode() + data + b"\nendobj\n")
    xref = handle.tell()
    handle.write(f"xref\n0 {len(objects) + 1}\n0000000000 65535 f \n".encode())
    for offset in offsets[1:]:
        handle.write(f"{offset:010d} 00000 n \n".encode())
    handle.write(f"trailer\n<< /Size {len(objects) + 1} /Root {catalog} 0 R >>\nstartxref\n{xref}\n%%EOF\n".encode())
print(PDF)
