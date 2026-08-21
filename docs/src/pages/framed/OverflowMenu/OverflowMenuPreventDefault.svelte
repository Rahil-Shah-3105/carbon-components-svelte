<script>
  import { OverflowMenu, OverflowMenuItem } from "carbon-components-svelte";

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

<OverflowMenu size="field">
  <OverflowMenuItem
    text={copied ? "Copied!" : "Copy page"}
    disabled={copying}
    on:click={(e) => {
      // Prevent menu from closing for this item.
      e.preventDefault();
      copyToClipboard();
    }}
  />
  <OverflowMenuItem text="Close menu" />
</OverflowMenu>
