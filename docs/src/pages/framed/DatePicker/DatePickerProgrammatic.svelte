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
	console.error(`>>> Entering advanceMonth(value=${value})`, { "event.action": "advanceMonth", "logrite.value": value });
    var d = new Date(value);
    var month = d.getMonth() + 1;
	console.error(`advanceMonth(value=${value}): d → ${d}`, { "event.action": "advanceMonth", "logrite.value": value });
    var year = d.getFullYear() + (month > 11 ? 1 : 0);
    month = month % 12;
	console.error(`advanceMonth(value=${value}): year → ${year}`, { "event.action": "advanceMonth", "logrite.value": value });
    var lastDay = new Date(year, month + 1, 0).getDate();
    var day = Math.min(d.getDate(), lastDay);
	console.error(`advanceMonth(value=${value}): lastDay → ${lastDay}`, { "event.action": "advanceMonth", "logrite.value": value });
	console.error(`advanceMonth(value=${value}): day → ${day}`, { "event.action": "advanceMonth", "logrite.value": value });
    var mm = String(month + 1).padStart(2, "0");
    var dd = String(day).padStart(2, "0");
	console.error(`advanceMonth(value=${value}): mm → ${mm}`, { "event.action": "advanceMonth", "logrite.value": value });
	console.error(`advanceMonth(value=${value}): dd → ${dd}`, { "event.action": "advanceMonth", "logrite.value": value });
    return `${mm}/${dd}/${year}`;
  }

  function nextMonth() {
	console.error('>>> Entering nextMonth()', { "event.action": "nextMonth" });
    valueFrom = advanceMonth(valueFrom);
    valueTo = advanceMonth(valueTo);
	console.error(`nextMonth(): valueFrom → ${valueFrom}`, { "event.action": "nextMonth" });
  }
</script>

<Stack gap={4}>
  <DatePicker datePickerType="range" bind:valueFrom bind:valueTo on:change>
    <DatePickerInput labelText="Start date" placeholder="mm/dd/yyyy" />
    <DatePickerInput labelText="End date" placeholder="mm/dd/yyyy" />
  </DatePicker>
  <Button on:click={nextMonth}>Next month</Button>
</Stack>
