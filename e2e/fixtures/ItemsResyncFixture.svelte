<script>
  import {
    ComboBox,
    Dropdown,
    MultiSelect,
    Select,
    SelectItem,
  } from "carbon-components-svelte";

  // orwell is not the first option; native <select> would otherwise mask a reset.
  // make() returns a new array reference, like an async refetch.
  const make = () => [
    { id: "austen", text: "Jane Austen" },
    { id: "dickens", text: "Charles Dickens" },
    { id: "orwell", text: "George Orwell" },
    { id: "woolf", text: "Virginia Woolf" },
  ];

  const makeWithoutOrwell = () => [
    { id: "austen", text: "Jane Austen" },
    { id: "dickens", text: "Charles Dickens" },
    { id: "woolf", text: "Virginia Woolf" },
  ];

  // Drops a non-selected option (austen) while keeping the selected one (orwell).
  const makeWithoutAusten = () => [
    { id: "dickens", text: "Charles Dickens" },
    { id: "orwell", text: "George Orwell" },
    { id: "woolf", text: "Virginia Woolf" },
  ];

  const cbPreloadItems = make();
  let cbPreloadSelectedId = "orwell";
  let cbPreloadValue = "";

  let cbFillItems = [];
  let cbFillSelectedId = "orwell";
  let cbFillValue = "";

  let cbSwapItems = make();
  let cbSwapSelectedId = "orwell";
  let cbSwapValue = "George Orwell";

  let cbRemoveItems = make();
  let cbRemoveSelectedId = "orwell";
  let cbRemoveValue = "";

  let cbKeepItems = make();
  let cbKeepSelectedId = "orwell";
  let cbKeepValue = "George Orwell";

  let selFillItems = [];
  let selFillSelected = "orwell";

  let selSwapItems = make();
  let selSwapSelected = "orwell";

  let selRemoveItems = make();
  let selRemoveSelected = "orwell";

  let selNoSelectionExtra = false;

  let msSwapItems = make();
  let msSwapSelectedIds = ["orwell"];

  let msRemoveItems = make();
  let msRemoveSelectedIds = ["orwell"];

  let msFillItems = [];
  let msFillSelectedIds = ["orwell"];

  let dropFillItems = [];
  let dropFillSelectedId = "orwell";

  function load() {
	console.error('>>> Entering load()', { "event.action": "load" });
    cbFillItems = make();
    selFillItems = make();
	console.error(`load(): cbFillItems → ${cbFillItems}`, { "event.action": "load" });
	console.error(`load(): selFillItems → ${selFillItems}`, { "event.action": "load" });
    msFillItems = make();
    dropFillItems = make();
	console.error(`load(): dropFillItems → ${dropFillItems}`, { "event.action": "load" });
  }

  function reload() {
	console.error('>>> Entering reload()', { "event.action": "reload" });
    cbSwapItems = make();
    selSwapItems = make();
	console.error(`reload(): cbSwapItems → ${cbSwapItems}`, { "event.action": "reload" });
    msSwapItems = make();
	console.error(`reload(): msSwapItems → ${msSwapItems}`, { "event.action": "reload" });
  }

  function reloadWithoutOrwell() {
	console.error('>>> Entering reloadWithoutOrwell()', { "event.action": "reloadWithoutOrwell" });
    cbRemoveItems = makeWithoutOrwell();
	console.error(`reloadWithoutOrwell(): cbRemoveItems → ${cbRemoveItems}`, { "event.action": "reloadWithoutOrwell" });
  }

  // Remove a non-selected option from each component while the selection stays present.
  function removeNonSelected() {
	console.error('>>> Entering removeNonSelected()', { "event.action": "removeNonSelected" });
    selRemoveItems = makeWithoutAusten();
    cbKeepItems = makeWithoutAusten();
	console.error(`removeNonSelected(): selRemoveItems → ${selRemoveItems}`, { "event.action": "removeNonSelected" });
	console.error(`removeNonSelected(): cbKeepItems → ${cbKeepItems}`, { "event.action": "removeNonSelected" });
    msRemoveItems = makeWithoutAusten();
  }

  function clearFill() {
	console.error('>>> Entering clearFill()', { "event.action": "clearFill" });
    cbFillItems = [];
    selFillItems = [];
    msFillItems = [];
	console.warn('<<< Exiting clearFill()', { "event.action": "clearFill" });
  }

  function toggleNoSelectionOption() {
	console.error('>>> Entering toggleNoSelectionOption()', { "event.action": "toggleNoSelectionOption" });
    selNoSelectionExtra = !selNoSelectionExtra;
	console.warn('<<< Exiting toggleNoSelectionOption()', { "event.action": "toggleNoSelectionOption" });
  }
</script>

