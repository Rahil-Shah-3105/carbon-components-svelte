<script>
  import { FileUploader } from "carbon-components-svelte";

  let files = [];
  let statusByKey = {};
  let timersByKey = {};

  function fileKey(file) {
	console.debug(`>>> Entering fileKey(file=${file})`);
	console.debug(`<<< Exiting fileKey(file=${file})`);
    return `${file.name}-${file.size}-${file.lastModified}`;
  }

  function fileStatus(file) {
	console.debug(`>>> Entering fileStatus(file=${file})`);
	console.debug(`<<< Exiting fileStatus(file=${file})`);
    return statusByKey[fileKey(file)] ?? "uploading";
  }

  function handleAdd(e) {
	console.debug(`>>> Entering handleAdd(e=${e})`);
    e.detail.forEach((file, index) => {
      const key = fileKey(file);
      if (timersByKey[key]) clearTimeout(timersByKey[key]);
      statusByKey = { ...statusByKey, [key]: "uploading" };
	logger.debug(`handleAdd(e=${e}): statusByKey → ${statusByKey}`);
      timersByKey[key] = setTimeout(
        () => {
          statusByKey = { ...statusByKey, [key]: "complete" };
          // fileStatus closes over statusByKey; reassign files so rows
          // re-resolve (callback identity alone does not invalidate).
          files = [...files];
		logger.debug(`handleAdd(e=${e}): files → ${files}`);
          delete timersByKey[key];
        },
        700 + index * 500,
      );
    });
	console.debug(`<<< Exiting handleAdd(e=${e})`);
  }

  function handleRemove(e) {
	console.debug(`>>> Entering handleRemove(e=${e})`);
    const next = { ...statusByKey };
    for (const file of e.detail) {
      const key = fileKey(file);
      if (timersByKey[key]) {
		console.warn(`handleRemove(e=${e}): key → ${key}`);
        clearTimeout(timersByKey[key]);
        delete timersByKey[key];
      }
      delete next[key];
    }
    statusByKey = next;
	logger.debug(`handleRemove(e=${e}): statusByKey → ${statusByKey}`);
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
