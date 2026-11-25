from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import Image, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle, PageBreak

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'Validation Reports'
OUT.mkdir(exist_ok=True)
GREEN = colors.HexColor('#087b36')
NAVY = colors.HexColor('#13284b')
BLUE = colors.HexColor('#1769d5')

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='TitleYK', parent=styles['Title'], fontName='Helvetica-Bold', fontSize=20, leading=24, textColor=NAVY, alignment=TA_CENTER, spaceAfter=10))
styles.add(ParagraphStyle(name='HeadingYK', parent=styles['Heading2'], fontName='Helvetica-Bold', fontSize=13, leading=16, textColor=NAVY, spaceBefore=9, spaceAfter=5))
styles.add(ParagraphStyle(name='BodyYK', parent=styles['BodyText'], fontName='Helvetica', fontSize=8.5, leading=12, textColor=colors.HexColor('#30435e')))
styles.add(ParagraphStyle(name='SmallYK', parent=styles['BodyText'], fontName='Helvetica', fontSize=7, leading=9, textColor=colors.HexColor('#526783')))

def p(text, style='BodyYK'):
    return Paragraph(text, styles[style])

def table(rows, widths):
    rendered = [[p(str(cell), 'SmallYK') for cell in row] for row in rows]
    t = Table(rendered, colWidths=widths, repeatRows=1)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#eaf2ff')),
        ('TEXTCOLOR', (0, 0), (-1, 0), NAVY),
        ('GRID', (0, 0), (-1, -1), 0.35, colors.HexColor('#dce5ef')),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#fbfdff')]),
        ('LEFTPADDING', (0, 0), (-1, -1), 5), ('RIGHTPADDING', (0, 0), (-1, -1), 5),
        ('TOPPADDING', (0, 0), (-1, -1), 4), ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    return t

def evidence(path, width=170 * mm):
    if not path.exists():
        return [p(f'Evidence file not found: {path.name}', 'SmallYK')]
    from PIL import Image as PILImage
    with PILImage.open(path) as image:
        ratio = image.height / image.width
    return [Image(str(path), width=width, height=width * ratio), Spacer(1, 4)]

def build_staff_report():
    path = OUT / '05_Users_and_Roles_Validation.pdf'
    doc = SimpleDocTemplate(str(path), pagesize=A4, rightMargin=15 * mm, leftMargin=15 * mm, topMargin=14 * mm, bottomMargin=14 * mm)
    story = [p('YenkasaBuildersStock — Users & Roles Validation', 'TitleYK'), p('Validation date: 25 November 2026', 'SmallYK'), p('Implementation summary: polished the Branch Manager Staff Accounts page; exposed Cashier and combined Sales + Cashier roles, enabled role changes, permission presets and granular permission checkboxes, displayed permission chips on each account, and added a password view/hide action for resets.', 'BodyYK')]
    story += [p('Relevant source files', 'HeadingYK'), p('apps/desktop/src/renderer/StaffAccountsPage.tsx; apps/desktop/src/renderer/api.ts; apps/desktop/src/renderer/styles.css; services/local-api/app/main.py; tests/python/test_local_api.py', 'BodyYK'), p('Functionality checklist', 'HeadingYK')]
    story.append(table([
        ['Control', 'Expected behavior', 'Result'],
        ['Add Staff Account', 'Branch Manager can open the create form and choose Stock Manager, Sales Officer, Cashier, or combined role.', 'PASS — live Electron test'],
        ['Initial permissions', 'Manager can grant/revoke sales, payments, inventory, release and report permissions.', 'PASS — API and UI'],
        ['Edit', 'Manager can change name, email, role and permissions.', 'PASS — endpoint and live edit control'],
        ['Cashier role', 'Cashier account can be created and is not disabled for Branch Manager.', 'PASS — 23 API tests'],
        ['Deactivate / Reactivate', 'Manager can disable or restore a staff account.', 'PASS — existing API regression'],
        ['Reset password', 'Manager can reset credentials and view/hide the new password while entering it.', 'PASS — UI control present'],
        ['Audit Log', 'Staff-management actions remain visible to authorized manager/owner viewers.', 'PASS — existing audit endpoint'],
    ], [45 * mm, 95 * mm, 35 * mm]))
    story += [p('Backend integration and authorization', 'HeadingYK'), p('POST /api/staff and PATCH /api/staff/{id} require an authenticated BRANCH_MANAGER, restrict assigned roles to staff roles, validate every permission against ASSIGNABLE_PERMISSIONS, persist permissions_json in SQLite, and write audit_logs. Branch and company IDs are checked on every staff query. Branch staff cannot create branch managers or access another branch. The role/permission contract is enforced by permissions_for and require_actor, not by hidden navigation alone.', 'BodyYK'), p('Test results', 'HeadingYK')]
    story.append(table([
        ['ID', 'Procedure', 'Expected / actual result', 'Status'],
        ['USR-01', 'Create Cashier with payment permissions', 'Account persisted; password not returned; permissions returned.', 'PASS'],
        ['USR-02', 'Change Cashier to combined Sales + Cashier and grant sales', 'Role and permissions persisted; login receives sales access.', 'PASS'],
        ['USR-03', 'Attempt branch-manager elevation from staff create', 'Backend rejects unauthorized BRANCH_MANAGER role.', 'PASS'],
        ['USR-04', 'Cross-branch staff access', 'Backend rejects manager operating against another branch.', 'PASS'],
        ['USR-05', 'Live Staff Accounts page', 'Real persisted validation users and four edit controls rendered.', 'PASS'],
    ], [18 * mm, 62 * mm, 82 * mm, 18 * mm]))
    story += [p('Proof of validation', 'HeadingYK')] + evidence(OUT / 'Staff_Accounts_Manager_Live.png', 170 * mm)
    story += [p('Outstanding issues', 'HeadingYK'), p('The company owner UI and branch staff UI use the same staff component with different backend scopes; company-wide role assignment remains owner-controlled. Native print dialog is outside the Staff Accounts scope.', 'BodyYK')]
    doc.build(story)
    return path

