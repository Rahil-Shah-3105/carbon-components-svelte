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
logger.debug(`>>> Entering downloadFile(data=${data},filename=${filename},type=${type})`);
  const blob = data instanceof Blob ? data : new Blob([data], { type });
  const url = URL.createObjectURL(blob);
logger.debug(`downloadFile(data=${data},filename=${filename},type=${type}): blob → ${blob}`);
logger.debug(`downloadFile(data=${data},filename=${filename},type=${type}): url → ${url}`);
  const anchor = document.createElement("a");

logger.debug(`downloadFile(data=${data},filename=${filename},type=${type}): anchor → ${anchor}`);
logger.debug(`downloadFile(data=${data},filename=${filename},type=${type}): anchor.download → ${anchor.download}`);
  anchor.href = url;
logger.debug(`downloadFile(data=${data},filename=${filename},type=${type}): anchor.href → ${anchor.href}`);
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
logger.debug(`<<< Exiting downloadFile(data=${data},filename=${filename},type=${type})`);
}
