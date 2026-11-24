const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const page = browser.contexts()[0].pages()[0];
  page.setDefaultTimeout(8000);
  const openTemplates = async () => {
    const setup = page.getByRole('button', { name: /Company Setup/ });
    if (await page.locator('.setup-subnav').count() === 0) await setup.click();
    await page.locator('.setup-subnav button', { hasText: 'Business Branding' }).click();
    await page.getByRole('tab', { name: 'Document Templates' }).click();
    await page.waitForTimeout(250);
  };
  await page.evaluate(() => sessionStorage.removeItem('yenkasa-session'));
  await page.reload();
  await openTemplates();
  await page.getByRole('button', { name: 'Receipt Template' }).click();
  await page.locator('input[type="radio"]').nth(1).check();
  await page.locator('.document-template-options select').selectOption({ label: 'A5 (148 × 210 mm)' });
  await page.locator('.document-template-options input[type="checkbox"]').nth(2).uncheck();
  await page.locator('.document-template-options .security-field input').fill('Thank you from Yenkasa Validation');
  await page.getByTestId('branding-save').click();
  await page.getByText('Saved branding locally to SQLite').waitFor();
  console.log('template save status', true);
  await page.reload();
  await openTemplates();
  const selected = await page.locator('.document-template-list button.selected strong').innerText();
  const layout = await page.locator('input[type="radio"]').nth(1).isChecked();
  const pageSize = await page.locator('.document-template-options select').inputValue();
  const branchShown = await page.locator('.document-template-options input[type="checkbox"]').nth(2).isChecked();
  const footer = await page.locator('.document-template-options .security-field input').inputValue();
  console.log('template persisted', selected === 'Receipt Template' && layout && pageSize === 'A5 (148 × 210 mm)' && !branchShown && footer === 'Thank you from Yenkasa Validation');
  await page.screenshot({ path: 'Validation Reports/44_business_branding_document_templates_persisted.png', fullPage: true });
  await browser.close();
})().catch((error) => { console.error(error); process.exit(1); });
