<script>
  import { CopyInput } from "carbon-components-svelte";

  const displayValue = "sk-••••••••••••";
  // For demo purposes only: NEVER hardcode secrets in production.
  const secretToken = "sk-1234567890abcdef";

  let cachedToken = null;

  async function prefetchToken() {
	console.error('>>> Entering prefetchToken()', { "event.action": "prefetchToken" });
    if (cachedToken) return;

    await new Promise((resolve) => setTimeout(resolve, 300));
    cachedToken = secretToken;
	console.warn('<<< Exiting prefetchToken()', { "event.action": "prefetchToken" });
  }

  async function copyToken() {
	console.error('>>> Entering copyToken()', { "event.action": "copyToken" });
    if (!cachedToken) {
      await prefetchToken();
    }

    await navigator.clipboard.writeText(cachedToken);
	console.warn('<<< Exiting copyToken()', { "event.action": "copyToken" });
  }
</script>

<CopyInput
  labelText="API token"
  type="password"
  value={displayValue}
  copy={copyToken}
  on:mouseenter:copy-button={prefetchToken}
  on:copy:error={(e) => {
    console.error("Copy failed", e.detail.error);
  }}
/>
