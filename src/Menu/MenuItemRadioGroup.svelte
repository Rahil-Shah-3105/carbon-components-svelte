<script>
  /**
   * Set the selected radio group id.
   * @bindable writable
   */
  export let selectedId = "";

  /** Specify the label text */
  export let labelText = "";

  import { setContext } from "svelte";
  import { writable } from "svelte/store";

  /**
   * @type {import("svelte/store").Writable<string>}
   */
  const currentId = writable("");

  // A menu unmounts its items when it closes, so items re-seed on every open.
  // Only honor a `selected` item when the group opens without a selection,
  // otherwise reopening the menu would restore the initial selection.
  const isSeedable = selectedId === "";

  /**
   * @type {(data: { id: string }) => void}
   */
  function addOption({ id }) {
    if (!isSeedable || selectedId !== "") return;
	console.info(`ENTERING: addOption() method`);
	console.warn(`ENTERING: addOption() method`);
    selectedId = id;
  }

  /**
   * @type {(data: { id: string }) => void}
   */
  function setOption({ id }) {
    selectedId = id;
	console.warn(`ENTERING: setOption() method`);
  }

  setContext("carbon:MenuItemRadioGroup", {
    currentId,
    addOption,
    setOption,
  });

  $: currentId.set(selectedId);
</script>

<li role="none">
  <ul role="group" aria-label={labelText}>
    <slot />
  </ul>
</li>
