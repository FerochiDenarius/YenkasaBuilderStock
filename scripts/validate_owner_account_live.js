const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const page = browser.contexts()[0].pages()[0];
  page.setDefaultTimeout(8000);
  const shot = (name) => page.screenshot({ path: `Validation Reports/${name}`, fullPage: true });

  await page.evaluate(() => sessionStorage.removeItem('yenkasa-session'));
  await page.reload();
  await page.waitForTimeout(300);
  const sidebarText = await page.locator('.dashboard-sidebar').innerText();
  console.log('branch login first', sidebarText.indexOf('Branch Login') < sidebarText.indexOf('Company Setup'));
  console.log('branch login visible without configured branch', await page.locator('.branch-login-nav').count() === 1);

  const setup = page.getByRole('button', { name: /Company Setup/ });
  if (await page.locator('.setup-subnav').count() === 0) await setup.click();
  await page.locator('.setup-subnav button', { hasText: 'Owner Account' }).click();
  await page.waitForTimeout(250);
  console.log('owner header removed', await page.locator('.reference-page-heading').count() === 0);
  console.log('horizontal owner tabs', await page.locator('.reference-section-menu').evaluate((node) => getComputedStyle(node).display === 'flex'));
  await shot('38_owner_profile_tabs_live.png');

  await page.getByRole('button', { name: 'Security & Login' }).click();
  await page.getByTestId('owner-security-username').waitFor();
  console.log('security only', await page.locator('.owner-security-page').count() === 1 && await page.locator('.reference-profile-card').count() === 0);
  await page.getByTestId('owner-security-username').fill('live.owner');
  await page.getByTestId('owner-security-email').fill('live.owner@example.com');
  await page.getByTestId('owner-security-password').fill('LiveOwnerPass123');
  await page.getByTestId('owner-security-save').click({ force: true });
  await page.waitForTimeout(800);
  const securityText = await page.locator('.owner-security-page').innerText();
  console.log('security save button', await page.getByTestId('owner-security-save').count(), await page.getByTestId('owner-security-save').isDisabled());
  console.log('security save status', securityText.includes('Saved security settings to SQLite'), securityText.includes('Unable to save security settings'), securityText.slice(-300));
  await shot('39_owner_security_live.png');

  await page.getByRole('button', { name: 'Activity Log' }).click();
  await page.getByTestId('owner-activity-type').waitFor();
  console.log('activity only', await page.locator('.owner-activity-page').count() === 1 && await page.locator('.owner-security-page').count() === 0);
  console.log('activity loaded', await page.locator('.owner-activity-row').count() > 1, (await page.locator('.owner-activity-page').innerText()).slice(-400));
  await page.getByTestId('owner-activity-export').click();
  console.log('activity export status', await page.getByText('Activity log exported').count() === 1);
  await shot('40_owner_activity_live.png');
  await browser.close();
})().catch((error) => { console.error(error); process.exit(1); });
