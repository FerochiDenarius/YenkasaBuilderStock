const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const page = browser.contexts()[0].pages().find((candidate) => candidate.url().includes('5173'));
  if (!page) throw new Error('Renderer page not found');
  page.setDefaultTimeout(10000);
  await page.evaluate(() => sessionStorage.removeItem('yenkasa-session'));
  await page.reload();
  await page.locator('.branch-login-nav').click();
  await page.getByTestId('login-role').selectOption('BRANCH_MANAGER');
  await page.getByTestId('login-username').fill('validation.manager');
  await page.getByTestId('login-password').fill('ValidationPass123');
  await page.getByTestId('branch-login-submit').click();
  await page.getByRole('button', { name: 'Sales' }).click();
  await page.getByRole('tab', { name: 'Invoice' }).click();
  await page.getByRole('button', { name: /Clear Cart/ }).click();
  await page.getByPlaceholder('Search by product name, code or barcode...').fill('Ghacem');
  console.log('catalog cards', await page.locator('.sales-product-card').allTextContents());
  await page.getByRole('button', { name: /Ghacem Super Strong 42.5R/ }).click();
  await page.locator('.sales-actions .primary-button').click();
  await page.getByRole('dialog', { name: 'Invoice preview' }).waitFor();
  const rendered = await page.locator('.sales-print-invoice').innerText();
  const templateStatus = await page.locator('.sales-template-status').innerText();
  const pdfPath = '/private/tmp/yenkasa-sales-owner-template.pdf';
  const exported = await page.evaluate(async (path) => window.desktopBridge.exportPdf(path, 'A4 (210 × 297 mm)'), pdfPath);
  const persisted = await page.evaluate(async () => {
    const session = JSON.parse(sessionStorage.getItem('yenkasa-session'));
    const response = await fetch(`http://127.0.0.1:8765/api/sales?branchId=${encodeURIComponent(session.branchId)}`, {
      headers: { 'X-User-Id': session.userId, 'X-Branch-Id': session.branchId },
    });
    const records = await response.json();
    return { ok: response.ok, latest: records[0] };
  });
  await page.screenshot({ path: 'Validation Reports/47_sales_owner_template_preview_live.png', fullPage: true });
  const pass = rendered.includes('Yenkasa Builders Supplies Ltd') &&
    rendered.includes('Ghacem Super Strong 42.5R') &&
    templateStatus.includes('Classic Invoice') &&
    exported === pdfPath && fs.existsSync(pdfPath) &&
    persisted.ok && persisted.latest.templateName === 'Classic Invoice' &&
    persisted.latest.templateVersion >= 1;
  console.log('owner template status', templateStatus);
  console.log('rendered company heading', rendered.includes('Yenkasa Builders Supplies Ltd'));
  console.log('rendered catalog item', rendered.includes('Ghacem Super Strong 42.5R'));
  console.log('template snapshot persisted', persisted.latest.templateName, persisted.latest.templateVersion);
  console.log('pdf exported', exported, fs.statSync(pdfPath).size);
  await browser.close();
  if (!pass) process.exit(1);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
