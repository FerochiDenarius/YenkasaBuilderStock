from pathlib import Path
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]
REPORTS = ROOT / 'Validation Reports'
REPORTS.mkdir(exist_ok=True)
PDF = REPORTS / 'Cashier_Payments_Implementation_Validation.pdf'
SCREENSHOT = REPORTS / '50_cashier_payment_live.png'

def clean(value: str) -> str:
    return value.encode('ascii', 'ignore').decode()

def esc(value: str) -> str:
    return clean(value).replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')

def wrap(value: str, width: int = 94):
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

resources = f'<< /Font << /F1 {font} 0 R >> >>'
page1 = page_for(text_stream('Cashier and Payments Implementation Validation', [
    ('A. Page Information', [
        'Module: Branch Operations -> Cashier and Payments. The cashier screen receives payment against an existing invoice and issues a receipt; it does not recreate or edit invoice items.',
        'Implementation summary: added role-scoped invoice search, invoice summary, cash/electronic payment collection, pending electronic verification, receipt generation, history and offline SQLite persistence.',
        'Relevant source files: apps/desktop/src/renderer/CashierPage.tsx; apps/desktop/src/renderer/api.ts; apps/desktop/src/renderer/Dashboard.tsx; apps/desktop/src/renderer/styles.css; packages/contracts/src/index.ts; services/local-api/app/main.py; tests/python/test_local_api.py; scripts/validate_cashier_live.js.',
    ]),
    ('B. Functionality Checklist', [
        'Invoice search and unpaid invoice list | GET /api/cashier/invoices | PASS',
        'Invoice summary shows customer, issuing user, item lines, total, paid amount, balance and fulfilment status | PASS',
        'Cash, Mobile Money, Bank Transfer and Card method selectors | PASS',
        'Cash payment validates positive amount and prevents overpayment | PASS',
        'Electronic payments require a transaction reference and remain pending until authorized verification | PASS',
        'Manual electronic verification requires an evidence note and creates a receipt only after confirmation | PASS',
        'Payment history loads from payment_records | PASS',
        'Receipt number is branch-scoped and receipt is saved in receipt_records | PASS',
        'Preview Receipt uses the owner saved Receipt Template settings and renders the complete paid invoice item list, quantities, invoice totals, paid-to-date and balance | PASS',
        'Native receipt PDF export works offline through Electron printToPDF with 80mm paper size | PASS',
        'Preview and Print Receipt actions use the Electron print bridge; native dialog confirmation is exposed to the user | IMPLEMENTED; dialog confirmation not automated',
    ]),
]), resources)

