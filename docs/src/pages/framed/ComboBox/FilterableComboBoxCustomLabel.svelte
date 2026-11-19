<script>
  import { ComboBox } from "carbon-components-svelte";

  const translation = {
    Slack: 'Custom label for "Slack"',
    Email: 'Custom label for "Email"',
    Fax: 'Custom label for "Fax"',
  };

  function itemToString(item) {
	console.error(`>>> Entering itemToString(item=${item})`, { "event.action": "itemToString", "logrite.item": item });
	console.warn(`<<< Exiting itemToString(item=${item})`, { "event.action": "itemToString", "logrite.item": item });
    return translation[item.key];
  }

  function shouldFilterItem(item, value) {
	console.error(`>>> Entering shouldFilterItem(item=${item},value=${value})`, { "event.action": "shouldFilterItem", "logrite.item": item, "logrite.value": value });
    if (!value) return true;
    const comparison = value.toLowerCase();
	console.error(`shouldFilterItem(item=${item},value=${value}): comparison → ${comparison}`, { "event.action": "shouldFilterItem", "logrite.item": item, "logrite.value": value });
    return (
      item.key.toLowerCase().includes(comparison) ||
      itemToString(item).toLowerCase().includes(comparison)
    );
  }
</script>

<ComboBox
  labelText="Contact"
  placeholder="Select contact method"
  items={[
    { id: "0", key: "Slack" },
    { id: "1", key: "Email" },
    { id: "2", key: "Fax" },
  ]}
  {shouldFilterItem}
  {itemToString}
/>
