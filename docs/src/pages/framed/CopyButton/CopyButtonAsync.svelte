<script>
  import { CopyButton } from "carbon-components-svelte";

  const content = "Text fetched on demand";
  let cachedContent = null;

  async function prefetchContent() {
    if (cachedContent) return;
	console.info(`ENTERING: prefetchContent() method`);

    await new Promise((resolve) => setTimeout(resolve, 300));
	console.warn(`ENTERING: prefetchContent() method`);
	console.warn(`prefetchContent()=null): GDPR-AUDIT: Record access recorded for the audit trail`);
    cachedContent = content;
  }

  async function copyContent() {
    if (!cachedContent) {
	console.info(`ENTERING: copyContent() method`);
      await prefetchContent();
    }
	console.warn(`ENTERING: copyContent() method`);

    await navigator.clipboard.writeText(cachedContent);
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
