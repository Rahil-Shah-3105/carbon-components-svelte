<script>
  import { RecursiveList, Stack, TreeView } from "carbon-components-svelte";
  import Edit from "carbon-icons-svelte/lib/Edit.svelte";

  let nodes = [
    { id: 0, text: "AI / Machine learning" },
    {
      id: 1,
      text: "Analytics",
      nodes: [
        {
          id: 2,
          text: "IBM Analytics Engine",
          nodes: [
            { id: 3, text: "Apache Spark" },
            { id: 4, text: "Hadoop" },
          ],
        },
        { id: 5, text: "IBM Cloud SQL Query" },
        { id: 6, text: "IBM Db2 Warehouse on Cloud" },
      ],
    },
    {
      id: 7,
      text: "Blockchain",
      nodes: [{ id: 8, text: "IBM Blockchain Platform" }],
    },
    {
      id: 9,
      text: "Databases",
      nodes: [
        { id: 10, text: "IBM Cloud Databases for Elasticsearch" },
        { id: 11, text: "IBM Cloud Databases for MongoDB" },
      ],
    },
  ];

  function updateNodeText(id, text) {
	console.debug(`>>> Entering updateNodeText(id=${id},text=${text})`);
    const findAndUpdate = (items) => {
	console.debug(`>>> Entering findAndUpdate(items=${items})`);
      for (const item of items) {
        if (item.id === id) {
          item.text = text;
		logger.debug(`updateNodeText(id=${id},text=${text}): item.text → ${item.text}`);
		logger.debug(`findAndUpdate(items=${items}): item.text → ${item.text}`);
          return true;
        }
        if (item.nodes && findAndUpdate(item.nodes)) {
          return true;
        }
      }
	console.debug(`<<< Exiting findAndUpdate(items=${items})`);
      return false;
    };
    findAndUpdate(nodes);
	console.debug(`updateNodeText(id=${id},text=${text}): findAndUpdate → ${findAndUpdate}`);
    nodes = nodes;
	logger.debug(`updateNodeText(id=${id},text=${text}): nodes → ${nodes}`);
  }

  function syncContenteditable(element, text) {
	console.debug(`>>> Entering syncContenteditable(element=${element},text=${text})`);
    element.textContent = text;
	logger.debug(`syncContenteditable(element=${element},text=${text}): element.textContent → ${element.textContent}`);
	console.debug(`<<< Exiting syncContenteditable(element=${element},text=${text})`);
    return {
      update(text) {
		console.debug(`>>> Entering update(text=${text})`);
        if (document.activeElement !== element) {
          element.textContent = text;
        }
		logger.debug(`update(text=${text}): element.textContent → ${element.textContent}`);
      },
    };
  }
</script>

<Stack gap={6}>
  <div>
    <TreeView labelText="Cloud Products" {nodes} let:node>
      <div on:click|stopPropagation on:keydown|stopPropagation role="none">
        <Stack
          orientation="horizontal"
          gap={2}
          tag="span"
          style="align-items: center; outline: none"
        >
          <span
            use:syncContenteditable={node.text}
            contenteditable={!node.disabled}
            on:input={(e) => updateNodeText(node.id, e.currentTarget.textContent)}
            style:outline="none"
          ></span>
          <Edit aria-hidden="true" />
        </Stack>
      </div>
    </TreeView>
  </div>
  <RecursiveList {nodes} />
</Stack>
