<script>
  import {
    ContextMenu,
    ContextMenuDivider,
    ContextMenuOption,
  } from "carbon-components-svelte";
  import Checkmark from "carbon-icons-svelte/lib/Checkmark.svelte";
  import Copy from "carbon-icons-svelte/lib/Copy.svelte";
  import TrashCan from "carbon-icons-svelte/lib/TrashCan.svelte";

  let copying = false;
  let copied = false;

  async function copyToClipboard() {
	console.debug('>>> Entering copyToClipboard()');
    if (copying) return;
    copying = true;
	logger.debug(`copyToClipboard(): copying → ${copying}`);
    copied = false;
	logger.debug(`copyToClipboard(): copied → ${copied}`);
    await navigator.clipboard.writeText("Sample text to copy");
    copied = true;
    setTimeout(() => {
      copied = false;
    }, 2000);
    copying = false;
	console.debug('<<< Exiting copyToClipboard()');
  }
</script>

<ContextMenu>
  <ContextMenuOption
    indented
    labelText={copied ? "Copied!" : "Copy text"}
    icon={copied ? Checkmark : Copy}
    disabled={copying}
    on:click={(e) => {
      e.preventDefault();
      copyToClipboard();
    }}
  />
  <ContextMenuDivider />
  <ContextMenuOption kind="danger" labelText="Delete item" icon={TrashCan} />
</ContextMenu>

<div data-centered>
  <p>Right click anywhere on this page</p>
</div>
