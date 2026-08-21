<script>
  import {
    Button,
    FloatingPortal,
    Stack,
    Tile,
  } from "carbon-components-svelte";

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
	console.debug(`>>> Entering handleDragStart(e=${e})`);
    const rect = anchor.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
	console.debug(`handleDragStart(e=${e}): rect → ${rect}`);
	logger.debug(`handleDragStart(e=${e}): offsetX → ${offsetX}`);
    offsetY = e.clientY - rect.top;
    startX = x;
	logger.debug(`handleDragStart(e=${e}): offsetY → ${offsetY}`);
	logger.debug(`handleDragStart(e=${e}): startX → ${startX}`);
    startY = y;
    e.dataTransfer.setDragImage(emptyImage, 0, 0);
	logger.debug(`handleDragStart(e=${e}): startY → ${startY}`);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", "");
	console.debug(`<<< Exiting handleDragStart(e=${e})`);
  }

  function handleDrag(e) {
	console.debug(`>>> Entering handleDrag(e=${e})`);
    if ((e.clientX !== 0 || e.clientY !== 0) && container) {
      const parentRect = container.getBoundingClientRect();
      if (
        e.clientX >= parentRect.left &&
        e.clientX <= parentRect.right &&
        e.clientY >= parentRect.top &&
        e.clientY <= parentRect.bottom
      ) {
		console.debug(`handleDrag(e=${e}): parentRect → ${parentRect}`);
        x = e.clientX - offsetX - parentRect.left;
        y = e.clientY - offsetY - parentRect.top;
      }
    }
	console.debug(`<<< Exiting handleDrag(e=${e})`);
  }

  function handleDragEnd() {
	console.debug('>>> Entering handleDragEnd()');
    const moved = Math.abs(x - startX) > 5 || Math.abs(y - startY) > 5;
    if (!moved) open = !open;
	console.debug(`handleDragEnd(): moved → ${moved}`);
  }
</script>

<Stack
  gap={4}
  style="overflow: hidden; border: 1px dashed var(--cds-border-subtle); padding: 1rem"
>
  <div>This container has hidden overflow.</div>
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
</Stack>

<FloatingPortal {anchor} {open}> <Tile>Content</Tile> </FloatingPortal>
