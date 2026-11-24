from pathlib import Path
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]
REPORTS = ROOT / "Validation Reports"
REPORTS.mkdir(exist_ok=True)
PDF = REPORTS / "Document_Templates_Implementation_Validation.pdf"
SCREENSHOT = REPORTS / "45_document_template_editor_live.png"


def clean(value: str) -> str:
    return value.encode("ascii", "ignore").decode()


def esc(value: str) -> str:
    return clean(value).replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")


def wrap(value: str, width: int = 95):
    words = clean(value).split()
    lines, line = [], ""
    for word in words:
        if line and len(line) + len(word) + 1 > width:
            lines.append(line)
            line = word
        else:
            line = word if not line else f"{line} {word}"
    return lines + ([line] if line else [])


objects = []


def obj(data: bytes) -> int:
    objects.append(data)
    return len(objects)


font = obj(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>")


def text_stream(title: str, sections):
    lines = [title, "YenkasaBuildersStock | Validation date: 22 November 2026", ""]
    for heading, entries in sections:
        lines += [heading, "-" * min(94, max(20, len(heading)))]
        for entry in entries:
            lines += wrap(entry)
        lines.append("")
    stream = ["BT", "/F1 16 Tf", "36 806 Td", f"({esc(lines[0])}) Tj", "/F1 8 Tf", "0 -18 Td"]
    for line in lines[1:]:
        if line.startswith(("A. ", "B. ", "C. ", "D. ", "E. ", "F. ")):
            stream += ["0 -8 Td", "/F1 11 Tf", f"({esc(line)}) Tj", "/F1 8 Tf", "0 -13 Td"]
        else:
            stream += [f"({esc(line)}) Tj", "0 -11 Td"]
    stream.append("ET")
    return "\n".join(stream).encode()


def page_for(content: bytes, resources: str) -> int:
    return obj(f"<< /Length {len(content)} /Resources {resources} >>\nstream\n".encode() + content + b"\nendstream")


page1 = page_for(text_stream("Document Templates Implementation Validation", [
    ("A. Page Information", [
        "Module: Company Setup -> Business Branding -> Document Templates. The former placeholder preview was replaced by a controlled editable invoice document with real item rows, calculations, persistence, preview, native printing and PDF export.",
        "Relevant source files: apps/desktop/src/renderer/ConnectedSetup.tsx; apps/desktop/src/renderer/styles.css; apps/desktop/src/main/index.ts; apps/desktop/src/preload/index.ts; apps/desktop/src/renderer/desktop.d.ts; packages/contracts/src/index.ts; services/local-api/app/main.py.",
    ]),
    ("B. Functionality Checklist", [
        "Invoice heading, invoice number, dates, company, branch, customer, payment terms and notes are controlled editable fields | PASS",
        "Item rows expose Item name, Qty, Unit and Unit price; Add Item Row focuses the new Item name field | PASS",
        "Rows can be removed; amounts, subtotal, discount, VAT, total, amount paid and balance recalculate from current values | PASS",
        "Editing tools activate optional company/logo/branch/footer elements and identify the selected element | PASS",
        "Element properties change heading font, size, colour, bold state, logo dimensions and logo position | PASS",
        "Undo and redo controls restore template snapshots | IMPLEMENTED",
        "Preview hides editor controls; Print invokes Electron OS print dialog; Save PDF invokes native Save dialog/PDF generation | PASS for PDF; print handler wired",
        "Template ID, name, version, content and styles persist in the existing company SQLite JSON column | PASS",
    ]),
    ("C. Backend Integration", [
        "GET /api/company loads documentTemplates. PUT /api/company validates the company payload and commits documentTemplates JSON to the local SQLite companies row.",
        "Persisted structure includes templateId, templateName, version, selectedDocument, layout, page size, visibility flags, styles and invoice content. No plaintext credentials or unrelated tables were modified.",
        "The current repository has no completed PostgreSQL sync/outbox service for document templates; central synchronization and signed owner authorization remain outstanding.",
    ]),
]), f"<< /Font << /F1 {font} 0 R >> >>")

page2 = page_for(text_stream("Document Templates Implementation Validation", [
    ("D. Test Results", [
        "DT-01 | Open editor | Click Edit Template in the running Electron app | Three-area editor opens | Editing Tools, document canvas and Element Properties rendered | PASS",
        "DT-02 | Heading style | Set heading size to 24 and colour to #B42318 | Preview changes immediately | Live screenshot shows red 24px heading | PASS",
        "DT-03 | Logo resize/move | Change width/height/Move X/Move Y properties | Logo style updates | Controlled style values applied to preview | PASS",
        "DT-04 | Item row | Add fourth item; fill item name, quantity, unit and price | Row is editable and appears in table | Validation Added Item rendered and saved | PASS",
        "DT-05 | Invalid item | Clear fourth item name and click Save Template | Save rejected with useful error | Item 4 needs an item name | PASS",
        "DT-06 | Persistence | Save; reload the Electron page; reopen editor | Edited heading, footer and row return | Live test reports editor persisted true | PASS",
        "DT-07 | PDF | Export saved invoice through Electron bridge | Real PDF saved | /private/tmp/yenkasa-live-invoice.pdf, 1-page PDF, 247343 bytes | PASS",
        "DT-08 | Print | Click Print | OS print dialog requested without app shell in print CSS | Electron webContents.print handler is wired; interactive dialog confirmation remains manual | NOT AUTOMATED",
        "DT-09 | Build regression | npm run lint and npm run build:desktop | No compile/lint errors | Both passed after implementation | PASS",
    ]),
    ("E. Proof of Validation", [
        "Validation Reports/45_document_template_editor_live.png is a screenshot captured from the running Electron application through Playwright/CDP and shows the actual editor, real invoice values, the fourth-row workflow and active properties.",
        "Validation Reports/Yenkasa_Live_Invoice_Sample.pdf is copied from the live Electron printToPDF result and can be opened by an external PDF reader.",
        "The live test script is scripts/validate_document_editor_live.js. It verifies add/edit/remove item fields, invalid input rejection, SQLite reload persistence, bridge availability and PDF file creation.",
    ]),
    ("F. Outstanding Issues", [
        "PostgreSQL synchronization, template history records as separate database rows, transaction-template binding from Sales/Invoices, and multi-page repeating-header generation need a follow-up backend/document-generation phase.",
        "The OS print dialog was not auto-confirmed in automation because it is a native modal; the renderer calls Electron webContents.print and the PDF path is fully validated.",
    ]),
]), f"<< /Font << /F1 {font} 0 R >> >>")


image_path = Path("/private/tmp/document-template-editor.jpg")
subprocess.run(["sips", "-s", "format", "jpeg", str(SCREENSHOT), "--out", str(image_path)], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
metadata = subprocess.check_output(["sips", "-g", "pixelWidth", "-g", "pixelHeight", str(image_path)], text=True)
width, height = [int(value) for value in re.findall(r"pixel(?:Width|Height): (\d+)", metadata)]
image_data = image_path.read_bytes()
image = obj(f"<< /Type /XObject /Subtype /Image /Width {width} /Height {height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length {len(image_data)} >>\nstream\n".encode() + image_data + b"\nendstream")
proof = text_stream("Document Templates Live Evidence", [("E. Proof of Validation", ["Screenshot captured from the running Electron editor. The image below is evidence of the live interface, not a generated mockup."])])
proof += f"\nq\n523 0 0 330 36 390 cm\n/Im1 Do\nQ\n".encode()
page3 = page_for(proof, f"<< /Font << /F1 {font} 0 R >> /XObject << /Im1 {image} 0 R >> >>")

pages = obj(b"")
page_refs = [obj(f"<< /Type /Page /Parent {pages} 0 R /MediaBox [0 0 595 842] /Contents {page_ref} 0 R >>".encode()) for page_ref in (page1, page2, page3)]
objects[pages - 1] = f"<< /Type /Pages /Kids [{' '.join(f'{ref} 0 R' for ref in page_refs)}] /Count 3 >>".encode()
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
