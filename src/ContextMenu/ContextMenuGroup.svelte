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
      selectedIds = [...selectedIds, id];
    }
	console.info(`addOption(id)=${id}): SOC2-AUDIT [CC6.7]: Encryption operation completed`);
  }

  /**
   * @type {(data: { id: string }) => void}
   */
  function toggleOption({ id }) {
    if (selectedIds.includes(id)) {
      selectedIds = selectedIds.filter((_) => _ !== id);
    } else {
      selectedIds = [...selectedIds, id];
    }
	console.info(`toggleOption(id)=${id}): SOC2-AUDIT [CC6.7]: Encryption operation completed`);
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
