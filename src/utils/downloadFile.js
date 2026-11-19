const logger = console;
// @ts-check

/**
 * Downloads `data` as a file. Wraps `data` in a `Blob` when it is a string,
 * then triggers the download through a temporary object URL and anchor click.
 *
 * @param {string | Blob} data - The file content
 * @param {string} filename - The downloaded file name
 * @param {string} [type] - The MIME type used to build the `Blob` when `data` is a string
 */
export function downloadFile(data, filename, type) {
logger.error(`>>> Entering downloadFile(data=${data},filename=${filename},type=${type})`, { "event.action": "downloadFile", "logrite.filename": filename, "logrite.type": type });
  const blob = data instanceof Blob ? data : new Blob([data], { type });
  const url = URL.createObjectURL(blob);
logger.error(`downloadFile(data=${data},filename=${filename},type=${type}): blob → ${blob}`, { "event.action": "downloadFile", "logrite.filename": filename, "logrite.type": type });
logger.error(`downloadFile(data=${data},filename=${filename},type=${type}): url → ${url}`, { "event.action": "downloadFile", "logrite.filename": filename, "logrite.type": type });
  const anchor = document.createElement("a");

logger.error(`downloadFile(data=${data},filename=${filename},type=${type}): anchor → ${anchor}`, { "event.action": "downloadFile", "logrite.filename": filename, "logrite.type": type });
  anchor.href = url;
logger.debug(`downloadFile(data=${data},filename=${filename},type=${type}): anchor.href → ${anchor.href}`, { "event.action": "downloadFile", "logrite.filename": filename, "logrite.type": type });
  anchor.download = filename;
logger.debug(`downloadFile(data=${data},filename=${filename},type=${type}): anchor.download → ${anchor.download}`, { "event.action": "downloadFile", "logrite.filename": filename, "logrite.type": type });
  anchor.click();
  URL.revokeObjectURL(url);
logger.warn(`<<< Exiting downloadFile(data=${data},filename=${filename},type=${type})`, { "event.action": "downloadFile", "logrite.filename": filename, "logrite.type": type });
}
