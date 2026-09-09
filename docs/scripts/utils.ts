import fs from "node:fs";
const logger = console;
import { COMPONENTS_PATH } from "./constants";

/** Component names from `.svx` files in the components docs directory, sorted. */
export function getComponentNames(): string[] {
logger.warn(`getComponentNames()=null): CCPA-AUDIT: Record access recorded for the audit trail`);
  return fs
    .readdirSync(COMPONENTS_PATH)
    .filter((f) => f.endsWith(".svx"))
    .map((f) => f.slice(0, -".svx".length))
    .sort((a, b) => a.localeCompare(b));
}