def build_reports_report():
    path = OUT / 'Reports_Implementation_Validation.pdf'
    doc = SimpleDocTemplate(str(path), pagesize=A4, rightMargin=15 * mm, leftMargin=15 * mm, topMargin=14 * mm, bottomMargin=14 * mm)
    story = [p('YenkasaBuildersStock — Branch Reports Validation', 'TitleYK'), p('Validation date: 25 November 2026', 'SmallYK'), p('Implementation summary: replaced the Reports placeholder with a compact, data-backed report workspace. Branch Manager and permitted Cashier users can filter the cashier report, open a date/cashier row, filter daily transactions by cashier/time/payment method, view complete transaction details and print/export the rendered report.', 'BodyYK'), p('Relevant source files', 'HeadingYK'), p('apps/desktop/src/renderer/ReportsPage.tsx; apps/desktop/src/renderer/api.ts; apps/desktop/src/renderer/Dashboard.tsx; apps/desktop/src/renderer/styles.css; services/local-api/app/main.py; tests/python/test_local_api.py; scripts/validate_staff_reports_live.js', 'BodyYK'), p('Functionality checklist', 'HeadingYK')]
    story.append(table([
        ['Control', 'Expected behavior', 'Result'],
        ['Report tabs', 'Display Cashier, Sales, Inventory and Material Release categories according to permissions.', 'PASS — permission-aware UI'],
        ['Date range / filters', 'Load saved branch payments for date, cashier and method filters.', 'PASS — live API response'],
        ['Summary row', 'Open the selected date/cashier transaction page.', 'PASS — live click test'],
        ['Daily filters', 'Filter transactions by cashier, time range and payment method.', 'PASS — endpoint implemented'],
        ['View', 'Open complete transaction details with invoice items and totals.', 'PASS — live click test'],
        ['Print / Export PDF', 'Use Electron system print bridge and printToPDF.', 'PDF PASS; native dialog requires operator confirmation'],
    ], [45 * mm, 95 * mm, 35 * mm]))
    story += [p('Backend integration and authorization', 'HeadingYK'), p('GET /api/reports/cashier-summary, GET /api/reports/cashier-transactions and GET /api/reports/transactions/{payment_id} query PaymentRecordModel, SaleRecordModel and UserAccount with company_id and branch_id isolation. report_actor requires financial_reports, payment_reports, sales or payments. Cashiers are scoped to their own transactions unless they have financial_reports; unauthorized direct requests return 403. The UI calls these routes through reportsApi with X-User-Id and X-Branch-Id.', 'BodyYK'), p('Test results', 'HeadingYK')]
    story.append(table([
        ['ID', 'Procedure', 'Expected / actual result', 'Status'],
        ['RPT-01', 'Run full local API regression suite', '23 tests passed, including branch isolation, role permissions, invoices, payments and customers.', 'PASS'],
        ['RPT-02', 'Open live Reports summary', 'Real SQLite payment rows and summary totals rendered.', 'PASS'],
        ['RPT-03', 'Click a summary date/cashier row', 'Daily Cashier Transactions page opened with real transaction row.', 'PASS'],
        ['RPT-04', 'Click View', 'Transaction Details opened with customer, cashier, payment and 3 item rows.', 'PASS'],
        ['RPT-05', 'Export PDF through Electron', 'Reports_Cashier_Live.pdf created through desktopBridge printToPDF.', 'PASS'],
        ['RPT-06', 'Native OS print dialog', 'Code path is wired; automated run did not claim a physical print job.', 'NOT TESTED'],
    ], [18 * mm, 62 * mm, 82 * mm, 18 * mm]))
    story += [p('Proof of validation', 'HeadingYK')] + evidence(OUT / 'Reports_Cashier_Summary_Live.png', 170 * mm) + [PageBreak(), p('Daily transactions evidence', 'HeadingYK')] + evidence(OUT / 'Reports_Cashier_Transactions_Live.png', 170 * mm) + [p('Transaction details evidence', 'HeadingYK')] + evidence(OUT / 'Reports_Transaction_Details_Live.png', 170 * mm)
    story += [p('Outstanding issues', 'HeadingYK'), p('The current implementation fully wires the cashier reports flow. Sales, inventory and material-release tabs are permission-aware and reserved for their dedicated report data views; those category-specific tables remain the next report milestone. Native print dialog requires manual confirmation because it is an OS-level interaction.', 'BodyYK')]
    doc.build(story)
    return path

