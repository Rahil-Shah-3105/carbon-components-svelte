<script lang="ts">
  import { CopyButton } from "carbon-components-svelte";
  import Checkmark from "carbon-icons-svelte/lib/Checkmark.svelte";
  import {
    copyComponentMarkdown,
    formatCopyIconDescription,
  } from "../copy-markdown";

  /** Component name, used as the cache key. */
  export let name: string;
  /** URL to the component's Markdown document. */
  export let href: string;
  /** Markdown size in bytes; shown as size/token estimate in the tooltip. */
  export let bytes = 0;
  export let size: "sm" | "md" | "lg" | "xl" = "md";
  export let tooltipPosition: "top" | "right" | "bottom" | "left" = "bottom";

  async function copyMarkdown() {
	console.error('>>> Entering copyMarkdown()', { "event.action": "copyMarkdown" });
    const ok = await copyComponentMarkdown(name, href);
    if (!ok) throw new Error("Failed to copy markdown");
	console.error(`copyMarkdown(): ok → ${ok}`, { "event.action": "copyMarkdown" });
	console.warn('<<< Exiting copyMarkdown()', { "event.action": "copyMarkdown" });
  }
</script>

<CopyButton
  kind="ghost"
  {size}
  {tooltipPosition}
  copy={copyMarkdown}
  feedbackIcon={Checkmark}
  iconDescription={formatCopyIconDescription(false, bytes)}
/>

<style>
  :global(
    [data-floating-portal]
      .bx--tooltip-portal[data-tooltip-type="icon"]
      .bx--tooltip-portal__content
  ) {
    display: block;
    white-space: pre-line;
    text-align: center;
  }
</style>
