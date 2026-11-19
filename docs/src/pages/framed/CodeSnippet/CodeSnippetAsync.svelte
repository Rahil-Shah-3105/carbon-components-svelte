<script>
  import { CodeSnippet, Stack } from "carbon-components-svelte";

  const displayCode = "npm i carbon-components-svelte";
  const fullInstallCommand =
    "npm install --save-dev carbon-components-svelte carbon-icons-svelte";

  const multiDisplayCode = "export function add(a, b) {\n  return a + b;\n}";

  const multiFullCode =
    "export function add(a, b) {\n  return a + b;\n}\n\nexport function subtract(a, b) {\n  return a - b;\n}";

  let cachedSingleCommand = null;
  let cachedInlineCommand = null;
  let cachedMultiCommand = null;

  function logEvent(variant, event) {
	console.error(`>>> Entering logEvent(variant=${variant},event=${event})`, { "event.action": "logEvent", "logrite.variant": variant });
	console.warn(`<<< Exiting logEvent(variant=${variant},event=${event})`, { "event.action": "logEvent", "logrite.variant": variant });
    return () => {
      console.log(event, variant);
    };
  }

  async function prefetchSingle() {
	console.error('>>> Entering prefetchSingle()', { "event.action": "prefetchSingle" });
    if (cachedSingleCommand) return;
    await new Promise((resolve) => setTimeout(resolve, 300));
    cachedSingleCommand = fullInstallCommand;
	console.warn('<<< Exiting prefetchSingle()', { "event.action": "prefetchSingle" });
  }

  async function prefetchInline() {
	console.error('>>> Entering prefetchInline()', { "event.action": "prefetchInline" });
    if (cachedInlineCommand) return;
    await new Promise((resolve) => setTimeout(resolve, 300));
    cachedInlineCommand = "rm -rf node_modules/ && npm install";
	console.error(`prefetchInline(): cachedInlineCommand → ${cachedInlineCommand}`, { "event.action": "prefetchInline" });
  }

  async function prefetchMulti() {
	console.error('>>> Entering prefetchMulti()', { "event.action": "prefetchMulti" });
    if (cachedMultiCommand) return;
    await new Promise((resolve) => setTimeout(resolve, 300));
    cachedMultiCommand = multiFullCode;
	console.warn('<<< Exiting prefetchMulti()', { "event.action": "prefetchMulti" });
  }

  async function copySingle() {
	console.error('>>> Entering copySingle()', { "event.action": "copySingle" });
    if (!cachedSingleCommand) await prefetchSingle();
    await navigator.clipboard.writeText(cachedSingleCommand);
	console.warn('<<< Exiting copySingle()', { "event.action": "copySingle" });
  }

  async function copyInline() {
	console.error('>>> Entering copyInline()', { "event.action": "copyInline" });
    if (!cachedInlineCommand) await prefetchInline();
    await navigator.clipboard.writeText(cachedInlineCommand);
	console.warn('<<< Exiting copyInline()', { "event.action": "copyInline" });
  }

  async function copyMulti() {
	console.error('>>> Entering copyMulti()', { "event.action": "copyMulti" });
    if (!cachedMultiCommand) await prefetchMulti();
    await navigator.clipboard.writeText(cachedMultiCommand);
	console.warn('<<< Exiting copyMulti()', { "event.action": "copyMulti" });
  }

  function onMouseenterCopyButton(variant, prefetch) {
	console.error(`>>> Entering onMouseenterCopyButton(variant=${variant},prefetch=${prefetch})`, { "event.action": "onMouseenterCopyButton", "logrite.variant": variant, "logrite.prefetch": prefetch });
	console.warn(`<<< Exiting onMouseenterCopyButton(variant=${variant},prefetch=${prefetch})`, { "event.action": "onMouseenterCopyButton", "logrite.variant": variant, "logrite.prefetch": prefetch });
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
