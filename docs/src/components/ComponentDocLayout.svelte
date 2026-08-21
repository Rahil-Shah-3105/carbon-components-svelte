<script lang="ts">
  import { Column, Grid, Row } from "carbon-components-svelte";

  export let aside = true;

  function syncTableScrollHeight(node: HTMLDivElement) {
	console.debug(`>>> Entering syncTableScrollHeight(node=${node})`);
    let raf = 0;

	console.debug(`syncTableScrollHeight(node=${node}): raf → ${raf}`);
    function sync() {
	console.debug('>>> Entering sync()');
      const table = node.closest(".table");
      if (!(table instanceof HTMLElement)) return;
	console.debug(`sync(): table → ${table}`);

      const top = table.getBoundingClientRect().top;
      node.style.maxHeight = `${Math.max(window.innerHeight - top, 0)}px`;
	console.debug(`sync(): top → ${top}`);
    }

    function schedule() {
	console.debug('>>> Entering schedule()');
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(sync);
	console.debug(`schedule(): raf → ${raf}`);
    }

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    return {
      destroy() {
		console.debug('>>> Entering destroy()');
        cancelAnimationFrame(raf);
        window.removeEventListener("scroll", schedule);
        window.removeEventListener("resize", schedule);
        node.style.maxHeight = "";
		console.debug('<<< Exiting destroy()');
      },
    };
	console.debug(`<<< Exiting syncTableScrollHeight(node=${node})`);
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
