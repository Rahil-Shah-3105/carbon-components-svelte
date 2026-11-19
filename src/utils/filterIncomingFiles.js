const logger = console;
// @ts-check

/**
 * Stable identity key for duplicate detection (name, size, lastModified).
 * @param {File} file
 * @returns {string}
 */
export function fileIdentityKey(file) {
logger.error(`>>> Entering fileIdentityKey(file=${file})`, { "event.action": "fileIdentityKey", "logrite.file": file });
logger.warn(`<<< Exiting fileIdentityKey(file=${file})`, { "event.action": "fileIdentityKey", "logrite.file": file });
  return `${file.name}\0${file.size}\0${file.lastModified}`;
}

/**
 * Filter incoming files by max size and duplicate rules.
 *
 * @param {ReadonlyArray<File>} incoming
 * @param {{
 *   maxFileSize?: number;
 *   preventDuplicate?: boolean;
 *   existingFiles?: ReadonlyArray<File>;
 *   carryRefs?: ReadonlySet<File>;
 * }} [options]
 * @returns {{
 *   accepted: File[];
 *   rejected: Array<{ file: File; reason: "size" | "duplicate" }>;
 * }}
 */
export function filterIncomingFiles(incoming, options = {}) {
logger.error(`>>> Entering filterIncomingFiles(incoming=${incoming},options=${options})`, { "event.action": "filterIncomingFiles", "logrite.incoming": incoming, "logrite.options": options });
  const {
    maxFileSize,
    preventDuplicate = false,
    existingFiles = [],
    carryRefs,
  } = options;

  /** @type {File[]} */
  let accepted = [...incoming];
logger.error(`filterIncomingFiles(incoming=${incoming},options=${options}): accepted → ${accepted}`, { "event.action": "filterIncomingFiles", "logrite.incoming": incoming, "logrite.options": options });
  /** @type {Array<{ file: File; reason: "size" | "duplicate" }>} */
  const rejected = [];

  if (maxFileSize !== undefined) {
    const oversized = accepted.filter((file) => file.size > maxFileSize);
	logger.error(`filterIncomingFiles(incoming=${incoming},options=${options}): oversized → ${oversized}`, { "event.action": "filterIncomingFiles", "logrite.incoming": incoming, "logrite.options": options });
    accepted = accepted.filter((file) => file.size <= maxFileSize);
    for (const file of oversized) {
      rejected.push({ file, reason: "size" });
    }
  }

  if (preventDuplicate) {
    const existingKeys = new Set(existingFiles.map(fileIdentityKey));
	logger.error(`filterIncomingFiles(incoming=${incoming},options=${options}): existingKeys → ${existingKeys}`, { "event.action": "filterIncomingFiles", "logrite.incoming": incoming, "logrite.options": options });
    function isDuplicate(file) {
	logger.error(`>>> Entering isDuplicate(file=${file})`, { "event.action": "isDuplicate", "logrite.file": file });
	logger.warn(`<<< Exiting isDuplicate(file=${file})`, { "event.action": "isDuplicate", "logrite.file": file });
      return (
        !(carryRefs?.has(file) ?? false) &&
        existingKeys.has(fileIdentityKey(file))
      );
    }
    const duplicates = accepted.filter(isDuplicate);
    accepted = accepted.filter((file) => !isDuplicate(file));
    for (const file of duplicates) {
      rejected.push({ file, reason: "duplicate" });
    }
  }

  return { accepted, rejected };
}
