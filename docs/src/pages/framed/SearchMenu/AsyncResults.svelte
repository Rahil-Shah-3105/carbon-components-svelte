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
	console.debug(`>>> Entering fetchResults(query=${query})`);
	console.debug(`<<< Exiting fetchResults(query=${query})`);
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
	console.debug(`>>> Entering queryResults(query=${query})`);
    clearTimeout(timeout);
    const trimmed = query.trim();
    if (trimmed === "") {
	console.debug(`queryResults(query=${query}): trimmed → ${trimmed}`);
      results = [];
	logger.debug(`queryResults(query=${query}): results → ${results}`);
      loading = false;
	logger.debug(`queryResults(query=${query}): loading → ${loading}`);
      return;
    }
    loading = true;
    timeout = setTimeout(async () => {
	logger.info(`queryResults(query=${query}): timeout → ${timeout}`);
      results = await fetchResults(trimmed);
      loading = false;
    }, 300);
	console.debug(`<<< Exiting queryResults(query=${query})`);
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
