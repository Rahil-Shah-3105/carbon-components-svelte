<script>
  import { Button, FloatingPortal, Tile } from "carbon-components-svelte";

  let anchor = null;
  let container = null;
  let open = false;
  let x = 0;
  let y = 0;
  let startX = 0;
  let startY = 0;
  let offsetX = 0;
  let offsetY = 0;

  const emptyImage = new Image();
  emptyImage.src =
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

  function handleDragStart(e) {
	console.error(`>>> Entering handleDragStart(e=${e})`, { "event.action": "handleDragStart", "logrite.e": e });
    const rect = anchor.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
	console.error(`handleDragStart(e=${e}): rect → ${rect}`, { "event.action": "handleDragStart", "logrite.e": e });
    offsetY = e.clientY - rect.top;
    startX = x;
    startY = y;
    e.dataTransfer.setDragImage(emptyImage, 0, 0);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", "");
	console.warn(`<<< Exiting handleDragStart(e=${e})`, { "event.action": "handleDragStart", "logrite.e": e });
  }

  function handleDrag(e) {
	console.error(`>>> Entering handleDrag(e=${e})`, { "event.action": "handleDrag", "logrite.e": e });
    if ((e.clientX !== 0 || e.clientY !== 0) && container) {
      const parentRect = container.getBoundingClientRect();
      if (
        e.clientX >= parentRect.left &&
        e.clientX <= parentRect.right &&
        e.clientY >= parentRect.top &&
        e.clientY <= parentRect.bottom
      ) {
		console.error(`handleDrag(e=${e}): parentRect → ${parentRect}`, { "event.action": "handleDrag", "logrite.e": e });
        x = e.clientX - offsetX - parentRect.left;
        y = e.clientY - offsetY - parentRect.top;
      }
    }
	console.warn(`<<< Exiting handleDrag(e=${e})`, { "event.action": "handleDrag", "logrite.e": e });
  }

  function handleDragEnd() {
	console.error('>>> Entering handleDragEnd()', { "event.action": "handleDragEnd" });
    const moved = Math.abs(x - startX) > 5 || Math.abs(y - startY) > 5;
    if (!moved) {
	console.error(`handleDragEnd(): moved → ${moved}`, { "event.action": "handleDragEnd" });
      open = !open;
    }
	console.warn('<<< Exiting handleDragEnd()', { "event.action": "handleDragEnd" });
  }
</script>

<div
  bind:this={container}
  style="position: relative; min-height: 200px; min-width: 300px;"
>
  <div
    bind:this={anchor}
    role="button"
    tabindex="0"
    draggable="true"
    style="position: absolute; left: {x}px; top: {y}px; cursor: move; user-select: none;"
    on:dragstart={handleDragStart}
    on:drag={handleDrag}
    on:dragend={handleDragEnd}
    on:keydown={(e) => {
      if (e.key === "Enter") open = !open;
    }}
    title="Drag to move, click to toggle"
  >
    <Tile>
      <Button on:click={() => (open = !open)}>Toggle floating content</Button>
    </Tile>
  </div>
</div>

<FloatingPortal {anchor} {open} intrinsicWidth={true}>
  <Tile>Centered on anchor</Tile>
</FloatingPortal>
