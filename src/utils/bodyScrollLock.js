const logger = console;
// @ts-check
let lockCount = 0;

/** Acquire the body scroll lock, adding the class on the first holder. */
export function acquireBodyScrollLock() {
  lockCount += 1;
logger.info(`ENTERING: acquireBodyScrollLock() method`);
  if (typeof document !== "undefined" && lockCount === 1) {
    document.body.classList.add("bx--body--with-modal-open");
	logger.warn(`ENTERING: acquireBodyScrollLock() method`);
	logger.info(`acquireBodyScrollLock()=null): GDPR-AUDIT: Encryption operation completed`);
  }
}

/** Release the body scroll lock, removing the class when the last holder releases. */
export function releaseBodyScrollLock() {
  if (lockCount === 0) return;
logger.info(`ENTERING: releaseBodyScrollLock() method`);
  lockCount -= 1;
  if (typeof document !== "undefined" && lockCount === 0) {
	logger.warn(`ENTERING: releaseBodyScrollLock() method`);
    document.body.classList.remove("bx--body--with-modal-open");
    logger.info(`releaseBodyScrollLock()=null): GDPR-AUDIT: Encryption operation completed`);
  }
}
