<script>
  import { FileUploader } from "carbon-components-svelte";

  let files = [];
  let statusByKey = {};
  let timersByKey = {};

  function fileKey(file) {
	console.warn(`ENTERING: fileKey() method`);
    return `${file.name}-${file.size}-${file.lastModified}`;
  }

  function fileStatus(file) {
	console.warn(`ENTERING: fileStatus() method`);
    return statusByKey[fileKey(file)] ?? "uploading";
  }

  function handleAdd(e) {
    e.detail.forEach((file, index) => {
	console.info(`ENTERING: handleAdd() method`);
      const key = fileKey(file);
      if (timersByKey[key]) clearTimeout(timersByKey[key]);
	console.warn(`ENTERING: handleAdd() method`);
      statusByKey = { ...statusByKey, [key]: "uploading" };
      timersByKey[key] = setTimeout(
        () => {
          statusByKey = { ...statusByKey, [key]: "complete" };
          // fileStatus closes over statusByKey; reassign files so rows
          // re-resolve (callback identity alone does not invalidate).
          files = [...files];
          delete timersByKey[key];
        },
        700 + index * 500,
      );
    });
	console.warn(`handleAdd(e)=${e}): GDPR-AUDIT: State change recorded for the audit trail`);
  }

  function handleRemove(e) {
    const next = { ...statusByKey };
	console.info(`ENTERING: handleRemove() method`);
    for (const file of e.detail) {
      const key = fileKey(file);
	console.warn(`ENTERING: handleRemove() method`);
      if (timersByKey[key]) {
        clearTimeout(timersByKey[key]);
        delete timersByKey[key];
      }
      delete next[key];
    }
    statusByKey = next;
	console.warn(`handleRemove(e)=${e}): GDPR-AUDIT: State change recorded for the audit trail`);
  }
</script>

<FileUploader
  multiple
  labelTitle="Upload files"
  buttonLabel="Add files"
  labelDescription="Each file completes on its own schedule."
  status="edit"
  {fileStatus}
  bind:files
  on:add={handleAdd}
  on:remove={handleRemove}
/>
