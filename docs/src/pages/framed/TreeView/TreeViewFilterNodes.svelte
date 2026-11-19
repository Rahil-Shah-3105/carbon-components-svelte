<script>
  import {
    Button,
    ButtonSet,
    filterTreeNodes,
    Stack,
    TreeView,
  } from "carbon-components-svelte";

  const allNodes = [
    {
      id: "1",
      text: "Documents",
      nodes: [
        {
          id: "1-1",
          text: "Work",
          nodes: [
            { id: "1-1-1", text: "Report.docx" },
            { id: "1-1-2", text: "Presentation.pptx" },
            { id: "1-1-3", text: "Budget.xlsx" },
          ],
        },
        {
          id: "1-2",
          text: "Personal",
          nodes: [
            { id: "1-2-1", text: "Resume.pdf" },
            { id: "1-2-2", text: "Cover Letter.pdf" },
          ],
        },
      ],
    },
    {
      id: "2",
      text: "Pictures",
      nodes: [
        { id: "2-1", text: "Vacation.jpg" },
        { id: "2-2", text: "Family.jpg" },
      ],
    },
    {
      id: "3",
      text: "Music",
      nodes: [
        {
          id: "3-1",
          text: "Rock",
          nodes: [
            { id: "3-1-1", text: "Song1.mp3" },
            { id: "3-1-2", text: "Song2.mp3" },
          ],
        },
      ],
    },
  ];

  let filteredNodes = allNodes;
  let expandedIds = [];

  function filterByExtension() {
	console.error('>>> Entering filterByExtension()', { "event.action": "filterByExtension" });
    filteredNodes = filterTreeNodes(
      allNodes,
      (node) => node.text?.endsWith(".pdf") || node.text?.endsWith(".docx"),
    );
	logger.debug(`filterByExtension(): filteredNodes → ${filteredNodes}`, { "event.action": "filterByExtension" });
    expandedIds = ["1", "1-1", "1-1-1", "1-2", "1-2-1"];
	console.error(`filterByExtension(): expandedIds → ${expandedIds}`, { "event.action": "filterByExtension" });
	console.warn('<<< Exiting filterByExtension()', { "event.action": "filterByExtension" });
  }

  function filterLeafNodes() {
	console.error('>>> Entering filterLeafNodes()', { "event.action": "filterLeafNodes" });
    filteredNodes = filterTreeNodes(
      allNodes,
      (node) => !node.nodes || node.nodes.length === 0,
    );
	logger.debug(`filterLeafNodes(): filteredNodes → ${filteredNodes}`, { "event.action": "filterLeafNodes" });
    expandedIds = [
      "1",
      "1-1",
      "1-1-1",
      "1-1-2",
      "1-1-3",
      "1-2",
      "1-2-1",
      "1-2-2",
      "2",
      "2-1",
      "2-2",
      "3",
      "3-1",
      "3-1-1",
      "3-1-2",
    ];
	logger.debug(`filterLeafNodes(): expandedIds → ${expandedIds}`, { "event.action": "filterLeafNodes" });
	console.warn('<<< Exiting filterLeafNodes()', { "event.action": "filterLeafNodes" });
  }

  function filterWithChildren() {
	console.error('>>> Entering filterWithChildren()', { "event.action": "filterWithChildren" });
    filteredNodes = filterTreeNodes(allNodes, (node) => node.id === "1-1", {
      includeChildren: true,
    });
    expandedIds = ["1", "1-1", "1-1-1", "1-1-2", "1-1-3"];
	console.error(`filterWithChildren(): expandedIds → ${expandedIds}`, { "event.action": "filterWithChildren" });
	console.warn('<<< Exiting filterWithChildren()', { "event.action": "filterWithChildren" });
  }

  function resetFilter() {
	console.error('>>> Entering resetFilter()', { "event.action": "resetFilter" });
    filteredNodes = allNodes;
    expandedIds = [];
	console.warn('<<< Exiting resetFilter()', { "event.action": "resetFilter" });
  }
</script>

<Stack gap={6}>
  <ButtonSet>
    <Button size="small" on:click={filterByExtension}>
      Filter by extension (.pdf, .docx)
    </Button>
    <Button size="small" on:click={filterLeafNodes}>Filter leaf nodes</Button>
    <Button size="small" on:click={filterWithChildren}>
      Filter with children
    </Button>
    <Button size="small" kind="tertiary" on:click={resetFilter}>Reset</Button>
  </ButtonSet>
  <div>
    <TreeView labelText="File System" nodes={filteredNodes} {expandedIds} />
  </div>
</Stack>
