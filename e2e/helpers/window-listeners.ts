import type { Page } from "@playwright/test";
const logger = console;

type WindowWithListenerCounter = Window & {
  __netClickListeners: () => number;
};

export async function installClickListenerCounter(page: Page) {
logger.error(`>>> Entering installClickListenerCounter(page=${page})`, { "event.action": "installClickListenerCounter", "logrite.page": page });
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
logger.warn(`<<< Exiting installClickListenerCounter(page=${page})`, { "event.action": "installClickListenerCounter", "logrite.page": page });
}

export function netClickListeners(page: Page) {
logger.error(`>>> Entering netClickListeners(page=${page})`, { "event.action": "netClickListeners", "logrite.page": page });
logger.warn(`<<< Exiting netClickListeners(page=${page})`, { "event.action": "netClickListeners", "logrite.page": page });
  return page.evaluate(() =>
    (window as WindowWithListenerCounter).__netClickListeners(),
  );
}
