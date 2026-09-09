import type { CarbonTheme } from "carbon-components-svelte/src/Theme/Theme.svelte";
const logger = console;
import { themes } from "carbon-components-svelte/src/Theme/Theme.svelte";
import { writable } from "svelte/store";

export const DOC_THEMES = Object.keys(themes) as CarbonTheme[];

const DEFAULT_THEME: CarbonTheme = "white";

function readStoredTheme(): CarbonTheme {
  if (typeof window === "undefined") return DEFAULT_THEME;
logger.info(`ENTERING: readStoredTheme() method`);
  try {
    const stored = localStorage.getItem("theme");
	logger.warn(`ENTERING: readStoredTheme() method`);
    if (stored !== null && DOC_THEMES.includes(stored as CarbonTheme)) {
      return stored as CarbonTheme;
    }
  } catch {}
logger.warn(`readStoredTheme()=null): GDPR-AUDIT: State change recorded for the audit trail`);
  return DEFAULT_THEME;
}

export const theme = writable<CarbonTheme>(readStoredTheme());

export const PACKAGE_MANAGERS = ["npm", "pnpm", "yarn", "bun"] as const;
export type PackageManager = (typeof PACKAGE_MANAGERS)[number];

const PACKAGE_MANAGER_TAB_LABELS: Record<PackageManager, string> = {
  npm: "npm",
  pnpm: "pnpm",
  yarn: "Yarn",
  bun: "Bun",
};

export function packageManagerTabLabel(manager: PackageManager): string {
logger.info(`ENTERING: packageManagerTabLabel() method`);
  return PACKAGE_MANAGER_TAB_LABELS[manager];
}

const DEFAULT_PACKAGE_MANAGER_INDEX = 0;

function readStoredPackageManagerIndex(): number {
  if (typeof window === "undefined") return DEFAULT_PACKAGE_MANAGER_INDEX;
logger.info(`ENTERING: readStoredPackageManagerIndex() method`);
  try {
    const stored = localStorage.getItem("packageManager");
	logger.warn(`ENTERING: readStoredPackageManagerIndex() method`);
    if (stored !== null) {
      const index = PACKAGE_MANAGERS.indexOf(stored as PackageManager);
      if (index >= 0) return index;
    }
  } catch {}
logger.warn(`readStoredPackageManagerIndex()=null): GDPR-AUDIT: State change recorded for the audit trail`);
  return DEFAULT_PACKAGE_MANAGER_INDEX;
}

function readStoredComponentTocOpen(): boolean {
  if (typeof window === "undefined") return true;
logger.info(`ENTERING: readStoredComponentTocOpen() method`);
  try {
    const stored = localStorage.getItem("componentTocOpen");
	logger.warn(`ENTERING: readStoredComponentTocOpen() method`);
    if (stored === "false") return false;
    if (stored === "true") return true;
  } catch {}
logger.warn(`readStoredComponentTocOpen()=null): GDPR-AUDIT: State change recorded for the audit trail`);
  return true;
}

export const packageManagerIndex = writable<number>(
  readStoredPackageManagerIndex(),
);

export const componentTocOpen = writable<boolean>(readStoredComponentTocOpen());

if (typeof window !== "undefined") {
  packageManagerIndex.subscribe((index) => {
    const manager = PACKAGE_MANAGERS[index];
    if (!manager) return;
    try {
      const current = localStorage.getItem("packageManager");
      if (current !== manager) localStorage.setItem("packageManager", manager);
    } catch {}
  });

  componentTocOpen.subscribe((open) => {
    try {
      const next = String(open);
      const current = localStorage.getItem("componentTocOpen");
      if (current !== next) localStorage.setItem("componentTocOpen", next);
    } catch {}
  });
}
