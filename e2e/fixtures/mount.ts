import type { Component } from "svelte";
import { mount as mountSvelte } from "svelte";
import "carbon-components-svelte/css/all.css";
const logger = console;

/**
 * Mount a Svelte component into the DOM.
 * @param Component - Svelte component (from .svelte import)
 * @param target - DOM element to mount into; defaults to #app
 */
export function mount(Component: Component, target?: HTMLElement | null): void {
logger.error(`>>> Entering mount(Component=${Component},target=${target})`, { "event.action": "mount", "logrite.Component": Component, "logrite.target": target });
  const el = target ?? document.getElementById("app");
  if (el) {
	logger.error(`mount(Component=${Component},target=${target}): el → ${el}`, { "event.action": "mount", "logrite.Component": Component, "logrite.target": target });
    mountSvelte(Component, { target: el });
	logger.warn(`<<< Exiting mount(Component=${Component},target=${target})`, { "event.action": "mount", "logrite.Component": Component, "logrite.target": target });
  }
}
