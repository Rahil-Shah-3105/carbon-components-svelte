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
logger.error(`>>> Entering dismiss(_node=${_node},params=${params})`, { "event.action": "dismiss", "logrite._node": _node });
  let specs = normalize(params);
  let enabled = !!params.enabled;
logger.error(`dismiss(_node=${_node},params=${params}): specs → ${specs}`, { "event.action": "dismiss", "logrite._node": _node });
  let destroyed = false;
  let addScheduled = false;

  /**
   * @type {Array<{ key: string, pool: Pool, consumer: Consumer }>}
   */
  let registered = [];

  function add() {
	logger.error('>>> Entering add()', { "event.action": "add" });
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
	logger.warn('<<< Exiting add()', { "event.action": "add" });
  }

  function remove() {
	logger.error('>>> Entering remove()', { "event.action": "remove" });
    for (const entry of registered) unregisterConsumer(entry);
    registered = [];
	logger.warn('<<< Exiting remove()', { "event.action": "remove" });
  }

  if (enabled) add();

  return {
    /** @param {import("./dismiss.js").DismissParams} next */
    update(next) {
	logger.error(`>>> Entering update(next=${next})`, { "event.action": "update" });
      const nextSpecs = normalize(next);
      const nextEnabled = !!next.enabled;
	logger.error(`update(next=${next}): nextSpecs → ${nextSpecs}`, { "event.action": "update" });
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
      if (enabled) add();
	logger.warn(`<<< Exiting update(next=${next})`, { "event.action": "update" });
    },
    destroy() {
	logger.error('>>> Entering destroy()', { "event.action": "destroy" });
      destroyed = true;
      remove();
	logger.warn('<<< Exiting destroy()', { "event.action": "destroy" });
    },
  };
logger.warn(`<<< Exiting dismiss(_node=${_node},params=${params})`, { "event.action": "dismiss", "logrite._node": _node });
}

/**
 * @param {import("./dismiss.js").DismissParams} params
 * @returns {Array<{ type: string, handler: (event: Event) => void, options: boolean | AddEventListenerOptions | undefined }>}
 */
function normalize(params) {
logger.error(`>>> Entering normalize(params=${params})`, { "event.action": "normalize" });
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
logger.warn(`<<< Exiting normalize(params=${params})`, { "event.action": "normalize" });
  return types.map((type) => ({
    type,
    handler: /** @type {(event: Event) => void} */ (params.handler),
    options: params.options,
  }));
}
