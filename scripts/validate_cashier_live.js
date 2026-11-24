const { chromium } = require('playwright');
const { execFile } = require('node:child_process');

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
    if (response.status >= 400) throw new Error(`${path}: ${JSON.stringify(response.body)}`);
    return response.body;
  };

  // Create a real unpaid invoice through the local API using the persisted
  // branch manager account, then collect it through the live cashier screen.
  const manager = await apiJson('/api/auth/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ branchId: BRANCH_ID, username: 'validation.manager', password: 'ValidationPass123', loginRole: 'BRANCH_MANAGER' }),
  });
  const products = await apiJson(`/api/products?branchId=${BRANCH_ID}`, {
    headers: { 'X-User-Id': manager.userId, 'X-Branch-Id': BRANCH_ID },
  });
  const product = products.find((item) => item.sku === 'CEM-GHA-425R') || products[0];
  const customer = `Cashier Live Customer ${Date.now()}`;
  const invoice = await apiJson('/api/sales', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-User-Id': manager.userId, 'X-Branch-Id': BRANCH_ID },
    body: JSON.stringify({
      branchId: BRANCH_ID, documentType: 'INVOICE', customerName: customer, vatPercent: 0,
      items: [{ sku: product.sku, name: product.name, quantity: 1, unit: product.unit, unitPrice: product.price, discountPercent: 0 }],
    }),
  });

  await page.evaluate(() => sessionStorage.removeItem('yenkasa-session'));
  await page.reload();
  await page.locator('.branch-login-nav').click();
  await page.getByTestId('login-role').selectOption('CASHIER');
  await page.getByTestId('login-username').fill('validation.cashier');
  await page.getByTestId('login-password').fill('ValidationCashier123');
  await page.getByTestId('branch-login-submit').click();
  await page.getByText(/workspace/).waitFor();
  await page.getByRole('button', { name: 'Cashier & Payments' }).click();
  await page.locator('.cashier-page').waitFor();

  const invoiceRow = page.locator('.cashier-invoice-row').filter({ hasText: customer });
  await invoiceRow.waitFor();
  await invoiceRow.click();
  const amount = page.locator('.cashier-field input').first();
  await amount.fill(invoice.total.toFixed(2));
  await page.getByRole('button', { name: 'Confirm Payment & Print Receipt' }).click();
  await page.getByText('Payment Successful!').waitFor();
  const fullyPaidButtonDisabled = await page.getByRole('button', { name: 'Invoice Fully Paid' }).isDisabled();
  await page.getByRole('button', { name: 'Preview Receipt' }).click();
  await page.getByRole('dialog', { name: 'Receipt preview' }).waitFor();
  const previewVisible = await page.getByRole('dialog', { name: 'Receipt preview' }).getByText('PAYMENT RECEIPT').count() > 0;
  const fullItemListVisible = await page.getByRole('dialog', { name: 'Receipt preview' }).getByText(product.name).count() > 0;
  const ownerTemplateLabelVisible = await page.getByRole('dialog', { name: 'Receipt preview' }).getByText(/Owner template:/).count() > 0;
  const nativePrintBridge = await page.evaluate(() => typeof window.desktopBridge?.print === 'function');
  await page.screenshot({ path: 'Validation Reports/50_cashier_receipt_preview_live.png', fullPage: true });
  await page.getByRole('button', { name: 'Close receipt preview' }).click();
  const dismissPrintDialog = new Promise((resolve) => {
    execFile('osascript', ['-e', 'delay 2', '-e', 'tell application "System Events" to key code 53'], { timeout: 10000 }, () => resolve());
  });
  const nativePrintResult = await page.evaluate(() => window.desktopBridge?.print() ?? false);
  await dismissPrintDialog;

  const pdfPath = '/Users/kofibright/Desktop/YKBuildStock/Validation Reports/50_cashier_receipt_live.pdf';
  const exported = await page.evaluate(async ({ pdfPath }) => window.desktopBridge?.exportPdf(pdfPath, '80 mm') ?? null, { pdfPath });
  await page.screenshot({ path: 'Validation Reports/50_cashier_payment_live.png', fullPage: true });

  const cashier = await apiJson('/api/auth/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ branchId: BRANCH_ID, username: 'validation.cashier', password: 'ValidationCashier123', loginRole: 'CASHIER' }),
  });
  const invoices = await apiJson(`/api/cashier/invoices?branchId=${BRANCH_ID}&search=${encodeURIComponent(customer)}`, {
    headers: { 'X-User-Id': cashier.userId, 'X-Branch-Id': BRANCH_ID },
  });
  const persisted = invoices.find((item) => item.id === invoice.id);
  const result = {
    invoiceNumber: invoice.saleNumber,
    receiptVisible: await page.getByText(/Receipt No:/).count() === 1,
    paymentStatus: persisted?.paymentStatus,
    fulfilmentStatus: persisted?.fulfilmentStatus,
    receiptPdf: exported,
    fullyPaidButtonDisabled,
    previewVisible,
    nativePrintBridge,
    nativePrintResult,
    fullItemListVisible,
    ownerTemplateLabelVisible,
  };
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
  if (!result.receiptVisible || result.paymentStatus !== 'PAID' || result.fulfilmentStatus !== 'AWAITING_RELEASE' || exported !== pdfPath || !fullyPaidButtonDisabled || !previewVisible || !fullItemListVisible || !ownerTemplateLabelVisible || !nativePrintBridge || typeof nativePrintResult !== 'boolean') process.exit(1);
})().catch((error) => { console.error(error); process.exit(1); });
