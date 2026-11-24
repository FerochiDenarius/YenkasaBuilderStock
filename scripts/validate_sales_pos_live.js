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
  await page.locator('.branch-login-nav').click();
  await page.getByTestId('login-role').selectOption('BRANCH_MANAGER');
  await page.getByTestId('login-username').fill('validation.manager');
  await page.getByTestId('login-password').fill('ValidationPass123');
  await page.getByTestId('branch-login-submit').click();
  await page.getByRole('button', { name: 'Sales' }).click();
  await page.waitForSelector('.sales-page');
  await page
    .getByPlaceholder('Search by product name, code or barcode...')
    .fill('Roofing');
  const filteredCount = await page.locator('.sales-product-card').count();
  console.log(
    'sales mode buttons',
    await page.locator('.sales-mode-tabs button').allTextContents(),
  );
  await page.getByRole('tab', { name: 'Invoice' }).click();
  await page.getByRole('button', { name: /Clear Cart/ }).click();
  await page.locator('.sales-actions .primary-button').click();
  const emptyError = await page.locator('.sales-error').count();
  await page.getByRole('button', { name: /Roofing Sheet/ }).click();
  await page.locator('.quantity-control button').last().click();
  await page.locator('.sales-toggle').click();
  await page.getByRole('button', { name: /Clear Cart/ }).click();
  await page
    .getByPlaceholder('Search by product name, code or barcode...')
    .fill('');
  await page.getByRole('button', { name: /Dangote Cement/ }).click();
  await page.waitForTimeout(500);
  console.log(
    'sales actions',
    await page.locator('.sales-actions button').allTextContents(),
    await page.locator('.sales-actions .primary-button').isEnabled(),
  );
  await page.locator('.sales-actions .primary-button').click();
  await page.waitForTimeout(300);
  console.log(
    'save feedback',
    await page.locator('.sales-status, .sales-error').allTextContents(),
  );
  await page.getByText(/saved to SQLite/).waitFor();
  const persisted = await page.evaluate(async () => {
    const session = JSON.parse(sessionStorage.getItem('yenkasa-session'));
    const response = await fetch(
      `http://127.0.0.1:8765/api/sales?branchId=${encodeURIComponent(session.branchId)}`,
      {
        headers: {
          'X-User-Id': session.userId,
          'X-Branch-Id': session.branchId,
        },
      },
    );
    const records = await response.json();
    return { ok: response.ok, count: records.length, latest: records[0] };
  });
  await page.screenshot({
    path: 'Validation Reports/46_sales_pos_live.png',
    fullPage: true,
  });
  console.log('filtered products', filteredCount === 1);
  console.log('empty-cart validation', emptyError > 0);
  console.log(
    'invoice persisted',
    persisted.ok &&
      persisted.count > 0 &&
      persisted.latest.documentType === 'INVOICE',
  );
  console.log(
    'latest invoice',
    persisted.latest?.saleNumber,
    persisted.latest?.total,
  );
  await browser.close();
  if (
    filteredCount !== 1 ||
    emptyError === 0 ||
    !persisted.ok ||
    persisted.count === 0 ||
    persisted.latest.documentType !== 'INVOICE'
  )
    process.exit(1);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
