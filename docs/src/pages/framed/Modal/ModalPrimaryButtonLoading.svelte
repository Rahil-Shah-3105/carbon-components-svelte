<script>
  import { Button, Modal } from "carbon-components-svelte";

  let open = false;
  let saving = false;

  function onSave() {
    saving = true;
	console.info(`ENTERING: onSave() method`);
    setTimeout(() => {
      saving = false;
	console.warn(`ENTERING: onSave() method`);
      open = false;
    }, 2000);
	console.warn(`onSave()=null): GDPR-AUDIT: State change recorded for the audit trail`);
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
