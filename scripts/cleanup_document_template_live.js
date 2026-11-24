const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const pages = browser.contexts()[0].pages();
  const page =
    pages.find((candidate) => candidate.url().includes('5173')) ??
    pages[pages.length - 1];
  page.setDefaultTimeout(10000);
  await page.evaluate(() => sessionStorage.removeItem('yenkasa-session'));
  await page.reload();
  const setup = page.getByRole('button', { name: /Company Setup/ });
  if ((await page.locator('.setup-subnav').count()) === 0) await setup.click();
  await page
    .locator('.setup-subnav button', { hasText: 'Business Branding' })
    .click();
  await page.getByRole('tab', { name: 'Document Templates' }).click();
  await page.getByTestId('document-edit-toggle').click();
  while ((await page.locator('.document-item-row').count()) > 3) {
    const rows = page.locator('.document-item-row');
    await rows
      .nth((await rows.count()) - 1)
      .getByRole('button')
      .click();
  }
  await page.getByRole('button', { name: 'Save Template' }).click();
  await page.getByText('Saved branding locally to SQLite').waitFor();
  await page.reload();
  await page
    .locator('.setup-subnav button', { hasText: 'Business Branding' })
    .click();
  await page.getByRole('tab', { name: 'Document Templates' }).click();
  await page.getByTestId('document-edit-toggle').click();
  const count = await page.locator('.document-item-row').count();
  console.log('final persisted item rows', count);
  await browser.close();
  if (count !== 3) process.exit(1);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
