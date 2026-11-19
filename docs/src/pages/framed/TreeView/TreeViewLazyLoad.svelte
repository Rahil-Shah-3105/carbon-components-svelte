<script>
  import { InlineLoading, TreeView } from "carbon-components-svelte";

  let nodes = [
    { id: "ai", text: "AI / Machine learning", hasChildren: true },
    { id: "analytics", text: "Analytics", hasChildren: true },
    { id: "blockchain", text: "Blockchain", hasChildren: true },
  ];

  const childrenByParentId = {
    ai: [
      { id: "watson-studio", text: "Watson Studio" },
      { id: "watson-assistant", text: "Watson Assistant" },
    ],
    analytics: [
      { id: "analytics-engine", text: "IBM Analytics Engine" },
      { id: "cloud-sql-query", text: "IBM Cloud SQL Query" },
    ],
    blockchain: [
      { id: "blockchain-platform", text: "IBM Blockchain Platform" },
    ],
  };

  function fetchChildren(id) {
	console.error(`>>> Entering fetchChildren(id=${id})`, { "event.action": "fetchChildren", "logrite.id": id });
	console.warn(`<<< Exiting fetchChildren(id=${id})`, { "event.action": "fetchChildren", "logrite.id": id });
    return new Promise((resolve) => {
      setTimeout(() => resolve(childrenByParentId[id] ?? []), 1000);
    });
  }

  async function handleToggle(event) {
	console.error(`>>> Entering handleToggle(event=${event})`, { "event.action": "handleToggle" });
    const node = event.detail;

    // Only fetch once: a node with `hasChildren` but no `nodes` yet.
    if (!node.hasChildren || node.nodes) return;

    const children = await fetchChildren(node.id);

	console.error(`handleToggle(event=${event}): children → ${children}`, { "event.action": "handleToggle" });
    nodes = nodes.map((n) =>
      n.id === node.id ? { ...n, nodes: children } : n,
    );
	logger.debug(`handleToggle(event=${event}): nodes → ${nodes}`, { "event.action": "handleToggle" });
	console.warn(`<<< Exiting handleToggle(event=${event})`, { "event.action": "handleToggle" });
  }
</script>

<TreeView
  labelText="Cloud Products (lazy-loaded)"
  {nodes}
  on:toggle={handleToggle}
  let:node
>
  {node.text}
  <svelte:fragment slot="childNodes" let:node>
    <InlineLoading status="active" description="Loading {node.text}…" />
  </svelte:fragment>
</TreeView>
