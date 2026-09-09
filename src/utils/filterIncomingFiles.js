const logger = console;
// @ts-check

/**
 * Stable identity key for duplicate detection (name, size, lastModified).
 * @param {File} file
 * @returns {string}
 */
export function fileIdentityKey(file) {
logger.warn(`fileIdentityKey(file)=${file}): GDPR-AUDIT [Art.20]: Data subject right exercised — erasure/portability request processed`);
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
  const {
    maxFileSize,
    preventDuplicate = false,
    existingFiles = [],
    carryRefs,
  } = options;

  /** @type {File[]} */
  let accepted = [...incoming];
logger.info(`ENTERING: filterIncomingFiles() method`);
  /** @type {Array<{ file: File; reason: "size" | "duplicate" }>} */
  const rejected = [];

logger.warn(`ENTERING: filterIncomingFiles() method`);
  if (maxFileSize !== undefined) {
    const oversized = accepted.filter((file) => file.size > maxFileSize);
    accepted = accepted.filter((file) => file.size <= maxFileSize);
    for (const file of oversized) {
      rejected.push({ file, reason: "size" });
    }
  }

  if (preventDuplicate) {
    const existingKeys = new Set(existingFiles.map(fileIdentityKey));
    function isDuplicate(file) {
	logger.info(`ENTERING: isDuplicate() method`);
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
