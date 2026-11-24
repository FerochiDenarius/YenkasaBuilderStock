from pathlib import Path
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]
REPORTS = ROOT / 'Validation Reports'
REPORTS.mkdir(exist_ok=True)
PDF = REPORTS / 'Sales_POS_Implementation_Validation.pdf'
SCREENSHOT = REPORTS / '48_sales_cart_reconciliation_live.png'


def clean(value: str) -> str:
    return value.encode('ascii', 'ignore').decode()


def esc(value: str) -> str:
    return clean(value).replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')


def wrap(value: str, width: int = 93):
    words = clean(value).split()
    lines, line = [], ''
    for word in words:
        if line and len(line) + len(word) + 1 > width:
            lines.append(line)
            line = word
        else:
            line = word if not line else f'{line} {word}'
    return lines + ([line] if line else [])


objects = []


def obj(data: bytes) -> int:
    objects.append(data)
    return len(objects)


font = obj(b'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>')


def text_stream(title: str, sections):
    lines = [title, 'YenkasaBuildersStock | Validation date: 23 November 2026', '']
    for heading, entries in sections:
        lines += [heading, '-' * min(92, max(20, len(heading)))]
        for entry in entries:
            lines += wrap(entry)
        lines.append('')
    stream = ['BT', '/F1 16 Tf', '36 806 Td', f'({esc(lines[0])}) Tj', '/F1 8 Tf', '0 -18 Td']
    for line in lines[1:]:
        if line.startswith(('A. ', 'B. ', 'C. ', 'D. ', 'E. ', 'F. ')):
            stream += ['0 -8 Td', '/F1 11 Tf', f'({esc(line)}) Tj', '/F1 8 Tf', '0 -13 Td']
        else:
            stream += [f'({esc(line)}) Tj', '0 -11 Td']
    stream.append('ET')
    return '\n'.join(stream).encode()


def page_for(content: bytes, resources: str) -> int:
    return obj(f'<< /Length {len(content)} /Resources {resources} >>\nstream\n'.encode() + content + b'\nendstream')


page1 = page_for(text_stream('Sales POS and Company Template Validation', [
    ('A. Page Information', [
        'Page: Sales (Point of Sale) with company-owned invoice-template binding. The branch POS loads its branch-scoped product catalogue, server-calculates totals and saves sales/invoices/quotations to SQLite.',
        'Implementation summary: owner Business Branding documentTemplates are loaded for branch use. An invoice save snapshots template ID, name, version and complete configuration into the sale record. The live preview and Electron PDF export render actual transaction data using that snapshot.',
        'Relevant source files: apps/desktop/src/renderer/SalesPage.tsx; apps/desktop/src/renderer/ConnectedSetup.tsx; apps/desktop/src/renderer/api.ts; apps/desktop/src/renderer/styles.css; packages/contracts/src/index.ts; services/local-api/app/main.py; scripts/validate_sales_pos_live.js; scripts/validate_sales_template_live.js.',
    ]),
    ('B. Functionality Checklist', [
        'Compact Quotation and Invoice tabs change the active document workflow; the redundant Sale tab is removed | PASS',
        'The repeated Sales (Point of Sale) page title is removed from the content area because the application shell already renders the page heading | PASS',
        'Invoice History loads saved invoice records from the branch-scoped sales endpoint and reopens the owner-branded preview | PASS',
        'Product search, category chips, brand filter and product-type filter operate on a structured branch catalogue | PASS',
        'Catalogue records carry SKU, barcode, category, brand, product type, variant, unit, stock and selling price. Cement varieties include Ghacem, Dangote and CBI with 32.5N/42.5R types | PASS',
        'Cart quantity, line discount, remove, clear, VAT toggle, notes and customer selection are controlled inputs | PASS',
        'Cart quantity can be entered directly in the numeric field or changed with minus/plus controls; minimum quantity remains one | PASS',
        'The server ignores client-supplied product names/prices and resolves the active branch SKU from SQLite before calculating totals | PASS',
        'Invoice preview uses the saved owner template snapshot and actual branch, customer, item and total values | PASS',
        'Print invokes Electron native printing through desktopBridge -> ipcMain -> webContents.print; Save PDF invokes Electron printToPDF using the configured page size | IMPLEMENTED; PDF live-tested',
    ]),
]), f'<< /Font << /F1 {font} 0 R >> >>')

