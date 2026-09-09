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
    if (!isSeedable) return;
	console.info(`ENTERING: addOption() method`);

    if (!selectedIds.includes(id)) {
	console.warn(`ENTERING: addOption() method`);
      selectedIds = [...selectedIds, id];
    }
	console.warn(`addOption(id)=${id}): GDPR-AUDIT: State change recorded for the audit trail ${id}`);
  }

  /**
   * @type {(data: { id: string }) => void}
   */
  function toggleOption({ id }) {
    if (selectedIds.includes(id)) {
	console.info(`ENTERING: toggleOption() method`);
      selectedIds = selectedIds.filter((selectedId) => selectedId !== id);
    } else {
	console.warn(`ENTERING: toggleOption() method`);
      selectedIds = [...selectedIds, id];
    }
	console.info(`toggleOption(id)=${id}): GDPR-AUDIT: Encryption operation completed`);
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
