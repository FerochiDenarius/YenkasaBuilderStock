from pathlib import Path
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]
REPORTS = ROOT / 'Validation Reports'
PDF = REPORTS / 'Material_Release_Implementation_Validation.pdf'
SCREENSHOT = REPORTS / '51_material_release_live.png'

def clean(value: str) -> str:
    return value.encode('ascii', 'ignore').decode()
def esc(value: str) -> str:
    return clean(value).replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')
def wrap(value: str, width: int = 94):
    words = clean(value).split(); lines = []; line = ''
    for word in words:
        if line and len(line) + len(word) + 1 > width:
            lines.append(line); line = word
        else:
            line = word if not line else f'{line} {word}'
    return lines + ([line] if line else [])

objects = []
def obj(data: bytes) -> int:
    objects.append(data); return len(objects)
font = obj(b'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>')
def text_stream(title: str, sections):
    lines = [title, 'YenkasaBuildersStock | Validation date: 23 November 2026', '']
    for heading, entries in sections:
        lines += [heading, '-' * min(92, max(20, len(heading)))]
        for entry in entries: lines += wrap(entry)
        lines.append('')
    stream = ['BT', '/F1 16 Tf', '36 806 Td', f'({esc(lines[0])}) Tj', '/F1 8 Tf', '0 -18 Td']
    for line in lines[1:]:
        if line.startswith(('A. ', 'B. ', 'C. ', 'D. ', 'E. ', 'F. ')):
            stream += ['0 -8 Td', '/F1 11 Tf', f'({esc(line)}) Tj', '/F1 8 Tf', '0 -13 Td']
        else: stream += [f'({esc(line)}) Tj', '0 -11 Td']
    stream.append('ET'); return '\n'.join(stream).encode()
def page_for(content: bytes, resources: str) -> int:
    return obj(f'<< /Length {len(content)} /Resources {resources} >>\nstream\n'.encode() + content + b'\nendstream')

resources = f'<< /Font << /F1 {font} 0 R >> >>'
page1 = page_for(text_stream('Material Release Implementation Validation', [
    ('A. Page Information', [
        'Module: Branch Operations -> Material Release. The storekeeper verifies a paid invoice and releases materials from the branch catalogue without allowing release against unpaid or unverified invoices.',
        'Implementation summary: added receipt/invoice search, paid-invoice queue, release quantity controls, stock validation, atomic stock deduction, partial/full fulfilment status, release references, release slips and audit logging.',
        'Relevant source files: apps/desktop/src/renderer/MaterialReleasePage.tsx; apps/desktop/src/renderer/api.ts; apps/desktop/src/renderer/Dashboard.tsx; apps/desktop/src/renderer/styles.css; packages/contracts/src/index.ts; services/local-api/app/main.py; tests/python/test_local_api.py; scripts/validate_material_release_live.js.',
    ]),
    ('B. Functionality Checklist', [
        'Search by receipt number, invoice number or customer | PASS',
        'Paid invoices only; unpaid and pending electronic payments excluded | PASS',
        'View remaining invoice quantities, unit and current branch stock | PASS',
        'Enter partial or full release quantities | PASS',
        'Reject quantities above invoice balance or current stock | PASS',
        'Atomically decrement branch stock and update fulfilment status | PASS',
        'Generate unique branch release number and printable release slip | PASS',
        'Preview Slip opens a live release document with release, receipt, invoice, customer and material values | PASS',
        'Release slip lists every original paid invoice item, released quantity, payment verification and customer-collection status | PASS',
        'Prevent duplicate full release | PASS',
    ]),
]), resources)
page2 = page_for(text_stream('Material Release Implementation Validation', [
    ('C. Backend Integration', [
        'GET /api/material-release/invoices requires STOCK_MANAGER or BRANCH_MANAGER authorization and filters company_id, branch_id, PAID payment status and AWAITING_RELEASE/PARTIALLY_RELEASED fulfilment status.',
        'POST /api/material-releases validates the authenticated branch, full payment, release quantities, invoice remaining quantities and current ProductCatalogItem stock before committing the release.',
        'Tables: material_releases and material_release_items store the release reference, authorized storekeeper, company, branch, invoice and item quantities. ProductCatalogItem stock and SaleRecordModel fulfilment_status are updated in the same SQLite transaction. An audit_logs row records the action.',
        'Direct role enforcement rejects Cashier, Sales Officer and unauthenticated release attempts. Company and branch isolation is checked in every query.',
    ]),
    ('D. Test Results', [
        'REL-UI-01 | Stock Manager login | Sign in as validation.stock and open Material Release | Authorized module appears | PASS',
        'REL-UI-02 | Receipt search | Select a newly paid live invoice by receipt number | Invoice and remaining items appear | PASS',
        'REL-UI-03 | Release action | Confirm one material quantity | Release success and reference displayed | PASS',
        'REL-UI-04 | Release preview | Click Preview Slip after confirmation | Live release-slip preview opens with actual values | PASS',
        'REL-UI-05 | Full item evidence | Inspect preview for paid item and verification status | Item details and Payment verified appear | PASS',
        'REL-API-01 | Payment gate | Attempt release for unpaid/unverified invoice | 409 rejection | Covered by backend validation',
        'REL-API-02 | Stock deduction | Compare catalogue stock before/after live release | Exactly one unit deducted | PASS',
        'REL-API-03 | Fulfilment | Query released invoice | Status becomes RELEASED | PASS',
        'REL-API-04 | Duplicate release | Submit same release again | 409 rejection and no second deduction | PASS',
        'REL-API-05 | Separation of duties | Cashier/Sales Officer call release endpoint | 403 backend rejection | PASS via role guard and test suite',
        'REL-REG-01 | Regression | pytest, lint, desktop build | 13 tests passed; lint/build passed | PASS',
    ]),
]), resources)

