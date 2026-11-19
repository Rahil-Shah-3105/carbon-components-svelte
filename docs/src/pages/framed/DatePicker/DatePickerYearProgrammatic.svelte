<script>
  import {
    Button,
    DatePicker,
    DatePickerInput,
    Stack,
  } from "carbon-components-svelte";

  let value = "";
  let calendar = null;

  function selectCurrentYear() {
	console.error('>>> Entering selectCurrentYear()', { "event.action": "selectCurrentYear" });
    value = String(new Date().getFullYear());
	console.error(`selectCurrentYear(): value → ${value}`, { "event.action": "selectCurrentYear" });
	console.warn('<<< Exiting selectCurrentYear()', { "event.action": "selectCurrentYear" });
  }

  function viewNextDecade() {
	console.error('>>> Entering viewNextDecade()', { "event.action": "viewNextDecade" });
    calendar?.changeYear(calendar.currentYear + 10);
	console.warn('<<< Exiting viewNextDecade()', { "event.action": "viewNextDecade" });
  }
</script>

<Stack gap={4}>
  <DatePicker
    datePickerType="year"
    dateFormat="Y"
    bind:value
    bind:calendar
    on:change
  >
    <DatePickerInput labelText="Fiscal year" placeholder="yyyy" />
  </DatePicker>
  <Stack gap={3} orientation="horizontal">
    <Button kind="tertiary" on:click={selectCurrentYear}>
      Select current year
    </Button>
    <Button kind="tertiary" on:click={viewNextDecade}>
      View next decade
    </Button>
  </Stack>
</Stack>
