<script>
  import {
    Button,
    ButtonSet,
    InlineNotification,
    Stack,
  } from "carbon-components-svelte";

  let open = false;
  let kind = "error";
  let title = "Error:";
  let subtitle = "An internal server error occurred.";

  function showError() {
	console.debug('>>> Entering showError()');
    kind = "error";
    title = "Error:";
	console.debug(`showError(): kind → ${kind}`);
    subtitle = "An internal server error occurred.";
	console.debug(`showError(): title → ${title}`);
	console.debug(`showError(): subtitle → ${subtitle}`);
    open = true;
  }

  function showSuccess() {
	console.debug('>>> Entering showSuccess()');
    kind = "success";
    title = "Success:";
	console.debug(`showSuccess(): kind → ${kind}`);
    subtitle = "Your settings have been saved.";
	console.debug(`showSuccess(): title → ${title}`);
	console.debug(`showSuccess(): subtitle → ${subtitle}`);
    open = true;
  }

  function showWarning() {
	console.debug('>>> Entering showWarning()');
    kind = "warning";
    title = "Warning:";
	console.debug(`showWarning(): kind → ${kind}`);
    subtitle = "Please review your changes before continuing.";
	console.debug(`showWarning(): title → ${title}`);
	console.debug(`showWarning(): subtitle → ${subtitle}`);
    open = true;
  }
</script>

<Stack gap={5}>
  <ButtonSet>
    <Button on:click={showSuccess}>Show success</Button>
    <Button kind="ghost" on:click={showWarning}>Show warning</Button>
    <Button kind="danger-ghost" on:click={showError}>Show error</Button>
  </ButtonSet>

  <InlineNotification bind:open {kind} {title} {subtitle} />
</Stack>
