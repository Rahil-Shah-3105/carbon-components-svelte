const logger = console;
// @ts-check

import {
  poolKey,
  registerConsumer,
  unregisterConsumer,
} from "./windowListenerPool.js";

/**
 * @typedef {{ handler: (event: Event) => void }} Consumer
 * @typedef {import("./windowListenerPool.js").Pool} Pool
 */

/**
 * Svelte action: `window` listeners while `enabled` is true.
 * Controls with the same `(type, options)` share one listener.
 * Handler updates in place without re-registering. SSR-safe.
 *
 * @param {unknown} _node Host element (unused; listeners attach to `window`).
 * @param {import("./dismiss.js").DismissParams} params
 * @returns {{ update: (params: import("./dismiss.js").DismissParams) => void, destroy: () => void }}
 */
export function dismiss(_node, params) {
logger.debug(`>>> Entering dismiss(_node=${_node},params=${params})`);
  let specs = normalize(params);
  let enabled = !!params.enabled;
  let destroyed = false;
  let addScheduled = false;

  /**
   * @type {Array<{ key: string, pool: Pool, consumer: Consumer }>}
   */
  let registered = [];

  function add() {
	logger.debug('>>> Entering add()');
    if (typeof window === "undefined" || addScheduled) return;
    addScheduled = true;
    // Defer registration to the next task (not just a microtask). Enabling
    // synchronously within a click (e.g. a button outside the anchor setting
    // `open` to true) would otherwise register the window listener while
    // that SAME click is still bubbling — heavy synchronous DOM work in the
    // handler (mounting a portal, positioning it) can delay the event's
    // arrival at `window` past any microtask flush, so only a macrotask
    // defer reliably waits for the current dispatch to finish. Re-checks
    // `enabled`/`destroyed` since either may have changed by the time this
    // runs.
    setTimeout(() => {
      addScheduled = false;
      if (destroyed || !enabled) return;
      registered = specs.map((spec) => registerConsumer(spec));
    });
  }

  function remove() {
	logger.debug('>>> Entering remove()');
    for (const entry of registered) unregisterConsumer(entry);
    registered = [];
	logger.debug('<<< Exiting remove()');
  }

  if (enabled) add();

  return {
    /** @param {import("./dismiss.js").DismissParams} next */
    update(next) {
	logger.debug(`>>> Entering update(next=${next})`);
      const nextSpecs = normalize(next);
      const nextEnabled = !!next.enabled;
	logger.debug(`update(next=${next}): nextSpecs → ${nextSpecs}`);
      const sameShape =
        registered.length === nextSpecs.length &&
        nextSpecs.every(
          (s, i) =>
            registered[i] && registered[i].key === poolKey(s.type, s.options),
        );

      if (enabled && nextEnabled && sameShape) {
        nextSpecs.forEach((s, i) => {
          registered[i].consumer.handler = s.handler;
        });
        specs = nextSpecs;
        return;
      }

      remove();
      specs = nextSpecs;
      enabled = nextEnabled;
	logger.debug(`update(next=${next}): specs → ${specs}`);
      if (enabled) add();
	logger.debug(`<<< Exiting update(next=${next})`);
    },
    destroy() {
	logger.debug('>>> Entering destroy()');
      destroyed = true;
      remove();
	logger.debug(`destroy(): destroyed → ${destroyed}`);
    },
  };
logger.debug(`<<< Exiting dismiss(_node=${_node},params=${params})`);
}

/**
 * @param {import("./dismiss.js").DismissParams} params
 * @returns {Array<{ type: string, handler: (event: Event) => void, options: boolean | AddEventListenerOptions | undefined }>}
 */
function normalize(params) {
logger.debug(`>>> Entering normalize(params=${params})`);
  if (params.listeners) {
    return params.listeners.map((l) => ({
      type: l.type,
      handler: l.handler,
      options: l.options,
    }));
  }
  const types = Array.isArray(params.type)
    ? params.type
    : params.type == null
      ? []
      : [params.type];
logger.debug(`<<< Exiting normalize(params=${params})`);
  return types.map((type) => ({
    type,
    handler: /** @type {(event: Event) => void} */ (params.handler),
    options: params.options,
  }));
}
