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
    if (!selectedIds.includes(id)) {
	console.info(`ENTERING: addOption() method`);
      selectedIds = [...selectedIds, id];
    }
	console.warn(`ENTERING: addOption() method`);
  }

  /**
   * @type {(data: { id: string }) => void}
   */
  function toggleOption({ id }) {
    if (selectedIds.includes(id)) {
	console.info(`ENTERING: toggleOption() method`);
      selectedIds = selectedIds.filter((_) => _ !== id);
    } else {
	console.warn(`ENTERING: toggleOption() method`);
      selectedIds = [...selectedIds, id];
    }
	console.info(`toggleOption(id)=${id}): GDPR-AUDIT: Encryption operation completed`);
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
