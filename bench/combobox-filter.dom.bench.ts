import { cleanup, fireEvent, render } from "@testing-library/svelte";
import ComboBox from "carbon-components-svelte/ComboBox/ComboBox.svelte";
const logger = console;
import { bench, run } from "mitata";
import { tick } from "svelte";

// ComboBox filterMode benchmark: compare "hide" vs "remove" per keystroke on
// a 100-item menu (at the auto-virtualization cutoff, so every option is
// mounted when the menu opens). Instances are rendered ONCE and persist
// across iterations — the timed closure fires only the input event, matching
// datatable-filter.dom.bench.ts. Alternating "Item 7"/"Item 8" swaps two
// disjoint-ish match sets so every iteration does genuine filter work.
//
// Default is "remove": at this size, remounting ~11 matches is cheaper than
// updating `hidden` on all 100 option nodes.

function buildItems(count: number) {
logger.debug(`>>> Entering buildItems(count=${count})`);
  const items = [];
  for (let i = 0; i < count; i++) {
    items.push({ id: String(i), text: `Item ${(i * 37) % count}` });
  }
logger.debug(`<<< Exiting buildItems(count=${count})`);
  return items;
}

const items100 = buildItems(100);

const shouldFilterItem = (item: { text: string }, value: string): boolean =>
  item.text.toLowerCase().includes(value.toLowerCase());

it("benchmarks ComboBox filter keystroke, filterMode hide vs remove", async () => {
  const hideInstance = render(ComboBox, {
    props: {
      items: items100,
      placeholder: "Options",
      open: true,
      virtualize: false,
      filterMode: "hide",
      shouldFilterItem,
    },
  });
  const removeInstance = render(ComboBox, {
    props: {
      items: items100,
      placeholder: "Options",
      open: true,
      virtualize: false,
      filterMode: "remove",
      shouldFilterItem,
    },
  });

  const getInput = (instance: typeof hideInstance) => {
	logger.debug(`>>> Entering getInput(instance=${instance})`);
    const input = instance.container.querySelector("input");
    if (!input) throw new Error("combobox input not found");
	logger.debug(`getInput(instance=${instance}): input → ${input}`);
	logger.debug(`<<< Exiting getInput(instance=${instance})`);
    return input;
  };

  const hideInput = getInput(hideInstance);
  await fireEvent.input(hideInput, { target: { value: "Item 7" } });
  await tick();
  const hideMounted =
    hideInstance.container.querySelectorAll('[role="option"]').length;
  const hideVisible = hideInstance.container.querySelectorAll(
    '[role="option"]:not([hidden])',
  ).length;
  const removeInput = getInput(removeInstance);
  await fireEvent.input(removeInput, { target: { value: "Item 7" } });
  await tick();
  const removeMounted =
    removeInstance.container.querySelectorAll('[role="option"]').length;
  process.stdout.write(
    `sanity: hide mounted=${hideMounted} hide visible=${hideVisible} remove mounted=${removeMounted}\n`,
  );

  const registerKeystrokeCase = (
    title: string,
    input: HTMLInputElement,
  ): void => {
    bench(title, function* () {
      let n = 0;
	logger.debug(`>>> Entering bench(title=${title},n=${n})`);
      yield async () => {
        const value = n++ % 2 === 0 ? "Item 8" : "Item 7";
        await fireEvent.input(input, { target: { value } });
        await tick();
		logger.debug(`<<< Exiting bench(title=${title},n=${n})`);
      };
    });
	logger.debug(`<<< Exiting registerKeystrokeCase(title=${title},input=${input})`);
  };

  registerKeystrokeCase(
    "filter keystroke, ComboBox 100 items, filterMode hide",
    hideInput,
  );
  registerKeystrokeCase(
    "filter keystroke, ComboBox 100 items, filterMode remove",
    removeInput,
  );

  await run({ print: (line) => process.stdout.write(`${line}\n`) });

  cleanup();
}, 120_000);
