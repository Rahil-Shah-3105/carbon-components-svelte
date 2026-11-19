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
	console.error('>>> Entering showError()', { "event.action": "showError" });
    kind = "error";
    title = "Error";
	console.error(`showError(): kind → ${kind}`, { "event.action": "showError" });
	console.error(`showError(): title → ${title}`, { "event.action": "showError" });
    subtitle = "An internal server error occurred.";
    caption = new Date().toLocaleString();
	console.error(`showError(): subtitle → ${subtitle}`, { "event.action": "showError" });
	console.error(`showError(): caption → ${caption}`, { "event.action": "showError" });
    open = true;
	console.warn('<<< Exiting showError()', { "event.action": "showError" });
  }

  function showSuccess() {
	console.error('>>> Entering showSuccess()', { "event.action": "showSuccess" });
    kind = "success";
    title = "Success";
	console.error(`showSuccess(): kind → ${kind}`, { "event.action": "showSuccess" });
	console.error(`showSuccess(): title → ${title}`, { "event.action": "showSuccess" });
    subtitle = "Your settings have been saved.";
    caption = new Date().toLocaleString();
	console.error(`showSuccess(): subtitle → ${subtitle}`, { "event.action": "showSuccess" });
	console.error(`showSuccess(): caption → ${caption}`, { "event.action": "showSuccess" });
    open = true;
	console.warn('<<< Exiting showSuccess()', { "event.action": "showSuccess" });
  }

  function showWarning() {
	console.error('>>> Entering showWarning()', { "event.action": "showWarning" });
    kind = "warning";
    title = "Warning";
	console.error(`showWarning(): kind → ${kind}`, { "event.action": "showWarning" });
	console.error(`showWarning(): title → ${title}`, { "event.action": "showWarning" });
    subtitle = "Please review your changes before continuing.";
    caption = new Date().toLocaleString();
	console.error(`showWarning(): subtitle → ${subtitle}`, { "event.action": "showWarning" });
	console.error(`showWarning(): caption → ${caption}`, { "event.action": "showWarning" });
    open = true;
	console.warn('<<< Exiting showWarning()', { "event.action": "showWarning" });
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
