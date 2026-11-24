const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const page = browser.contexts()[0].pages()[0];
  page.setDefaultTimeout(8000);
  await page.evaluate(() => sessionStorage.removeItem('yenkasa-session'));
  await page.reload();
  await page.waitForTimeout(350);
  const setup = page.getByRole('button', { name: /Company Setup/ });
  if (await page.locator('.setup-subnav').count() === 0) await setup.click();
  await page.locator('.setup-subnav button', { hasText: 'Business Branding' }).click();
  await page.getByRole('tab', { name: 'Document Templates' }).click();
  await page.waitForTimeout(250);
  await page.screenshot({ path: 'Validation Reports/43_business_branding_document_templates_before_polish.png', fullPage: true });
  console.log(await page.locator('.document-templates-panel').innerText());
  await browser.close();
})().catch((error) => { console.error(error); process.exit(1); });
