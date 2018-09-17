import * as puppeteer from 'puppeteer';
import * as devices from 'puppeteer/DeviceDescriptors';

interface IEmulateConfig {
  userAgent: string;
  viewport: {
    width: number;
    height: number;
    deviceScaleFactor: number;
    isMobile: boolean;
    hasTouch: boolean;
    isLandscape: boolean;
  };
}

// https://github.com/GoogleChrome/puppeteer/blob/master/DeviceDescriptors.js
const desktopConfig: IEmulateConfig = {
  userAgent: '',
  viewport: {
    width: 2560,
    height: 1600,
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
    isLandscape: false
  },
};
const mobileConfig: IEmulateConfig = devices['iPhone X'];

function url(path: string): string {
  return `http://localhost:3000${path}`;
}

function getText(selector: string): string {
  const el: HTMLElement | null = document.querySelector(selector);

  return el === null ? '' : el.textContent || '';
};

function getPathname(): string {
  return window.location.pathname;
};

function getHref(selector: string): string {
  const el: HTMLAnchorElement | null = document.querySelector(selector);

  return el === null ? '' : el.pathname || '';
}

let browser: puppeteer.Browser;

beforeAll(async () => {
  browser = await puppeteer.launch();
});

afterAll(async () => {
  await browser.close();
});

describe('Home', async () => {

  describe('Desktop', () => {
    let page: puppeteer.Page;
    const selectors: {[key: string]: string} = {
      result: 'body > section > main > section > div:nth-child(2)',
      incrementButton: 'body > section > main > section > div:nth-child(3)',
      decrementButton: 'body > section > main > section > div:nth-child(4)',
      toSubPageLink: 'body > section > main > section > div:nth-child(5) > a',
    };

    beforeEach(async () => {
      page = await browser.newPage();
      await page.emulate(desktopConfig);
      await page.goto(url('/'));
    });

    it('screen spec', async () => {
      const incrementButtonElement: puppeteer.ElementHandle<Element> | null = await page.$(selectors.incrementButton);
      const decrementButtonElement: puppeteer.ElementHandle<Element> | null = await page.$(selectors.decrementButton);
      const toSubPageLinkElement: puppeteer.ElementHandle<Element> | null = await page.$(selectors.toSubPageLink);

      if (incrementButtonElement && decrementButtonElement && toSubPageLinkElement) {
        let text: string = await page.evaluate(getText, selectors.result);
        expect(text).toEqual('0');

        await incrementButtonElement.click();

        text = await page.evaluate(getText, selectors.result);
        expect(text).toEqual('1');

        await decrementButtonElement.click();

        text = await page.evaluate(getText, selectors.result);
        expect(text).toEqual('0');

        const href: string = await page.evaluate(getHref, selectors.toSubPageLink);

        await toSubPageLinkElement.click();

        const pathname: string = await page.evaluate(getPathname);
        expect(pathname).toEqual(href);
      } else {
        throw new Error('Not display need elements');
      }
    });
  });
});
