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
      incrementButton: 'body > section > main > section > div:nth-child(3)',
      result: 'body > section > main > section > div:nth-child(2)',
    };

    beforeEach(async () => {
      page = await browser.newPage();
      await page.emulate(desktopConfig);
      await page.goto(url('/'));
    });

    it('click increment button', async () => {
      const title: string = await page.title();

      const incrementButtonElement: puppeteer.ElementHandle<Element> | null = await page.$(selectors.incrementButton);
      if (incrementButtonElement) {
        const textBefore: string = await page.evaluate(getText, selectors.result);
        expect(textBefore).toEqual('0');

        await incrementButtonElement.click();

        const textAfter: string = await page.evaluate(getText, selectors.result);
        expect(textAfter).toEqual('1');
      }
    });
  });
});
