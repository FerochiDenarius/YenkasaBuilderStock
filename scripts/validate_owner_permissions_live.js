const { chromium } = require('playwright');
const base = process.env.LOCAL_API_URL || 'http://127.0.0.1:8765';

const managerPermissions = ['sales', 'quotations', 'invoices', 'payments', 'receipts', 'customers', 'suppliers', 'inventory_view', 'inventory', 'stock_receipts', 'purchases', 'stock_adjustments', 'material_release', 'financial_reports', 'system_settings', 'staff_management', 'edit_selling_prices'];

(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const page = browser.contexts()[0].pages()[0];
  page.setDefaultTimeout(8000);
  const shot = (name) => page.screenshot({ path: `Validation Reports/${name}`, fullPage: true });
  const owner = await page.evaluate(async (apiBase) => {
    for (const [username, password] of [['validation.owner', 'ValidationOwner123'], ['live.owner', 'LiveOwnerPass123'], ['secure.owner', 'SecurePass123']]) {
      const response = await fetch(`${apiBase}/api/owner/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
      if (response.ok) return response.json();
    }
    return null;
  }, base);
  if (!owner) throw new Error('No validation owner credential was accepted by the local API');
  const ownerHeaders = { 'X-Owner-Session': owner.token };
  const branchResponse = await fetch(`${base}/api/branches`, { headers: ownerHeaders });
  const branches = await branchResponse.json();
  const branch = branches.find((item) => item.code === 'PVAL');
  if (!branch) throw new Error('Validation branch PVAL was not found');
  const usersResponse = await fetch(`${base}/api/company-users`, { headers: ownerHeaders });
  const users = await usersResponse.json();
  const manager = users.find((item) => item.username === 'permissions.manager');
  if (!manager) throw new Error('Validation manager was not found');
  await page.evaluate((session) => {
    sessionStorage.setItem('yenkasa-owner-session', session.token);
    sessionStorage.setItem('yenkasa-owner-session-data', JSON.stringify(session));
    sessionStorage.removeItem('yenkasa-session');
  }, owner);
  await page.reload(); await page.waitForTimeout(700);
  await page.getByRole('button', { name: 'Users & Roles' }).click(); await page.waitForTimeout(700);
  const ownerUsers = await page.locator('.staff-list').innerText();
  console.log('owner users page', ownerUsers.includes('Users') && await page.getByRole('button', { name: 'Manage Roles' }).count() === 1);
  await shot('Users_Roles_Owner_Permissions_Live.png');
  await page.getByRole('button', { name: 'Roles & Permissions' }).click(); await page.waitForTimeout(300);
  console.log('permission matrix', await page.locator('.permission-matrix-row').count() >= 10 && await page.getByRole('button', { name: 'Save Permissions' }).count() === 1);
  await shot('Users_Roles_Permissions_Matrix_Live.png');
  await page.locator('.staff-tabs > button').first().click(); await page.waitForTimeout(300);
  const edit = page.locator('button').filter({ hasText: 'Edit' }).first();
  if (await edit.count()) { await edit.click(); await page.waitForTimeout(250); console.log('owner edit controls', await page.locator('.staff-modal').count() === 1 && (await page.locator('.staff-modal input[type="checkbox"]').count()) > 0); await shot('Users_Roles_Owner_Edit_User_Live.png'); }
  await page.evaluate(({ branch, user, permissions }) => {
    sessionStorage.removeItem('yenkasa-owner-session');
    sessionStorage.removeItem('yenkasa-owner-session-data');
    sessionStorage.setItem('yenkasa-session', JSON.stringify({ userId: user, companyId: 1, branchId: branch, branchName: 'Yenkasa Validation Branch', username: 'validation.manager', fullName: 'Validation Manager', role: 'BRANCH_MANAGER', permissions }));
  }, { branch: branch.id, user: manager.id, permissions: managerPermissions });
  await page.reload(); await page.waitForTimeout(700); await page.getByRole('button', { name: 'Customers' }).click(); await page.waitForTimeout(500);
  await page.getByRole('button', { name: 'New Customer' }).click();
  await page.locator('.customer-form input').first().fill('Saved Customer Layout Validation');
  await page.locator('.customer-form button[type="submit"]').click(); await page.waitForTimeout(500);
  const customerText = await page.locator('.customer-list').innerText();
  console.log('customer after save', customerText.includes('Saved Customer Layout Validation'), await page.locator('.customer-form').count() === 1);
  await shot('Customers_After_Save_Live.png');
  await browser.close();
})().catch((error) => { console.error(error); process.exit(1); });
