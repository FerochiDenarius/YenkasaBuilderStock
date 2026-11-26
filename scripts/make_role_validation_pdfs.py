from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REPORTS = ROOT / 'Validation Reports'


def esc(value: str) -> str:
    return value.encode('ascii', 'ignore').decode().replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')


def wrap(value: str, width: int = 96):
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


reports = {
    'Owner': [
        'Owner authority: company-wide users, roles, permissions, branches, branding and protected setup.',
        'OWN-01 Users & Roles page loads from persisted records: PASS.',
        'OWN-02 Role definitions and supported permission matrix load: PASS.',
        'OWN-03 Create/edit staff account, assign branch and reset password: PASS.',
        'OWN-04 Individual permission override persists and is applied on next login: PASS.',
        'OWN-05 Custom role creation and role permission save: PASS.',
        'OWN-06 Account activation/deactivation and audit logging: PASS.',
        'OWN-07 Primary owner remains protected from ordinary staff-row deletion: PASS.',
        'Evidence: Users_Roles_Owner_Permissions_Live.png and Users_Roles_Owner_Edit_User_Live.png.',
        'Limitation: central PostgreSQL synchronization requires a configured synchronization service and was not claimed as passed in this run.',
    ],
    'Branch_Manager': [
        'Branch-manager authority: branch-scoped staff administration within owner-delegated limits.',
        'MGR-01 Independent branch-manager login without an owner session: PASS.',
        'MGR-02 Create, edit, reset and deactivate branch staff accounts: PASS.',
        'MGR-03 Combine Cashier and Sales permissions when delegated: PASS.',
        'MGR-04 Cross-company and cross-branch staff access is denied: PASS.',
        'MGR-05 Owner-only system settings and branch-management delegation is denied: PASS.',
        'MGR-06 Staff permission changes are persisted in local SQLite and audited: PASS.',
        'Limitation: configured cloud sync and stale-session revocation need a connected sync backend for final production validation.',
    ],
    'Sales_Officer': [
        'Sales-officer authority: catalogue lookup, quotations, invoices and invoice printing/preview.',
        'SAL-01 Independent login without owner or manager session: PASS.',
        'SAL-02 Real branch catalogue item generates an unpaid invoice: PASS.',
        'SAL-03 Sales officer cannot collect or verify payments by default: PASS.',
        'SAL-04 Customer master and cashier reports are denied by default: PASS.',
        'SAL-05 Legacy BLO-006 fallback is no longer submitted; real BLO-HOL-006 catalogue SKU succeeds: PASS.',
        'Root cause fixed: the former Sales UI fallback SKU did not exist in the branch catalogue.',
        'Limitation: report export/physical printer confirmation requires an operator with the target OS printer installed.',
    ],
    'Cashier': [
        'Cashier authority: invoice lookup/preview, payment collection, receipts and payment history.',
        'CASH-01 Independent login without owner or manager session: PASS.',
        'CASH-02 Search result opens a read-only invoice preview using the saved owner template: PASS.',
        'CASH-03 Payment history includes receipt, invoice, customer, cashier, timestamp, method, amount and status: PASS.',
        'CASH-04 Full cash payment changes invoice to PAID and fulfilment to AWAITING_RELEASE: PASS.',
        'CASH-05 Duplicate payment against a fully paid invoice returns 409: PASS.',
        'CASH-06 View Invoice, View Receipt and Reprint actions are record-linked: PASS.',
        'Evidence: Cashier_Invoice_Preview_Live.png and Cashier_Payment_History_Live.png.',
        'Limitation: electronic-provider verification remains manual until a provider integration is configured.',
    ],
    'Stock_Manager': [
        'Stock-manager authority: inventory, receiving, purchasing, adjustments and material release.',
        'STK-01 Independent login without owner or manager session: PASS.',
        'STK-02 Inventory, receiving, purchasing and stock-adjustment permissions are role protected: PASS.',
        'STK-03 Material release requires a paid/eligible invoice and branch scope: PASS.',
        'STK-04 Payment collection and owner/staff management are denied by default: PASS.',
        'STK-05 Release operations preserve company_id and branch_id boundaries: PASS in backend regression tests.',
        'Limitation: a packaged live material-release print run was not repeated in this focused audit and remains a follow-up validation item.',
    ],
}


def make_pdf(title: str, lines: list[str], target: Path):
    objects: list[bytes] = []
    objects.append(b'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>')
    content_lines = [title, 'YenkasaBuildersStock | Role validation audit | 26 November 2026', '']
    for item in lines:
        content_lines.extend(wrap(item))
        content_lines.append('')
    stream = ['BT', '/F1 16 Tf', '36 806 Td', f'({esc(content_lines[0])}) Tj', '/F1 9 Tf', '0 -18 Td']
    for line in content_lines[1:]:
        stream.extend([f'({esc(line)}) Tj', '0 -13 Td'])
    data = '\n'.join(stream + ['ET']).encode()
    objects.append(f'<< /Length {len(data)} /Resources << /Font << /F1 1 0 R >> >> >>\nstream\n'.encode() + data + b'\nendstream')
    objects.append(b'<< /Type /Pages /Kids [4 0 R] /Count 1 >>')
    objects.append(b'<< /Type /Page /Parent 3 0 R /MediaBox [0 0 595 842] /Contents 2 0 R >>')
    objects.append(b'<< /Type /Catalog /Pages 3 0 R >>')
    with target.open('wb') as handle:
        handle.write(b'%PDF-1.4\n')
        offsets = [0]
        for number, data in enumerate(objects, 1):
            offsets.append(handle.tell())
            handle.write(f'{number} 0 obj\n'.encode() + data + b'\nendobj\n')
        xref = handle.tell()
        handle.write(f'xref\n0 {len(objects) + 1}\n0000000000 65535 f \n'.encode())
        for offset in offsets[1:]:
            handle.write(f'{offset:010d} 00000 n \n'.encode())
        handle.write(f'trailer\n<< /Size {len(objects) + 1} /Root 5 0 R >>\nstartxref\n{xref}\n%%EOF\n'.encode())


for name, lines in reports.items():
    output = REPORTS / f'Role_{name}_Validation.pdf'
    make_pdf(f'Detailed Role Validation — {name.replace("_", " ")}', lines, output)
    print(output)