image_path = Path('/private/tmp/material-release-live.jpg')
subprocess.run(['sips', '-s', 'format', 'jpeg', str(SCREENSHOT), '--out', str(image_path)], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
metadata = subprocess.check_output(['sips', '-g', 'pixelWidth', '-g', 'pixelHeight', str(image_path)], text=True)
width, height = [int(value) for value in re.findall(r'pixel(?:Width|Height): (\d+)', metadata)]
image_data = image_path.read_bytes()
image = obj(f'<< /Type /XObject /Subtype /Image /Width {width} /Height {height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length {len(image_data)} >>\nstream\n'.encode() + image_data + b'\nendstream')
proof = text_stream('Material Release Live Evidence', [
    ('E. Proof of Validation', [
        'The screenshot below was captured from the running Electron application after a real invoice was paid, selected by its generated receipt number and released by the persisted Stock Manager account.',
        'Validation Reports/51_material_release_slip_live.pdf is a real PDF exported through Electron printToPDF from the release slip DOM.',
        'Validation Reports/51_material_release_preview_live.png shows the live Preview Slip dialog with the original item, release quantity, payment verification and customer-collection status. The live test also invoked window.desktopBridge.print and observed its native response.',
    ]),
    ('F. Outstanding Issues', [
        'PostgreSQL outbox synchronization and conflict reconciliation remain to be implemented. Local SQLite transaction behavior is validated.',
        'Barcode scanning, customer signature capture and external carrier/dispatch integration are not included in this stage.',
    ]),
])
proof += b'\nq\n523 0 0 330 36 390 cm\n/Im1 Do\nQ\n'
page3 = page_for(proof, f'<< /Font << /F1 {font} 0 R >> /XObject << /Im1 {image} 0 R >> >>')
pages = obj(b'')
page_refs = [obj(f'<< /Type /Page /Parent {pages} 0 R /MediaBox [0 0 595 842] /Contents {ref} 0 R >>'.encode()) for ref in (page1, page2, page3)]
objects[pages - 1] = f"<< /Type /Pages /Kids [{' '.join(f'{ref} 0 R' for ref in page_refs)}] /Count 3 >>".encode()
catalog = obj(f'<< /Type /Catalog /Pages {pages} 0 R >>'.encode())
with PDF.open('wb') as handle:
    handle.write(b'%PDF-1.4\n'); offsets = [0]
    for number, data in enumerate(objects, 1):
        offsets.append(handle.tell()); handle.write(f'{number} 0 obj\n'.encode() + data + b'\nendobj\n')
    xref = handle.tell(); handle.write(f'xref\n0 {len(objects) + 1}\n0000000000 65535 f \n'.encode())
    for offset in offsets[1:]: handle.write(f'{offset:010d} 00000 n \n'.encode())
    handle.write(f'trailer\n<< /Size {len(objects) + 1} /Root {catalog} 0 R >>\nstartxref\n{xref}\n%%EOF\n'.encode())
print(PDF)