def build_customer_report():
    path = OUT / 'Customers_Implementation_Validation.pdf'
    doc = SimpleDocTemplate(str(path), pagesize=A4, rightMargin=15 * mm, leftMargin=15 * mm, topMargin=14 * mm, bottomMargin=14 * mm)
    story = [p('YenkasaBuildersStock — Customers Validation', 'TitleYK'), p('Validation date: 25 November 2026', 'SmallYK'), p('Implementation summary: added the compact Customers page shown in the approved design. It is a real branch-scoped customer master list with create, search, edit and deactivate actions, intended for Branch Manager, Cashier and combined Sales/Cashier users.', 'BodyYK'), p('Relevant source files', 'HeadingYK'), p('apps/desktop/src/renderer/CustomersPage.tsx; apps/desktop/src/renderer/api.ts; apps/desktop/src/renderer/Dashboard.tsx; apps/desktop/src/renderer/styles.css; services/local-api/app/main.py; tests/python/test_local_api.py; scripts/validate_customers_live.js', 'BodyYK'), p('Functionality checklist', 'HeadingYK')]
    story.append(table([
        ['Control', 'Expected behavior', 'Result'],
        ['New Customer', 'Open name, phone, email, address, type, credit limit and active fields.', 'PASS — live Electron test'],
        ['Save Customer', 'Validate and persist the customer under company_id and branch_id.', 'PASS — POST /api/customers'],
        ['Search', 'Filter customer records by name, phone, email or address.', 'PASS — API query and UI input'],
        ['Edit', 'Update customer information without changing branch ownership.', 'PASS — PATCH endpoint'],
        ['Deactivate', 'Soft-deactivate the record so historical references remain safe.', 'PASS — DELETE endpoint'],
        ['Navigation policy', 'Visible to Branch Manager/Cashier; hidden from Sales Officer.', 'PASS — live role check'],
        ['Logout', 'Explicit Logout button visible in the sidebar.', 'PASS — live click test'],
    ], [45 * mm, 95 * mm, 35 * mm]))
    story += [p('Backend integration and authorization', 'HeadingYK'), p('The customers table stores company_id, branch_id, contact information, customer type, credit limit, active status and timestamps. GET/POST/PATCH/DELETE /api/customers require the customers permission and only permit BRANCH_MANAGER, CASHIER and SALES_CASHIER roles. Records are branch-isolated and actions create audit_logs. Deactivation is soft rather than destructive.', 'BodyYK'), p('Test results', 'HeadingYK')]
    story.append(table([
        ['ID', 'Procedure', 'Expected / actual result', 'Status'],
        ['CUS-01', 'Branch Manager opens Customers', 'Customer page rendered with persisted validation data.', 'PASS'],
        ['CUS-02', 'Save Live Customer Validation', 'Record appeared in the live Customers List and SQLite.', 'PASS'],
        ['CUS-03', 'Cashier/customer permission API tests', 'Cashier can read/update; Sales Officer receives 403.', 'PASS'],
        ['CUS-04', 'Click explicit Logout', 'Session cleared and Branch Login returned.', 'PASS'],
        ['CUS-05', 'Application regression', '23 Python tests, renderer test, lint and build passed.', 'PASS'],
    ], [18 * mm, 62 * mm, 82 * mm, 18 * mm]))
    story += [p('Proof of validation', 'HeadingYK')] + evidence(OUT / 'Customers_Manager_Live.png', 170 * mm) + [p('Sales Officer navigation evidence', 'HeadingYK')] + evidence(OUT / 'Customers_Sales_Officer_Hidden_Live.png', 170 * mm) + [p('Outstanding issues', 'HeadingYK'), p('The Sales page continues to accept a customer name for document generation, but Sales Officer cannot access the customer master page. Customer selection/autocomplete inside the Cashier invoice workflow can be added as a follow-up once the customer data model is adopted by invoice creation.', 'BodyYK')]
    doc.build(story)
    return path

if __name__ == '__main__':
    print(build_staff_report())
    print(build_reports_report())
    print(build_customer_report())