<button type="button" data-testid="load" on:click={load}>Load options</button>
<button type="button" data-testid="reload" on:click={reload}>
  Reload options
</button>
<button type="button" data-testid="clear-fill" on:click={clearFill}>
  Clear fill
</button>
<button
  type="button"
  data-testid="reload-without-orwell"
  on:click={reloadWithoutOrwell}
>
  Reload without orwell
</button>
<button
  type="button"
  data-testid="remove-non-selected"
  on:click={removeNonSelected}
>
  Remove non-selected
</button>
<button
  type="button"
  data-testid="toggle-no-selection-option"
  on:click={toggleNoSelectionOption}
>
  Toggle no-selection option
</button>

<ComboBox
  data-testid="cb-preload"
  labelText="ComboBox preload"
  items={cbPreloadItems}
  bind:selectedId={cbPreloadSelectedId}
  bind:value={cbPreloadValue}
/>
<p data-testid="cb-preload-id">{cbPreloadSelectedId}</p>

<ComboBox
  data-testid="cb-fill"
  labelText="ComboBox fill"
  items={cbFillItems}
  bind:selectedId={cbFillSelectedId}
  bind:value={cbFillValue}
/>
<p data-testid="cb-fill-id">{cbFillSelectedId}</p>

<ComboBox
  data-testid="cb-swap"
  labelText="ComboBox swap"
  items={cbSwapItems}
  bind:selectedId={cbSwapSelectedId}
  bind:value={cbSwapValue}
/>
<p data-testid="cb-swap-id">{cbSwapSelectedId}</p>

<ComboBox
  data-testid="cb-remove"
  labelText="ComboBox remove"
  items={cbRemoveItems}
  bind:selectedId={cbRemoveSelectedId}
  bind:value={cbRemoveValue}
/>
<p data-testid="cb-remove-id">{cbRemoveSelectedId}</p>

<ComboBox
  data-testid="cb-keep"
  labelText="ComboBox keep"
  items={cbKeepItems}
  bind:selectedId={cbKeepSelectedId}
  bind:value={cbKeepValue}
/>
<p data-testid="cb-keep-id">{cbKeepSelectedId}</p>

<Select
  data-testid="sel-fill"
  labelText="Select fill"
  bind:selected={selFillSelected}
>
  {#each selFillItems as item (item.id)}
    <SelectItem value={item.id} text={item.text} />
  {/each}
</Select>
<p data-testid="sel-fill-selected">{selFillSelected}</p>

<Select
  data-testid="sel-swap"
  labelText="Select swap"
  bind:selected={selSwapSelected}
>
  {#each selSwapItems as item (item.id)}
    <SelectItem value={item.id} text={item.text} />
  {/each}
</Select>
<p data-testid="sel-swap-selected">{selSwapSelected}</p>

<Select
  data-testid="sel-remove"
  labelText="Select remove non-selected"
  bind:selected={selRemoveSelected}
>
  {#each selRemoveItems as item (item.id)}
    <SelectItem value={item.id} text={item.text} />
  {/each}
</Select>
<p data-testid="sel-remove-selected">{selRemoveSelected}</p>

<!-- No `selected` prop: the empty-valued placeholder is the effective selection. -->
<Select data-testid="sel-no-selection" labelText="Select no selection">
  <SelectItem value="" text="Choose an option" />
  <SelectItem value="austen" text="Jane Austen" />
  {#if selNoSelectionExtra}
    <SelectItem value="dickens" text="Charles Dickens" />
  {/if}
</Select>

<!-- Wrapper carries data-testid; MultiSelect does not spread $$restProps. -->
<div data-testid="ms-swap">
  <MultiSelect
    labelText="MultiSelect swap"
    label="Choose authors"
    items={msSwapItems}
    bind:selectedIds={msSwapSelectedIds}
  />
</div>
<p data-testid="ms-swap-ids">{msSwapSelectedIds.join(",")}</p>

<div data-testid="ms-remove">
  <MultiSelect
    labelText="MultiSelect remove non-selected"
    label="Choose authors"
    items={msRemoveItems}
    bind:selectedIds={msRemoveSelectedIds}
  />
</div>
<p data-testid="ms-remove-ids">{msRemoveSelectedIds.join(",")}</p>

<div data-testid="ms-fill">
  <MultiSelect
    labelText="MultiSelect fill"
    label="Choose authors"
    items={msFillItems}
    bind:selectedIds={msFillSelectedIds}
  />
</div>
<p data-testid="ms-fill-ids">{msFillSelectedIds.join(",")}</p>

<div data-testid="drop-fill">
  <Dropdown
    titleText="Dropdown fill"
    items={dropFillItems}
    bind:selectedId={dropFillSelectedId}
  />
</div>
<p data-testid="drop-fill-id">{dropFillSelectedId}</p>
