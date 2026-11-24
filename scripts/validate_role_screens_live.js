const { chromium } = require('playwright');
(async () => {
  const b = await chromium.connectOverCDP('http://127.0.0.1:9222'); const p = b.contexts()[0].pages()[0]; p.setDefaultTimeout(5000); const cases = [['BRANCH_MANAGER', 'live.manager', 'LivePass123', '31_phase2_manager_workspace_final.png'], ['STOCK_MANAGER', 'stock.live', 'StockPass123', '32_phase2_stock_workspace_final.png'], ['SALES_CASHIER', 'sales.live', 'SalesPass123', '33_phase2_sales_workspace_final.png']];
  for (const [role, username, password, shot] of cases) { await p.evaluate(() => sessionStorage.removeItem('yenkasa-session')); await p.reload(); await p.waitForTimeout(400); await p.locator('.branch-login-nav').click(); await p.getByTestId('login-role').selectOption(role); await p.getByTestId('login-username').fill(username); await p.getByTestId('login-password').fill(password); await p.getByTestId('branch-login-submit').click(); await p.waitForTimeout(350); const nav = await p.locator('.dashboard-nav').innerText(); console.log(role, JSON.stringify(nav)); await p.screenshot({ path: `Validation Reports/${shot}`, fullPage: true }); }
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
