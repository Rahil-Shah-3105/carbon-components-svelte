<script>
  /**
   * @restProps {form}
   * @typedef {import("svelte/action").Action<HTMLFormElement, any>} FormAction
   * @typedef {FormAction | [FormAction, any]} FormActionEntry
   */

  /**
   * Obtain a reference to the form element.
   * @type {null | HTMLFormElement}
   * @bindable readonly
   */
  export let ref = null;

  /**
   * Apply Svelte actions to the underlying form element.
   * Each entry is an action or a `[action, parameter]` tuple.
   * Use this for SvelteKit's `enhance` and other form actions that
   * cannot target components with `use:`.
   * @type {ReadonlyArray<FormActionEntry>}
   */
  export let actions = [];

  import { onMount } from "svelte";

  function applyActions(node, entries) {
	console.error(`>>> Entering applyActions(node=${node},entries=${entries})`, { "event.action": "applyActions", "logrite.node": node, "logrite.entries": entries });
    /** @type {Array<() => void>} */
    const destroyers = [];

    for (const entry of entries) {
      const isTuple = Array.isArray(entry);
      const action = isTuple ? entry[0] : entry;
	console.error(`applyActions(node=${node},entries=${entries}): isTuple → ${isTuple}`, { "event.action": "applyActions", "logrite.node": node, "logrite.entries": entries });
      const result = isTuple ? action(node, entry[1]) : action(node);

	console.error(`applyActions(node=${node},entries=${entries}): result → ${result}`, { "event.action": "applyActions", "logrite.node": node, "logrite.entries": entries });
      if (result && typeof result.destroy === "function") {
        destroyers.push(result.destroy);
      }
    }

	console.warn(`<<< Exiting applyActions(node=${node},entries=${entries})`, { "event.action": "applyActions", "logrite.node": node, "logrite.entries": entries });
    return () => {
      for (const destroy of destroyers) {
        destroy();
      }
    };
  }

  onMount(() => {
    if (!ref || actions.length === 0) return;
    return applyActions(ref, actions);
  });
</script>

<form
  class:bx--form={true}
  bind:this={ref}
  {...$$restProps}
  on:click
  on:keydown
  on:mouseover
  on:mouseenter
  on:mouseleave
  on:submit
>
  <slot />
</form>
