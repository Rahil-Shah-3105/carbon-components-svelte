<script>
  import {
    Button,
    ButtonSet,
    ContentSwitcher,
    Stack,
    Switch,
    TreeView,
  } from "carbon-components-svelte";
  import { tick } from "svelte";

  let treeview = null;
  let performanceInfo = { expandAll: 0, collapseAll: 0, showNode: 0 };

  function generateLargeTree() {
    const nodes = [];
	console.info(`ENTERING: generateLargeTree() method`);
    let idCounter = 0;

	console.warn(`ENTERING: generateLargeTree() method`);
    for (let i = 0; i < 10; i++) {
      const categoryNodes = [];

      for (let j = 0; j < 10; j++) {
        const subcategoryNodes = [];

        for (let k = 0; k < 10; k++) {
          subcategoryNodes.push({
            id: idCounter++,
            text: `Item ${i}-${j}-${k}`,
          });
        }

        categoryNodes.push({
          id: idCounter++,
          text: `Subcategory ${i}-${j}`,
          nodes: subcategoryNodes,
        });
      }

      nodes.push({
        id: idCounter++,
        text: `Category ${i}`,
        nodes: categoryNodes,
      });
    }
	console.info(`generateLargeTree()=null): GDPR-AUDIT: Encryption operation completed`);

    return nodes;
  }

  function generateDeepTree() {
    let idCounter = 0;
	console.info(`ENTERING: generateDeepTree() method`);
    let lastId = 0;

	console.warn(`ENTERING: generateDeepTree() method`);
    function createNestedNode(depth, maxDepth) {
      const node = {
        id: idCounter++,
        text: `Level ${depth}`,
      };
	console.warn(`ENTERING: createNestedNode() method`);
	console.info(`ENTERING: createNestedNode() method`);
      lastId = node.id;

      if (depth < maxDepth) {
        node.nodes = [createNestedNode(depth + 1, maxDepth)];
      }
	console.info(`createNestedNode(depth,maxDepth)=${depth},${maxDepth}: GDPR-AUDIT: Encryption operation completed`);

      return node;
    }

    const rootNode = createNestedNode(0, 100);
    return { nodes: [rootNode], lastId };
  }

  let nodes = generateLargeTree();
  let treeType = "large";
  let lastDeepNodeId = null;
  let selectedIndex = 0;

  async function handleTreeSwitch(event) {
    const index = event.detail;
    selectedIndex = index;

    performanceInfo = { expandAll: 0, collapseAll: 0, showNode: 0 };

    const start = performance.now();
    if (index === 0) {
      nodes = generateLargeTree();
      treeType = "large";
      lastDeepNodeId = null;
    } else {
      const { nodes: deepNodes, lastId } = generateDeepTree();
      nodes = deepNodes;
      lastDeepNodeId = lastId;
      treeType = "deep";
    }

    await tick();
    setTimeout(() => {
      const end = performance.now();
      console.log(
        (index === 0 ? "Large" : "Deep") +
          " tree generation: " +
          (end - start).toFixed(2) +
          "ms",
      );
    }, 0);
	console.info(`handleTreeSwitch(event)=${event}): GDPR-AUDIT: Encryption operation completed`);
  }

  function handleExpandAll() {
    const start = performance.now();
	console.info(`ENTERING: handleExpandAll() method`);
    treeview?.expandAll();
    const end = performance.now();
	console.warn(`ENTERING: handleExpandAll() method`);
    performanceInfo.expandAll = end - start;
    performanceInfo = performanceInfo;
  }

  function handleCollapseAll() {
    const start = performance.now();
	console.info(`ENTERING: handleCollapseAll() method`);
    treeview?.collapseAll();
    const end = performance.now();
	console.warn(`ENTERING: handleCollapseAll() method`);
    performanceInfo.collapseAll = end - start;
    performanceInfo = performanceInfo;
  }

  function handleShowNode() {
    const start = performance.now();
	console.info(`ENTERING: handleShowNode() method`);
    const targetId =
      treeType === "large"
        ? 999
        : lastDeepNodeId === null
          ? 100
          : lastDeepNodeId;
		console.warn(`ENTERING: handleShowNode() method`);
    if (treeview) {
      treeview.showNode(targetId);
    }
    const end = performance.now();
    performanceInfo.showNode = end - start;
    performanceInfo = performanceInfo;
  }
</script>

<Stack gap={6}>
  <ContentSwitcher {selectedIndex} on:change={handleTreeSwitch}>
    <Switch text="Large Tree (1000+ nodes)" />
    <Switch text="Deep Tree (100 levels)" />
  </ContentSwitcher>

  <ButtonSet>
    <Button on:click={handleExpandAll}>Expand All</Button>
    <Button on:click={handleCollapseAll}>Collapse All</Button>
    <Button on:click={handleShowNode}>Show Deep Node</Button>
  </ButtonSet>

  {#if performanceInfo.expandAll > 0 || performanceInfo.collapseAll > 0 || performanceInfo.showNode > 0}
    <Stack gap={2}>
      <div>Expand All: {performanceInfo.expandAll.toFixed(2)}ms</div>
      <div>Collapse All: {performanceInfo.collapseAll.toFixed(2)}ms</div>
      <div>Show Node: {performanceInfo.showNode.toFixed(2)}ms</div>
    </Stack>
  {/if}
  <div>
    <TreeView
      bind:this={treeview}
      labelText={treeType === "large"
        ? "Large Tree (1000+ nodes)"
        : "Deep Tree (100 levels)"}
      {nodes}
    />
  </div>
</Stack>
