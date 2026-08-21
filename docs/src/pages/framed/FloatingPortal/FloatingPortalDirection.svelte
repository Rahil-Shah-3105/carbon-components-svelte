<script>
  import {
    Button,
    FloatingPortal,
    Stack,
    Tile,
  } from "carbon-components-svelte";

  let anchorTop = null;
  let anchorBottom = null;
  let containerBottom = null;
  let containerTop = null;
  let openTop = false;
  let openBottom = false;

  let xBottom = 0;
  let yBottom = 0;
  let xTop = 0;
  let yTop = 0;
  let startXBottom = 0;
  let startYBottom = 0;
  let startXTop = 0;
  let startYTop = 0;
  let offsetX = 0;
  let offsetY = 0;

  const emptyImage = new Image();
  emptyImage.src =
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

  function handleDragStartBottom(e) {
	console.debug(`>>> Entering handleDragStartBottom(e=${e})`);
    const rect = anchorBottom.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
	console.debug(`handleDragStartBottom(e=${e}): rect → ${rect}`);
	logger.debug(`handleDragStartBottom(e=${e}): offsetX → ${offsetX}`);
    offsetY = e.clientY - rect.top;
    startXBottom = xBottom;
	logger.debug(`handleDragStartBottom(e=${e}): offsetY → ${offsetY}`);
	logger.debug(`handleDragStartBottom(e=${e}): startXBottom → ${startXBottom}`);
    startYBottom = yBottom;
    e.dataTransfer.setDragImage(emptyImage, 0, 0);
	logger.debug(`handleDragStartBottom(e=${e}): startYBottom → ${startYBottom}`);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", "");
	console.debug(`<<< Exiting handleDragStartBottom(e=${e})`);
  }

  function handleDragStartTop(e) {
	console.debug(`>>> Entering handleDragStartTop(e=${e})`);
    const rect = anchorTop.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
	console.debug(`handleDragStartTop(e=${e}): rect → ${rect}`);
	logger.debug(`handleDragStartTop(e=${e}): offsetX → ${offsetX}`);
    offsetY = e.clientY - rect.top;
    startXTop = xTop;
	logger.debug(`handleDragStartTop(e=${e}): offsetY → ${offsetY}`);
	logger.debug(`handleDragStartTop(e=${e}): startXTop → ${startXTop}`);
    startYTop = yTop;
    e.dataTransfer.setDragImage(emptyImage, 0, 0);
	logger.debug(`handleDragStartTop(e=${e}): startYTop → ${startYTop}`);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", "");
	console.debug(`<<< Exiting handleDragStartTop(e=${e})`);
  }

  function handleDragBottom(e) {
	console.debug(`>>> Entering handleDragBottom(e=${e})`);
    if ((e.clientX !== 0 || e.clientY !== 0) && containerBottom) {
      const parentRect = containerBottom.getBoundingClientRect();
      if (
        e.clientX >= parentRect.left &&
        e.clientX <= parentRect.right &&
        e.clientY >= parentRect.top &&
        e.clientY <= parentRect.bottom
      ) {
		console.debug(`handleDragBottom(e=${e}): parentRect → ${parentRect}`);
        xBottom = e.clientX - offsetX - parentRect.left;
		logger.debug(`handleDragBottom(e=${e}): xBottom → ${xBottom}`);
        yBottom = e.clientY - offsetY - parentRect.top;
		logger.debug(`handleDragBottom(e=${e}): yBottom → ${yBottom}`);
      }
    }
	console.debug(`<<< Exiting handleDragBottom(e=${e})`);
  }

  function handleDragTop(e) {
	console.debug(`>>> Entering handleDragTop(e=${e})`);
    if ((e.clientX !== 0 || e.clientY !== 0) && containerTop) {
      const parentRect = containerTop.getBoundingClientRect();
      if (
        e.clientX >= parentRect.left &&
        e.clientX <= parentRect.right &&
        e.clientY >= parentRect.top &&
        e.clientY <= parentRect.bottom
      ) {
		console.debug(`handleDragTop(e=${e}): parentRect → ${parentRect}`);
        xTop = e.clientX - offsetX - parentRect.left;
		logger.debug(`handleDragTop(e=${e}): xTop → ${xTop}`);
        yTop = e.clientY - offsetY - parentRect.top;
		logger.debug(`handleDragTop(e=${e}): yTop → ${yTop}`);
      }
    }
	console.debug(`<<< Exiting handleDragTop(e=${e})`);
  }

  function handleDragEndBottom() {
	console.debug('>>> Entering handleDragEndBottom()');
    const moved =
      Math.abs(xBottom - startXBottom) > 5 ||
      Math.abs(yBottom - startYBottom) > 5;
    if (!moved) openBottom = !openBottom;
	console.debug('<<< Exiting handleDragEndBottom()');
  }

  function handleDragEndTop() {
	console.debug('>>> Entering handleDragEndTop()');
    const moved =
      Math.abs(xTop - startXTop) > 5 || Math.abs(yTop - startYTop) > 5;
    if (!moved) openTop = !openTop;
	console.debug('<<< Exiting handleDragEndTop()');
  }
</script>

<Stack gap={5}>
  <div
    bind:this={containerBottom}
    style="position: relative; min-height: 200px; min-width: 300px;"
  >
    <div
      bind:this={anchorBottom}
      role="button"
      tabindex="0"
      draggable="true"
      style="position: absolute; left: {xBottom}px; top: {yBottom}px; cursor: move; user-select: none;"
      on:dragstart={handleDragStartBottom}
      on:drag={handleDragBottom}
      on:dragend={handleDragEndBottom}
      on:keydown={(e) => {
        if (e.key === "Enter") openBottom = !openBottom;
      }}
      title="Drag to move, click to toggle"
    >
      <Tile>
        <Button on:click={() => (openBottom = !openBottom)}>
          Direction: bottom (default)
        </Button>
      </Tile>
    </div>
    <FloatingPortal anchor={anchorBottom} open={openBottom} direction="bottom">
      <Tile>Content</Tile>
    </FloatingPortal>
  </div>

  <div
    bind:this={containerTop}
    style="position: relative; min-height: 200px; min-width: 300px;"
  >
    <div
      bind:this={anchorTop}
      role="button"
      tabindex="0"
      draggable="true"
      style="position: absolute; left: {xTop}px; top: {yTop}px; cursor: move; user-select: none;"
      on:dragstart={handleDragStartTop}
      on:drag={handleDragTop}
      on:dragend={handleDragEndTop}
      on:keydown={(e) => {
        if (e.key === "Enter") openTop = !openTop;
      }}
      title="Drag to move, click to toggle"
    >
      <Tile>
        <Button on:click={() => (openTop = !openTop)}>Direction: top</Button>
      </Tile>
    </div>
    <FloatingPortal anchor={anchorTop} open={openTop} direction="top">
      <Tile>Content</Tile>
    </FloatingPortal>
  </div>
</Stack>
