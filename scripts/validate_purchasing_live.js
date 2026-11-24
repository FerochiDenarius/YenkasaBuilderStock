const { chromium } = require('playwright');

const BRANCH_ID = '77ed7f7f-0cdb-4ef2-beef-84a7f21ca289';

(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const page = browser.contexts()[0].pages().find((candidate) => candidate.url().includes('5173'));
  if (!page) throw new Error('Renderer page not found');
  page.setDefaultTimeout(15000);
  const apiJson = async (path, init = {}) => page.evaluate(async ({ path, init }) => {
    const response = await fetch(`http://127.0.0.1:8765${path}`, init);
    return { status: response.status, body: await response.json().catch(() => undefined) };
  }, { path, init });
  const manager = await apiJson('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ branchId: BRANCH_ID, username: 'validation.manager', password: 'ValidationPass123', loginRole: 'BRANCH_MANAGER' }) });
  const before = await apiJson(`/api/products?branchId=${BRANCH_ID}`, { headers: { 'X-User-Id': manager.body.userId, 'X-Branch-Id': BRANCH_ID } });
  const product = before.body.find((item) => item.sku === 'CEM-GHA-425R') || before.body[0];
  await page.evaluate(() => sessionStorage.removeItem('yenkasa-session'));
  await page.reload();
  await page.locator('.branch-login-nav').click();
  await page.getByTestId('login-role').selectOption('BRANCH_MANAGER');
  await page.getByTestId('login-username').fill('validation.manager');
  await page.getByTestId('login-password').fill('ValidationPass123');
  await page.getByTestId('branch-login-submit').click();
  await page.getByRole('button', { name: 'Purchasing', exact: true }).click();
  await page.locator('.purchasing-page').waitFor();
  await page.getByLabel('Supplier *').selectOption({ label: 'BuildPro Ghana Ltd' });
  await page.locator('.purchasing-search input').fill(product.name);
  await page.locator('.purchasing-product-results button').first().click();
  await page.getByLabel(`Quantity for ${product.name}`).fill('2');
  await page.getByLabel(`Unit cost for ${product.name}`).fill('80');
  await page.getByRole('button', { name: 'Save Purchase' }).click();
  await page.getByText(/saved and stock updated/).waitFor();
  const historyButton = page.getByRole('button', { name: 'Purchase History' });
  await historyButton.click();
  await page.locator('.purchasing-history-panel').waitFor();
  const historyRows = await page.locator('.purchasing-history-row').count();
  const after = await apiJson(`/api/products?branchId=${BRANCH_ID}`, { headers: { 'X-User-Id': manager.body.userId, 'X-Branch-Id': BRANCH_ID } });
  const updated = after.body.find((item) => item.sku === product.sku);
  const sales = await apiJson('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ branchId: BRANCH_ID, username: 'validation.officer', password: 'ValidationOfficer123', loginRole: 'SALES_OFFICER' }) });
  const unauthorized = await apiJson('/api/purchases', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-User-Id': sales.body.userId, 'X-Branch-Id': BRANCH_ID }, body: JSON.stringify({ branchId: BRANCH_ID, supplier: 'Unauthorized', purchaseDate: '2026-11-23', paymentType: 'Cash', discount: 0, items: [{ sku: product.sku, name: product.name, quantity: 1, unit: product.unit, unitCost: 80 }] }) });
  await page.screenshot({ path: 'Validation Reports/55_purchasing_live.png', fullPage: true });
  const result = { purchaseHistoryRows: historyRows, stockIncreased: updated.stock === product.stock + 2, unauthorizedStatus: unauthorized.status };
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
  if (!historyRows || !result.stockIncreased || unauthorized.status !== 403) process.exit(1);
})().catch((error) => { console.error(error); process.exit(1); });
