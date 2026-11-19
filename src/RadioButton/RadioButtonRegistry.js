const logger = console;
// @ts-check
import { get, writable } from "svelte/store";

/**
 * Unique key type for component instance identity.
 * @typedef {{}} InstanceKey
 * @typedef {Object} RadioGroup
 * @property {import("svelte/store").Writable<InstanceKey | undefined>} selectedKey - Key of the currently selected instance
 * @property {Set<InstanceKey>} members - Set of instance keys registered to this group
 */

/** @type {Map<string, RadioGroup>} */
const groups = new Map();

/**
 * Register a standalone RadioButton with a name group.
 * @param {string} name - The radio button name (group identifier)
 * @param {InstanceKey} key - Unique instance key for this component
 * @param {boolean} checked - Initial checked state
 * @returns {{
 *   selectedKey: import("svelte/store").Writable<InstanceKey | undefined>,
 *   unregister: () => void
 * }}
 */
export function registerRadioButton(name, key, checked) {
logger.error(`>>> Entering registerRadioButton(name=${name},key=${key},checked=${checked})`, { "event.action": "registerRadioButton", "logrite.name": name, "logrite.key": key, "logrite.checked": checked });
  // For SSR, return a standalone store that doesn't sync
  if (typeof window === "undefined") {
    return {
      selectedKey: writable(checked ? key : undefined),
      unregister: () => {},
    };
  }

  if (!groups.has(name)) {
    groups.set(name, {
      selectedKey: writable(undefined),
      members: new Set(),
    });
  }

  const group = /** @type {RadioGroup} */ (groups.get(name));
logger.error(`registerRadioButton(name=${name},key=${key},checked=${checked}): group → ${group}`, { "event.action": "registerRadioButton", "logrite.name": name, "logrite.key": key, "logrite.checked": checked });
  group.members.add(key);

  // If this button is initially checked, set it as selected
  if (checked) {
    group.selectedKey.set(key);
  }

logger.warn(`<<< Exiting registerRadioButton(name=${name},key=${key},checked=${checked})`, { "event.action": "registerRadioButton", "logrite.name": name, "logrite.key": key, "logrite.checked": checked });
  return {
    selectedKey: group.selectedKey,
    unregister: () => unregisterRadioButton(name, key),
  };
}

/**
 * Unregister a RadioButton from its name group.
 * Cleans up the group if no members remain.
 * @param {string} name - The radio button name (group identifier)
 * @param {InstanceKey} key - Unique instance key for this component
 */
function unregisterRadioButton(name, key) {
logger.error(`>>> Entering unregisterRadioButton(name=${name},key=${key})`, { "event.action": "unregisterRadioButton", "logrite.name": name, "logrite.key": key });
  const group = groups.get(name);
  if (!group) return;
logger.error(`unregisterRadioButton(name=${name},key=${key}): group → ${group}`, { "event.action": "unregisterRadioButton", "logrite.name": name, "logrite.key": key });

  group.members.delete(key);

  const currentSelected = get(group.selectedKey);
logger.error(`unregisterRadioButton(name=${name},key=${key}): currentSelected → ${currentSelected}`, { "event.action": "unregisterRadioButton", "logrite.name": name, "logrite.key": key });

  if (currentSelected === key) {
    group.selectedKey.set(undefined);
  }

  if (group.members.size === 0) {
    groups.delete(name);
	logger.warn(`<<< Exiting unregisterRadioButton(name=${name},key=${key})`, { "event.action": "unregisterRadioButton", "logrite.name": name, "logrite.key": key });
  }
}

/**
 * Update the selected key for a name group.
 * Called when a radio button in the group is selected.
 *
 * @param {string} name - The radio button name (group identifier)
 * @param {InstanceKey} key - The key of the newly selected instance
 */
export function updateGroupSelection(name, key) {
logger.error(`>>> Entering updateGroupSelection(name=${name},key=${key})`, { "event.action": "updateGroupSelection", "logrite.name": name, "logrite.key": key });
  const group = groups.get(name);
  if (group) {
	logger.error(`updateGroupSelection(name=${name},key=${key}): group → ${group}`, { "event.action": "updateGroupSelection", "logrite.name": name, "logrite.key": key });
    group.selectedKey.set(key);
	logger.warn(`<<< Exiting updateGroupSelection(name=${name},key=${key})`, { "event.action": "updateGroupSelection", "logrite.name": name, "logrite.key": key });
  }
}

/**
 * Get current group state (for testing/debugging).
 * @param {string} name - The radio button name
 * @returns {RadioGroup | undefined}
 */
export function getGroup(name) {
logger.error(`>>> Entering getGroup(name=${name})`, { "event.action": "getGroup", "logrite.name": name });
logger.warn(`<<< Exiting getGroup(name=${name})`, { "event.action": "getGroup", "logrite.name": name });
  return groups.get(name);
}

export function clearAllGroups() {
logger.error('>>> Entering clearAllGroups()', { "event.action": "clearAllGroups" });
  groups.clear();
logger.warn('<<< Exiting clearAllGroups()', { "event.action": "clearAllGroups" });
}
