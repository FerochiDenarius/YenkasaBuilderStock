from pathlib import Path
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]
REPORTS = ROOT / 'Validation Reports'
REPORTS.mkdir(exist_ok=True)
PDF = REPORTS / 'Inventory_Implementation_Validation.pdf'
objects = []

def clean(value: str) -> str:
    return value.encode('ascii', 'ignore').decode()

def esc(value: str) -> str:
    return clean(value).replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')

def wrap(value: str, width: int = 92):
    words = clean(value).split(); lines = []; line = ''
    for word in words:
        if line and len(line) + len(word) + 1 > width:
            lines.append(line); line = word
        else:
            line = word if not line else f'{line} {word}'
    return lines + ([line] if line else [])

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

page1 = page_for(text_stream('Inventory Implementation and Validation', [
    ('A. Page Information', [
        'Page: Branch Operations -> Inventory (Stock Items). The page is branch-scoped and uses the persistent SQLite product_catalog_items table through FastAPI.',
        'Implementation summary: searchable and filterable inventory list, stock metrics, manager-only item creation, manager/stock-manager stock adjustment, validation messages and live dashboard integration.',
        'Relevant source files: apps/desktop/src/renderer/InventoryPage.tsx; apps/desktop/src/renderer/Dashboard.tsx; apps/desktop/src/renderer/api.ts; apps/desktop/src/renderer/styles.css; services/local-api/app/main.py; scripts/validate_inventory_live.js.',
    ]),
    ('B. Functionality Checklist', [
        'Branch catalogue loads from GET /api/products and shows item name, SKU, brand, product type, variant, unit, stock, price and status | PASS',
        'Search by item name, SKU, barcode, brand and product type | PASS',
        'Category tabs and stock-status filter | PASS',
        'Refresh action reloads the active branch catalogue | PASS',
        'Branch Manager and Stock Manager can add an item with validation | PASS',
        'Branch Manager and Stock Manager can record positive or negative stock adjustments with a reason | PASS',
        'Sales Officer receives read-only inventory access and cannot mutate stock | PASS',
        'Dashboard inventory summary and table use live branch product records | PASS',
    ]),
]), f'<< /Font << /F1 {font} 0 R >> >>')

page2 = page_for(text_stream('Inventory Implementation and Validation', [
    ('C. Backend Integration', [
        'GET /api/products?branchId=... requires an active authenticated branch role and returns only active products matching the authenticated company_id and branch_id.',
        'POST /api/products requires BRANCH_MANAGER or STOCK_MANAGER, validates required fields, rejects negative stock/prices and duplicate branch SKUs, then commits the product and audit log to SQLite.',
        'PATCH /api/products/{sku}/stock requires BRANCH_MANAGER or STOCK_MANAGER, validates a non-zero reasoned adjustment, prevents negative stock and commits the update plus audit log atomically.',
        'Frontend permissions hide mutation controls for Sales Officer, while backend require_actor enforcement independently rejects direct unauthorized requests.',
    ]),
    ('D. Test Results', [
        'INV-01 | Live manager navigation | Log in as validation.manager and open Inventory | Inventory page and real branch catalogue load | PASS',
        'INV-02 | Search | Search Ghacem | Matching catalogue rows are filtered | PASS',
        'INV-03 | Create item | Save a unique validation item through the UI | Item appears in the branch list and persists through API/SQLite | PASS',
        'INV-04 | Stock adjustment | Add 3 units with a reason | Item stock changes from 12 to 15 | PASS',
        'INV-05 | Backend authorization | Sales Officer calls PATCH stock endpoint directly | HTTP 403 returned | PASS',
        'INV-06 | Dashboard integration | Return to manager Dashboard | Newly created item appears in live inventory overview | PASS',
        'INV-07 | Regression | npm run build:desktop; npm run lint; Python pytest | Build passed, lint passed, 13 tests passed | PASS',
    ]),
]), f'<< /Font << /F1 {font} 0 R >> >>')

image_objects = []
image_commands = []
for path, x, y, w, h in [
    (REPORTS / '53_inventory_live.png', 36, 410, 523, 350),
    (REPORTS / '54_branch_manager_dashboard_live.png', 36, 35, 523, 350),
]:
    jpg = Path('/private/tmp') / f'{path.stem}.jpg'
    subprocess.run(['sips', '-s', 'format', 'jpeg', str(path), '--out', str(jpg)], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    metadata = subprocess.check_output(['sips', '-g', 'pixelWidth', '-g', 'pixelHeight', str(jpg)], text=True)
    width, height = [int(value) for value in re.findall(r'pixel(?:Width|Height): (\d+)', metadata)]
    data = jpg.read_bytes()
    image = obj(f'<< /Type /XObject /Subtype /Image /Width {width} /Height {height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length {len(data)} >>\nstream\n'.encode() + data + b'\nendstream')
    image_objects.append(image); image_commands.append((image, x, y, w, h))

proof = text_stream('Inventory Live Evidence', [
    ('E. Proof of Validation', [
        'The two screenshots below were captured from the running Electron application using Playwright/CDP after manager login, catalogue search, item creation, stock adjustment and dashboard navigation.',
        'The live test returned 15 initial rows, 2 Ghacem search rows, manager mutation success, HTTP 403 for the Sales Officer mutation attempt and dashboard visibility of the newly created item.',
    ]),
    ('F. Outstanding Issues', [
        'Purchasing, stock transfers, import/export and physical stock-count workflows are separate modules and remain for the next implementation stage.',
        'PostgreSQL outbox synchronization for inventory mutations is not yet implemented; offline SQLite persistence is active.',
    ]),
])
for image, x, y, w, h in image_commands:
    proof += f'\nq\n{w} 0 0 {h} {x} {y} cm\n/Im{image_commands.index((image, x, y, w, h)) + 1} Do\nQ\n'.encode()
resources = f'<< /Font << /F1 {font} 0 R >> /XObject << ' + ' '.join(f'/Im{i + 1} {image} 0 R' for i, image in enumerate(image_objects)) + ' >> >>'
page3 = page_for(proof, resources)

pages = obj(b'')
page_refs = [obj(f'<< /Type /Page /Parent {pages} 0 R /MediaBox [0 0 595 842] /Contents {page_ref} 0 R >>'.encode()) for page_ref in (page1, page2, page3)]
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
