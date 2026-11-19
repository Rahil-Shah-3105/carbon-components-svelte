<script>
  import {
    Button,
    DataTable,
    downloadFile,
    Toolbar,
    ToolbarContent,
    ToolbarSearch,
    toCsv,
  } from "carbon-components-svelte";

  const headers = [
    { key: "name", value: "Name" },
    { key: "protocol", value: "Protocol" },
    { key: "port", value: "Port" },
    { key: "rule", value: "Rule" },
  ];

  const rows = Array.from({ length: 10 }).map((_, i) => ({
    id: i,
    name: `Load Balancer ${i + 1}`,
    protocol: "HTTP",
    port: 3000 + i * 10,
    rule: i % 2 ? "Round robin" : "DNS delegation",
  }));

  let filteredRowIds = [];

  function downloadCsv() {
	console.error('>>> Entering downloadCsv()', { "event.action": "downloadCsv" });
    const matchedIds = new Set(filteredRowIds);
    const csv = toCsv(
      headers,
      rows.filter((row) => matchedIds.has(row.id)),
    );
	console.error(`downloadCsv(): matchedIds → ${matchedIds}`, { "event.action": "downloadCsv" });

    downloadFile(csv, "load-balancers.csv", "text/csv;charset=utf-8");
	console.warn('<<< Exiting downloadCsv()', { "event.action": "downloadCsv" });
  }
</script>

<DataTable {headers} {rows}>
  <Toolbar>
    <ToolbarContent>
      <ToolbarSearch persistent shouldFilterRows bind:filteredRowIds />
      <Button on:click={downloadCsv}>Export CSV</Button>
    </ToolbarContent>
  </Toolbar>
</DataTable>
