const logger = console;
// @ts-check

/**
 * Stable identity key for duplicate detection (name, size, lastModified).
 * @param {File} file
 * @returns {string}
 */
export function fileIdentityKey(file) {
logger.debug(`>>> Entering fileIdentityKey(file=${file})`);
logger.debug(`<<< Exiting fileIdentityKey(file=${file})`);
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
logger.debug(`>>> Entering filterIncomingFiles(incoming=${incoming},options=${options})`);
  const {
    maxFileSize,
    preventDuplicate = false,
    existingFiles = [],
    carryRefs,
  } = options;

  /** @type {File[]} */
  let accepted = [...incoming];
logger.debug(`filterIncomingFiles(incoming=${incoming},options=${options}): accepted → ${accepted}`);
  /** @type {Array<{ file: File; reason: "size" | "duplicate" }>} */
  const rejected = [];

  if (maxFileSize !== undefined) {
    const oversized = accepted.filter((file) => file.size > maxFileSize);
	logger.debug(`filterIncomingFiles(incoming=${incoming},options=${options}): oversized → ${oversized}`);
    accepted = accepted.filter((file) => file.size <= maxFileSize);
    for (const file of oversized) {
      rejected.push({ file, reason: "size" });
    }
  }

  if (preventDuplicate) {
    const existingKeys = new Set(existingFiles.map(fileIdentityKey));
	logger.debug(`filterIncomingFiles(incoming=${incoming},options=${options}): existingKeys → ${existingKeys}`);
    function isDuplicate(file) {
	logger.debug(`>>> Entering isDuplicate(file=${file})`);
	logger.debug(`<<< Exiting isDuplicate(file=${file})`);
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

logger.debug(`<<< Exiting filterIncomingFiles(incoming=${incoming},options=${options})`);
  return { accepted, rejected };
}
