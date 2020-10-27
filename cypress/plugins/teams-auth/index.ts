import { chromium, Page, ChromiumBrowserContext, ChromiumBrowser, Cookie } from 'playwright-chromium';
import { Config, KeyValuePair } from '../../models';

const TEAMS_URL = `https://teams.microsoft.com`;
const selectors = {
  username: `input[name=loginfmt]`,
  password: `input[name=passwd]`,
  submit: `input[type=submit]`,
  useWebAppLink: `a.use-app-lnk`,
  teamsElm: `#new-post-button`
}

export const TeamsAuth = async function (config: Config): Promise<{ cookies: Cookie[], localStorage: KeyValuePair[] }> {

  // Check if the required options are provided
  if (!config.username || !config.password) {
    throw new Error('Username or password missing.');
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(TEAMS_URL);
  
  await page.waitForSelector(selectors.username);
  await page.click(selectors.username);
  await page.type(selectors.username, config.username);
  await page.press(selectors.username, "Enter");

  await page.waitForSelector(selectors.password);
  await page.click(selectors.password);
  await page.type(selectors.password, config.password);
  await page.press(selectors.password, "Enter");

  await page.waitForSelector(selectors.submit);
  await page.click(selectors.submit);

  await page.waitForSelector(selectors.useWebAppLink);
  await page.click(selectors.useWebAppLink);

  const cookies = await getCookies(context, page, config);
  const localStorage = await getStorageValues(page, "localStorage")
  await finalizeSession(browser);

  // Return the browser cookies
  return {
    cookies,
    localStorage
  };
}

async function getCookies(context: ChromiumBrowserContext, page: Page, config: Config) {
  await page.waitForSelector(selectors.teamsElm);
  // Retrieving all the cookies
  const cookies = await context.cookies();
  return cookies
}

async function getStorageValues(page: Page, type: "localStorage") {
  const storageItems = await page.evaluate(() => {
    const storage = window.localStorage;
    const keys = Object.keys(storage);
    return keys.map(key => ({
      key,
      value: storage.getItem(key)
    }));
  });
  return storageItems;
}

async function finalizeSession(browser: ChromiumBrowser) {
  await browser.close()
}