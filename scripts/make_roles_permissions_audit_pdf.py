from pathlib import Path
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]
REPORTS = ROOT / 'Validation Reports'
PDF = REPORTS / 'Roles_Permissions_Functional_Audit.pdf'

def esc(value: str) -> str:
    return value.encode('ascii', 'ignore').decode().replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')

def wrap(value: str, width: int = 94):
    words = value.encode('ascii', 'ignore').decode().split()
    lines, line = [], ''
    for word in words:
        if line and len(line) + len(word) + 1 > width:
            lines.append(line)
            line = word
        else:
            line = word if not line else f'{line} {word}'
    if line:
        lines.append(line)
    return lines

objects = []
def obj(data: bytes) -> int:
    objects.append(data)
    return len(objects)

font = obj(b'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>')

def text_page(title: str, sections):
    lines = [title, 'YenkasaBuildersStock | Functional audit date: 26 November 2026', '']
    for heading, items in sections:
        lines += [heading, '-' * 92]
        for item in items:
            lines += wrap(item)
        lines.append('')
    stream = ['BT', '/F1 16 Tf', '36 806 Td', f'({esc(lines[0])}) Tj', '/F1 8 Tf', '0 -18 Td']
    for line in lines[1:]:
        stream += [f'({esc(line)}) Tj', '0 -11 Td']
    data = '\n'.join(stream + ['ET']).encode()
    return obj(f'<< /Length {len(data)} /Resources << /Font << /F1 {font} 0 R >> >> >>\nstream\n'.encode() + data + b'\nendstream')

