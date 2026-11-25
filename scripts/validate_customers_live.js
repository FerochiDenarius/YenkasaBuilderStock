const { chromium } = require('playwright');

const branchId = '77ed7f7f-0cdb-4ef2-beef-84a7f21ca289';
const managerId = 'c42221ba-8a38-44df-af37-ad19f72f9184';
const salesId = 'c5ca77ea-f20b-4b38-8702-0cdd27e4d2bc';
const managerPermissions = ['sales', 'quotations', 'invoices', 'payments', 'receipts', 'customers', 'suppliers', 'inventory_view', 'inventory', 'stock_receipts', 'purchases', 'stock_adjustments', 'material_release', 'financial_reports', 'system_settings', 'staff_management', 'edit_selling_prices'];

(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const page = browser.contexts()[0].pages()[0];
  page.setDefaultTimeout(8000);
  const shot = (name) => page.screenshot({ path: `Validation Reports/${name}`, fullPage: true });
  await page.evaluate(({ branch, user, permissions, role, name }) => {
    sessionStorage.setItem('yenkasa-session', JSON.stringify({ userId: user, companyId: 1, branchId: branch, branchName: 'Yenkasa Validation Branch', username: name.toLowerCase().replaceAll(' ', '.'), fullName: name, role, permissions }));
    sessionStorage.removeItem('yenkasa-owner-session');
    sessionStorage.removeItem('yenkasa-owner-session-data');
  }, { branch: branchId, user: managerId, permissions: managerPermissions, role: 'BRANCH_MANAGER', name: 'Validation Manager' });
  await page.reload(); await page.waitForTimeout(650);
  await page.getByRole('button', { name: 'Customers' }).click(); await page.waitForTimeout(500);
  console.log('manager customer access', await page.locator('.customers-page').count() === 1, 'logout visible', await page.locator('.sidebar-logout').count() === 1);
  await page.getByRole('button', { name: 'New Customer' }).click();
  const customerName = page.locator('.customer-form input').first();
  await customerName.fill('Live Customer Validation');
  await page.locator('.customer-form button[type="submit"]').click(); await page.waitForTimeout(500);
  console.log('customer saved', (await page.locator('.customer-list').innerText()).includes('Live Customer Validation'));
  await shot('Customers_Manager_Live.png');
  await page.locator('.sidebar-logout').click(); await page.waitForTimeout(300);
  console.log('logout visible after sign out', await page.locator('.branch-login-nav').count() === 1);
  await page.evaluate(({ branch, user }) => sessionStorage.setItem('yenkasa-session', JSON.stringify({ userId: user, companyId: 1, branchId: branch, branchName: 'Yenkasa Validation Branch', username: 'validation.sales', fullName: 'Validation Sales', role: 'SALES_OFFICER', permissions: ['sales', 'quotations', 'invoices', 'inventory_view', 'limited_reports'] })), { branch: branchId, user: salesId });
  await page.reload(); await page.waitForTimeout(650);
  const navigation = await page.locator('.dashboard-nav').innerText();
  console.log('sales customer hidden', !navigation.includes('Customers'));
  await shot('Customers_Sales_Officer_Hidden_Live.png');
  await browser.close();
})().catch((error) => { console.error(error); process.exit(1); });
