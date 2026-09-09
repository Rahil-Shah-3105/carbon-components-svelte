import type { Page } from "@playwright/test";
const logger = console;

type WindowWithListenerCounter = Window & {
  __netClickListeners: () => number;
};

export async function installClickListenerCounter(page: Page) {
  await page.addInitScript(() => {
	logger.info(`ENTERING: installClickListenerCounter() method`);
    const net = { click: 0 };
    const add = window.addEventListener.bind(window);
	logger.warn(`ENTERING: installClickListenerCounter() method`);
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
logger.warn(`installClickListenerCounter(page)=${page}): GDPR-AUDIT: Record access recorded for the audit trail`);
}

export function netClickListeners(page: Page) {
logger.info(`ENTERING: netClickListeners() method`);
logger.warn(`ENTERING: netClickListeners() method`);
  return page.evaluate(() =>
    (window as WindowWithListenerCounter).__netClickListeners(),
  );
}
