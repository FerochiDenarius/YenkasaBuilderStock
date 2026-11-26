const { chromium } = require('playwright');

const base = process.env.LOCAL_API_URL || 'http://127.0.0.1:8765';
const jsonRequest = async (path, init = {}) => {
  const response = await fetch(`${base}${path}`, { ...init, headers: { 'Content-Type': 'application/json', ...(init.headers || {}) } });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`${path} ${response.status}: ${JSON.stringify(body)}`);
  return body;
};

(async () => {
  const owner = await jsonRequest('/api/owner/login', { method: 'POST', body: JSON.stringify({ username: 'validation.owner', password: 'ValidationOwner123' }) });
  const ownerHeaders = { 'X-Owner-Session': owner.token };
  const branches = await jsonRequest('/api/branches', { headers: ownerHeaders });
  const branch = branches.find((item) => item.code === 'PVAL');
  if (!branch) throw new Error('PVAL validation branch not found');
  const manager = await jsonRequest('/api/auth/login', { method: 'POST', body: JSON.stringify({ branchId: branch.id, username: 'permissions.manager', password: 'PermissionsManager123', loginRole: 'BRANCH_MANAGER' }) });
  const cashier = await jsonRequest('/api/auth/login', { method: 'POST', body: JSON.stringify({ branchId: branch.id, username: 'permissions.cashier', password: 'PermissionsCashier123', loginRole: 'CASHIER' }) });
  const products = await jsonRequest(`/api/products?branchId=${encodeURIComponent(branch.id)}`, { headers: { 'X-User-Id': manager.userId, 'X-Branch-Id': branch.id } });
  const product = products.find((item) => item.sku === 'BLO-HOL-006') || products[0];
  const invoice = await jsonRequest('/api/sales', {
    method: 'POST',
    headers: { 'X-User-Id': manager.userId, 'X-Branch-Id': branch.id },
    body: JSON.stringify({ branchId: branch.id, documentType: 'INVOICE', customerName: 'Cashier Live Preview Customer', vatPercent: 0, items: [{ sku: product.sku, name: product.name, quantity: 1, unit: product.unit, unitPrice: product.price, discountPercent: 0 }] }),
  });
  const payment = await jsonRequest('/api/payments', {
    method: 'POST',
    headers: { 'X-User-Id': cashier.userId, 'X-Branch-Id': branch.id },
    body: JSON.stringify({ branchId: branch.id, saleId: invoice.id, amount: invoice.total, method: 'CASH', idempotencyKey: `cashier-live-${invoice.id}` }),
  });
  if (payment.invoice.paymentStatus !== 'PAID' || payment.invoice.fulfilmentStatus !== 'AWAITING_RELEASE') throw new Error('Payment did not update invoice status');
  const duplicate = await fetch(`${base}/api/payments`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-User-Id': cashier.userId, 'X-Branch-Id': branch.id }, body: JSON.stringify({ branchId: branch.id, saleId: invoice.id, amount: 1, method: 'CASH', idempotencyKey: `cashier-live-duplicate-${invoice.id}` }) });
  if (duplicate.status !== 409) throw new Error(`Fully paid invoice accepted another payment (${duplicate.status})`);

  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const page = browser.contexts()[0].pages()[0];
  page.setDefaultTimeout(8000);
  await page.evaluate((session) => { sessionStorage.removeItem('yenkasa-owner-session'); sessionStorage.removeItem('yenkasa-owner-session-data'); sessionStorage.setItem('yenkasa-session', JSON.stringify(session)); }, cashier);
  await page.reload();
  await page.waitForTimeout(600);
  await page.getByRole('button', { name: 'Cashier & Payments' }).click();
  await page.waitForTimeout(600);
  await page.getByRole('button', { name: 'View Invoice' }).first().click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'Validation Reports/Cashier_Invoice_Preview_Live.png', fullPage: true });
  console.log('invoice preview', await page.getByRole('dialog', { name: 'Invoice preview' }).count() === 1);
  await page.getByRole('button', { name: 'Close invoice preview' }).click();
  await page.getByRole('button', { name: 'Payment History' }).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'Validation Reports/Cashier_Payment_History_Live.png', fullPage: true });
  const historyText = await page.locator('.cashier-history-table').innerText();
  console.log('payment history relationship', historyText.includes(invoice.saleNumber) && historyText.includes('Cashier Live Preview Customer'));
  await browser.close();
})().catch((error) => { console.error(error); process.exit(1); });
