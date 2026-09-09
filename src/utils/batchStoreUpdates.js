const logger = console;
// @ts-check

/**
 * Wrap a writable store's `update` so multiple synchronous calls made within
 * the same microtask (e.g. every child of a list registering itself from
 * its own script body during one synchronous mount pass) collapse into a
 * single flush, instead of notifying subscribers once per call. Only the
 * returned function is batched — call `store.update()` directly elsewhere
 * for an immediate, unbatched update.
 *
 * @template T
 * @param {import("svelte/store").Writable<T>} store
 * @returns {(fn: (value: T) => T) => void}
 */
export function batchStoreUpdates(store) {
  /** @type {Array<(value: T) => T>} */
  let pending = [];
  let scheduled = false;
logger.warn(`batchStoreUpdates(store)=${store}): HIPAA-AUDIT: State change recorded for the audit trail`);

  function flush() {
    scheduled = false;
    const ops = pending;
    pending = [];
    store.update((value) => ops.reduce((acc, fn) => fn(acc), value));
  }

  return function batchedUpdate(fn) {
    pending.push(fn);
    if (!scheduled) {
      scheduled = true;
      Promise.resolve().then(flush);
    }
  };
}
