const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const page = browser.contexts()[0].pages().find((candidate) => candidate.url().includes('5173'));
  if (!page) throw new Error('Renderer page not found');
  page.setDefaultTimeout(10000);
  const branchId = '77ed7f7f-0cdb-4ef2-beef-84a7f21ca289';
  const login = async (role, username, password) => {
    await page.locator('.branch-login-nav').click();
    await page.getByTestId('login-role').selectOption(role);
    await page.getByTestId('login-username').fill(username);
    await page.getByTestId('login-password').fill(password);
    await page.getByTestId('branch-login-submit').click();
    await page.getByText(/workspace/).waitFor();
  };
  const logout = async () => {
    await page.locator('.user-card').click();
    await page.locator('.branch-login-nav').waitFor();
  };
  await page.evaluate(() => sessionStorage.removeItem('yenkasa-session'));
  await page.reload();
  await login('BRANCH_MANAGER', 'validation.manager', 'ValidationPass123');
  const manager = await page.evaluate(() => JSON.parse(sessionStorage.getItem('yenkasa-session')));
  for (const account of [
    { role: 'SALES_OFFICER', username: 'validation.officer', fullName: 'Validation Sales Officer', password: 'ValidationOfficer123' },
    { role: 'CASHIER', username: 'validation.cashier', fullName: 'Validation Cashier', password: 'ValidationCashier123' },
  ]) {
    await page.evaluate(async ({ branchId, manager, account }) => {
      const response = await fetch('http://127.0.0.1:8765/api/staff', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'X-User-Id': manager.userId, 'X-Branch-Id': branchId },
        body: JSON.stringify({ branchId, username: account.username, fullName: account.fullName, email: `${account.username}@example.com`, role: account.role, password: account.password }),
      });
      if (!response.ok && response.status !== 409) throw new Error(await response.text());
    }, { branchId, manager, account });
  }
  await logout();
  await login('SALES_OFFICER', 'validation.officer', 'ValidationOfficer123');
  const officerNav = await page.locator('.dashboard-nav').innerText();
  const officerSales = await page.getByRole('button', { name: 'Sales & Invoices' }).count();
  await page.getByRole('button', { name: 'Sales & Invoices' }).click();
  const officerActions = await page.locator('.sales-actions').innerText();
  const officerPass = officerNav.includes('Sales & Invoices') && !officerNav.includes('Cashier & Payments') && !officerNav.includes('Inventory') && !officerNav.includes('Staff Accounts') && officerSales === 1 && officerActions.includes('Generate Invoice') && !officerActions.includes('Proceed to Payment');
  await logout();
  await login('CASHIER', 'validation.cashier', 'ValidationCashier123');
  const cashierNav = await page.locator('.dashboard-nav').innerText();
  const cashierPass = cashierNav.includes('Cashier & Payments') && cashierNav.includes('Reports') && !cashierNav.includes('Sales & Invoices') && !cashierNav.includes('Inventory') && !cashierNav.includes('Staff Accounts');
  await logout();
  await login('STOCK_MANAGER', 'validation.stock', 'ValidationStock123');
  const stockNav = await page.locator('.dashboard-nav').innerText();
  const stockPass = stockNav.includes('Inventory') && stockNav.includes('Material Release') && stockNav.includes('Purchasing') && !stockNav.includes('Cashier & Payments') && !stockNav.includes('Sales & Invoices') && !stockNav.includes('Staff Accounts');
  await page.screenshot({ path: 'Validation Reports/49_stage1_role_navigation_live.png', fullPage: true });
  console.log('sales officer separation', officerPass, officerActions);
  console.log('cashier separation', cashierPass);
  console.log('stock manager separation', stockPass);
  await browser.close();
  if (!officerPass || !cashierPass || !stockPass) process.exit(1);
})().catch((error) => { console.error(error); process.exit(1); });
