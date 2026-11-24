import { chromium } from 'playwright';

const browser = await chromium.connectOverCDP('http://127.0.0.1:9225');
const page = browser.contexts()[0].pages()[0];
await page.waitForLoadState('domcontentloaded');
await page.waitForTimeout(3000);
console.log('URL', page.url());
console.log((await page.locator('body').innerText()).slice(0, 3000));
await page.screenshot({ path: 'Validation Reports/Welcome_Fresh_Install_Debug.png', fullPage: true });
await page.getByText('Welcome to YenkasaBuildersStock').waitFor({ state: 'visible', timeout: 15000 });

const body = await page.locator('body').innerText();
const firstScreen = {
  welcomeVisible: body.includes('Welcome to YenkasaBuildersStock'),
  databaseConfigurationVisible: body.includes('Configure Database'),
  ownerLoginDisabled: await page.getByRole('button', { name: 'Login as Owner' }).isDisabled(),
  staffLoginDisabled: await page.getByRole('button', { name: 'Login as Staff' }).isDisabled(),
  newCompanyDisabled: await page.getByRole('button', { name: 'Set Up New Company' }).isDisabled(),
};
await page.screenshot({ path: 'Validation Reports/Welcome_Fresh_Install.png', fullPage: true });

await page.getByRole('button', { name: 'Configure Database' }).click();
await page.getByText('Connect to Supabase').waitFor({ state: 'visible', timeout: 5000 });
const databaseScreen = { databaseHeadingVisible: true };

console.log(JSON.stringify({ firstScreen, databaseScreen }));
await browser.close();
