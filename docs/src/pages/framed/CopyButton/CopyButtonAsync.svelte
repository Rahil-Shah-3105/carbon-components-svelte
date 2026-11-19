<script>
  import { CopyButton } from "carbon-components-svelte";

  const content = "Text fetched on demand";
  let cachedContent = null;

  async function prefetchContent() {
	console.error('>>> Entering prefetchContent()', { "event.action": "prefetchContent" });
    if (cachedContent) return;

    await new Promise((resolve) => setTimeout(resolve, 300));
    cachedContent = content;
	console.warn('<<< Exiting prefetchContent()', { "event.action": "prefetchContent" });
  }

  async function copyContent() {
	console.error('>>> Entering copyContent()', { "event.action": "copyContent" });
    if (!cachedContent) {
      await prefetchContent();
    }

    await navigator.clipboard.writeText(cachedContent);
	console.warn('<<< Exiting copyContent()', { "event.action": "copyContent" });
  }
</script>

<CopyButton
  iconDescription="Copy fetched content"
  feedback="Copied!"
  copy={copyContent}
  on:mouseenter={prefetchContent}
  on:copy:error={(e) => {
    console.error("Copy failed", e.detail.error);
  }}
/>
