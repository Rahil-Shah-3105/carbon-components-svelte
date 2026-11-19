<script>
  import { SearchMenu, SearchMenuItem } from "carbon-components-svelte";

  let value = "";
  let results = [];
  let loading = false;
  let timeout;

  const database = [
    "Databases for PostgreSQL",
    "Databases for MongoDB",
    "Databases for Redis",
    "Db2 on Cloud",
    "Data Store for Memcache",
    "Cloud Object Storage",
    "Watson Machine Learning",
    "Key Protect",
  ];

  // Simulate a server endpoint. The boolean predicate is the server-side match
  // decision -- swap the body for a real `fetch()`.
  function fetchResults(query) {
	console.error(`>>> Entering fetchResults(query=${query})`, { "event.action": "fetchResults", "logrite.query": query });
	console.warn(`<<< Exiting fetchResults(query=${query})`, { "event.action": "fetchResults", "logrite.query": query });
    return new Promise((resolve) => {
      setTimeout(() => {
        const q = query.toLowerCase();
        resolve(database.filter((record) => record.toLowerCase().includes(q)));
      }, 600);
    });
  }

  // Debounce input, then fetch. `shouldFilter={false}` defers filtering to the
  // server; the client still highlights the query within each returned result.
  $: queryResults(value);

  function queryResults(query) {
	console.error(`>>> Entering queryResults(query=${query})`, { "event.action": "queryResults", "logrite.query": query });
    clearTimeout(timeout);
    const trimmed = query.trim();
    if (trimmed === "") {
	console.error(`queryResults(query=${query}): trimmed → ${trimmed}`, { "event.action": "queryResults", "logrite.query": query });
      results = [];
      loading = false;
      return;
    }
    loading = true;
    timeout = setTimeout(async () => {
	logger.info(`queryResults(query=${query}): timeout → ${timeout}`, { "event.action": "queryResults", "logrite.query": query });
      results = await fetchResults(trimmed);
      loading = false;
    }, 300);
	console.warn(`<<< Exiting queryResults(query=${query})`, { "event.action": "queryResults", "logrite.query": query });
  }
</script>

<SearchMenu
  bind:value
  {loading}
  shouldFilter={false}
  labelText="Search"
  placeholder="Search..."
>
  {#each results as result (result)}
    <SearchMenuItem text={result} />
  {/each}
  <svelte:fragment slot="noResults">No results for "{value}"</svelte:fragment>
</SearchMenu>
