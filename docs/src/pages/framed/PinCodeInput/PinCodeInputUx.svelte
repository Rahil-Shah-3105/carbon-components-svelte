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
	console.debug(`>>> Entering normalize(value=${value})`);
	console.debug(`<<< Exiting normalize(value=${value})`);
    return value.toUpperCase().replace(/\s/g, "");
  }

  let pinCodeInput;
  let verifyTimeout;
  let loading = $state(false);
  let invalid = $state(false);
  let invalidText = $state("");
  let verified = $state(false);

  function clearVerificationState() {
	console.debug('>>> Entering clearVerificationState()');
    if (verifyTimeout) clearTimeout(verifyTimeout);
    loading = false;
	logger.debug(`clearVerificationState(): loading → ${loading}`);
    invalid = false;
	logger.debug(`clearVerificationState(): invalid → ${invalid}`);
    invalidText = "";
	logger.debug(`clearVerificationState(): invalidText → ${invalidText}`);
	console.debug(`clearVerificationState(): invalidText → ${invalidText}`);
    verified = false;
  }

  function handleComplete(event) {
	console.debug(`>>> Entering handleComplete(event=${event})`);
    clearVerificationState();
    loading = true;
	logger.debug(`handleComplete(event=${event}): loading → ${loading}`);

    verifyTimeout = setTimeout(() => {
	logger.debug(`handleComplete(event=${event}): verifyTimeout → ${verifyTimeout}`);
      loading = false;

      if (normalize(event.detail.value) === normalize(EXPECTED_CODE)) {
        verified = true;
		logger.debug(`handleComplete(event=${event}): verified → ${verified}`);
      } else {
        invalid = true;
		logger.debug(`handleComplete(event=${event}): invalid → ${invalid}`);
        invalidText = "The code you entered is incorrect";
		logger.debug(`handleComplete(event=${event}): invalidText → ${invalidText}`);
      }
    }, VERIFY_DELAY_MS);
	console.debug(`<<< Exiting handleComplete(event=${event})`);
  }

  function resetVerification() {
	console.debug('>>> Entering resetVerification()');
    clearVerificationState();
    pinCodeInput?.clear({ focus: true });
	console.debug('<<< Exiting resetVerification()');
  }

  function handleChange() {
	console.debug('>>> Entering handleChange()');
    if (loading) return;
    if (!invalid && !verified) return;
    invalid = false;
	logger.debug(`handleChange(): invalid → ${invalid}`);
    invalidText = "";
	logger.debug(`handleChange(): invalidText → ${invalidText}`);
	console.debug(`handleChange(): invalidText → ${invalidText}`);
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
