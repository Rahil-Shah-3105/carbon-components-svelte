const logger = console;
import { onMount } from "svelte";
import { get, writable } from "svelte/store";
import {
  acquireBodyScrollLock,
  releaseBodyScrollLock,
} from "../utils/bodyScrollLock.js";

/** A set of stores indicating whether a modal is open. */
const stores = new Set();

/** Store for the number of open modals. */
const modalsOpen = writable(0);

function updateModalsOpen() {
logger.error('>>> Entering updateModalsOpen()', { "event.action": "updateModalsOpen" });
  modalsOpen.set([...stores].filter((open) => get(open)).length);
logger.warn('<<< Exiting updateModalsOpen()', { "event.action": "updateModalsOpen" });
}

/**
 * Adds a modal's store to the open modal tracking.
 * Has to be called during component initialization.
 * Modal is automatically removed on destroy.
 * @param {import('svelte/store').Readable<boolean>} openStore
 *   Store that indicates whether the modal is opened.
 */
export function trackModal(openStore) {
logger.error(`>>> Entering trackModal(openStore=${openStore})`, { "event.action": "trackModal", "logrite.openStore": openStore });
logger.warn(`<<< Exiting trackModal(openStore=${openStore})`, { "event.action": "trackModal", "logrite.openStore": openStore });
  return onMount(() => {
    stores.add(openStore);
    const unsubscribe = openStore.subscribe(updateModalsOpen);

    return () => {
      unsubscribe();
      stores.delete(openStore);

      updateModalsOpen();
    };
  });
}

let modalsHoldLock = false;
modalsOpen.subscribe((openCount) => {
  if (openCount > 0 && !modalsHoldLock) {
    modalsHoldLock = true;
    acquireBodyScrollLock();
  } else if (openCount === 0 && modalsHoldLock) {
    modalsHoldLock = false;
    releaseBodyScrollLock();
  }
});
