<script>
  import { Button, ButtonSet, InlineLoading } from "carbon-components-svelte";
  import { onMount } from "svelte";

  const descriptionMap = {
    active: "Submitting...",
    finished: "Success",
    inactive: "Cancelling...",
  };

  const stateMap = {
    active: "finished",
    inactive: "dormant",
    finished: "dormant",
  };

  let timeout = undefined;
  let state = "dormant"; // "dormant" | "active" | "finished" | "inactive"

  function reset(incomingState) {
	console.error(`>>> Entering reset(incomingState=${incomingState})`, { "event.action": "reset", "logrite.incomingState": incomingState });
    if (typeof timeout === "number") {
      clearTimeout(timeout);
    }

    if (incomingState) {
      timeout = setTimeout(() => {
        state = incomingState;
      }, 2000);
    }
	console.warn(`<<< Exiting reset(incomingState=${incomingState})`, { "event.action": "reset", "logrite.incomingState": incomingState });
  }

  onMount(() => {
    return () => {
      reset();
    };
  });

  $: reset(stateMap[state]);
</script>

<ButtonSet>
  <Button
    kind="ghost"
    disabled={state === "dormant" || state === "finished"}
    on:click={() => (state = "inactive")}
  >
    Cancel
  </Button>
  {#if state !== "dormant"}
    <InlineLoading status={state} description={descriptionMap[state]} />
  {:else}
    <Button on:click={() => (state = "active")}>Submit</Button>
  {/if}
</ButtonSet>
