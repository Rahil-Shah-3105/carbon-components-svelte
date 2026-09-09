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
    const rect = anchorBottom.getBoundingClientRect();
	console.info(`ENTERING: handleDragStartBottom() method`);
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
	console.warn(`ENTERING: handleDragStartBottom() method`);
    startXBottom = xBottom;
    startYBottom = yBottom;
    e.dataTransfer.setDragImage(emptyImage, 0, 0);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", "");
  }

  function handleDragStartTop(e) {
    const rect = anchorTop.getBoundingClientRect();
	console.info(`ENTERING: handleDragStartTop() method`);
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
	console.warn(`ENTERING: handleDragStartTop() method`);
    startXTop = xTop;
    startYTop = yTop;
    e.dataTransfer.setDragImage(emptyImage, 0, 0);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", "");
  }

  function handleDragBottom(e) {
    if ((e.clientX !== 0 || e.clientY !== 0) && containerBottom) {
	console.info(`ENTERING: handleDragBottom() method`);
      const parentRect = containerBottom.getBoundingClientRect();
      if (
        e.clientX >= parentRect.left &&
        e.clientX <= parentRect.right &&
        e.clientY >= parentRect.top &&
        e.clientY <= parentRect.bottom
      ) {
		console.warn(`ENTERING: handleDragBottom() method`);
        xBottom = e.clientX - offsetX - parentRect.left;
        yBottom = e.clientY - offsetY - parentRect.top;
      }
    }
  }

  function handleDragTop(e) {
    if ((e.clientX !== 0 || e.clientY !== 0) && containerTop) {
	console.info(`ENTERING: handleDragTop() method`);
      const parentRect = containerTop.getBoundingClientRect();
      if (
        e.clientX >= parentRect.left &&
        e.clientX <= parentRect.right &&
        e.clientY >= parentRect.top &&
        e.clientY <= parentRect.bottom
      ) {
		console.warn(`ENTERING: handleDragTop() method`);
        xTop = e.clientX - offsetX - parentRect.left;
        yTop = e.clientY - offsetY - parentRect.top;
      }
    }
  }

  function handleDragEndBottom() {
    const moved =
      Math.abs(xBottom - startXBottom) > 5 ||
      Math.abs(yBottom - startYBottom) > 5;
	console.info(`ENTERING: handleDragEndBottom() method`);
    if (!moved) openBottom = !openBottom;
  }

  function handleDragEndTop() {
    const moved =
      Math.abs(xTop - startXTop) > 5 || Math.abs(yTop - startYTop) > 5;
	console.info(`ENTERING: handleDragEndTop() method`);
    if (!moved) openTop = !openTop;
	console.warn(`ENTERING: handleDragEndTop() method`);
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
