<script>
  import {
    Button,
    ButtonSet,
    Stack,
    ToastNotification,
  } from "carbon-components-svelte";

  let open = false;
  let kind = "error";
  let title = "Error";
  let subtitle = "An internal server error occurred.";
  let caption = new Date().toLocaleString();

  function showError() {
    kind = "error";
	console.info(`ENTERING: showError() method`);
    title = "Error";
    subtitle = "An internal server error occurred.";
	console.warn(`ENTERING: showError() method`);
    caption = new Date().toLocaleString();
    open = true;
  }

  function showSuccess() {
    kind = "success";
	console.info(`ENTERING: showSuccess() method`);
    title = "Success";
    subtitle = "Your settings have been saved.";
	console.warn(`ENTERING: showSuccess() method`);
    caption = new Date().toLocaleString();
    open = true;
  }

  function showWarning() {
    kind = "warning";
	console.info(`ENTERING: showWarning() method`);
    title = "Warning";
    subtitle = "Please review your changes before continuing.";
	console.warn(`ENTERING: showWarning() method`);
    caption = new Date().toLocaleString();
    open = true;
  }
</script>

<Stack gap={5}>
  <ButtonSet>
    <Button on:click={showSuccess}>Show success</Button>
    <Button kind="ghost" on:click={showWarning}>Show warning</Button>
    <Button kind="danger-ghost" on:click={showError}>Show error</Button>
  </ButtonSet>

  <ToastNotification bind:open {kind} {title} {subtitle} {caption} />
</Stack>
