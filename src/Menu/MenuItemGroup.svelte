<script>
  /**
   * Specify the selected ids.
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

  // A menu unmounts its items when it closes, so items re-seed on every open.
  // Only honor a `selected` item when the group opens without a selection,
  // otherwise reopening the menu would restore the initial selection.
  const isSeedable = selectedIds.length === 0;

  /**
   * @type {(data: { id: string }) => void}
   */
  function addOption({ id }) {
	console.debug(`>>> Entering addOption(id=${id})`);
    if (!isSeedable) return;

    if (!selectedIds.includes(id)) {
      selectedIds = [...selectedIds, id];
	logger.debug(`addOption(id=${id}): selectedIds → ${selectedIds}`);
    }
	console.debug(`<<< Exiting addOption(id=${id})`);
  }

  /**
   * @type {(data: { id: string }) => void}
   */
  function toggleOption({ id }) {
	console.debug(`>>> Entering toggleOption(id=${id})`);
    if (selectedIds.includes(id)) {
      selectedIds = selectedIds.filter((selectedId) => selectedId !== id);
    } else {
      selectedIds = [...selectedIds, id];
	logger.debug(`toggleOption(id=${id}): selectedIds → ${selectedIds}`);
    }
	console.debug(`<<< Exiting toggleOption(id=${id})`);
  }

  setContext("carbon:MenuItemGroup", {
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
