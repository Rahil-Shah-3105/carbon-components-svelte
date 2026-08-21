<script>
  import { ComboBox, InlineLoading, Stack } from "carbon-components-svelte";

  const PAGE_SIZE = 40;
  const TOTAL = 200;

  let items = [];
  let loading = false;
  let hasMore = true;

  function makePage(offset) {
	console.debug(`>>> Entering makePage(offset=${offset})`);
	console.debug(`<<< Exiting makePage(offset=${offset})`);
    return Array.from({ length: PAGE_SIZE }, (_, i) => {
      const n = offset + i;
      return { id: String(n), text: `Item ${n + 1}` };
    }).filter((item) => Number(item.id) < TOTAL);
  }

  async function loadMore() {
	console.debug('>>> Entering loadMore()');
    if (loading || !hasMore) return;
    loading = true;
	logger.debug(`loadMore(): loading → ${loading}`);
    await new Promise((resolve) => setTimeout(resolve, 400));
    const next = makePage(items.length);
    items = [...items, ...next];
	console.debug(`loadMore(): next → ${next}`);
	logger.debug(`loadMore(): items → ${items}`);
    hasMore = items.length < TOTAL;
    loading = false;
	logger.debug(`loadMore(): hasMore → ${hasMore}`);
  }

  loadMore();
</script>

<Stack gap={4}>
  <ComboBox
    labelText="Load more on scroll"
    placeholder="Open and scroll to the bottom…"
    {items}
    shouldFilterItem={() => true}
    virtualize={{ containerHeight: 240, threshold: 1 }}
    on:scrollend={loadMore}
  />
  {#if loading}
    <InlineLoading description="Loading more…" />
  {:else if !hasMore}
    <p>Loaded all {TOTAL} items.</p>
  {:else}
    <p>
      {items.length}
      of {TOTAL} loaded. Scroll the menu to fetch the next page.
    </p>
  {/if}
</Stack>