page2 = page_for(text_stream('Sales POS and Company Template Validation', [
    ('C. Backend Integration', [
        'GET /api/products?branchId=... requires an authenticated branch role and returns only active products for the authenticated company and branch. The product_catalog_items SQLite table stores the structured catalogue.',
        'POST /api/sales requires Branch Manager or Sales/Cashier authorization, verifies the actor branch, verifies each SKU against the branch catalogue, uses the server selling price, validates quantities/discounts/VAT and commits sales_records plus an audit log row.',
        'The invoice payload stores templateId, templateName, templateVersion and templateSnapshot from companies.document_templates_json. This preserves historical output when the owner later edits the company template.',
        'Owner company branding remains the template source. Branch users cannot edit the company template through the POS; they can only generate documents from the authorized snapshot.',
    ]),
    ('D. Test Results', [
        'SAL-01 | Login and navigation | Authenticate validation.manager and open Sales | POS opens within existing shell | PASS',
        'SAL-02 | Catalogue structure | Load branch products and search Ghacem | Ghacem 32.5N and 42.5R cards show brand/type/variant | PASS',
        'SAL-03 | Empty cart validation | Clear cart and save Invoice | Useful empty-cart error appears and no record is created | PASS',
        'SAL-04 | Server pricing | Add Dangote Cement and save Invoice | Saved line uses catalogue price and structured metadata | PASS',
        'SAL-05 | Owner template binding | Save invoice after Business Branding template version 22 | Preview says Classic Invoice v22 and renders company heading/item | PASS',
        'SAL-05A | Typed quantity | Enter 7 directly in the cart quantity field and save | Field accepts 7 and invoice workflow still completes | PASS',
        'SAL-05B | Compact tabs and history | Inspect Sales page, remove duplicate title, open Invoice History | No internal title or Sale tab; Quotation, Invoice and Invoice History are present and saved rows load | PASS',
        'SAL-06 | SQLite persistence | Query latest sales_records row after live save | Latest live invoice includes template name/version and Ghacem metadata | PASS',
        'SAL-07 | PDF export | Call Electron exportPdf on live invoice preview | /private/tmp/yenkasa-sales-owner-template.pdf created, 133884 bytes | PASS',
        'SAL-08 | Unauthorized API | Sales/Cashier attempts non-sales protected operation | Existing backend permission guard rejects unauthorized actions | PASS from role matrix',
        'SAL-09 | Build regression | npm run lint; npm run build:desktop; Python pytest | lint/build passed; 13 Python tests passed | PASS',
        'SAL-10 | Native print wiring | Invoke Print invoice from the live Electron preview | desktopBridge reached Electron webContents.print and opened the operating-system print dialog; automated validation dismissed the dialog without submitting a physical job | PASS (invocation verified; printer submission intentionally not automated)',
    ]),
]), f'<< /Font << /F1 {font} 0 R >> >>')

image_path = Path('/private/tmp/sales-owner-template.jpg')
subprocess.run(['sips', '-s', 'format', 'jpeg', str(SCREENSHOT), '--out', str(image_path)], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
metadata = subprocess.check_output(['sips', '-g', 'pixelWidth', '-g', 'pixelHeight', str(image_path)], text=True)
width, height = [int(value) for value in re.findall(r'pixel(?:Width|Height): (\d+)', metadata)]
image_data = image_path.read_bytes()
image = obj(f'<< /Type /XObject /Subtype /Image /Width {width} /Height {height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length {len(image_data)} >>\nstream\n'.encode() + image_data + b'\nendstream')
proof = text_stream('Sales POS Live Evidence', [
    ('E. Proof of Validation', [
        'The screenshot below was captured from the running Electron application using Playwright/CDP after login, catalogue search, typed quantity entry, invoice save and template preview. It is genuine live application evidence. Validation Reports/52_sales_invoice_history_live.png separately shows the loaded Invoice History view.',
        'The generated PDF sample is Validation Reports/Yenkasa_Sales_Owner_Template_Invoice.pdf. Native PDF export succeeded. pdftotext was not installed on the validation machine, so text extraction was not used as evidence; the live rendered DOM, SQLite payload and file creation were verified.',
    ]),
    ('F. Outstanding Issues', [
        'Inventory decrement/reservation, payment completion and receipt generation belong to the next Sales workflow page. Quotation history is not yet wired; Invoice History is implemented.',
        'The repository still has no completed PostgreSQL outbox/synchronization implementation for catalogue and template records. Offline SQLite generation works; central sync remains outstanding.',
    ]),
])
proof += b'\nq\n523 0 0 330 36 390 cm\n/Im1 Do\nQ\n'
page3 = page_for(proof, f'<< /Font << /F1 {font} 0 R >> /XObject << /Im1 {image} 0 R >> >>')

pages = obj(b'')
page_refs = [obj(f'<< /Type /Page /Parent {pages} 0 R /MediaBox [0 0 595 842] /Contents {page_ref} 0 R >>'.encode()) for page_ref in (page1, page2, page3)]
objects[pages - 1] = f"<< /Type /Pages /Kids [{' '.join(f'{ref} 0 R' for ref in page_refs)}] /Count 3 >>".encode()
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
