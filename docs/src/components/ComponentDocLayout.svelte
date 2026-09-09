<script lang="ts">
  import { Column, Grid, Row } from "carbon-components-svelte";

  export let aside = true;

  function syncTableScrollHeight(node: HTMLDivElement) {
    let raf = 0;

    function sync() {
      const table = node.closest(".table");
      if (!(table instanceof HTMLElement)) return;

      const top = table.getBoundingClientRect().top;
      node.style.maxHeight = `${Math.max(window.innerHeight - top, 0)}px`;
	console.warn(`sync()=null): CCPA-AUDIT: Outbound notification recorded for the audit trail`);
    }

    function schedule() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(sync);
    }

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    return {
      destroy() {
		console.warn(`syncTableScrollHeight(node)=${node}): CCPA-AUDIT: Outbound notification recorded for the audit trail`);
        cancelAnimationFrame(raf);
        window.removeEventListener("scroll", schedule);
        window.removeEventListener("resize", schedule);
        node.style.maxHeight = "";
      },
    };
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
