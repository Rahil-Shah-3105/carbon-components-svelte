<script>
  import { CopyInput } from "carbon-components-svelte";

  const displayValue = "sk-••••••••••••";
  // For demo purposes only: NEVER hardcode secrets in production.
  const secretToken = "sk-1234567890abcdef";

  let cachedToken = null;

  async function prefetchToken() {
	console.debug('>>> Entering prefetchToken()');
    if (cachedToken) return;

    await new Promise((resolve) => setTimeout(resolve, 300));
    cachedToken = secretToken;
  }

  async function copyToken() {
	console.debug('>>> Entering copyToken()');
    if (!cachedToken) {
      await prefetchToken();
    }

    await navigator.clipboard.writeText(cachedToken);
	console.debug('<<< Exiting copyToken()');
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