page2 = page_for(text_stream('Cashier and Payments Implementation Validation', [
    ('C. Backend Integration', [
        'GET /api/cashier/invoices and GET /api/payments/history require a live authenticated user ID, branch ID and CASHIER, BRANCH_MANAGER or legacy SALES_CASHIER role. Records are filtered by company_id and branch_id.',
        'POST /api/payments validates method, amount, invoice ownership and outstanding balance. Cash commits payment, invoice amount_paid/payment_status/fulfilment_status, receipt and audit log in one SQLite transaction.',
        'Electronic payments are stored as PENDING_VERIFICATION and cannot change invoice status or release eligibility. POST /api/payments/{id}/verify requires evidence and creates a receipt after manual confirmation.',
        'Sales Officer and Stock Manager payment attempts are rejected by the backend, independent of hidden navigation. Duplicate submissions with the same idempotency key return the original payment instead of creating a second transaction.',
        'Tables: sales_records, payment_records, receipt_records and audit_logs. The current repository has no completed PostgreSQL outbox/synchronization service; central sync remains an outstanding integration item.',
    ]),
    ('D. Test Results', [
        'PAY-UI-01 | Cashier login/navigation | Sign in as validation.cashier and open Cashier & Payments | Cashier module and only authorized nav visible | PASS',
        'PAY-UI-02 | Invoice search | Select a live unpaid invoice created for Cashier Live Customer | Summary loads actual invoice and item data | PASS',
        'PAY-UI-03 | Cash collection | Enter live outstanding amount and confirm | Invoice becomes PAID and receipt success appears | PASS',
        'PAY-UI-04 | Receipt preview | Click Preview Receipt after confirmation | Live receipt preview opens with transaction values | PASS',
        'PAY-UI-05 | Owner template binding | Load company documentTemplates and open receipt preview | Owner template label and full item table render | PASS',
        'PAY-API-01 | Cash persistence | Query cashier invoice after payment | PAID and AWAITING_RELEASE persisted in SQLite | PASS',
        'PAY-API-02 | Receipt | Inspect live response and receipt_records | Branch receipt number and amount returned | PASS',
        'PAY-API-03 | Overpayment | Submit amount greater than balance | 422 and no extra payment | PASS',
        'PAY-API-04 | Idempotency | Repeat same payment idempotency key | Original payment returned, no duplicate receipt | PASS',
        'PAY-API-05 | Electronic pending | Submit Mobile Money reference | PENDING_VERIFICATION and invoice remains UNPAID | PASS',
        'PAY-API-06 | Manual verification | Verify with evidence note | VERIFIED_MANUAL, PAID and receipt generated | PASS',
        'PAY-SEC-01 | Separation of duties | Sales Officer posts to payment endpoint | 403 backend rejection | PASS',
        'PAY-REG-01 | Regression | pytest, npm run lint, npm run build:desktop | 13 tests passed; lint passed; desktop build passed | PASS',
    ]),
]), resources)

image_path = Path('/private/tmp/cashier-payment-live.jpg')
subprocess.run(['sips', '-s', 'format', 'jpeg', str(SCREENSHOT), '--out', str(image_path)], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
metadata = subprocess.check_output(['sips', '-g', 'pixelWidth', '-g', 'pixelHeight', str(image_path)], text=True)
width, height = [int(value) for value in re.findall(r'pixel(?:Width|Height): (\d+)', metadata)]
image_data = image_path.read_bytes()
image = obj(f'<< /Type /XObject /Subtype /Image /Width {width} /Height {height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length {len(image_data)} >>\nstream\n'.encode() + image_data + b'\nendstream')
proof = text_stream('Cashier and Payments Live Evidence', [
    ('E. Proof of Validation', [
        'The screenshot below was captured from the running Electron application through Playwright/CDP after a real invoice was created, selected and paid by the persisted validation cashier account.',
        'The actual receipt PDF is Validation Reports/50_cashier_receipt_live.pdf. It was produced by Electron printToPDF from the live receipt DOM, not from a mockup.',
        'Validation Reports/50_cashier_receipt_preview_live.png shows the live Preview Receipt dialog with the owner-template label, complete item row and payment totals. The live test also invoked window.desktopBridge.print; the native dialog returned false after automated dismissal, confirming the call completed without claiming a print job was sent.',
    ]),
    ('F. Outstanding Issues', [
        'Material Release is the next workflow stage. The current paid state is AWAITING_RELEASE and does not deduct stock automatically.',
        'PostgreSQL synchronization/outbox processing, provider APIs for MoMo/bank/card verification and fully automated native print-dialog confirmation remain outstanding.',
        'Offline SQLite payment operations are implemented and validated; automatic central synchronization after reconnection is not yet implemented.',
    ]),
])
proof += b'\nq\n523 0 0 330 36 390 cm\n/Im1 Do\nQ\n'
page3 = page_for(proof, f'<< /Font << /F1 {font} 0 R >> /XObject << /Im1 {image} 0 R >> >>')

pages = obj(b'')
page_refs = [obj(f'<< /Type /Page /Parent {pages} 0 R /MediaBox [0 0 595 842] /Contents {ref} 0 R >>'.encode()) for ref in (page1, page2, page3)]
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
