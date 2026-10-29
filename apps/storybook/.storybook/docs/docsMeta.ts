import libraryPackage from '../../../../packages/native-ui/package.json';
import usageSnapshot from '../../docs/data/production-usage.json';
import type { DocsLanguage } from '../../shared/docsGlobals';

/** Structured Do / Don't guidance a story file can put in `parameters.guidelines`. */
export interface Guidelines {
  do: readonly string[];
  dont: readonly string[];
}

export interface ProductionApp {
  name: string;
  url: string;
}

/** Branch, tag or commit the source links open when the build does not name one. */
const DEFAULT_SOURCE_REF = 'main';

/**
 * Git ref for "View source". CI sets `STORYBOOK_SOURCE_REF` to the built
 * commit, so a published Storybook links to the exact code it documents.
 */
function sourceRef(): string {
  const fromEnv: unknown = import.meta.env.STORYBOOK_SOURCE_REF;

  return typeof fromEnv === 'string' && fromEnv.length > 0 ? fromEnv : DEFAULT_SOURCE_REF;
}

/** `git+https://github.com/owner/repo.git` → `https://github.com/owner/repo`. */
function repositoryWebUrl(url: string): string {
  return url.replace(/^git\+/, '').replace(/\.git$/, '');
}

/** Library `src/` on GitHub, derived from packages/native-ui/package.json `repository`. */
export const SOURCE_REPOSITORY = `${repositoryWebUrl(libraryPackage.repository.url)}/blob/${sourceRef()}/${libraryPackage.repository.directory}/src`;

/** Story tags shown as badges in the docs header; labels live in `DOCS_PAGE_COPY`. */
export const STATUS_TAGS = ['new', 'beta', 'stable', 'deprecated', 'native-only'] as const;

export type StatusTag = (typeof STATUS_TAGS)[number];

/** Fixed labels of the component docs template; story-provided text stays as authored. */
export interface DocsPageCopy {
  copy: string;
  copied: string;
  copyFailed: string;
  viewSource: string;
  usedBy: string;
  axeChecked: string;
  guidelinesLabel: string;
  doTitle: string;
  dontTitle: string;
  statusTags: Record<StatusTag, string>;
}

export const DOCS_PAGE_COPY: Record<DocsLanguage, DocsPageCopy> = {
  en: {
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    viewSource: 'View source',
    usedBy: 'Part of the UI kit of',
    axeChecked: 'axe checked',
    guidelinesLabel: 'Usage guidelines',
    doTitle: 'Do',
    dontTitle: "Don't",
    statusTags: {
      new: 'New',
      beta: 'Beta',
      stable: 'Stable',
      deprecated: 'Deprecated',
      'native-only': 'Native only',
    },
  },
  pl: {
    copy: 'Kopiuj',
    copied: 'Skopiowano',
    copyFailed: 'Nie udało się skopiować',
    viewSource: 'Zobacz kod źródłowy',
    usedBy: 'Część zestawu UI aplikacji',
    axeChecked: 'sprawdzone przez axe',
    guidelinesLabel: 'Wytyczne użycia',
    doTitle: 'Zalecane',
    dontTitle: 'Niezalecane',
    statusTags: {
      new: 'Nowy',
      beta: 'Beta',
      stable: 'Stabilny',
      deprecated: 'Przestarzały',
      'native-only': 'Tylko natywnie',
    },
  },
};

const SOURCE_FOLDERS = { Components: 'components', Primitives: 'primitives' } as const;

function isStringArray(value: unknown): value is readonly string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

export function readGuidelines(value: unknown): Guidelines | null {
  if (typeof value !== 'object' || value === null || !('do' in value) || !('dont' in value)) {
    return null;
  }

  return isStringArray(value.do) && isStringArray(value.dont)
    ? { do: value.do, dont: value.dont }
    : null;
}

export function isStatusTag(tag: string): tag is StatusTag {
  return STATUS_TAGS.some((status) => status === tag);
}

/** "Components/Button" → { group: 'Components', name: 'Button' }. */
export function splitTitle(title: string): { group: string; name: string } {
  const parts = title.split('/');

  return { group: parts.slice(0, -1).join(' / '), name: parts[parts.length - 1] ?? title };
}

export function sourceHref(group: string, name: string): string | null {
  const folder = group === 'Components' || group === 'Primitives' ? SOURCE_FOLDERS[group] : null;

  return folder ? `${SOURCE_REPOSITORY}/${folder}/${name}.tsx` : null;
}

/** Production apps whose UI kit includes the component, from the committed scan. */
export function appsUsing(name: string): ProductionApp[] {
  const usedBy: unknown = Object.entries(usageSnapshot.usage).find(([key]) => key === name)?.[1];

  if (!isStringArray(usedBy)) {
    return [];
  }

  return usageSnapshot.apps.filter((app) => usedBy.includes(app.name));
}
