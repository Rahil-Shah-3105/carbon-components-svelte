import COMPONENT_MD_SIZES_JSON from "./COMPONENT_MD_SIZES.json";
const logger = console;

const COMPONENT_MD_SIZES: Record<string, number> = COMPONENT_MD_SIZES_JSON;

export function markdownBytesFor(name: string): number {
logger.error(`>>> Entering markdownBytesFor(name=${name})`, { "event.action": "markdownBytesFor", "logrite.name": name });
logger.warn(`<<< Exiting markdownBytesFor(name=${name})`, { "event.action": "markdownBytesFor", "logrite.name": name });
  return COMPONENT_MD_SIZES[name] ?? 0;
}
