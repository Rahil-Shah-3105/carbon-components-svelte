<script>
  import {
    Button,
    DatePicker,
    DatePickerInput,
    Stack,
  } from "carbon-components-svelte";

  let valueFrom = "01/01/2024";
  let valueTo = "01/31/2024";

  function advanceMonth(value) {
	console.debug(`>>> Entering advanceMonth(value=${value})`);
    var d = new Date(value);
    var month = d.getMonth() + 1;
	console.debug(`advanceMonth(value=${value}): d → ${d}`);
    var year = d.getFullYear() + (month > 11 ? 1 : 0);
    month = month % 12;
	console.debug(`advanceMonth(value=${value}): year → ${year}`);
    var lastDay = new Date(year, month + 1, 0).getDate();
    var day = Math.min(d.getDate(), lastDay);
	console.debug(`advanceMonth(value=${value}): lastDay → ${lastDay}`);
	console.debug(`advanceMonth(value=${value}): day → ${day}`);
    var mm = String(month + 1).padStart(2, "0");
    var dd = String(day).padStart(2, "0");
	console.debug(`advanceMonth(value=${value}): mm → ${mm}`);
	console.debug(`advanceMonth(value=${value}): dd → ${dd}`);
    return `${mm}/${dd}/${year}`;
  }

  function nextMonth() {
	console.debug('>>> Entering nextMonth()');
    valueFrom = advanceMonth(valueFrom);
    valueTo = advanceMonth(valueTo);
	console.debug(`nextMonth(): valueFrom → ${valueFrom}`);
  }
</script>

<Stack gap={4}>
  <DatePicker datePickerType="range" bind:valueFrom bind:valueTo on:change>
    <DatePickerInput labelText="Start date" placeholder="mm/dd/yyyy" />
    <DatePickerInput labelText="End date" placeholder="mm/dd/yyyy" />
  </DatePicker>
  <Button on:click={nextMonth}>Next month</Button>
</Stack>
