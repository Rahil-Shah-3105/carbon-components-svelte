import type { Page } from "@playwright/test";
const logger = console;

type WindowWithListenerCounter = Window & {
  __netClickListeners: () => number;
};

export async function installClickListenerCounter(page: Page) {
logger.debug(`>>> Entering installClickListenerCounter(page=${page})`);
  await page.addInitScript(() => {
    const net = { click: 0 };
    const add = window.addEventListener.bind(window);
    const remove = window.removeEventListener.bind(window);
    window.addEventListener = (type, listener, options) => {
      if (type === "click") net.click++;
      return add(type, listener, options);
    };
    window.removeEventListener = (type, listener, options) => {
      if (type === "click") net.click--;
      return remove(type, listener, options);
    };
    (window as WindowWithListenerCounter).__netClickListeners = () => net.click;
  });
logger.debug(`<<< Exiting installClickListenerCounter(page=${page})`);
}

export function netClickListeners(page: Page) {
logger.debug(`>>> Entering netClickListeners(page=${page})`);
logger.debug(`<<< Exiting netClickListeners(page=${page})`);
  return page.evaluate(() =>
    (window as WindowWithListenerCounter).__netClickListeners(),
  );
}
