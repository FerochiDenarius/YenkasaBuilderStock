const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222'); const page = browser.contexts()[0].pages()[0]; const snap = name => page.screenshot({ path: `Validation Reports/${name}`, fullPage: true });
  await page.evaluate(() => sessionStorage.removeItem('yenkasa-session')); await page.reload(); await page.waitForTimeout(300);
  await page.waitForTimeout(300);
  const sidebar = () => page.locator('.dashboard-sidebar');
  const subnav = () => page.locator('.setup-subnav');
  const text = await sidebar().innerText();
  console.log('sidebar order', text.indexOf('Branch Login') < text.indexOf('Company Setup'));
  console.log('ops hidden', !['Dashboard', 'Sales', 'Inventory', 'Purchasing', 'Customers', 'Reports', 'Branch Operations', 'Staff Accounts'].some(label => text.includes(label)));
  console.log('single shell', await sidebar().count() === 1 && await page.locator('.branch-login-hero').count() === 0 && await page.locator('.branch-login-content').count() === 1);
  console.log('branch data loaded', (await page.locator('.branch-login-branch').innerText()).includes('Live Oyarifa Branch') && (await page.locator('.branch-login-branch').innerText()).includes('Yenkasa Builders Supplies Ltd'));
  const setupButton = page.getByRole('button', { name: /Company Setup/ }); await setupButton.click(); console.log('setup collapses', await subnav().count() === 0); await setupButton.click(); console.log('setup expands', await subnav().count() === 1);
  const setupPages = ['Business Information', 'Business Branding', 'Branches', 'Users & Roles', 'Owner Account', 'Device Activation', 'System Settings'];
  const opened = [];
  for (const label of setupPages) { await page.locator('.setup-subnav button', { hasText: label }).click(); await page.waitForTimeout(100); const pageText = await page.locator('.dashboard-main').innerText(); const sidebarText = await sidebar().innerText(); if (label === 'Business Information') await snap('25_phase1_business_information_no_ops.png'); opened.push([label, pageText.includes(label), !['Sales', 'Inventory', 'Purchasing', 'Customers', 'Reports', 'Branch Operations', 'Staff Accounts'].some(item => sidebarText.includes(item))]); }
  console.log('setup pages open', opened.every(([, ok]) => ok));
  console.log('ops hidden on every setup page', opened.every(([, , hidden]) => hidden));
  await page.locator('.branch-login-nav').click(); await page.locator('.branch-login-branch').waitFor(); await page.waitForTimeout(150); await page.getByTestId('login-username').fill('wrong.user'); await page.getByTestId('login-password').fill('wrong-password'); await page.getByTestId('branch-login-submit').click(); console.log('invalid login shown', await page.getByRole('alert').count() > 0); await snap('24_phase1_branch_login_final.png'); await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
