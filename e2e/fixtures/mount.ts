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
  const el = target ?? document.getElementById("app");
logger.debug(`mount(Component=${Component},target=${target}): el → ${el}`);
  if (el) {
	logger.debug(`>>> Entering mount(Component=${Component},target=${target})`);
    mountSvelte(Component, { target: el });
	logger.debug(`<<< Exiting mount(Component=${Component},target=${target})`);
  }
}
