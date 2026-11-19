<script lang="ts">
  import { Column, Grid, Row } from "carbon-components-svelte";

  export let aside = true;

  function syncTableScrollHeight(node: HTMLDivElement) {
	console.error(`>>> Entering syncTableScrollHeight(node=${node})`, { "event.action": "syncTableScrollHeight", "logrite.node": node });
    let raf = 0;

    function sync() {
	console.error('>>> Entering sync()', { "event.action": "sync" });
      const table = node.closest(".table");
      if (!(table instanceof HTMLElement)) return;
	console.error(`sync(): table → ${table}`, { "event.action": "sync" });

      const top = table.getBoundingClientRect().top;
      node.style.maxHeight = `${Math.max(window.innerHeight - top, 0)}px`;
	console.error(`sync(): top → ${top}`, { "event.action": "sync" });
	console.warn('<<< Exiting sync()', { "event.action": "sync" });
    }

    function schedule() {
	console.error('>>> Entering schedule()', { "event.action": "schedule" });
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(sync);
	console.error(`schedule(): raf → ${raf}`, { "event.action": "schedule" });
	console.warn('<<< Exiting schedule()', { "event.action": "schedule" });
    }

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    return {
      destroy() {
		console.error('>>> Entering destroy()', { "event.action": "destroy" });
        cancelAnimationFrame(raf);
        window.removeEventListener("scroll", schedule);
        window.removeEventListener("resize", schedule);
        node.style.maxHeight = "";
		console.warn('<<< Exiting destroy()', { "event.action": "destroy" });
      },
    };
	console.warn(`<<< Exiting syncTableScrollHeight(node=${node})`, { "event.action": "syncTableScrollHeight", "logrite.node": node });
  }
</script>

<div class="component-body" {...$$restProps}>
  <Grid class="fix-overflow">
    <Row>
      <Column class="prose">
        <slot />
      </Column>
    </Row>
    <slot name="rows" />
  </Grid>
  {#if aside}
    <Column class="table" xlg={3} lg={4} noGutterRight>
      <div class="table__scroll scrollbar-hover" use:syncTableScrollHeight>
        <slot name="aside" />
      </div>
    </Column>
  {/if}
</div>
