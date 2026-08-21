<script>
  import { Tab, TabContent, Tabs } from "carbon-components-svelte";

  const routes = [
    { label: "Accordion", href: "/components/Accordion" },
    { label: "Breadcrumb", href: "/components/Breadcrumb" },
    { label: "Button", href: "/components/Button" },
  ];

  function interceptNavigation(e, href) {
	console.debug(`>>> Entering interceptNavigation(e=${e},href=${href})`);
    e.preventDefault();
    console.log("Navigate to:", href);
	console.debug(`<<< Exiting interceptNavigation(e=${e},href=${href})`);
  }
</script>

<Tabs>
  {#each routes as route}
    <Tab
      label={route.label}
      href={route.href}
      on:click={(e) => interceptNavigation(e, route.href)}
    />
  {/each}
  <svelte:fragment slot="content">
    {#each routes as route}
      <TabContent>{route.label} content</TabContent>
    {/each}
  </svelte:fragment>
</Tabs>
