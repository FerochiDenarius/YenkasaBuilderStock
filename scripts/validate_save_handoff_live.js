import { chromium } from 'playwright';

const browser = await chromium.connectOverCDP('http://127.0.0.1:9226');
const page = browser.contexts()[0].pages()[0];
await page.waitForLoadState('domcontentloaded');
await page.getByText('Welcome to YenkasaBuildersStock').waitFor({ state: 'visible', timeout: 15000 });
await page.getByRole('button', { name: 'Database Configuration' }).click();
await page.getByText('Connect to Supabase').waitFor({ state: 'visible', timeout: 5000 });
await page.getByRole('button', { name: 'Test Connection' }).click();
await page.getByText('Connection verified').waitFor({ state: 'visible', timeout: 30000 });
await page.getByRole('button', { name: 'Save and Continue' }).click();
await page.getByText('Welcome to YenkasaBuildersStock').waitFor({ state: 'visible', timeout: 10000 });
await page.screenshot({ path: 'Validation Reports/Welcome_After_Save_Live.png', fullPage: true });
console.log(JSON.stringify({ saveHandoffReturnedToWelcome: true }));
await browser.close();
