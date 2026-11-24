const { chromium } = require('playwright');

const API = 'http://127.0.0.1:8765';
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

  await page.evaluate(() => sessionStorage.removeItem('yenkasa-session'));
  await page.reload();
  await page.locator('.branch-login-nav').click();
  await page.getByTestId('login-role').selectOption('BRANCH_MANAGER');
  await page.getByTestId('login-username').fill('validation.manager');
  await page.getByTestId('login-password').fill('ValidationPass123');
  await page.getByTestId('branch-login-submit').click();
  await page.getByRole('button', { name: 'Inventory', exact: true }).click();
  await page.locator('.inventory-page').waitFor();
  await page.locator('[data-testid="inventory-list"]').waitFor();
  const initialRows = await page.locator('.inventory-list-row').count();
  await page.getByTestId('inventory-search').fill('Ghacem');
  const searchRows = await page.locator('.inventory-list-row').count();
  await page.getByTestId('inventory-search').fill('');

  const sku = `VAL-${Date.now().toString().slice(-8)}`;
  const itemName = `Validation Inventory Item ${Date.now()}`;
  await page.getByRole('button', { name: 'Add Item' }).click();
  await page.getByLabel('Sku').fill(sku);
  await page.getByLabel('Name').fill(itemName);
  await page.getByLabel('Category').fill('Validation');
  await page.getByLabel('Brand').fill('Validation Brand');
  await page.getByLabel('Product type').fill('Test Material');
  await page.getByLabel('Variant').fill('Standard');
  await page.getByLabel('Unit').fill('Piece');
  const numericFields = page.locator('.inventory-modal input[type="number"]');
  await numericFields.nth(0).fill('12');
  await numericFields.nth(1).fill('10');
  await page.getByRole('button', { name: 'Save Item' }).click();
  await page.getByTestId('inventory-list').getByText(itemName, { exact: true }).waitFor();
  const row = page.locator('.inventory-list-row').filter({ hasText: itemName });
  await row.getByRole('button', { name: 'Adjust' }).click();
  await page.getByLabel('Adjustment quantity').fill('3');
  await page.getByLabel('Reason').fill('Live inventory validation count');
  await page.getByRole('button', { name: 'Save Adjustment' }).click();
  await row.getByText('15', { exact: true }).waitFor();
  const managerMutationWorked = await row.count() === 1;

  const salesLogin = await apiJson('/api/auth/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ branchId: BRANCH_ID, username: 'validation.officer', password: 'ValidationOfficer123', loginRole: 'SALES_OFFICER' }),
  });
  const unauthorized = await apiJson(`/api/products/${encodeURIComponent(sku)}/stock`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'X-User-Id': salesLogin.body.userId, 'X-Branch-Id': BRANCH_ID },
    body: JSON.stringify({ branchId: BRANCH_ID, quantity: 1, reason: 'Unauthorized test' }),
  });
  await page.screenshot({ path: 'Validation Reports/53_inventory_live.png', fullPage: true });
  await page.getByRole('button', { name: 'Dashboard', exact: true }).click();
  await page.locator('.dashboard-content').waitFor();
  await page.getByText(itemName, { exact: true }).waitFor();
  const liveDashboardInventory = await page.getByText(itemName, { exact: true }).count();
  await page.screenshot({ path: 'Validation Reports/54_branch_manager_dashboard_live.png', fullPage: true });

  console.log(JSON.stringify({
    initialRows,
    searchRows,
    managerMutationWorked,
    unauthorizedStatus: unauthorized.status,
    managerCanMutate: managerMutationWorked,
    salesOfficerMutationRejected: unauthorized.status === 403,
    branchDashboardInventoryVisible: liveDashboardInventory > 0,
  }, null, 2));
  await browser.close();
  if (!initialRows || !searchRows || !managerMutationWorked || unauthorized.status !== 403 || liveDashboardInventory === 0) process.exit(1);
})().catch((error) => { console.error(error); process.exit(1); });
