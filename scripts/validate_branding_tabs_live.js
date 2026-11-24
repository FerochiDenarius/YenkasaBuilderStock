const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const page = browser.contexts()[0].pages()[0];
  page.setDefaultTimeout(8000);
  const shot = (name) => page.screenshot({ path: `Validation Reports/${name}`, fullPage: true });
  await page.evaluate(() => sessionStorage.removeItem('yenkasa-session'));
  await page.reload();
  await page.waitForTimeout(250);
  const setup = page.getByRole('button', { name: /Company Setup/ });
  if (await page.locator('.setup-subnav').count() === 0) await setup.click();
  await page.locator('.setup-subnav button', { hasText: 'Business Branding' }).click();
  await page.waitForTimeout(250);
  console.log('branding tabs visible', await page.locator('.branding-section-tabs button').count() === 2);
  console.log('identity only by default', await page.locator('.brand-identity').count() === 1 && await page.locator('.brand-right').count() === 0);
  await shot('41_business_branding_identity_tab_live.png');
  await page.getByRole('tab', { name: 'Branding Preview' }).click();
  console.log('preview only after click', await page.locator('.brand-right').count() === 1 && await page.locator('.brand-identity').count() === 0);
  await shot('42_business_branding_preview_tab_live.png');
  await browser.close();
})().catch((error) => { console.error(error); process.exit(1); });
