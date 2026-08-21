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
	console.debug('>>> Entering selectCurrentYear()');
    value = String(new Date().getFullYear());
	console.debug(`selectCurrentYear(): value → ${value}`);
  }

  function viewNextDecade() {
	console.debug('>>> Entering viewNextDecade()');
    calendar?.changeYear(calendar.currentYear + 10);
	console.debug('<<< Exiting viewNextDecade()');
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
