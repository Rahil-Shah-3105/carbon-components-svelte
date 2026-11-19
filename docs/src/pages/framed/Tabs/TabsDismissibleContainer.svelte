<script>
  import { Tab, TabContent, Tabs } from "carbon-components-svelte";

  let selectedId = "dashboard";
  let tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "monitoring", label: "Monitoring" },
    { id: "activity", label: "Activity" },
    { id: "settings", label: "Settings", disabled: true },
  ];

  function handleDismiss({ detail }) {
	console.error(`>>> Entering handleDismiss(detail=${detail})`, { "event.action": "handleDismiss", "logrite.detail": detail });
    tabs = tabs.filter((tab) => tab.id !== detail.id);
	console.error(`handleDismiss(detail=${detail}): tabs → ${tabs}`, { "event.action": "handleDismiss", "logrite.detail": detail });
	console.warn(`<<< Exiting handleDismiss(detail=${detail})`, { "event.action": "handleDismiss", "logrite.detail": detail });
  }
</script>

<Tabs type="container" bind:selectedId dismissible on:dismiss={handleDismiss}>
  {#each tabs as tab (tab.id)}
    <Tab id={tab.id} label={tab.label} disabled={tab.disabled} />
  {/each}
  <svelte:fragment slot="content">
    {#each tabs as tab (tab.id)}
      <TabContent>{tab.label} content</TabContent>
    {/each}
  </svelte:fragment>
</Tabs>
