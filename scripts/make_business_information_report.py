from pathlib import Path
import html
import subprocess

ROOT = Path(__file__).resolve().parents[1]
REPORTS = ROOT / "Validation Reports"
REPORTS.mkdir(exist_ok=True)
pdf_path = REPORTS / "01_Business_Information_Validation.pdf"
html_path = Path("/private/tmp/01_business_information_validation.html")

def file_url(path: Path) -> str:
    return path.as_uri()

checklist = [
    ("Registered Company Name", "Controlled required text input", "Implemented and exercised", "PASS"),
    ("Trading / Business Name", "Controlled required text input", "Implemented and exercised", "PASS"),
    ("Business Category", "Dropdown selection and required validation", "Implemented and exercised", "PASS"),
    ("Business Email", "Email input with format validation", "Implemented and exercised", "PASS"),
    ("Phone Number", "Phone input with format validation", "Implemented and exercised", "PASS"),
    ("Country / Currency / Timezone", "Dropdown selections persisted", "Implemented and exercised", "PASS"),
    ("Business Address", "Required multiline text input", "Implemented and exercised", "PASS"),
    ("Reset Changes", "Restore last saved values without an API write", "Implemented and exercised", "PASS"),
    ("Save Changes", "Validate and persist through FastAPI to SQLite", "Implemented and exercised", "PASS"),
    ("Company Profile preview", "Reflect current form state", "Implemented and visually verified", "PASS"),
]

tests = [
    ("BI-UI-01", "Navigation and rendering", "Launch Electron; select Company Setup → Business Information", "Page and controls render", "Page loaded in running Electron; screenshot captured", "PASS"),
    ("BI-UI-02", "Required-field validation", "Clear Registered Company Name; click Save Changes", "Useful validation; no write", "Alert displayed: Review the highlighted fields before saving", "PASS"),
    ("BI-UI-03", "Valid save", "Fill valid values; click Save Changes", "Success status and API write", "Saved locally to SQLite", "PASS"),
    ("BI-UI-04", "Reset", "Change Trading / Business Name; click Reset Changes", "Last saved value restored", "Validation Builders restored; status Changes reset", "PASS"),
    ("BI-API-01", "Health endpoint", "GET /health", "200 and local-api status", "200; local-api status returned", "PASS"),
    ("BI-API-02", "Company save/read", "PUT /api/company then GET /api/company", "200 responses and persisted fields", "PUT 200; GET 200; saved company returned", "PASS"),
    ("BI-API-03", "Invalid request", "PUT malformed email and empty fields", "422 validation response", "HTTP 422 with email validation detail", "PASS"),
    ("BI-DB-01", "SQLite persistence", "Restart local API and query /api/company", "Record survives process restart", "Validation Builders Ltd / Validation Builders restored", "PASS"),
    ("BI-DB-02", "Electron restart persistence", "Close and relaunch Electron against same SQLite file", "Saved fields reload", "Registered, trading, category, and email reloaded correctly", "PASS"),
    ("BI-OFF-01", "Offline-first local storage", "Run with PostgreSQL unavailable; save through loopback local API", "Local operation does not require PostgreSQL", "Local API uses SQLite; no PostgreSQL dependency in this flow", "PASS"),
    ("BI-REG-01", "Build and regression", "Build desktop; frontend test; local pytest", "No compilation/test regressions", "Build passed; frontend 1 test; backend 3 tests", "PASS"),
    ("BI-CLOUD-01", "Central PostgreSQL synchronization", "Inspect current architecture", "Cloud sync and authorization enforced", "Not implemented for this page; tracked as outstanding", "NOT TESTED"),
]

def rows(items):
    return "".join("<tr>" + "".join(f"<td>{html.escape(str(cell))}</td>" for cell in item) + "</tr>" for item in items)

