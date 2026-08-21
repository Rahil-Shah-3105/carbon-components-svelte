<script>
  import {
    Button,
    DatePicker,
    DatePickerInput,
    Stack,
  } from "carbon-components-svelte";

  let calendar = null;
  let weekendsDisabled = false;

  function openCalendar(e) {
	console.debug(`>>> Entering openCalendar(e=${e})`);
    // Prevent the click from bubbling to the outside click
    // handler and closing the calendar immediately.
    e.stopPropagation();
    calendar?.open();
	console.debug(`<<< Exiting openCalendar(e=${e})`);
  }

  function toggleWeekends() {
	console.debug('>>> Entering toggleWeekends()');
    weekendsDisabled = !weekendsDisabled;
    calendar?.set(
      "disable",
      weekendsDisabled
        ? [(date) => date.getDay() === 0 || date.getDay() === 6]
        : [],
    );
	logger.debug(`toggleWeekends(): weekendsDisabled → ${weekendsDisabled}`);
  }
</script>

<Stack gap={4}>
  <DatePicker datePickerType="single" bind:calendar on:change>
    <DatePickerInput labelText="Appointment" placeholder="mm/dd/yyyy" />
  </DatePicker>
  <Stack gap={3} orientation="horizontal">
    <Button kind="tertiary" on:click={openCalendar}>Open calendar</Button>
    <Button kind="tertiary" on:click={toggleWeekends}>
      {weekendsDisabled ? "Enable" : "Disable"}
      weekends
    </Button>
  </Stack>
</Stack>
