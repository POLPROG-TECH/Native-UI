import { COMPONENT_SECTIONS, STORYBOOK_URLS } from '../searchConfig';
import type { ComponentDoc, StorybookDocsIndex } from '../searchTypes';

/** The fields of a Storybook `index.json` entry this page relies on. */
interface IndexEntry {
  id: string;
  title: string;
  type: string;
  importPath: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isIndexEntry(value: unknown): value is IndexEntry {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    typeof value.type === 'string' &&
    typeof value.importPath === 'string'
  );
}

/** A docs entry under one of the component sections, or null for any other page. */
function toComponentDoc(entry: IndexEntry): ComponentDoc | null {
  const segments = entry.title.split('/');
  const section = segments[0] ?? '';
  const name = segments[segments.length - 1] ?? '';

  if (segments.length < 2 || !COMPONENT_SECTIONS.includes(section)) {
    return null;
  }

  return { id: entry.id, name, section, importPath: entry.importPath };
}

/** One component per name, sorted, so a title with two docs entries is listed once. */
function uniqueComponents(entries: readonly IndexEntry[]): ComponentDoc[] {
  const byTitle = new Map<string, ComponentDoc>();

  entries.forEach((entry) => {
    const doc = toComponentDoc(entry);

    if (doc !== null && !byTitle.has(entry.title)) {
      byTitle.set(entry.title, doc);
    }
  });

  return [...byTitle.values()].sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Reads the docs pages out of a Storybook `index.json` payload. Entries
 * without the expected fields are skipped; a payload without `entries`
 * yields null.
 */
export function parseStorybookIndex(payload: unknown): StorybookDocsIndex | null {
  if (!isRecord(payload) || !isRecord(payload.entries)) {
    return null;
  }

  const docsEntries = Object.values(payload.entries)
    .filter(isIndexEntry)
    .filter((entry) => entry.type === 'docs');
  const docsIdByTitle = new Map<string, string>();

  docsEntries.forEach((entry) => {
    if (!docsIdByTitle.has(entry.title)) {
      docsIdByTitle.set(entry.title, entry.id);
    }
  });

  return { components: uniqueComponents(docsEntries), docsIdByTitle };
}

/** Fetches and validates the index of the Storybook this page is served from. */
export async function loadStorybookIndex(signal: AbortSignal): Promise<StorybookDocsIndex> {
  const response = await fetch(new URL(STORYBOOK_URLS.index, window.location.href), { signal });

  if (!response.ok) {
    throw new Error(`Storybook index request failed with status ${response.status}`);
  }

  const payload: unknown = await response.json();
  const index = parseStorybookIndex(payload);

  if (index === null) {
    throw new Error('Storybook index has an unexpected shape');
  }

  return index;
}
