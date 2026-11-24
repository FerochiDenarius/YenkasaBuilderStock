const { chromium } = require('playwright');

const API = 'http://127.0.0.1:8765';
const BRANCH_ID = '77ed7f7f-0cdb-4ef2-beef-84a7f21ca289';

(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const page = browser.contexts()[0].pages().find((candidate) => candidate.url().includes('5173'));
  if (!page) throw new Error('Renderer page not found');
  page.setDefaultTimeout(15000);
  const apiJson = async (path, init = {}) => {
    const response = await page.evaluate(async ({ path, init }) => {
      const result = await fetch(`http://127.0.0.1:8765${path}`, init);
      return { status: result.status, body: await result.json() };
    }, { path, init });
    return response;
  };
  const manager = (await apiJson('/api/auth/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ branchId: BRANCH_ID, username: 'validation.manager', password: 'ValidationPass123', loginRole: 'BRANCH_MANAGER' }),
  })).body;
  const productsBefore = (await apiJson(`/api/products?branchId=${BRANCH_ID}`, { headers: { 'X-User-Id': manager.userId, 'X-Branch-Id': BRANCH_ID } })).body;
  const product = productsBefore.find((item) => item.sku === 'CEM-GHA-425R') || productsBefore[0];
  const customer = `Release Live Customer ${Date.now()}`;
  const invoice = (await apiJson('/api/sales', {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'X-User-Id': manager.userId, 'X-Branch-Id': BRANCH_ID },
    body: JSON.stringify({ branchId: BRANCH_ID, documentType: 'INVOICE', customerName: customer, vatPercent: 0, items: [{ sku: product.sku, name: product.name, quantity: 1, unit: product.unit, unitPrice: product.price, discountPercent: 0 }] }),
  })).body;
  const cashier = (await apiJson('/api/auth/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ branchId: BRANCH_ID, username: 'validation.cashier', password: 'ValidationCashier123', loginRole: 'CASHIER' }),
  })).body;
  const payment = await apiJson('/api/payments', {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'X-User-Id': cashier.userId, 'X-Branch-Id': BRANCH_ID },
    body: JSON.stringify({ branchId: BRANCH_ID, saleId: invoice.id, amount: invoice.total, method: 'CASH', idempotencyKey: `release-live-${Date.now()}` }),
  });
  if (payment.status !== 200 || payment.body.invoice.fulfilmentStatus !== 'AWAITING_RELEASE') throw new Error(`Payment setup failed: ${JSON.stringify(payment)}`);

  await page.evaluate(() => sessionStorage.removeItem('yenkasa-session'));
  await page.reload();
  await page.locator('.branch-login-nav').click();
  await page.getByTestId('login-role').selectOption('STOCK_MANAGER');
  await page.getByTestId('login-username').fill('validation.stock');
  await page.getByTestId('login-password').fill('ValidationStock123');
  await page.getByTestId('branch-login-submit').click();
  await page.getByText(/workspace/).waitFor();
  await page.getByRole('button', { name: 'Material Release' }).click();
  await page.locator('.release-page').waitFor();
  const row = page.locator('.release-invoice-row').filter({ hasText: payment.body.receipt.receiptNumber });
  await row.waitFor();
  await row.click();
  await page.getByRole('button', { name: 'Confirm Material Release' }).click();
  await page.getByText('Release recorded').waitFor();
  await page.getByRole('button', { name: 'Preview Slip' }).click();
  await page.getByRole('dialog', { name: 'Material release slip preview' }).waitFor();
  const previewVisible = await page.getByRole('dialog', { name: 'Material release slip preview' }).getByText('MATERIAL RELEASE SLIP').count() > 0;
  const itemDetailsVisible = await page.getByRole('dialog', { name: 'Material release slip preview' }).getByText(product.name).count() > 0;
  const paymentVerifiedVisible = await page.getByRole('dialog', { name: 'Material release slip preview' }).getByText('Payment verified').count() > 0;
  const nativePrintBridge = await page.evaluate(() => typeof window.desktopBridge?.print === 'function');
  await page.screenshot({ path: 'Validation Reports/51_material_release_preview_live.png', fullPage: true });
  await page.getByRole('button', { name: 'Close release preview' }).click();
  const pdfPath = '/Users/kofibright/Desktop/YKBuildStock/Validation Reports/51_material_release_slip_live.pdf';
  const exported = await page.evaluate(async ({ pdfPath }) => window.desktopBridge?.exportPdf(pdfPath, 'A4') ?? null, { pdfPath });
  await page.screenshot({ path: 'Validation Reports/51_material_release_live.png', fullPage: true });

  const releases = await apiJson(`/api/material-release/invoices?branchId=${BRANCH_ID}&search=${encodeURIComponent(customer)}`, { headers: { 'X-User-Id': manager.userId, 'X-Branch-Id': BRANCH_ID } });
  const productsAfter = (await apiJson(`/api/products?branchId=${BRANCH_ID}`, { headers: { 'X-User-Id': manager.userId, 'X-Branch-Id': BRANCH_ID } })).body;
  const after = productsAfter.find((item) => item.sku === product.sku);
  const duplicate = await apiJson('/api/material-releases', {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'X-User-Id': manager.userId, 'X-Branch-Id': BRANCH_ID },
    body: JSON.stringify({ branchId: BRANCH_ID, saleId: invoice.id, items: [{ sku: product.sku, quantity: 1 }] }),
  });
  const result = {
    invoiceNumber: invoice.saleNumber,
    releaseVisible: await page.getByText('Release recorded').count() === 1,
    noLongerAwaitingRelease: releases.status === 200 && !releases.body.some((item) => item.id === invoice.id),
    stockDecremented: after.stock === product.stock - 1,
    duplicateStatus: duplicate.status,
    releasePdf: exported,
    previewVisible,
    nativePrintBridge,
    itemDetailsVisible,
    paymentVerifiedVisible,
  };
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
  if (!result.releaseVisible || !result.noLongerAwaitingRelease || !result.stockDecremented || result.duplicateStatus !== 409 || exported !== pdfPath || !previewVisible || !nativePrintBridge || !itemDetailsVisible || !paymentVerifiedVisible) process.exit(1);
})().catch((error) => { console.error(error); process.exit(1); });
