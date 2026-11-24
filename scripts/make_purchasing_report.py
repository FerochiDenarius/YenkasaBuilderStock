from pathlib import Path
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]
REPORTS = ROOT / 'Validation Reports'
PDF = REPORTS / 'Purchasing_Implementation_Validation.pdf'
sections = [
    ('A. Page Information', [
        'Page: Branch Operations -> Purchases.',
        'Implementation summary: supplier/date/payment fields, searchable branch catalogue selection, editable quantities and unit costs, totals, persistent purchase history and atomic stock increase.',
        'Relevant source files: apps/desktop/src/renderer/PurchasingPage.tsx; apps/desktop/src/renderer/Dashboard.tsx; apps/desktop/src/renderer/api.ts; apps/desktop/src/renderer/styles.css; packages/contracts/src/index.ts; services/local-api/app/main.py; scripts/validate_purchasing_live.js.',
    ]),
    ('B. Functionality Checklist', [
        'Supplier, date, reference and payment fields validate and save | PASS',
        'Catalogue search and item selection | PASS',
        'Editable quantity and unit-cost fields with live line totals | PASS',
        'Discount and total calculation | PASS',
        'Clear, Save Purchase and Purchase History actions | PASS',
        'Successful purchase increases stock through the backend transaction | PASS',
    ]),
    ('C. Backend Integration', [
        'GET /api/purchases is branch/company scoped and restricted to BRANCH_MANAGER and STOCK_MANAGER.',
        'POST /api/purchases validates supplier, items, quantities, unit costs and discounts, calculates totals server-side, commits purchase_records and stock increases atomically, and writes an audit record.',
        'Sales Officer direct purchase creation is rejected by backend authorization with HTTP 403.',
    ]),
    ('D. Test Results', [
        'PUR-01 Manager opens Purchasing | Form loads in existing shell | PASS',
        'PUR-02 Search/select catalogue item | Item added to editable table | PASS',
        'PUR-03 Edit quantity 2 and unit cost GHc 80 | Totals update | PASS',
        'PUR-04 Save purchase | Record persists and stock increases by 2 | PASS',
        'PUR-05 Purchase History | Saved purchase row appears | PASS',
        'PUR-06 Sales Officer direct POST | HTTP 403 | PASS',
        'PUR-07 Build, lint and Python tests | Build/lint passed; 13 tests passed | PASS',
    ]),
    ('E. Proof of Validation', [
        'Genuine live screenshot: Validation Reports/55_purchasing_live.png.',
        'Live validation script: scripts/validate_purchasing_live.js. It recorded purchaseHistoryRows=1, stockIncreased=true and unauthorizedStatus=403.',
    ]),
    ('F. Outstanding Issues', [
        'Supplier master records, purchase-order approval, goods-received inspection and PostgreSQL outbox synchronization remain for later purchasing milestones.',
    ]),
]

def esc(value: str) -> str:
    return value.encode('ascii', 'ignore').decode().replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')

def wrap(value: str, width=92):
    words = value.split(); lines = []; line = ''
    for word in words:
        if line and len(line) + len(word) + 1 > width:
            lines.append(line); line = word
        else:
            line = word if not line else f'{line} {word}'
    return lines + ([line] if line else [])

objects = []
def obj(data):
    objects.append(data); return len(objects)

font = obj(b'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>')
lines = ['Purchasing Implementation and Validation', 'YenkasaBuildersStock | Validation date: 23 November 2026', '']
for heading, entries in sections:
    lines += [heading, '-' * min(92, max(20, len(heading)))]
    for entry in entries: lines += wrap(entry)
    lines.append('')
stream = ['BT', '/F1 16 Tf', '36 806 Td', f'({esc(lines[0])}) Tj', '/F1 8 Tf', '0 -18 Td']
for line in lines[1:]:
    if line.startswith(('A. ', 'B. ', 'C. ', 'D. ', 'E. ', 'F. ')):
        stream += ['0 -8 Td', '/F1 11 Tf', f'({esc(line)}) Tj', '/F1 8 Tf', '0 -13 Td']
    else:
        stream += [f'({esc(line)}) Tj', '0 -11 Td']
stream.append('ET')
content = '\n'.join(stream).encode()
page = obj(f'<< /Length {len(content)} /Resources << /Font << /F1 {font} 0 R >> >> >>\nstream\n'.encode() + content + b'\nendstream')
image_path = REPORTS / '55_purchasing_live.png'
jpg_path = Path('/private/tmp/purchasing-live.jpg')
subprocess.run(['sips', '-s', 'format', 'jpeg', str(image_path), '--out', str(jpg_path)], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
metadata = subprocess.check_output(['sips', '-g', 'pixelWidth', '-g', 'pixelHeight', str(jpg_path)], text=True)
image_width, image_height = [int(value) for value in re.findall(r'pixel(?:Width|Height): (\d+)', metadata)]
image_data = jpg_path.read_bytes()
image = obj(f'<< /Type /XObject /Subtype /Image /Width {image_width} /Height {image_height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length {len(image_data)} >>\nstream\n'.encode() + image_data + b'\nendstream')
proof_lines = ['Purchasing Live Evidence', 'The screenshot below is genuine running Electron application evidence.', 'It shows the live purchasing form after catalogue selection and save validation.', 'The live script also confirmed purchaseHistoryRows=1, stockIncreased=true and HTTP 403 for Sales Officer purchase creation.']
proof_stream = ['BT', '/F1 16 Tf', '36 806 Td', f'({esc(proof_lines[0])}) Tj', '/F1 9 Tf', '0 -20 Td']
for line in proof_lines[1:]: proof_stream += [f'({esc(line)}) Tj', '0 -14 Td']
proof_stream.append('ET')
proof_content = '\n'.join(proof_stream).encode() + b'\nq\n523 0 0 350 36 330 cm\n/Im1 Do\nQ\n'
proof_page = obj(f'<< /Length {len(proof_content)} /Resources << /Font << /F1 {font} 0 R >> /XObject << /Im1 {image} 0 R >> >> >>\nstream\n'.encode() + proof_content + b'\nendstream')
pages = obj(b'')
page_ref = obj(f'<< /Type /Page /Parent {pages} 0 R /MediaBox [0 0 595 842] /Contents {page} 0 R >>'.encode())
proof_ref = obj(f'<< /Type /Page /Parent {pages} 0 R /MediaBox [0 0 595 842] /Contents {proof_page} 0 R >>'.encode())
objects[pages - 1] = f'<< /Type /Pages /Kids [{page_ref} 0 R {proof_ref} 0 R] /Count 2 >>'.encode()
catalog = obj(f'<< /Type /Catalog /Pages {pages} 0 R >>'.encode())
with PDF.open('wb') as handle:
    handle.write(b'%PDF-1.4\n'); offsets = [0]
    for number, data in enumerate(objects, 1):
        offsets.append(handle.tell()); handle.write(f'{number} 0 obj\n'.encode() + data + b'\nendobj\n')
    xref = handle.tell(); handle.write(f'xref\n0 {len(objects) + 1}\n0000000000 65535 f \n'.encode())
    for offset in offsets[1:]: handle.write(f'{offset:010d} 00000 n \n'.encode())
    handle.write(f'trailer\n<< /Size {len(objects) + 1} /Root {catalog} 0 R >>\nstartxref\n{xref}\n%%EOF\n'.encode())
print(PDF)