page = f"""<!doctype html>
<html><head><meta charset='utf-8'><style>
@page {{ size: A4; margin: 15mm; }}
body {{ font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif; color: #172b4d; font-size: 10px; line-height: 1.4; }}
h1 {{ color: #0b2d6b; font-size: 26px; margin: 0 0 4px; }} h2 {{ color: #0b2d6b; font-size: 16px; margin: 20px 0 7px; border-bottom: 2px solid #dbe5f4; padding-bottom: 4px; }}
.meta {{ color: #53637c; margin-bottom: 16px; }} .badge {{ display: inline-block; padding: 3px 7px; border-radius: 10px; background: #dcf8e5; color: #167a4a; font-weight: bold; }}
table {{ border-collapse: collapse; width: 100%; margin: 6px 0 12px; }} th {{ background: #0b2d6b; color: white; text-align: left; }} th, td {{ border: 1px solid #d8e1ed; padding: 5px; vertical-align: top; }} tr:nth-child(even) {{ background: #f7f9fc; }}
.evidence {{ page-break-inside: avoid; margin: 9px 0 13px; }} .evidence img {{ max-width: 100%; max-height: 155mm; border: 1px solid #cad6e5; }} .caption {{ color: #53637c; font-size: 9px; margin-top: 3px; }}
code {{ font-family: Menlo, monospace; font-size: 9px; }} .note {{ background: #fff8e6; border-left: 4px solid #f7b500; padding: 8px; }}
</style></head><body>
<h1>Business Information Validation Report</h1>
<div class='meta'><b>Page:</b> Business Information &nbsp; | &nbsp; <b>Date:</b> 21 November 2026 &nbsp; | &nbsp; <span class='badge'>PAGE VALIDATED</span></div>
<h2>A. Page Information</h2>
<p><b>Implementation summary:</b> Replaced uncontrolled setup fields with controlled React state, constrained category/country/currency/timezone dropdowns, field-level validation, reset-to-last-save behavior, and a live FastAPI client backed by SQLite. The page is reached from the dashboard’s Company Setup navigation.</p>
<p><b>Relevant source files:</b> <code>apps/desktop/src/renderer/BusinessInfoPage.tsx</code>, <code>apps/desktop/src/renderer/api.ts</code>, <code>apps/desktop/src/renderer/Dashboard.tsx</code>, <code>apps/desktop/src/renderer/styles.css</code>, <code>services/local-api/app/main.py</code>, <code>tests/python/test_local_api.py</code>.</p>
<h2>B. Functionality Checklist</h2>
<table><tr><th>Control</th><th>Expected behavior</th><th>Implementation / validation</th><th>Result</th></tr>{rows(checklist)}</table>
<h2>C. Backend Integration</h2>
<p><b>API:</b> <code>GET /health</code> verifies the loopback FastAPI service; <code>GET /api/company</code> loads the company record; <code>PUT /api/company</code> validates and upserts the company record.</p>
<p><b>Storage and data flow:</b> React state → typed <code>companyApi</code> fetch client → FastAPI/Pydantic validation → SQLAlchemy <code>companies</code> table in SQLite → response rehydrates the form and preview. The current page is company-level; branch-scoped records and central PostgreSQL synchronization are not yet implemented in this repository.</p>
<p><b>Authorization:</b> No authenticated company/branch session or headquarters authorization middleware exists yet for this page. This is explicitly listed as an outstanding issue, not treated as passed.</p>
<h2>D. Test Results</h2>
<table><tr><th>Test ID</th><th>Feature</th><th>Procedure</th><th>Expected</th><th>Actual</th><th>Result</th></tr>{rows(tests)}</table>
<h2>E. Proof of Validation</h2>
<p>Evidence below was captured from the running Electron application and live loopback API. The screenshots are original captures, not mockups.</p>
<div class='evidence'><img src='{file_url(REPORTS / "01_business_information_ui.png")}'><div class='caption'>Running Electron page after navigation; visible controlled fields, dropdowns, preview, Reset, and Save controls.</div></div>
<div class='evidence'><img src='{file_url(REPORTS / "01_business_information_saved.png")}'><div class='caption'>Running Electron page after save/reset interaction; values remained restored from the last saved state.</div></div>
<p><b>Live API evidence:</b> <code>PUT /api/company → HTTP 200</code>; <code>GET /api/company → HTTP 200</code>; malformed email request → <code>HTTP 422</code>. Restarted Electron reload → <code>registered=Validation Builders Ltd; trading=Validation Builders; category=Building Materials; email=validation@example.com</code>.</p>
<h2>F. Outstanding Issues</h2>
<div class='note'>Central PostgreSQL synchronization, durable outbox, authenticated company/branch context, and headquarters-only authorization are not implemented for Business Information yet. The page’s ordinary offline path is local SQLite through the loopback API and does not require PostgreSQL.</div>
</body></html>"""

html_path.write_text(page, encoding="utf-8")
electron = ROOT / "node_modules/electron/dist/Electron.app/Contents/MacOS/Electron"
subprocess.run([str(electron), "--headless", "--no-sandbox", "--disable-gpu", f"--print-to-pdf={pdf_path}", html_path.as_uri()], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
print(pdf_path)
