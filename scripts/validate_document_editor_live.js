const { chromium } = require('playwright');
const fs = require('node:fs');

(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const pages = browser.contexts()[0].pages();
  console.log(
    'pages',
    pages.map((candidate) => candidate.url()),
  );
  const page =
    pages.find((candidate) => candidate.url().includes('5173')) ??
    pages[pages.length - 1];
  page.on('pageerror', (error) => console.log('pageerror', error.message));
  page.on('console', (message) => {
    if (message.type() === 'error')
      console.log('console error', message.text());
  });
  page.setDefaultTimeout(10000);
  const openEditor = async () => {
    const setup = page.getByRole('button', { name: /Company Setup/ });
    if ((await page.locator('.setup-subnav').count()) === 0)
      await setup.click();
    await page
      .locator('.setup-subnav button', { hasText: 'Business Branding' })
      .click();
    await page.getByRole('tab', { name: 'Document Templates' }).click();
    console.log(
      'after tab',
      (await page.locator('body').innerText()).slice(0, 500),
    );
    await page.waitForSelector('.document-templates-panel');
    console.log(
      'template panel',
      await page.locator('.document-templates-panel').count(),
    );
    await page.getByTestId('document-edit-toggle').click();
  };

  await page.evaluate(() => sessionStorage.removeItem('yenkasa-session'));
  await page.reload();
  await openEditor();
  await page
    .getByTestId('document-companyName')
    .fill('Yenkasa Live Invoice Company');
  await page
    .getByTestId('document-footerMessage')
    .fill('Printed from the saved Yenkasa template');
  await page
    .getByTestId('document-item-0-description')
    .fill('Live Cement Item');
  await page
    .locator('.document-properties input[type="number"]')
    .first()
    .fill('24');
  await page
    .locator('.document-properties input[type="color"]')
    .fill('#B42318');
  await page
    .locator('.document-editor-tools button', {
      hasText: 'Add Branch Information',
    })
    .click();
  await page.getByRole('button', { name: '＋ Add Item Row' }).click();
  await page
    .getByTestId('document-item-3-description')
    .fill('Validation Added Item');
  await page
    .locator('.document-item-row')
    .nth(3)
    .locator('input')
    .nth(1)
    .fill('3');
  await page
    .locator('.document-item-row')
    .nth(3)
    .locator('input')
    .nth(2)
    .fill('bag');
  await page
    .locator('.document-item-row')
    .nth(3)
    .locator('input')
    .nth(3)
    .fill('12.50');
  await page.screenshot({
    path: 'Validation Reports/45_document_template_editor_live.png',
    fullPage: true,
  });
  await page.getByRole('button', { name: 'Save Template' }).click();
  await page.getByText('Saved branding locally to SQLite').waitFor();
  await page.reload();
  await openEditor();
  const persistedHeading = await page
    .getByTestId('document-companyName')
    .inputValue();
  const persistedFooter = await page
    .getByTestId('document-footerMessage')
    .inputValue();
  const persistedItem = await page
    .getByTestId('document-item-0-description')
    .inputValue();
  const persistedAddedItem = await page
    .getByTestId('document-item-3-description')
    .inputValue();
  await page.getByTestId('document-item-3-description').fill('');
  await page.getByRole('button', { name: 'Save Template' }).click();
  const validationShown = await page
    .locator('.document-validation-error')
    .isVisible();
  await page
    .getByTestId('document-item-3-description')
    .fill('Validation Added Item');
  await page
    .locator('.document-item-row')
    .nth(3)
    .getByRole('button', { name: 'Remove item 4' })
    .click();
  await page.getByRole('button', { name: '◉ Preview' }).click();
  await page.getByRole('button', { name: 'Invoice Template' }).click();
  await page.getByTestId('document-edit-toggle').click();
  await page
    .locator('.document-template-options input[type="radio"]')
    .first()
    .check();
  await page
    .locator('.document-template-options > .security-field select')
    .selectOption({ label: 'A4 (210 × 297 mm)' });
  await page
    .locator('.document-template-options input[type="checkbox"]')
    .evaluateAll((inputs) =>
      inputs.forEach((input) => {
        input.checked = true;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }),
    );
  await page
    .locator('.document-properties input[type="number"]')
    .first()
    .fill('20');
  await page
    .locator('.document-properties input[type="color"]')
    .fill('#0B7E34');
  await page
    .getByTestId('document-companyName')
    .fill('Yenkasa Builders Supplies Ltd');
  await page
    .getByTestId('document-footerMessage')
    .fill('Thank you for your business!');
  await page.getByTestId('document-item-0-description').fill('Cement (50kg)');
  await page.getByRole('button', { name: 'Save Template' }).click();
  await page.getByText('Saved branding locally to SQLite').waitFor();
  const pdfPath = '/private/tmp/yenkasa-live-invoice.pdf';
  console.log(
    'paper bounds',
    await page.locator('.document-paper').evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return {
        width: rect.width,
        height: rect.height,
        scrollHeight: element.scrollHeight,
      };
    }),
  );
  console.log(
    'bridge',
    await page.evaluate(() => ({
      keys: Object.keys(window.desktopBridge ?? {}),
      type: typeof window.desktopBridge,
      platform: window.desktopBridge?.platform,
      print: typeof window.desktopBridge?.print,
      exportPdf: typeof window.desktopBridge?.exportPdf,
    })),
  );
  const exported = await page.evaluate(
    (path) => window.desktopBridge?.exportPdf(path, 'A4 (210 × 297 mm)'),
    pdfPath,
  );
  const pdfExists =
    exported === pdfPath &&
    fs.existsSync(pdfPath) &&
    fs.statSync(pdfPath).size > 1000;
  console.log(
    'editor persisted',
    persistedHeading === 'Yenkasa Live Invoice Company' &&
      persistedFooter === 'Printed from the saved Yenkasa template' &&
      persistedItem === 'Live Cement Item' &&
      persistedAddedItem === 'Validation Added Item',
  );
  console.log('item validation', validationShown);
  console.log(
    'pdf exported',
    pdfExists,
    pdfExists ? `${fs.statSync(pdfPath).size} bytes` : exported,
  );
  await browser.close();
  if (
    persistedHeading !== 'Yenkasa Live Invoice Company' ||
    persistedFooter !== 'Printed from the saved Yenkasa template' ||
    persistedItem !== 'Live Cement Item' ||
    persistedAddedItem !== 'Validation Added Item' ||
    !validationShown ||
    !pdfExists
  )
    process.exit(1);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
