from pathlib import Path
import re
import subprocess
from typing import Optional

ROOT = Path(__file__).resolve().parents[1]
REPORTS = ROOT / "Validation Reports"
PDF = REPORTS / "01_Business_Information_Validation.pdf"

def clean(text: str) -> str:
    return text.encode("ascii", "ignore").decode().replace("→", "->")

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

def jpg(path: Path) -> tuple[bytes, int, int]:
    out = Path("/private/tmp") / f"{path.stem}.jpg"
    subprocess.run(["sips", "-s", "format", "jpeg", str(path), "--out", str(out)], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    info = subprocess.check_output(["sips", "-g", "pixelWidth", "-g", "pixelHeight", str(out)], text=True)
    nums = [int(x) for x in re.findall(r"pixel(?:Width|Height): (\d+)", info)]
    return out.read_bytes(), nums[0], nums[1]

objects: list[bytes] = []
def obj(data: bytes) -> int:
    objects.append(data)
    return len(objects)

font = obj(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>")
images = {}
for name in ("01_business_information_ui.png", "01_business_information_saved.png"):
    data, width, height = jpg(REPORTS / name)
    images[name] = (obj(f"<< /Type /XObject /Subtype /Image /Width {width} /Height {height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length {len(data)} >>\nstream\n".encode() + data + b"\nendstream"), width, height)

def text_content(title: str, sections: list[tuple[str, list[str]]]) -> bytes:
    lines = [title, "Business Information | Validation date: 21 November 2026 | PAGE VALIDATED", ""]
    for heading, body in sections:
        lines += [heading, "-" * min(92, max(heading.__len__(), 20))]
        for paragraph in body:
            lines += wrap(paragraph)
        lines.append("")
    stream = ["BT", "/F1 16 Tf", "36 806 Td", f"({esc(lines[0])}) Tj", "/F1 8 Tf", "0 -18 Td"]
    for index, line in enumerate(lines[1:]):
        if line in {"A. Page Information", "B. Functionality Checklist", "C. Backend Integration", "D. Test Results", "E. Proof of Validation", "F. Outstanding Issues"}:
            stream += ["0 -8 Td", "/F1 11 Tf", f"({esc(line)}) Tj", "/F1 8 Tf", "0 -13 Td"]
        else:
            stream += [f"({esc(line)}) Tj", "0 -11 Td"]
    stream += ["ET"]
    return "\n".join(stream).encode()

def page(content: bytes, xobjects: Optional[dict[str, int]] = None) -> int:
    resources = f"<< /Font << /F1 {font} 0 R >>"
    if xobjects:
        resources += " /XObject << " + " ".join(f"/{k} {v} 0 R" for k, v in xobjects.items()) + " >>"
    resources += " >>"
    return obj(f"<< /Length {len(content)} /Resources {resources} >>\nstream\n".encode() + content + b"\nendstream")

sections1 = [
    ("A. Page Information", [
        "Implementation summary: controlled React form state, constrained dropdowns, field-level validation, reset-to-last-save behavior, typed FastAPI client, and SQLite persistence.",
        "Relevant source files: apps/desktop/src/renderer/BusinessInfoPage.tsx; apps/desktop/src/renderer/api.ts; apps/desktop/src/renderer/Dashboard.tsx; apps/desktop/src/renderer/styles.css; services/local-api/app/main.py; tests/python/test_local_api.py.",
    ]),
    ("B. Functionality Checklist", [
        "Control | Expected behavior | Validation result",
        "Registered Company Name | Required controlled text input | PASS",
        "Trading / Business Name | Required controlled text input | PASS",
        "Business Category | Dropdown and required validation | PASS",
        "Business Email | Format validation | PASS",
        "Phone Number | Format validation | PASS",
        "Country, Currency, Timezone | Dropdowns persisted | PASS",
        "Business Address | Required multiline input | PASS",
        "Reset Changes | Restore last saved values | PASS",
        "Save Changes | Validate and persist through API | PASS",
        "Company Profile preview | Reflect current form state | PASS",
    ]),
]
sections2 = [
    ("C. Backend Integration", [
        "GET /health verifies the loopback FastAPI service. GET /api/company loads the company record. PUT /api/company validates and upserts the record.",
        "Data flow: React state -> typed companyApi fetch client -> FastAPI/Pydantic validation -> SQLAlchemy companies table in SQLite -> response rehydrates the form and preview.",
        "Authorization: authenticated company/branch context and headquarters-only authorization middleware are not yet present for this page and are listed as outstanding.",
    ]),
    ("D. Test Results", [
        "Test ID | Feature | Procedure | Expected | Actual | Result",
        "BI-UI-01 | Navigation/rendering | Open Electron and select page | Page renders | Page loaded; screenshot captured | PASS",
        "BI-UI-02 | Required validation | Clear name; Save | Useful error; no write | Alert: Review the highlighted fields before saving | PASS",
        "BI-UI-03 | Valid save | Fill valid values; Save | Success and API write | Saved locally to SQLite | PASS",
        "BI-UI-04 | Reset | Change trading name; Reset | Last save restored | Validation Builders restored | PASS",
        "BI-API-01 | Health | GET /health | 200 | 200 local-api status | PASS",
        "BI-API-02 | Save/read | PUT then GET /api/company | 200 and persisted fields | PUT 200; GET 200 | PASS",
        "BI-API-03 | Invalid request | Malformed email | 422 | HTTP 422 with validation detail | PASS",
        "BI-DB-01 | SQLite restart | Restart API; GET | Record survives | Saved company restored | PASS",
        "BI-DB-02 | Electron restart | Relaunch app; open page | Saved fields reload | Values reloaded correctly | PASS",
        "BI-OFF-01 | Offline-first | PostgreSQL unavailable; local save | Local operation works | SQLite flow has no PostgreSQL dependency | PASS",
        "BI-REG-01 | Regression | Build, frontend test, pytest | No regressions | Build passed; 1 frontend and 3 backend tests passed | PASS",
        "BI-CLOUD-01 | PostgreSQL sync/auth | Inspect architecture | Central sync and authorization | Not implemented for this page | NOT TESTED",
    ]),
]
sections3 = [
    ("E. Proof of Validation", [
        "Screenshots on the following pages are original captures from the running Electron application, not generated mockups.",
        "Live API evidence: PUT /api/company HTTP 200; GET /api/company HTTP 200; malformed email request HTTP 422.",
        "Electron restart evidence: registered=Validation Builders Ltd; trading=Validation Builders; category=Building Materials; email=validation@example.com.",
    ]),
    ("F. Outstanding Issues", [
        "Central PostgreSQL synchronization, durable outbox, authenticated company/branch context, and headquarters-only authorization are not implemented for Business Information yet.",
        "Ordinary offline operation is local SQLite through the loopback API and does not require PostgreSQL.",
    ]),
]

content1 = text_content("Business Information Validation Report", sections1)
content2 = text_content("Business Information Validation Report", sections2)
content3 = text_content("Business Information Validation Report", sections3)
for label, image_name, x, y, w in (("Im1", "01_business_information_ui.png", 36, 390, 523), ("Im2", "01_business_information_saved.png", 36, 390, 523)):
    _, iw, ih = images[image_name]
    h = int(w * ih / iw)
    content3 += f"\nq\n{w} 0 0 {h} {x} {y} cm\n/{label} Do\nQ\n".encode()

p1 = page(content1)
p2 = page(content2)
p3 = page(content3, {"Im1": images["01_business_information_ui.png"][0], "Im2": images["01_business_information_saved.png"][0]})
pages = obj(b"")
page_objects = []
for p in (p1, p2, p3):
    page_objects.append(obj(f"<< /Type /Page /Parent {pages} 0 R /MediaBox [0 0 595 842] /Contents {p} 0 R >>".encode()))
objects[pages - 1] = f"<< /Type /Pages /Kids [{' '.join(f'{p} 0 R' for p in page_objects)}] /Count {len(page_objects)} >>".encode()
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
