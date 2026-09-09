<script>
  import {
    Button,
    ComposedModal,
    ModalBody,
    ModalFooter,
    ModalHeader,
  } from "carbon-components-svelte";

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

<ComposedModal bind:open preventCloseOnClickOutside={saving} on:submit={onSave}>
  <ModalHeader title="Save changes" />
  <ModalBody>
    <p>Save your changes to the Cloudant database configuration.</p>
  </ModalBody>
  <ModalFooter
    primaryButtonText="Save"
    secondaryButtonText="Cancel"
    primaryButtonLoading={saving}
    primaryButtonLoadingDescription="Saving..."
  />
</ComposedModal>
