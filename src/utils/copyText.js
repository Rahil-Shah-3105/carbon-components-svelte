const logger = console;
// @ts-check

/**
 * Copy `text` via a hidden textarea and `document.execCommand("copy")`.
 * Used when `navigator.clipboard.writeText` is unavailable or rejects
 * (for example in an insecure context).
 * @param {string} text
 * @returns {void}
 */
function copyTextWithExecCommand(text) {
logger.debug(`>>> Entering copyTextWithExecCommand(text=${text})`);
  if (typeof document.execCommand !== "function") {
    throw new Error("Failed to copy");
  }

  const textarea = document.createElement("textarea");
logger.debug(`copyTextWithExecCommand(text=${text}): textarea → ${textarea}`);
  textarea.value = text;
  textarea.setAttribute("readonly", "");
logger.debug(`copyTextWithExecCommand(text=${text}): textarea.value → ${textarea.value}`);
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.left = "0";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    const ok = document.execCommand("copy");
	logger.debug(`copyTextWithExecCommand(text=${text}): ok → ${ok}`);
    if (!ok) {
      throw new Error("Failed to copy");
    }
  } finally {
    document.body.removeChild(textarea);
	logger.debug(`<<< Exiting copyTextWithExecCommand(text=${text})`);
  }
}

/**
 * Copy text to the clipboard.
 *
 * Tries `navigator.clipboard.writeText` first, then falls back to a
 * textarea + `document.execCommand("copy")` path. Rejects if both fail.
 *
 * @param {string} text
 * @returns {Promise<void>}
 */
export async function copyText(text) {
logger.debug(`>>> Entering copyText(text=${text})`);
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
	logger.error(`Exception in copyText(text=${text}): (no error binding)`);
      // Fall through to execCommand (insecure contexts, permission denied, etc.).
    }
  }

  copyTextWithExecCommand(text);
}
