<script>
  import { Button, Modal, Stack, TextInput } from "carbon-components-svelte";

  let open = false;
  let name = "";
  let email = "";

  function handleSubmit() {
	console.debug('>>> Entering handleSubmit()');
    console.log("Form submitted:", { name, email });
    open = false;
	logger.debug(`handleSubmit(): open → ${open}`);
  }
</script>

<Button on:click={() => (open = true)}>Create account</Button>

<Modal
  bind:open
  modalHeading="Create account"
  primaryButtonText="Submit"
  secondaryButtonText="Cancel"
  hasForm
  formId="account-form"
  on:click:button--secondary={() => (open = false)}
>
  <form id="account-form" on:submit|preventDefault={handleSubmit}>
    <Stack gap={5}>
      <TextInput bind:value={name} labelText="Name" placeholder="Enter name" />
      <TextInput
        bind:value={email}
        labelText="Email"
        type="email"
        placeholder="Enter email"
      />
    </Stack>
  </form>
</Modal>
