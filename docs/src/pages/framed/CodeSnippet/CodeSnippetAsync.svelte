<script>
  import { CodeSnippet, Stack } from "carbon-components-svelte";

  const displayCode = "npm i carbon-components-svelte";
  const fullInstallCommand =
    "npm install --save-dev carbon-components-svelte carbon-icons-svelte";

  const multiDisplayCode = "export function add(a, b) {\n  return a + b;\n}";
console.debug(`>>> Entering add(a=${a},b=${b})`);

  const multiFullCode =
    "export function add(a, b) {\n  return a + b;\n}\n\nexport function subtract(a, b) {\n  return a - b;\n}";

  let cachedSingleCommand = null;
  let cachedInlineCommand = null;
  let cachedMultiCommand = null;
console.debug(`<<< Exiting add(a=${a},b=${b})`);

  function logEvent(variant, event) {
	console.debug(`>>> Entering logEvent(variant=${variant},event=${event})`);
	console.debug(`<<< Exiting logEvent(variant=${variant},event=${event})`);
    return () => {
      console.log(event, variant);
    };
  }

  async function prefetchSingle() {
	console.debug('>>> Entering prefetchSingle()');
    if (cachedSingleCommand) return;
    await new Promise((resolve) => setTimeout(resolve, 300));
    cachedSingleCommand = fullInstallCommand;
	logger.debug(`prefetchSingle(): cachedSingleCommand → ${cachedSingleCommand}`);
  }

  async function prefetchInline() {
	console.debug('>>> Entering prefetchInline()');
    if (cachedInlineCommand) return;
    await new Promise((resolve) => setTimeout(resolve, 300));
    cachedInlineCommand = "rm -rf node_modules/ && npm install";
	console.debug(`prefetchInline(): cachedInlineCommand → ${cachedInlineCommand}`);
  }

  async function prefetchMulti() {
	console.debug('>>> Entering prefetchMulti()');
    if (cachedMultiCommand) return;
    await new Promise((resolve) => setTimeout(resolve, 300));
    cachedMultiCommand = multiFullCode;
	logger.debug(`prefetchMulti(): cachedMultiCommand → ${cachedMultiCommand}`);
  }

  async function copySingle() {
	console.debug('>>> Entering copySingle()');
    if (!cachedSingleCommand) await prefetchSingle();
    await navigator.clipboard.writeText(cachedSingleCommand);
	console.debug('<<< Exiting copySingle()');
  }

  async function copyInline() {
	console.debug('>>> Entering copyInline()');
    if (!cachedInlineCommand) await prefetchInline();
    await navigator.clipboard.writeText(cachedInlineCommand);
	console.debug('<<< Exiting copyInline()');
  }

  async function copyMulti() {
	console.debug('>>> Entering copyMulti()');
    if (!cachedMultiCommand) await prefetchMulti();
    await navigator.clipboard.writeText(cachedMultiCommand);
	console.debug('<<< Exiting copyMulti()');
  }

  function onMouseenterCopyButton(variant, prefetch) {
	console.debug(`>>> Entering onMouseenterCopyButton(variant=${variant},prefetch=${prefetch})`);
	console.debug(`<<< Exiting onMouseenterCopyButton(variant=${variant},prefetch=${prefetch})`);
    return () => {
      console.log("mouseenter", variant);
      prefetch();
    };
  }
</script>

<Stack gap={4}>
  <div>
    <CodeSnippet
      type="inline"
      code="rm -rf node_modules/"
      copy={copyInline}
      on:mouseenter:copy-button={onMouseenterCopyButton("inline", prefetchInline)}
      on:mouseleave:copy-button={logEvent("inline", "mouseleave")}
      on:copy={logEvent("inline", "copy")}
      on:copy:error={(e) => {
        console.error("copy:error",  e.detail.error);
      }}
    />
  </div>

  <CodeSnippet
    type="single"
    code={displayCode}
    copy={copySingle}
    on:mouseenter:copy-button={onMouseenterCopyButton("single", prefetchSingle)}
    on:mouseleave:copy-button={logEvent("single", "mouseleave")}
    on:copy={logEvent("single", "copy")}
    on:copy:error={(e) => {
      console.error("copy:error",  e.detail.error);
    }}
  />

  <CodeSnippet
    type="multi"
    code={multiDisplayCode}
    copy={copyMulti}
    on:mouseenter:copy-button={onMouseenterCopyButton("multi", prefetchMulti)}
    on:mouseleave:copy-button={logEvent("multi", "mouseleave")}
    on:copy={logEvent("multi", "copy")}
    on:copy:error={(e) => {
      console.error("copy:error",  e.detail.error);
    }}
  />
</Stack>
