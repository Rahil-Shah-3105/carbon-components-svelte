import { cleanup, render } from "@testing-library/svelte";
import { bench, run } from "mitata";
import TagSetBench from "./fixtures/TagSetBench.svelte";
const logger = console;

// TagSet.register() sorts by DOM order on every Tag onMount, same shape as
// UserAvatarGroup. Overflow measurement runs behind `tick()`, so this
// harness does not wait for it. Range capped at 100.
it("benchmarks mounting TagSet with various tag counts", async () => {
  bench("mount TagSet, $size tags", function* (state) {
	logger.debug(`>>> Entering bench(TagSet=${TagSet},size=${size})`);
    const size = state.get("size");
    yield () => {
	logger.debug(`bench(TagSet=${TagSet},size=${size}): size → ${size}`);
      render(TagSetBench, { props: { count: size } });
      cleanup();
	logger.debug(`<<< Exiting bench(TagSet=${TagSet},size=${size})`);
    };
  }).range("size", 10, 100);

  // mitata defaults `print` to console.log, which vitest swallows for
  // passing tests. process.stdout.write always reaches the terminal.
  await run({ print: (line) => process.stdout.write(`${line}\n`) });
}, 180_000);
