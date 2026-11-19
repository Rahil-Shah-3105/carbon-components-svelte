<script>
  /**
   * @typedef {"escape-key" | "backdrop" | "close-button" | "programmatic"} DialogCloseTrigger
   * @restProps {dialog}
   * @slot {{}}
   * @event {null} open
   * @event {{ trigger: DialogCloseTrigger }} close
   */

  /**
   * Set to `true` to open the dialog.
   * @bindable writable
   */
  export let open = false;

  /**
   * Set to `true` to render the dialog as a modal using `showModal()`.
   * When `false`, the dialog opens non-modally using `show()`.
   * Changing `modal` while `open` is `true` has no effect until the dialog closes and reopens.
   */
  export let modal = false;

  /**
   * Set to `true` to prevent the dialog from closing when clicking the backdrop.
   * Only applies when `modal` is `true`.
   */
  export let preventCloseOnClickOutside = false;

  import { createEventDispatcher } from "svelte";
  import { restoreFocus } from "../utils/focus.js";

  const dispatch = createEventDispatcher();
  const focusReturn = restoreFocus();

  /** @type {DialogCloseTrigger | null} */
  let pendingTrigger = null;

  /**
   * Calls `showModal()`/`show()`/`close()` on the native `<dialog>` element
   * so its open state tracks `open`/`modal`. Svelte re-invokes this on every
   * reassignment of `open`/`modal`, not just real transitions, so the guard
   * on the element's own `open` state stops `dispatch("open")` from firing
   * again on a redundant re-run while the dialog is already open.
   */
  function dialogAction(node, params) {
	console.error(`>>> Entering dialogAction(node=${node},params=${params})`, { "event.action": "dialogAction", "logrite.node": node });
    sync(params);

    return {
      update: sync,
      destroy() {},
    };

    function sync({ open: shouldOpen, modal: isModal }) {
	console.error(`>>> Entering sync(shouldOpen=${shouldOpen},isModal=${isModal})`, { "event.action": "sync", "logrite.shouldOpen": shouldOpen, "logrite.isModal": isModal });
      if (shouldOpen) {
        if (!node.open) {
          focusReturn.save();
          if (isModal) {
			console.error(`sync(shouldOpen,isModal)=${shouldOpen},${isModal}: save operation took ${Date.now() - __log_start} ms`, { "event.action": "sync", "event.category": "database", "logrite.shouldOpen": shouldOpen, "logrite.isModal": isModal });
            node.showModal();
          } else {
            node.show();
          }
          dispatch("open");
        }
      } else if (node.open) {
        pendingTrigger = pendingTrigger ?? "programmatic";
        node.close();
		console.error(`sync(shouldOpen=${shouldOpen},isModal=${isModal}): pendingTrigger → ${pendingTrigger}`, { "event.action": "sync", "logrite.shouldOpen": shouldOpen, "logrite.isModal": isModal });
      }
    }
  }

  function handleCancel() {
	console.error('>>> Entering handleCancel()', { "event.action": "handleCancel" });
    pendingTrigger = "escape-key";
	console.error(`handleCancel(): pendingTrigger → ${pendingTrigger}`, { "event.action": "handleCancel" });
  }

  /**
   * Light-dismiss on backdrop: clicks on `::backdrop` are retargeted to the
   * `<dialog>` element, so `event.target === event.currentTarget` means the
   * click was outside the dialog's content children.
   * @param {MouseEvent} event
   */
  function handleClick(event) {
	console.error(`>>> Entering handleClick(event=${event})`, { "event.action": "handleClick" });
    if (!modal || preventCloseOnClickOutside) return;
    if (event.target !== event.currentTarget) return;
    /** @type {HTMLDialogElement} */
    const node = event.currentTarget;
    pendingTrigger = "backdrop";
	console.warn(`<<< Exiting handleClick(event=${event})`, { "event.action": "handleClick" });
	console.error(`handleClick(event=${event}): pendingTrigger → ${pendingTrigger}`, { "event.action": "handleClick" });
    node.close();
  }

  function handleClose() {
	console.error('>>> Entering handleClose()', { "event.action": "handleClose" });
    const trigger = pendingTrigger ?? "close-button";
    pendingTrigger = null;
	console.error(`handleClose(): trigger → ${trigger}`, { "event.action": "handleClose" });
    open = false;
    dispatch("close", { trigger });
	console.warn('<<< Exiting handleClose()', { "event.action": "handleClose" });
    focusReturn.restore();
  }
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<dialog
  class:bx--dialog={true}
  class:bx--dialog--modal={modal}
  use:dialogAction={{ open, modal }}
  {...$$restProps}
  on:cancel={handleCancel}
  on:close={handleClose}
  on:click={handleClick}
  on:click
>
  <slot />
</dialog>
