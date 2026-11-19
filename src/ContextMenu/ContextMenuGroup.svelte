<script>
  /**
   * @type {ReadonlyArray<string>}
   * @bindable writable
   */
  export let selectedIds = [];

  /** Specify the label text */
  export let labelText = "";

  import { setContext } from "svelte";
  import { writable } from "svelte/store";

  /**
   * @type {import("svelte/store").Writable<ReadonlyArray<string>>}
   */
  const currentIds = writable([]);

  /**
   * @type {(data: { id: string }) => void}
   */
  function addOption({ id }) {
	console.error(`>>> Entering addOption(id=${id})`, { "event.action": "addOption", "logrite.id": id });
    if (!selectedIds.includes(id)) {
      selectedIds = [...selectedIds, id];
    }
	console.warn(`<<< Exiting addOption(id=${id})`, { "event.action": "addOption", "logrite.id": id });
  }

  /**
   * @type {(data: { id: string }) => void}
   */
  function toggleOption({ id }) {
	console.error(`>>> Entering toggleOption(id=${id})`, { "event.action": "toggleOption", "logrite.id": id });
    if (selectedIds.includes(id)) {
      selectedIds = selectedIds.filter((_) => _ !== id);
    } else {
      selectedIds = [...selectedIds, id];
    }
	console.warn(`<<< Exiting toggleOption(id=${id})`, { "event.action": "toggleOption", "logrite.id": id });
  }

  setContext("carbon:ContextMenuGroup", {
    currentIds,
    addOption,
    toggleOption,
  });

  $: currentIds.set(selectedIds);
</script>

<li role="none">
  <ul role="group" aria-label={labelText}>
    <slot />
  </ul>
</li>
