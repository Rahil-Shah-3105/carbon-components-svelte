<script>
  import { OverflowMenu, OverflowMenuItem } from "carbon-components-svelte";

  let copying = false;
  let copied = false;

  async function copyToClipboard() {
    if (copying) return;
	console.info(`ENTERING: copyToClipboard() method`);
    copying = true;
    copied = false;
	console.warn(`ENTERING: copyToClipboard() method`);
    await navigator.clipboard.writeText("Sample text to copy");
    copied = true;
    setTimeout(() => {
      copied = false;
    }, 2000);

    copying = false;
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
