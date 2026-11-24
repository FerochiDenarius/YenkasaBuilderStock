from pathlib import Path
import re
import subprocess
from typing import Optional

ROOT = Path(__file__).resolve().parents[1]
REPORTS = ROOT / "Validation Reports"
PDF = REPORTS / "03_Owner_Account_Validation.pdf"

def clean(text: str) -> str:
    return text.encode("ascii", "ignore").decode()

def esc(text: str) -> str:
    return clean(text).replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")

def wrap(text: str, width: int = 96):
    words = clean(text).split(); lines, line = [], ""
    for word in words:
        if line and len(line) + len(word) + 1 > width: lines.append(line); line = word
        else: line = word if not line else f"{line} {word}"
    return lines + ([line] if line else [])

objects = []
def obj(data: bytes) -> int: objects.append(data); return len(objects)
font = obj(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>")
images = {}
for name in ("03_owner_account_old_menu.png", "03_owner_account_old_menu_reloaded.png"):
    out = Path("/private/tmp") / f"{Path(name).stem}.jpg"
    subprocess.run(["sips", "-s", "format", "jpeg", str(REPORTS / name), "--out", str(out)], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    info = subprocess.check_output(["sips", "-g", "pixelWidth", "-g", "pixelHeight", str(out)], text=True)
    width, height = [int(x) for x in re.findall(r"pixel(?:Width|Height): (\d+)", info)]
    data = out.read_bytes(); images[name] = obj(f"<< /Type /XObject /Subtype /Image /Width {width} /Height {height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length {len(data)} >>\nstream\n".encode() + data + b"\nendstream")

def text_page(title, sections):
    lines = [title, "Owner Account | Validation date: 21 November 2026 | PAGE VALIDATED", ""]
    for heading, items in sections:
        lines += [heading, "-" * min(92, max(len(heading), 20))]
        for item in items: lines += wrap(item)
        lines.append("")
    stream = ["BT", "/F1 16 Tf", "36 806 Td", f"({esc(lines[0])}) Tj", "/F1 8 Tf", "0 -18 Td"]
    for line in lines[1:]:
        if line.startswith(("A. ", "B. ", "C. ", "D. ", "E. ", "F. ")): stream += ["0 -8 Td", "/F1 11 Tf", f"({esc(line)}) Tj", "/F1 8 Tf", "0 -13 Td"]
        else: stream += [f"({esc(line)}) Tj", "0 -11 Td"]
    stream += ["ET"]
    return "\n".join(stream).encode()

def content_page(content: bytes, xobjects: Optional[dict] = None):
    resources = f"<< /Font << /F1 {font} 0 R >>"
    if xobjects: resources += " /XObject << " + " ".join(f"/{key} {value} 0 R" for key, value in xobjects.items()) + " >>"
    resources += " >>"
    return obj(f"<< /Length {len(content)} /Resources {resources} >>\nstream\n".encode() + content + b"\nendstream")

page1 = text_page("Owner Account Validation Report", [
    ("A. Page Information", [
        "Implementation summary: added controlled owner profile state, section navigation, native profile-photo picker with PNG/JPG/WebP and 2 MB validation, save/reset actions, and SQLite-backed FastAPI persistence.",
        "Relevant source files: apps/desktop/src/renderer/OwnerAccountPage.tsx; apps/desktop/src/renderer/api.ts; apps/desktop/src/renderer/styles.css; services/local-api/app/main.py; tests/python/test_local_api.py.",
    ]),
    ("B. Functionality Checklist", [
        "Profile Information fields | Controlled required and optional inputs | PASS",
        "Identification Type and Gender | Functional dropdowns | PASS",
        "Change Photo | Opens native chooser and previews image | PASS",
        "Remove Photo | Clears photo preview | PASS",
        "Security & Login, Contact & Address, Business Access, Activity Log | Functional tabs | PASS",
        "Reset Changes | Restores last saved values | PASS",
        "Save Changes | Calls /api/owner and commits SQLite record | PASS",
    ]),
])
page2 = text_page("Owner Account Validation Report", [
    ("C. Backend Integration", [
        "GET /api/owner loads the owner record. PUT /api/owner validates fullName, role, phone, and email, then upserts the owners table.",
        "The owner record has company_id=1 for the current single-company MVP boundary. Photo data is stored as a Text data URL in SQLite and validated server-side.",
        "Authorization and authenticated company context are not yet implemented; headquarters-only enforcement is tracked as an outstanding issue.",
    ]),
    ("D. Test Results", [
        "OA-UI-01 | Required validation | Clear Full Name; Save | Error and no write | Complete the required owner fields before saving | PASS",
        "OA-UI-02 | Photo picker | Click Change Photo; choose PNG | Native chooser and preview | Filechooser event and Profile preview image | PASS",
        "OA-UI-03 | Section tabs | Open all five tabs | Content changes | Security, Contact, Access, Activity sections opened | PASS",
        "OA-UI-04 | Save | Save valid owner form | Success | Saved owner account locally to SQLite | PASS",
        "OA-DB-01 | Restart persistence | Relaunch Electron; open Owner Account | Values and photo reload | Validation Owner and photo restored | PASS",
        "OA-API-01 | API validation | Unsupported photo payload | 422 | Backend rejects unsupported image data | PASS",
        "OA-REG-01 | Regression | Build, frontend test, pytest, lint | No regressions | Build passed; 1 frontend, 5 backend tests, lint passed | PASS",
        "OA-CLOUD-01 | PostgreSQL sync/auth | Inspect architecture | Central sync and auth | Not implemented for this page | NOT TESTED",
    ]),
])
page3 = text_page("Owner Account Validation Report", [
    ("E. Proof of Validation", [
        "Screenshots below are original captures from the running Electron application. The existing dashboard menu is retained as the only global menu, with one Owner Account section menu. Live API log showed GET /api/owner 200 and PUT /api/owner 200.",
        "The restart evidence shows the saved owner name and photo restored from the same SQLite database.",
    ]),
    ("F. Outstanding Issues", [
        "Central PostgreSQL synchronization, durable outbox, authenticated company/branch context, and headquarters-only authorization remain pending.",
        "Security actions are currently local UI acknowledgements until the authentication/session milestone is implemented.",
    ]),
])
page3 += b"\nq\n523 0 0 320 36 390 cm\n/Im1 Do\nQ\nq\n523 0 0 320 36 45 cm\n/Im2 Do\nQ\n"
p1, p2, p3 = content_page(page1), content_page(page2), content_page(page3, {"Im1": images["03_owner_account_old_menu.png"], "Im2": images["03_owner_account_old_menu_reloaded.png"]})
pages = obj(b""); page_objects = [obj(f"<< /Type /Page /Parent {pages} 0 R /MediaBox [0 0 595 842] /Contents {p} 0 R >>".encode()) for p in (p1, p2, p3)]
objects[pages - 1] = f"<< /Type /Pages /Kids [{' '.join(f'{p} 0 R' for p in page_objects)}] /Count 3 >>".encode(); catalog = obj(f"<< /Type /Catalog /Pages {pages} 0 R >>".encode())
with PDF.open("wb") as handle:
    handle.write(b"%PDF-1.4\n"); offsets = [0]
    for number, data in enumerate(objects, 1): offsets.append(handle.tell()); handle.write(f"{number} 0 obj\n".encode() + data + b"\nendobj\n")
    xref = handle.tell(); handle.write(f"xref\n0 {len(objects) + 1}\n0000000000 65535 f \n".encode())
    for offset in offsets[1:]: handle.write(f"{offset:010d} 00000 n \n".encode())
    handle.write(f"trailer\n<< /Size {len(objects) + 1} /Root {catalog} 0 R >>\nstartxref\n{xref}\n%%EOF\n".encode())
print(PDF)
