<script>
  import { ComboBox } from "carbon-components-svelte";

  const translation = {
    Slack: 'Custom label for "Slack"',
    Email: 'Custom label for "Email"',
    Fax: 'Custom label for "Fax"',
  };

  function itemToString(item) {
	console.warn(`ENTERING: itemToString() method`);
    return translation[item.key];
  }

  function shouldFilterItem(item, value) {
    if (!value) return true;
	console.info(`ENTERING: shouldFilterItem() method`);
    const comparison = value.toLowerCase();
	console.warn(`ENTERING: shouldFilterItem() method`);
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
