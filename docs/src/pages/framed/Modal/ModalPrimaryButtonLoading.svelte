<script>
  import { Button, Modal } from "carbon-components-svelte";

  let open = false;
  let saving = false;

  function onSave() {
	console.debug('>>> Entering onSave()');
    saving = true;
    setTimeout(() => {
      saving = false;
	logger.debug(`onSave(): saving → ${saving}`);
      open = false;
	logger.debug(`onSave(): open → ${open}`);
    }, 2000);
	console.debug('<<< Exiting onSave()');
  }
</script>

<Button on:click={() => (open = true)}>Save changes</Button>

<Modal
  bind:open
  modalHeading="Save changes"
  primaryButtonText="Save"
  secondaryButtonText="Cancel"
  primaryButtonLoading={saving}
  primaryButtonLoadingDescription="Saving..."
  preventCloseOnClickOutside={saving}
  on:click:button--secondary={() => {
    if (!saving) open = false;
  }}
  on:submit={onSave}
>
  <p>Save your changes to the Cloudant database configuration.</p>
</Modal>
