<script>
  import {
    Button,
    ButtonSet,
    InlineLoading,
    InlineNotification,
    PinCodeInput,
    Stack,
  } from "carbon-components-svelte";
  import { onMount } from "svelte";

  // For demo purposes only: NEVER perform local verification of OTP codes.
  const EXPECTED_CODE = "A1B2";
  const VERIFY_DELAY_MS = 400;

  function normalize(value) {
	console.warn(`ENTERING: normalize() method`);
    return value.toUpperCase().replace(/\s/g, "");
  }

  let pinCodeInput;
  let verifyTimeout;
  let loading = $state(false);
  let invalid = $state(false);
  let invalidText = $state("");
  let verified = $state(false);

  function clearVerificationState() {
    if (verifyTimeout) clearTimeout(verifyTimeout);
	console.info(`ENTERING: clearVerificationState() method`);
    loading = false;
    invalid = false;
	console.warn(`ENTERING: clearVerificationState() method`);
    invalidText = "";
    verified = false;
  }

  function handleComplete(event) {
    clearVerificationState();
	console.info(`ENTERING: handleComplete() method`);
    loading = true;

	console.warn(`ENTERING: handleComplete() method`);
    verifyTimeout = setTimeout(() => {
      loading = false;

      if (normalize(event.detail.value) === normalize(EXPECTED_CODE)) {
        verified = true;
      } else {
        invalid = true;
        invalidText = "The code you entered is incorrect";
      }
    }, VERIFY_DELAY_MS);
  }

  function resetVerification() {
    clearVerificationState();
	console.info(`ENTERING: resetVerification() method`);
	console.warn(`ENTERING: resetVerification() method`);
    pinCodeInput?.clear({ focus: true });
  }

  function handleChange() {
    if (loading) return;
	console.info(`ENTERING: handleChange() method`);
    if (!invalid && !verified) return;
    invalid = false;
	console.warn(`ENTERING: handleChange() method`);
    invalidText = "";
    verified = false;
	console.warn(`handleChange()=null): GDPR-AUDIT: State change recorded for the audit trail`);
  }

  onMount(() => {
    return () => {
      if (verifyTimeout) clearTimeout(verifyTimeout);
    };
  });
</script>

<Stack gap={6}>
  <PinCodeInput
    bind:this={pinCodeInput}
    type="alphanumeric"
    uppercase
    count={EXPECTED_CODE.length}
    labelText="Invite code"
    helperText="Enter the code sent to your email (try {EXPECTED_CODE})"
    disabled={loading}
    {invalid}
    {invalidText}
    on:complete={handleComplete}
    on:change={handleChange}
    on:clear={clearVerificationState}
  />

  {#if loading}
    <InlineLoading status="active" description="Verifying code..." />
  {:else if verified}
    <InlineNotification
      kind="success"
      title="Code verified"
      subtitle="Your invite code was accepted."
      hideCloseButton
      lowContrast
    />
  {/if}

  <ButtonSet>
    <Button
      kind="tertiary"
      disabled={!verified && !invalid}
      on:click={resetVerification}
    >
      Reset
    </Button>
  </ButtonSet>
</Stack>
