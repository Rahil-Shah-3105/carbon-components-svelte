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
	console.error(`>>> Entering normalize(value=${value})`, { "event.action": "normalize", "logrite.value": value });
	console.warn(`<<< Exiting normalize(value=${value})`, { "event.action": "normalize", "logrite.value": value });
    return value.toUpperCase().replace(/\s/g, "");
  }

  let pinCodeInput;
  let verifyTimeout;
  let loading = $state(false);
  let invalid = $state(false);
  let invalidText = $state("");
  let verified = $state(false);

  function clearVerificationState() {
	console.error('>>> Entering clearVerificationState()', { "event.action": "clearVerificationState" });
    if (verifyTimeout) clearTimeout(verifyTimeout);
    loading = false;
    invalid = false;
    invalidText = "";
    verified = false;
	console.error(`clearVerificationState(): invalidText → ${invalidText}`, { "event.action": "clearVerificationState" });
  }

  function handleComplete(event) {
	console.error(`>>> Entering handleComplete(event=${event})`, { "event.action": "handleComplete" });
    clearVerificationState();
    loading = true;

    verifyTimeout = setTimeout(() => {
	logger.debug(`handleComplete(event=${event}): verifyTimeout → ${verifyTimeout}`, { "event.action": "handleComplete" });
      loading = false;

      if (normalize(event.detail.value) === normalize(EXPECTED_CODE)) {
        verified = true;
      } else {
        invalid = true;
        invalidText = "The code you entered is incorrect";
      }
    }, VERIFY_DELAY_MS);
	console.warn(`<<< Exiting handleComplete(event=${event})`, { "event.action": "handleComplete" });
  }

  function resetVerification() {
	console.error('>>> Entering resetVerification()', { "event.action": "resetVerification" });
    clearVerificationState();
    pinCodeInput?.clear({ focus: true });
	console.warn('<<< Exiting resetVerification()', { "event.action": "resetVerification" });
  }

  function handleChange() {
    if (loading) return;
    if (!invalid && !verified) return;
    invalid = false;
    invalidText = "";
    verified = false;
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