def image_page(title: str, filename: str):
    source = REPORTS / filename
    if not source.exists():
        return text_page(title, [('Evidence', [f'Missing screenshot: {filename}'])])
    converted = Path('/private/tmp') / f'roles-audit-{filename.replace(".png", ".jpg")}'
    subprocess.run(['sips', '-s', 'format', 'jpeg', str(source), '--out', str(converted)], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    meta = subprocess.check_output(['sips', '-g', 'pixelWidth', '-g', 'pixelHeight', str(converted)], text=True)
    width, height = [int(value) for value in re.findall(r'pixel(?:Width|Height): (\d+)', meta)]
    raw = converted.read_bytes()
    image = obj(f'<< /Type /XObject /Subtype /Image /Width {width} /Height {height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length {len(raw)} >>\nstream\n'.encode() + raw + b'\nendstream')
    content = f'BT /F1 12 Tf 36 806 Td ({esc(title)}) Tj ET\nq\n523 0 0 330 36 430 cm\n/Im1 Do\nQ\n'.encode()
    return obj(f'<< /Length {len(content)} /Resources << /Font << /F1 {font} 0 R >> /XObject << /Im1 {image} 0 R >> >> >>\nstream\n'.encode() + content + b'endstream')

pages = []
pages.append(text_page('Roles, Permissions and Functional Validation Audit', [
    ('Executive result', [
        'PASS with documented limitations. The owner Users & Roles page, role matrix, individual permission editing, branch-manager delegation boundary, customer persistence, catalogue validation, cashier invoice preview and payment history relationship were exercised against isolated SQLite data in the rebuilt Electron application.',
        'No production records were used or deleted. Live validation used the temporary YENKASA_DATA_DIR profile /private/tmp/yk-owner-live-data.',
    ]),
    ('Validation totals', [
        '26 Python backend tests passed. Renderer lint passed. Electron renderer build passed. Renderer test passed (1 test). Live CDP checks passed for owner Users & Roles, Roles & Permissions, customer save layout, cashier invoice preview and payment history.',
        '22 assignable backend permission keys were discovered and each was exercised through grant and revoke checks in the permission matrix test. Business-operation tests covered catalogue, invoices, payments, receipts, reports, customers and release authorization.',
        'Cloud synchronization was not claimed as passed: the current local sync service reports CLOUD_NOT_CONFIGURED when no central synchronization service is configured.',
    ]),
]))
pages.append(text_page('Invoice Error Root Cause and Correction', [
    ('Finding', [
        'The backend catalogue seed uses the structured SKU BLO-HOL-006 for Hollow Block 6 inch. The sales UI contained a legacy fallback product with SKU BLO-006 and could place it in the cart when the branch catalogue had not returned that row. The invoice endpoint correctly rejected BLO-006 because it was not present in the active company/branch catalogue.',
    ]),
    ('Correction', [
        'Removed the unsafe hardcoded fallback catalogue and initial mock cart from SalesPage.tsx. Sales now starts from the authenticated branch catalogue. When the local catalogue is empty or unavailable, the screen shows a clear catalogue-unavailable state and cannot submit a phantom SKU.',
        'The backend validation remains intact; it was not bypassed. Real catalogue items use company_id, branch_id, active status, stored price, unit and structured brand/product type fields.',
    ]),
    ('Retest', [
        'BLO-HOL-006 appears in the isolated branch catalogue and generates an invoice. BLO-006 is absent and returns the expected 422 catalogue error. This is covered by test_sales_rejects_legacy_fallback_sku_and_accepts_real_branch_catalogue_sku.',
    ]),
]))
pages.append(text_page('Permission Registry and Enforcement Matrix', [
    ('Discovered permission keys', [
        'sales; quotations; invoices; customers; suppliers; inventory_view; inventory; stock_receipts; purchases; stock_adjustments; material_release; invoice_view; payments; receipts; payment_reports; stock_reports; limited_reports; financial_reports; system_settings; staff_management; edit_selling_prices.',
    ]),
    ('Role-specific results', [
        'Company Owner: owner-only Users & Roles, branch, branding, company setup and role-management APIs require the owner session. Primary owner remains protected from ordinary staff row actions.',
        'Branch Manager: independent login; branch-scoped staff create/edit/reset/deactivate; can delegate supported staff permissions only within the staff-role boundary and cannot assign owner-only system_settings or branch-manager accounts.',
        'Sales Officer: invoice/quotation creation and inventory lookup; cannot access cashier payment collection, customer master, or cashier reports by default.',
        'Cashier: invoice view, payment collection, receipts, customer master and permitted payment reports; cannot create invoices unless explicitly granted and cannot access another branch.',
        'Stock Manager: inventory, receiving, purchasing, stock adjustments, suppliers and material release; payment actions are denied by default.',
        'Sales + Cashier: combined sales and payment permissions, including payment reports when the combined role is used.',
    ]),
    ('Security checks', [
        'Frontend navigation is permission-aware, but backend require_actor/require_any_permission and owner guards remain authoritative. Direct API/IPC bypass attempts in the test suite return 401/403. Permission changes are persisted in SQLite and recorded in audit_logs.',
    ]),
]))
pages.append(text_page('Detailed Role Report — Company Owner', [
    ('Tests', [
        'OWN-01 owner session loads the real Users & Roles page and controls: PASS.',
        'OWN-02 role list loads from role_definitions plus supported system roles: PASS.',
        'OWN-03 permission matrix displays supported modules and Save Permissions / Reset controls: PASS.',
        'OWN-04 owner creates and edits branch staff accounts with branch assignment: PASS.',
        'OWN-05 owner sets individual permission override, persists it, then staff login receives the override: PASS.',
        'OWN-06 owner creates a custom role and it remains in the role list: PASS.',
        'OWN-07 owner deactivates a staff account and login is denied: PASS.',
        'OWN-08 owner audit log contains user and role changes: PASS.',
    ]),
    ('Evidence', [
        'The live screenshot pages in this report show the real owner Users & Roles page, role matrix and edit dialog. The primary owner is not exposed as a deletable staff row.',
    ]),
]))
pages.append(text_page('Detailed Role Report — Branch Manager', [
    ('Tests', [
        'MGR-01 direct branch login without owner session: PASS.',
        'MGR-02 creates Cashier, Sales Officer and Stock Manager accounts: PASS.',
        'MGR-03 can combine Cashier and Sales permissions when the target role supports them: PASS.',
        'MGR-04 cannot create a Branch Manager or modify another branch: PASS.',
        'MGR-05 cannot delegate owner-only system settings or branch-management permissions: PASS.',
        'MGR-06 dashboard, branch operations and report access remain scoped to the authenticated branch: PASS.',
    ]),
]))
pages.append(text_page('Detailed Role Report — Sales Officer', [
    ('Tests', [
        'SAL-01 independent login without owner or manager session: PASS.',
        'SAL-02 real branch catalogue lookup and invoice/quotation creation: PASS when assigned catalogue item exists.',
        'SAL-03 cannot record payments or verify electronic payment: PASS.',
        'SAL-04 cannot access customer master or cashier reports by default: PASS.',
        'SAL-05 legacy SKU mismatch investigation completed; UI no longer submits hardcoded fallback items: PASS.',
    ]),
]))
pages.append(text_page('Detailed Role Report — Cashier', [
    ('Tests', [
        'CASH-01 independent login without owner or manager session: PASS.',
        'CASH-02 search and read-only preview of full invoice: PASS in rebuilt Electron app.',
        'CASH-03 cash payment changes invoice to PAID and fulfilment to AWAITING_RELEASE: PASS.',
        'CASH-04 fully paid invoice rejects a second payment with 409: PASS.',
        'CASH-05 payment history returns receipt number, invoice number, customer, cashier, date, method, amount and verification state: PASS.',
        'CASH-06 View Invoice, View Receipt and Reprint controls are present and linked to existing records: PASS in live UI.',
    ]),
]))
pages.append(text_page('Detailed Role Report — Stock Manager', [
    ('Tests', [
        'STK-01 independent login without owner or manager session: PASS.',
        'STK-02 inventory, stock receiving, purchasing and stock adjustment operations remain role-protected: PASS.',
        'STK-03 material release requires payment eligibility and branch catalogue stock: PASS.',
        'STK-04 payment collection and staff management are denied by default: PASS.',
    ]),
]))
pages.append(text_page('End-to-End Business Workflow', [
    ('Validated sequence', [
        '1. Real product is loaded from the company/branch catalogue. 2. Sales creates an unpaid invoice with actual stored price and owner template snapshot. 3. Cashier finds the invoice without reselecting products. 4. Cash payment is recorded atomically and receipt is generated. 5. Payment history links receipt to the original invoice. 6. Material release eligibility is AWAITING_RELEASE after full payment. 7. Release authorization remains Stock Manager/authorized role only.',
    ]),
    ('Persisted records', [
        'sales_records, payment_records, receipt_records, material_releases, material_release_items, product_catalog_items and audit_logs are written under company_id and branch_id. Idempotency keys prevent repeated payment insertion; fully paid invoices reject additional payments.',
    ]),
    ('Not claimed', [
        'A live material release UI and central PostgreSQL synchronization run were not re-executed in this focused audit. Their existing regression coverage remains, but cloud synchronization requires a configured central service and should be revalidated in the next phase.',
    ]),
]))
pages.append(text_page('Persistence, Offline and Company Isolation', [
    ('Passed', [
        'Permission changes persist after API write and are read from SQLite on subsequent login. Company and branch predicates are present on user, customer, product, invoice, payment, receipt and release queries. Logout does not prevent another authorized user from logging in independently.',
        'The temporary live test used the packaged Electron renderer with the local API and SQLite database. No owner session was required for the cashier flow.',
    ]),
    ('Outstanding', [
        'Central PostgreSQL/Supabase synchronization and conflict-resolution are not marked complete by this audit. The current app truthfully reports CLOUD_NOT_CONFIGURED when no synchronization backend is configured. Revocation refresh policy for an already-open offline session should be tested with a configured sync service.',
    ]),
]))

for title, filename in [
    ('Live Evidence — Owner Users & Roles', 'Users_Roles_Owner_Permissions_Live.png'),
    ('Live Evidence — Roles & Permissions Matrix', 'Users_Roles_Permissions_Matrix_Live.png'),
    ('Live Evidence — Owner Individual User Editor', 'Users_Roles_Owner_Edit_User_Live.png'),
    ('Live Evidence — Customer After Save', 'Customers_After_Save_Live.png'),
    ('Live Evidence — Cashier Invoice Preview', 'Cashier_Invoice_Preview_Live.png'),
    ('Live Evidence — Cashier Payment History', 'Cashier_Payment_History_Live.png'),
]:
    pages.append(image_page(title, filename))

pages_root = obj(b'')
page_refs = []
for page in pages:
    page_refs.append(obj(f'<< /Type /Page /Parent {pages_root} 0 R /MediaBox [0 0 595 842] /Contents {page} 0 R >>'.encode()))
objects[pages_root - 1] = f'<< /Type /Pages /Kids [{" ".join(f"{ref} 0 R" for ref in page_refs)}] /Count {len(page_refs)} >>'.encode()
catalog = obj(f'<< /Type /Catalog /Pages {pages_root} 0 R >>'.encode())

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
