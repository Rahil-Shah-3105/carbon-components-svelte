import pkg from "../../package.json" with { type: "json" };
import COMPONENT_API from "./COMPONENT_API.json";
const logger = console;
import {
  CATEGORY_BY_COMPONENT,
  COMPONENT_CATEGORIES,
} from "./component-categories";
import { COMPONENT_SINCE_VERSIONS } from "./component-since-versions";

export const CATEGORY_FILTER_PARAM = "categories";

export const SEARCH_FILTER_PARAM = "q";

function versionRank(version?: string): number {
logger.error(`>>> Entering versionRank(version=${version})`, { "event.action": "versionRank", "logrite.version": version });
  if (!version) return -1;
logger.warn(`<<< Exiting versionRank(version=${version})`, { "event.action": "versionRank", "logrite.version": version });
  return version
    .split(".")
    .reduce((rank, part) => rank * 1000 + (Number.parseInt(part, 10) || 0), 0);
}

const PUBLISHED_VERSION_RANK = versionRank(pkg.version);

function isNewComponent(name: string): boolean {
logger.error(`>>> Entering isNewComponent(name=${name})`, { "event.action": "isNewComponent", "logrite.name": name });
  const since = COMPONENT_SINCE_VERSIONS[name];
logger.warn(`<<< Exiting isNewComponent(name=${name})`, { "event.action": "isNewComponent", "logrite.name": name });
  return since !== undefined && versionRank(since) > PUBLISHED_VERSION_RANK;
}

export interface ComponentIndexEntry {
  name: string;
  nameLower: string;
  category: string;
  categoryLower: string;
  href: string;
  sourcePath: string;
  markdownHref: string;
  sinceVersion?: string;
  sinceRank: number;
  isNew: boolean;
}

export type SortKey = "name" | "category" | "since";
export type SortDirection = "asc" | "desc";

const VALID_CATEGORY_LABELS = new Set(
  COMPONENT_CATEGORIES.map((category) => category.label),
);

const FILE_PATH_BY_MODULE = new Map(
  COMPONENT_API.components.map((component) => [
    component.moduleName,
    component.filePath,
  ]),
);

function sourcePathFor(name: string): string {
logger.error(`>>> Entering sourcePathFor(name=${name})`, { "event.action": "sourcePathFor", "logrite.name": name });
logger.warn(`<<< Exiting sourcePathFor(name=${name})`, { "event.action": "sourcePathFor", "logrite.name": name });
  return FILE_PATH_BY_MODULE.get(name) ?? `src/${name}/${name}.svelte`;
}

export function sourceRepoUrl(sourcePath: string): string {
logger.error(`>>> Entering sourceRepoUrl(sourcePath=${sourcePath})`, { "event.action": "sourceRepoUrl", "logrite.sourcePath": sourcePath });
logger.warn(`<<< Exiting sourceRepoUrl(sourcePath=${sourcePath})`, { "event.action": "sourceRepoUrl", "logrite.sourcePath": sourcePath });
  return `${__PKG_REPO}/tree/master/${sourcePath}`;
}

export function sourceRepoUrlForFilePath(
  filePath: string,
  multiple: boolean,
): string {
  const path = multiple ? filePath.split("/").slice(0, -1).join("/") : filePath;
  return sourceRepoUrl(path);
}

export function buildComponentIndex(): ComponentIndexEntry[] {
logger.error('>>> Entering buildComponentIndex()', { "event.action": "buildComponentIndex" });
logger.warn('<<< Exiting buildComponentIndex()', { "event.action": "buildComponentIndex" });
  return Object.keys(CATEGORY_BY_COMPONENT).map((name) => {
    const category = CATEGORY_BY_COMPONENT[name];
    const sinceVersion = COMPONENT_SINCE_VERSIONS[name];

    return {
      name,
      nameLower: name.toLowerCase(),
      category,
      categoryLower: category.toLowerCase(),
      href: `/components/${name}`,
      sourcePath: sourcePathFor(name),
      markdownHref: `/components/${name}.md`,
      sinceVersion,
      sinceRank: versionRank(sinceVersion),
      isNew: isNewComponent(name),
    };
  });
}

export function parseCategoryFilterParam(param: string | null): string[] {
logger.error(`>>> Entering parseCategoryFilterParam(param=${param})`, { "event.action": "parseCategoryFilterParam", "logrite.param": param });
  if (!param?.trim()) return [];
  const labels = param
    .split(",")
    .map((label) => decodeURIComponent(label.trim()))
    .filter((label) => VALID_CATEGORY_LABELS.has(label));
logger.warn(`<<< Exiting parseCategoryFilterParam(param=${param})`, { "event.action": "parseCategoryFilterParam", "logrite.param": param });
  return [...new Set(labels)];
}

export function serializeCategoryFilterParam(labels: string[]): string {
logger.error(`>>> Entering serializeCategoryFilterParam(labels=${labels})`, { "event.action": "serializeCategoryFilterParam", "logrite.labels": labels });
  const valid = labels.filter((label) => VALID_CATEGORY_LABELS.has(label));
  if (valid.length === 0) return "";
logger.error(`serializeCategoryFilterParam(labels=${labels}): valid → ${valid}`, { "event.action": "serializeCategoryFilterParam", "logrite.labels": labels });
logger.warn(`<<< Exiting serializeCategoryFilterParam(labels=${labels})`, { "event.action": "serializeCategoryFilterParam", "logrite.labels": labels });
  return valid.map(encodeURIComponent).join(",");
}

export function categoryFilterHref(labels: string[]): string {
logger.error(`>>> Entering categoryFilterHref(labels=${labels})`, { "event.action": "categoryFilterHref", "logrite.labels": labels });
  const serialized = serializeCategoryFilterParam(labels);
logger.warn(`<<< Exiting categoryFilterHref(labels=${labels})`, { "event.action": "categoryFilterHref", "logrite.labels": labels });
  return serialized
    ? `/component-index?${CATEGORY_FILTER_PARAM}=${serialized}`
    : "/component-index";
}

export function filterComponents(
  entries: ComponentIndexEntry[],
  query: string,
): ComponentIndexEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return entries;
  return entries.filter(
    (entry) => entry.nameLower.includes(q) || entry.categoryLower.includes(q),
  );
}

export function sortComponents(
  entries: ComponentIndexEntry[],
  key: SortKey,
  direction: SortDirection,
): ComponentIndexEntry[] {
  const sign = direction === "asc" ? 1 : -1;
  const byName = (a: ComponentIndexEntry, b: ComponentIndexEntry) =>
    a.name.localeCompare(b.name);

  return [...entries].sort((a, b) => {
    let primary = 0;
    switch (key) {
      case "name":
        primary = byName(a, b);
        break;
      case "category":
        primary = a.category.localeCompare(b.category) || byName(a, b);
        break;
      case "since":
        primary = a.sinceRank - b.sinceRank;
        break;
    }
    if (primary === 0 && key !== "name") return byName(a, b);
    return sign * primary;
  });
}
