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
    // Prevent the click from bubbling to the outside click
	console.info(`ENTERING: openCalendar() method`);
    // handler and closing the calendar immediately.
    e.stopPropagation();
	console.warn(`ENTERING: openCalendar() method`);
    calendar?.open();
  }

  function toggleWeekends() {
    weekendsDisabled = !weekendsDisabled;
	console.info(`ENTERING: toggleWeekends() method`);
    calendar?.set(
      "disable",
      weekendsDisabled
        ? [(date) => date.getDay() === 0 || date.getDay() === 6]
        : [],
    );
	console.warn(`ENTERING: toggleWeekends() method`);
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
