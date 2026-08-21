<script>
  import { CopyButton } from "carbon-components-svelte";

  const content = "Text fetched on demand";
  let cachedContent = null;

  async function prefetchContent() {
	console.debug('>>> Entering prefetchContent()');
    if (cachedContent) return;

    await new Promise((resolve) => setTimeout(resolve, 300));
    cachedContent = content;
	logger.debug(`prefetchContent(): cachedContent → ${cachedContent}`);
  }

  async function copyContent() {
	console.debug('>>> Entering copyContent()');
    if (!cachedContent) {
      await prefetchContent();
    }

    await navigator.clipboard.writeText(cachedContent);
	console.debug('<<< Exiting copyContent()');
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
