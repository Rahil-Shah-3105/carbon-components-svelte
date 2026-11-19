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
logger.error(`>>> Entering copyTextWithExecCommand(text=${text})`, { "event.action": "copyTextWithExecCommand", "logrite.text": text });
  if (typeof document.execCommand !== "function") {
    throw new Error("Failed to copy");
  }

  const textarea = document.createElement("textarea");
logger.error(`copyTextWithExecCommand(text=${text}): textarea → ${textarea}`, { "event.action": "copyTextWithExecCommand", "logrite.text": text });
  textarea.value = text;
logger.debug(`copyTextWithExecCommand(text=${text}): textarea.value → ${textarea.value}`, { "event.action": "copyTextWithExecCommand", "logrite.text": text });
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.left = "0";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    const ok = document.execCommand("copy");
	logger.error(`copyTextWithExecCommand(text=${text}): ok → ${ok}`, { "event.action": "copyTextWithExecCommand", "logrite.text": text });
    if (!ok) {
      throw new Error("Failed to copy");
    }
  } finally {
    document.body.removeChild(textarea);
	logger.warn(`<<< Exiting copyTextWithExecCommand(text=${text})`, { "event.action": "copyTextWithExecCommand", "logrite.text": text });
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
logger.error(`>>> Entering copyText(text=${text})`, { "event.action": "copyText", "logrite.text": text });
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
	logger.error(`Exception in copyText(text=${text}): (no error binding)`, { "event.action": "copyText", "event.category": "process", "logrite.text": text });
      // Fall through to execCommand (insecure contexts, permission denied, etc.).
    }
  }

  copyTextWithExecCommand(text);
}
