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
logger.debug(`>>> Entering registerRadioButton(name=${name},key=${key},checked=${checked})`);
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
logger.debug(`registerRadioButton(name=${name},key=${key},checked=${checked}): group → ${group}`);
  group.members.add(key);

  // If this button is initially checked, set it as selected
  if (checked) {
    group.selectedKey.set(key);
  }

logger.debug(`<<< Exiting registerRadioButton(name=${name},key=${key},checked=${checked})`);
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
logger.debug(`>>> Entering unregisterRadioButton(name=${name},key=${key})`);
  const group = groups.get(name);
  if (!group) return;
logger.debug(`unregisterRadioButton(name=${name},key=${key}): group → ${group}`);
const __log_start = Date.now();

  group.members.delete(key);
logger.info(`unregisterRadioButton(name,key)=${name},${key}: delete operation took ${Date.now() - __log_start} ms`);

  const currentSelected = get(group.selectedKey);
logger.debug(`unregisterRadioButton(name=${name},key=${key}): currentSelected → ${currentSelected}`);

  if (currentSelected === key) {
    group.selectedKey.set(undefined);
  }

  if (group.members.size === 0) {
    groups.delete(name);
	logger.debug(`<<< Exiting unregisterRadioButton(name=${name},key=${key})`);
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
logger.debug(`>>> Entering updateGroupSelection(name=${name},key=${key})`);
  const group = groups.get(name);
  if (group) {
	logger.debug(`updateGroupSelection(name=${name},key=${key}): group → ${group}`);
    group.selectedKey.set(key);
	logger.debug(`<<< Exiting updateGroupSelection(name=${name},key=${key})`);
  }
}

/**
 * Get current group state (for testing/debugging).
 * @param {string} name - The radio button name
 * @returns {RadioGroup | undefined}
 */
export function getGroup(name) {
logger.debug(`>>> Entering getGroup(name=${name})`);
logger.debug(`<<< Exiting getGroup(name=${name})`);
  return groups.get(name);
}

export function clearAllGroups() {
logger.debug('>>> Entering clearAllGroups()');
  groups.clear();
logger.debug('<<< Exiting clearAllGroups()');
}
