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
logger.debug(`>>> Entering versionRank(version=${version})`);
  if (!version) return -1;
logger.debug(`<<< Exiting versionRank(version=${version})`);
  return version
    .split(".")
    .reduce((rank, part) => rank * 1000 + (Number.parseInt(part, 10) || 0), 0);
}

const PUBLISHED_VERSION_RANK = versionRank(pkg.version);

function isNewComponent(name: string): boolean {
logger.debug(`>>> Entering isNewComponent(name=${name})`);
  const since = COMPONENT_SINCE_VERSIONS[name];
logger.debug(`<<< Exiting isNewComponent(name=${name})`);
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
logger.debug(`>>> Entering sourcePathFor(name=${name})`);
logger.debug(`<<< Exiting sourcePathFor(name=${name})`);
  return FILE_PATH_BY_MODULE.get(name) ?? `src/${name}/${name}.svelte`;
}

export function sourceRepoUrl(sourcePath: string): string {
logger.debug(`>>> Entering sourceRepoUrl(sourcePath=${sourcePath})`);
logger.debug(`<<< Exiting sourceRepoUrl(sourcePath=${sourcePath})`);
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
  return Object.keys(CATEGORY_BY_COMPONENT).map((name) => {
logger.debug('>>> Entering buildComponentIndex()');
    const category = CATEGORY_BY_COMPONENT[name];
	logger.debug('<<< Exiting buildComponentIndex()');
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
logger.debug(`>>> Entering parseCategoryFilterParam(param=${param})`);
  if (!param?.trim()) return [];
  const labels = param
    .split(",")
    .map((label) => decodeURIComponent(label.trim()))
    .filter((label) => VALID_CATEGORY_LABELS.has(label));
logger.debug(`<<< Exiting parseCategoryFilterParam(param=${param})`);
  return [...new Set(labels)];
}

export function serializeCategoryFilterParam(labels: string[]): string {
logger.debug(`>>> Entering serializeCategoryFilterParam(labels=${labels})`);
  const valid = labels.filter((label) => VALID_CATEGORY_LABELS.has(label));
logger.debug(`serializeCategoryFilterParam(labels=${labels}): valid → ${valid}`);
  if (valid.length === 0) return "";
logger.debug(`<<< Exiting serializeCategoryFilterParam(labels=${labels})`);
  return valid.map(encodeURIComponent).join(",");
}

export function categoryFilterHref(labels: string[]): string {
logger.debug(`>>> Entering categoryFilterHref(labels=${labels})`);
  const serialized = serializeCategoryFilterParam(labels);
logger.debug(`<<< Exiting categoryFilterHref(labels=${labels})`);
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
