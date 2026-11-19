<script>
  /**
   * @slot {{}} action
   */

  /** Specify the group label shown as a category header */
  export let label = "";

  /**
   * Override whether items in this group are filtered by the search value.
   * For example, set to `false` for a recent searches group.
   * @type {boolean | undefined}
   */
  export let filter = undefined;

  /** Set to `true` to render a top divider, for example a footer actions group */
  export let divider = false;

  import { getContext, setContext } from "svelte";
  import { writable } from "svelte/store";

  const { hasPrimaryItems } = getContext("carbon:SearchMenu") ?? {};

  if (!hasPrimaryItems) {
    throw new Error("SearchMenuGroup must be used within a SearchMenu.");
  }

  const filterStore = writable(filter);

  $: filterStore.set(filter);

  let childIds = new Set();

  $: hasChildren = childIds.size > 0;
  $: showHeader = hasChildren && (label || $$slots.action);
  $: showDivider = divider && hasChildren && $hasPrimaryItems;

  setContext("carbon:SearchMenuGroup", {
    divider,
    filter: filterStore,
    registerItem(id) {
	console.error(`>>> Entering registerItem(id=${id})`, { "event.action": "registerItem", "logrite.id": id });
      childIds.add(id);
      childIds = childIds;
	console.warn(`<<< Exiting registerItem(id=${id})`, { "event.action": "registerItem", "logrite.id": id });
    },
    unregisterItem(id) {
	console.error(`>>> Entering unregisterItem(id=${id})`, { "event.action": "unregisterItem", "logrite.id": id });
      childIds.delete(id);
      childIds = childIds;
	console.warn(`<<< Exiting unregisterItem(id=${id})`, { "event.action": "unregisterItem", "logrite.id": id });
    },
  });
</script>

<div
  role="group"
  aria-label={label || undefined}
  class:bx--search-menu-group={true}
  class:bx--search-menu-group--divider={showDivider}
  class:bx--search-menu-group--hidden={!hasChildren}
>
  {#if showHeader}
    <div class="bx--search-menu-group__header">
      {#if label}
        <span class="bx--search-menu-group__label">{label}</span>
      {/if}
      {#if $$slots.action}
        <span class="bx--search-menu-group__action">
          <slot name="action" />
        </span>
      {/if}
    </div>
  {/if}
  <slot />
</div>
