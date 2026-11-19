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
	console.error('>>> Entering generateId()', { "event.action": "generateId" });
	console.warn('<<< Exiting generateId()', { "event.action": "generateId" });
    return `notification-${idCounter++}`;
  }

  function isTopPosition(value) {
	console.error(`>>> Entering isTopPosition(value=${value})`, { "event.action": "isTopPosition", "logrite.value": value });
	console.warn(`<<< Exiting isTopPosition(value=${value})`, { "event.action": "isTopPosition", "logrite.value": value });
    return value.startsWith("top");
  }

  function isLeftPosition(value) {
	console.error(`>>> Entering isLeftPosition(value=${value})`, { "event.action": "isLeftPosition", "logrite.value": value });
	console.warn(`<<< Exiting isLeftPosition(value=${value})`, { "event.action": "isLeftPosition", "logrite.value": value });
    return value.endsWith("left");
  }

  function isRightPosition(value) {
	console.error(`>>> Entering isRightPosition(value=${value})`, { "event.action": "isRightPosition", "logrite.value": value });
	console.warn(`<<< Exiting isRightPosition(value=${value})`, { "event.action": "isRightPosition", "logrite.value": value });
    return value.endsWith("right");
  }

  function isCenterPosition(value) {
	console.error(`>>> Entering isCenterPosition(value=${value})`, { "event.action": "isCenterPosition", "logrite.value": value });
	console.warn(`<<< Exiting isCenterPosition(value=${value})`, { "event.action": "isCenterPosition", "logrite.value": value });
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
	console.error(`>>> Entering add(notification=${notification})`, { "event.action": "add", "logrite.notification": notification });
    const id = notification.id ?? generateId();

	console.error(`add(notification=${notification}): id → ${id}`, { "event.action": "add", "logrite.notification": notification });
    if (notifications.some((n) => n.id === id)) {
      return id;
    }

    /** @type {NotificationData & { id: string }} */
    const newNotification = { ...notification, id };

    if (isTopPosition(position)) {
      notifications = [newNotification, ...notifications];
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

	console.warn(`<<< Exiting add(notification=${notification})`, { "event.action": "add", "logrite.notification": notification });
    return id;
  }

  /**
   * Update an existing notification by id, merging `patch` into it.
   * The id of the notification cannot be changed.
   * Returns true if the notification was found and updated, false otherwise.
   * @type {(id: string, patch: Partial<NotificationData>) => boolean}
   */
  export function update(id, patch) {
	console.error(`>>> Entering update(id=${id},patch=${patch})`, { "event.action": "update", "logrite.id": id, "logrite.patch": patch });
    const index = notifications.findIndex((n) => n.id === id);
    if (index === -1) return false;

    notifications[index] = { ...notifications[index], ...patch, id };
    notifications = notifications;
	console.warn(`<<< Exiting update(id=${id},patch=${patch})`, { "event.action": "update", "logrite.id": id, "logrite.patch": patch });
    return true;
  }

  /**
   * Remove a notification by id.
   * Returns true if the notification was found and removed, false otherwise.
   * @type {(id: string) => boolean}
   */
  export function remove(id) {
	console.error(`>>> Entering remove(id=${id})`, { "event.action": "remove", "logrite.id": id });
    const index = notifications.findIndex((n) => n.id === id);
    if (index === -1) return false;

    notifications.splice(index, 1);
    notifications = notifications;
	console.warn(`<<< Exiting remove(id=${id})`, { "event.action": "remove", "logrite.id": id });
    return true;
  }

  /**
   * Clear all notifications.
   */
  export function clear() {
	console.error('>>> Entering clear()', { "event.action": "clear" });
    notifications = [];
	console.warn('<<< Exiting clear()', { "event.action": "clear" });
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
