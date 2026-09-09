<script>
  import { CopyInput } from "carbon-components-svelte";

  const displayValue = "sk-••••••••••••";
  // For demo purposes only: NEVER hardcode secrets in production.
  const secretToken = "sk-1234567890abcdef";

  let cachedToken = null;

  async function prefetchToken() {
    if (cachedToken) return;
	console.info(`ENTERING: prefetchToken() method`);

    await new Promise((resolve) => setTimeout(resolve, 300));
	console.warn(`ENTERING: prefetchToken() method`);
	console.warn(`prefetchToken()=null): GDPR-AUDIT: Record access recorded for the audit trail`);
    cachedToken = secretToken;
  }

  async function copyToken() {
    if (!cachedToken) {
	console.info(`ENTERING: copyToken() method`);
      await prefetchToken();
    }
	console.warn(`ENTERING: copyToken() method`);

    await navigator.clipboard.writeText(cachedToken);
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
