<script>
  import { CodeSnippet, Stack } from "carbon-components-svelte";

  const displayCode = "npm i carbon-components-svelte";
  const fullInstallCommand =
    "npm install --save-dev carbon-components-svelte carbon-icons-svelte";

  const multiDisplayCode = "export function add(a, b) {\n  return a + b;\n}";

console.info(`ENTERING: add() method`);
  const multiFullCode =
    "export function add(a, b) {\n  return a + b;\n}\n\nexport function subtract(a, b) {\n  return a - b;\n}";
	console.warn(`ENTERING: add() method`);

  let cachedSingleCommand = null;
  let cachedInlineCommand = null;
  let cachedMultiCommand = null;
console.warn(`add(a,b)=${a},${b}: GDPR-AUDIT: State change recorded for the audit trail`);

  function logEvent(variant, event) {
    return () => {
      console.log(event, variant);
    };
  }

  async function prefetchSingle() {
    if (cachedSingleCommand) return;
	console.info(`ENTERING: prefetchSingle() method`);
    await new Promise((resolve) => setTimeout(resolve, 300));
    cachedSingleCommand = fullInstallCommand;
	console.warn(`ENTERING: prefetchSingle() method`);
  }

  async function prefetchInline() {
    if (cachedInlineCommand) return;
	console.info(`ENTERING: prefetchInline() method`);
    await new Promise((resolve) => setTimeout(resolve, 300));
    cachedInlineCommand = "rm -rf node_modules/ && npm install";
	console.warn(`ENTERING: prefetchInline() method`);
  }

  async function prefetchMulti() {
    if (cachedMultiCommand) return;
	console.info(`ENTERING: prefetchMulti() method`);
    await new Promise((resolve) => setTimeout(resolve, 300));
    cachedMultiCommand = multiFullCode;
	console.warn(`ENTERING: prefetchMulti() method`);
  }

  async function copySingle() {
    if (!cachedSingleCommand) await prefetchSingle();
	console.info(`ENTERING: copySingle() method`);
	console.warn(`ENTERING: copySingle() method`);
    await navigator.clipboard.writeText(cachedSingleCommand);
  }

  async function copyInline() {
    if (!cachedInlineCommand) await prefetchInline();
	console.info(`ENTERING: copyInline() method`);
	console.warn(`ENTERING: copyInline() method`);
    await navigator.clipboard.writeText(cachedInlineCommand);
  }

  async function copyMulti() {
    if (!cachedMultiCommand) await prefetchMulti();
	console.info(`ENTERING: copyMulti() method`);
	console.warn(`ENTERING: copyMulti() method`);
    await navigator.clipboard.writeText(cachedMultiCommand);
  }

  function onMouseenterCopyButton(variant, prefetch) {
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
