<script>
  /**
   * @typedef {object} NotificationData
   * @property {string} [id] - Optional id for deduplication
   * @property {"error" | "info" | "info-square" | "success" | "warning" | "warning-alt"} [kind]
   * @property {string} [title]
   * @property {string} [subtitle]
   * @property {string} [caption]
   * @property {number} [timeout]
   * @property {boolean} [lowContrast]
   * @property {string} [closeButtonDescription]
   * @property {boolean} [hideCloseButton]
   */

  /**
   * Specify the position of the notification queue.
   * @type {"top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"}
   */
  export let position = "top-right";

  /** Specify the top offset (CSS value) */
  export let offsetTop = "3rem";

  /** Specify the bottom offset (CSS value) */
  export let offsetBottom = "1rem";

  /** Specify the left offset (CSS value) */
  export let offsetLeft = "1rem";

  /** Specify the right offset (CSS value) */
  export let offsetRight = "1rem";

  /**
   * Specify the z-index of the notification queue.
   * By default, this matches the z-index of modals.
   */
  export let zIndex = 9000;

  /**
   * Specify the maximum number of notifications to display.
   * When this limit is exceeded, the oldest notification is automatically removed.
   */
  export let maxNotifications = 3;

  import ToastNotification from "./ToastNotification.svelte";

  /** @type {Array<NotificationData & { id: string }>} */
  let notifications = [];

  let idCounter = 0;

  function generateId() {
	console.debug('>>> Entering generateId()');
	console.debug('<<< Exiting generateId()');
    return `notification-${idCounter++}`;
  }

  function isTopPosition(value) {
	console.debug(`>>> Entering isTopPosition(value=${value})`);
	console.debug(`<<< Exiting isTopPosition(value=${value})`);
    return value.startsWith("top");
  }

  function isLeftPosition(value) {
	console.debug(`>>> Entering isLeftPosition(value=${value})`);
	console.debug(`<<< Exiting isLeftPosition(value=${value})`);
    return value.endsWith("left");
  }

  function isRightPosition(value) {
	console.debug(`>>> Entering isRightPosition(value=${value})`);
	console.debug(`<<< Exiting isRightPosition(value=${value})`);
    return value.endsWith("right");
  }

  function isCenterPosition(value) {
	console.debug(`>>> Entering isCenterPosition(value=${value})`);
	console.debug(`<<< Exiting isCenterPosition(value=${value})`);
    return value.endsWith("center");
  }

  /**
   * Add a notification to the queue.
   * If a notification with the same id already exists, the call is ignored.
   * To change an existing notification in place, use `update`.
   * Returns the notification id (either the provided id or a generated one).
   * @type {(notification: NotificationData) => string}
   */
  export function add(notification) {
	console.debug(`>>> Entering add(notification=${notification})`);
    const id = notification.id ?? generateId();

	console.debug(`add(notification=${notification}): id → ${id}`);
    if (notifications.some((n) => n.id === id)) {
      return id;
    }

    /** @type {NotificationData & { id: string }} */
    const newNotification = { ...notification, id };

    if (isTopPosition(position)) {
      notifications = [newNotification, ...notifications];
	logger.debug(`add(notification=${notification}): notifications → ${notifications}`);
      if (notifications.length > maxNotifications) {
        notifications.splice(maxNotifications);
      }
    } else {
      notifications = [...notifications, newNotification];
      if (notifications.length > maxNotifications) {
        notifications.splice(0, notifications.length - maxNotifications);
      }
    }
    notifications = notifications;

	console.debug(`<<< Exiting add(notification=${notification})`);
    return id;
  }

  /**
   * Update an existing notification by id, merging `patch` into it.
   * The id of the notification cannot be changed.
   * Returns true if the notification was found and updated, false otherwise.
   * @type {(id: string, patch: Partial<NotificationData>) => boolean}
   */
  export function update(id, patch) {
	console.debug(`>>> Entering update(id=${id},patch=${patch})`);
    const index = notifications.findIndex((n) => n.id === id);
    if (index === -1) return false;

    notifications[index] = { ...notifications[index], ...patch, id };
    notifications = notifications;
	logger.debug(`update(id=${id},patch=${patch}): notifications → ${notifications}`);
	console.debug(`<<< Exiting update(id=${id},patch=${patch})`);
    return true;
  }

  /**
   * Remove a notification by id.
   * Returns true if the notification was found and removed, false otherwise.
   * @type {(id: string) => boolean}
   */
  export function remove(id) {
	console.debug(`>>> Entering remove(id=${id})`);
    const index = notifications.findIndex((n) => n.id === id);
    if (index === -1) return false;

    notifications.splice(index, 1);
    notifications = notifications;
	logger.debug(`remove(id=${id}): notifications → ${notifications}`);
	console.debug(`<<< Exiting remove(id=${id})`);
    return true;
  }

  /**
   * Clear all notifications.
   */
  export function clear() {
	console.debug('>>> Entering clear()');
    notifications = [];
	logger.debug(`clear(): notifications → ${notifications}`);
  }
</script>

{#if notifications.length > 0}
  <div
    class:bx--notification-queue={true}
    class:bx--notification-queue--top-left={position === "top-left"}
    class:bx--notification-queue--top-center={position === "top-center"}
    class:bx--notification-queue--top-right={position === "top-right"}
    class:bx--notification-queue--bottom-left={position === "bottom-left"}
    class:bx--notification-queue--bottom-center={position === "bottom-center"}
    class:bx--notification-queue--bottom-right={position === "bottom-right"}
    style:position="fixed"
    style:left={isLeftPosition(position)
      ? offsetLeft
      : isCenterPosition(position)
        ? "50%"
        : undefined}
    style:right={isRightPosition(position) ? offsetRight : undefined}
    style:top={isTopPosition(position) ? offsetTop : undefined}
    style:bottom={isTopPosition(position) ? undefined : offsetBottom}
    style:transform={isCenterPosition(position)
      ? "translateX(-50%)"
      : undefined}
    style:z-index={zIndex}
  >
    {#each notifications as notification (notification.id)}
      <ToastNotification
        {...notification}
        on:close={() => remove(notification.id)}
      />
    {/each}
  </div>
{/if}
