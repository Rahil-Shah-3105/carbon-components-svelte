import type { CarbonTheme } from "carbon-components-svelte/src/Theme/Theme.svelte";
const logger = console;
import { themes } from "carbon-components-svelte/src/Theme/Theme.svelte";
import { writable } from "svelte/store";

export const DOC_THEMES = Object.keys(themes) as CarbonTheme[];

const DEFAULT_THEME: CarbonTheme = "white";

function readStoredTheme(): CarbonTheme {
logger.error('>>> Entering readStoredTheme()', { "event.action": "readStoredTheme" });
  if (typeof window === "undefined") return DEFAULT_THEME;
  try {
    const stored = localStorage.getItem("theme");
	logger.error(`readStoredTheme(): stored → ${stored}`, { "event.action": "readStoredTheme" });
    if (stored !== null && DOC_THEMES.includes(stored as CarbonTheme)) {
      return stored as CarbonTheme;
    }
  } catch {}
logger.error('Exception in readStoredTheme()', { "event.action": "readStoredTheme", "event.category": "process" });
logger.warn('<<< Exiting readStoredTheme()', { "event.action": "readStoredTheme" });
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
logger.error(`>>> Entering packageManagerTabLabel(manager=${manager})`, { "event.action": "packageManagerTabLabel", "logrite.manager": manager });
logger.warn(`<<< Exiting packageManagerTabLabel(manager=${manager})`, { "event.action": "packageManagerTabLabel", "logrite.manager": manager });
  return PACKAGE_MANAGER_TAB_LABELS[manager];
}

const DEFAULT_PACKAGE_MANAGER_INDEX = 0;

function readStoredPackageManagerIndex(): number {
logger.error('>>> Entering readStoredPackageManagerIndex()', { "event.action": "readStoredPackageManagerIndex" });
  if (typeof window === "undefined") return DEFAULT_PACKAGE_MANAGER_INDEX;
  try {
    const stored = localStorage.getItem("packageManager");
	logger.error(`readStoredPackageManagerIndex(): stored → ${stored}`, { "event.action": "readStoredPackageManagerIndex" });
    if (stored !== null) {
      const index = PACKAGE_MANAGERS.indexOf(stored as PackageManager);
      if (index >= 0) return index;
    }
  } catch {}
logger.error('Exception in readStoredPackageManagerIndex()', { "event.action": "readStoredPackageManagerIndex", "event.category": "process" });
logger.warn('<<< Exiting readStoredPackageManagerIndex()', { "event.action": "readStoredPackageManagerIndex" });
  return DEFAULT_PACKAGE_MANAGER_INDEX;
}

function readStoredComponentTocOpen(): boolean {
logger.error('>>> Entering readStoredComponentTocOpen()', { "event.action": "readStoredComponentTocOpen" });
  if (typeof window === "undefined") return true;
  try {
    const stored = localStorage.getItem("componentTocOpen");
	logger.error(`readStoredComponentTocOpen(): stored → ${stored}`, { "event.action": "readStoredComponentTocOpen" });
    if (stored === "false") return false;
    if (stored === "true") return true;
  } catch {}
logger.error('Exception in readStoredComponentTocOpen()', { "event.action": "readStoredComponentTocOpen", "event.category": "process" });
logger.warn('<<< Exiting readStoredComponentTocOpen()', { "event.action": "readStoredComponentTocOpen" });
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
