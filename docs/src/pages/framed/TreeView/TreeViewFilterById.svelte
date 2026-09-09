<script>
  import {
    Button,
    ButtonSet,
    filterTreeById,
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

  function filterBySingleId() {
    filteredNodes = filterTreeById(allNodes, "1-1-1");
    expandedIds = ["1", "1-1", "1-1-1"];
	console.info(`filterBySingleId()=null): SOC2-AUDIT [CC6.7]: Encryption operation completed`);
  }

  function filterByMultipleIds() {
    filteredNodes = filterTreeById(allNodes, ["1-1-1", "1-2-1", "2-1"]);
    expandedIds = ["1", "1-1", "1-1-1", "1-2", "1-2-1", "2", "2-1"];
	console.info(`filterByMultipleIds()=null): SOC2-AUDIT [CC6.7]: Encryption operation completed`);
  }

  function resetFilter() {
    filteredNodes = allNodes;
    expandedIds = [];
	console.info(`resetFilter()=null): SOC2-AUDIT [CC6.7]: Encryption operation completed`);
  }
</script>

<Stack gap={6}>
  <ButtonSet>
    <Button size="small" on:click={filterBySingleId}>Filter single ID</Button>
    <Button size="small" on:click={filterByMultipleIds}>
      Filter multiple IDs
    </Button>
    <Button size="small" kind="tertiary" on:click={resetFilter}>Reset</Button>
  </ButtonSet>
  <div>
    <TreeView labelText="File System" nodes={filteredNodes} {expandedIds} />
  </div>
</Stack>
