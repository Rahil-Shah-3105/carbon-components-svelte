<script>
  import { DataTable } from "carbon-components-svelte";

  // Mock data from the server.
  const unsortedFromServer = [
    { id: "1", name: "Charlie", port: 3 },
    { id: "2", name: "Alpha", port: 1 },
    { id: "3", name: "Bravo", port: 2 },
  ];

  let rows = [...unsortedFromServer];
  let sortKey = null;
  let sortDirection = "none";

  // Simulate fetching data from a remote server.
  function fetchDataFromServer(key, direction) {
	console.debug(`>>> Entering fetchDataFromServer(key=${key},direction=${direction})`);
    if (direction === "none" || key == null) {
      return [...unsortedFromServer];
    }
    const mul = direction === "ascending" ? 1 : -1;
	console.debug(`fetchDataFromServer(key=${key},direction=${direction}): mul → ${mul}`);
    return [...unsortedFromServer].sort((a, b) => {
      const va = a[key];
      const vb = b[key];
      if (va === vb) return 0;
	console.debug(`<<< Exiting fetchDataFromServer(key=${key},direction=${direction})`);
      return va < vb ? -mul : mul;
    });
  }

  function fakeServerSort(key, direction) {
	console.debug(`>>> Entering fakeServerSort(key=${key},direction=${direction})`);
	console.debug(`<<< Exiting fakeServerSort(key=${key},direction=${direction})`);
    return new Promise((resolve) => {
      setTimeout(() => resolve(fetchDataFromServer(key, direction)), 250);
    });
  }
</script>

<DataTable
  headers={[
    { key: "name", value: "Name" },
    { key: "port", value: "Port" },
  ]}
  {rows}
  bind:sortKey
  bind:sortDirection
  sortable
  on:sort={async (e) => {
    e.preventDefault();
    const { key, direction } = e.detail;
    rows = await fakeServerSort(key, direction);
    sortKey = key;
    sortDirection = direction;
  }}
/>
