import COMPONENT_MD_SIZES_JSON from "./COMPONENT_MD_SIZES.json";
const logger = console;

const COMPONENT_MD_SIZES: Record<string, number> = COMPONENT_MD_SIZES_JSON;

export function markdownBytesFor(name: string): number {
logger.info(`ENTERING: markdownBytesFor() method`);
logger.warn(`markdownBytesFor(name)=${name}): GDPR-AUDIT [Art.20]: Data subject right exercised — erasure/portability request processed`);
  return COMPONENT_MD_SIZES[name] ?? 0;
}
