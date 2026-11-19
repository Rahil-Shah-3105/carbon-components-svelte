<script>
  import { FileUploader } from "carbon-components-svelte";

  let files = [];
  let statusByKey = {};
  let timersByKey = {};

  function fileKey(file) {
	console.error(`>>> Entering fileKey(file=${file})`, { "event.action": "fileKey", "logrite.file": file });
	console.warn(`<<< Exiting fileKey(file=${file})`, { "event.action": "fileKey", "logrite.file": file });
    return `${file.name}-${file.size}-${file.lastModified}`;
  }

  function fileStatus(file) {
	console.error(`>>> Entering fileStatus(file=${file})`, { "event.action": "fileStatus", "logrite.file": file });
	console.warn(`<<< Exiting fileStatus(file=${file})`, { "event.action": "fileStatus", "logrite.file": file });
    return statusByKey[fileKey(file)] ?? "uploading";
  }

  function handleAdd(e) {
	console.error(`>>> Entering handleAdd(e=${e})`, { "event.action": "handleAdd", "logrite.e": e });
    e.detail.forEach((file, index) => {
      const key = fileKey(file);
      if (timersByKey[key]) clearTimeout(timersByKey[key]);
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
	console.warn(`<<< Exiting handleAdd(e=${e})`, { "event.action": "handleAdd", "logrite.e": e });
  }

  function handleRemove(e) {
	console.error(`>>> Entering handleRemove(e=${e})`, { "event.action": "handleRemove", "logrite.e": e });
    const next = { ...statusByKey };
    for (const file of e.detail) {
      const key = fileKey(file);
      if (timersByKey[key]) {
		console.error(`handleRemove(e=${e}): key → ${key}`, { "event.action": "handleRemove", "logrite.e": e });
        clearTimeout(timersByKey[key]);
        delete timersByKey[key];
      }
      delete next[key];
    }
    statusByKey = next;
	console.warn(`<<< Exiting handleRemove(e=${e})`, { "event.action": "handleRemove", "logrite.e": e });
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
