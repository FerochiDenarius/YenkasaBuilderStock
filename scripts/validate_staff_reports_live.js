const { chromium } = require('playwright');

const branchId = '77ed7f7f-0cdb-4ef2-beef-84a7f21ca289';
const userId = 'c42221ba-8a38-44df-af37-ad19f72f9184';
const permissions = ['sales', 'quotations', 'invoices', 'payments', 'receipts', 'inventory_view', 'inventory', 'stock_receipts', 'purchases', 'stock_adjustments', 'material_release', 'financial_reports', 'system_settings', 'staff_management', 'edit_selling_prices'];

(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const page = browser.contexts()[0].pages()[0];
  page.setDefaultTimeout(8000);
  const shot = (name) => page.screenshot({ path: `Validation Reports/${name}`, fullPage: true });
  await page.evaluate(({ branchId: branch, userId: user, permissions: userPermissions }) => {
    sessionStorage.setItem('yenkasa-session', JSON.stringify({
      userId: user,
      companyId: 1,
      branchId: branch,
      branchName: 'Yenkasa Validation Branch',
      username: 'validation.manager',
      fullName: 'Validation Manager',
      role: 'BRANCH_MANAGER',
      permissions: userPermissions,
    }));
    sessionStorage.removeItem('yenkasa-owner-session');
    sessionStorage.removeItem('yenkasa-owner-session-data');
  }, { branchId, userId, permissions });
  await page.reload();
  await page.waitForTimeout(700);
  await page.getByRole('button', { name: 'Staff Accounts' }).click();
  await page.waitForTimeout(600);
  await shot('Staff_Accounts_Manager_Live.png');
  const staffText = await page.locator('.staff-list').innerText();
  console.log('staff page loaded', staffText.includes('validation.cashier'), 'cashier edit controls', await page.locator('[data-testid^="staff-edit-"]').count());
  await page.getByRole('button', { name: 'Reports' }).click();
  await page.waitForTimeout(900);
  await shot('Reports_Cashier_Summary_Live.png');
  const reportText = await page.locator('.reports-page').innerText();
  console.log('reports summary loaded', reportText.includes('Cashier Reports'), 'summary rows', await page.locator('.reports-table tbody tr').count());
  const summaryRow = page.locator('.reports-table tbody tr[tabindex]').first();
  if (await summaryRow.count()) {
    await summaryRow.click();
    await page.waitForTimeout(600);
    await shot('Reports_Cashier_Transactions_Live.png');
    console.log('daily transactions page loaded', (await page.locator('.reports-detail-page').count()) === 1, 'view actions', await page.locator('.table-action').count());
    const view = page.locator('.table-action').first();
    if (await view.count()) {
      await view.click();
      await page.waitForTimeout(500);
      await shot('Reports_Transaction_Details_Live.png');
      console.log('transaction details loaded', (await page.locator('.reports-modal').count()) === 1, 'items', await page.locator('.reports-modal .reports-table tbody tr').count());
    }
  }
  await browser.close();
})().catch((error) => { console.error(error); process.exit(1); });
