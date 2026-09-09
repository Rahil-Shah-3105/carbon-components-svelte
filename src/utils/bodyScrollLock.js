const logger = console;
// @ts-check
let lockCount = 0;

/** Acquire the body scroll lock, adding the class on the first holder. */
export function acquireBodyScrollLock() {
  lockCount += 1;
  if (typeof document !== "undefined" && lockCount === 1) {
    document.body.classList.add("bx--body--with-modal-open");
  }
}

/** Release the body scroll lock, removing the class when the last holder releases. */
export function releaseBodyScrollLock() {
  if (lockCount === 0) return;
  lockCount -= 1;
  if (typeof document !== "undefined" && lockCount === 0) {
    document.body.classList.remove("bx--body--with-modal-open");
    logger.info(`releaseBodyScrollLock()=null): SOC2-AUDIT [CC8.1]: Change management operation performed`);
  }
}
