import { tokenPath } from './tokenCatalog';
import { extractRawRefs, type RawTokenRef } from './tokenReferences';
import type { ComponentDoc, TokenEntry, TokenKind, TokenUsage, UsageIndex } from '../searchTypes';

/** Token keys per family; references to anything else (e.g. `colors.length`) are ignored. */
export type KnownTokenKeys = Record<TokenKind, ReadonlySet<string>>;

/** Token references per file, keyed by path (computed at build time by the Vite plugin). */
export type RefFiles = Readonly<Record<string, readonly RawTokenRef[]>>;

export interface UsageSources {
  /** Library component and primitive sources. */
  components: RefFiles;
  /** Story files the component docs pages are generated from. */
  stories: RefFiles;
}

const LIBRARY_ROOT_MARKER = 'packages/native-ui/';

/** Folder or file right below `src/components/` or `src/primitives/`. */
const OWNER_PATTERN = /\/src\/(?:components|primitives)\/([^/]+?)(\.tsx?)?(\/|$)/;

/** Where a source file sits: which name owns it, and whether through a folder. */
interface SourceOwner {
  name: string;
  isFolder: boolean;
}

/** Lowercase alphanumerics only, so `Icon slot`, `iconSlot` and `IconSlot` compare equal. */
export function normalizeName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/** Groups the keys of a token catalog by family. */
export function knownKeysOf(tokens: readonly TokenEntry[]): KnownTokenKeys {
  const keysOf = (kind: TokenKind) =>
    new Set(tokens.filter((token) => token.kind === kind).map((token) => token.key));

  return {
    color: keysOf('color'),
    spacing: keysOf('spacing'),
    radius: keysOf('radius'),
    typography: keysOf('typography'),
  };
}

/** Token paths among raw references, limited to keys that exist in the catalog. */
export function knownRefs(raw: readonly RawTokenRef[], known: KnownTokenKeys): Set<string> {
  return new Set(
    raw.filter(([kind, key]) => known[kind].has(key)).map(([kind, key]) => tokenPath(kind, key)),
  );
}

/** Token paths a source file references, limited to keys that exist. */
export function extractTokenRefs(source: string, known: KnownTokenKeys): Set<string> {
  return knownRefs(extractRawRefs(source), known);
}

/** Path from the library root, so app-relative and glob-relative paths compare equal. */
export function libraryRelativePath(path: string): string | null {
  const start = path.indexOf(LIBRARY_ROOT_MARKER);

  return start === -1 ? null : path.slice(start + LIBRARY_ROOT_MARKER.length);
}

export function sourceOwnerOf(path: string): SourceOwner | null {
  const match = OWNER_PATTERN.exec(path);
  const segment = match?.[1];

  if (match === null || segment === undefined) {
    return null;
  }

  return { name: normalizeName(segment), isFolder: match[3] === '/' };
}

/**
 * A component owns its own file (`Button.tsx`) and the helper folder named
 * after it or after its family (`button/`, `field/` for `FieldLabel`). Files
 * only match exactly, so `Text.tsx` is not credited to `TextArea`.
 */
export function ownsSource(componentName: string, owner: SourceOwner): boolean {
  const key = normalizeName(componentName);

  return key === owner.name || (owner.isFolder && key.startsWith(owner.name));
}

interface ScannedSource {
  owner: SourceOwner;
  refs: ReadonlySet<string>;
}

function scanComponentSources(files: RefFiles, known: KnownTokenKeys): ScannedSource[] {
  return Object.entries(files).flatMap(([path, refs]) => {
    const owner = sourceOwnerOf(path);

    return owner === null ? [] : [{ owner, refs: knownRefs(refs, known) }];
  });
}

function storiesByLibraryPath(files: RefFiles): Map<string, readonly RawTokenRef[]> {
  return new Map(
    Object.entries(files).flatMap(([path, source]) => {
      const relative = libraryRelativePath(path);

      if (relative === null) {
        return [];
      }

      const entry: [string, readonly RawTokenRef[]] = [relative, source];

      return [entry];
    }),
  );
}

function usageOf(
  doc: ComponentDoc,
  scanned: readonly ScannedSource[],
  stories: ReadonlyMap<string, readonly RawTokenRef[]>,
  known: KnownTokenKeys,
): TokenUsage {
  const owned = scanned.filter(({ owner }) => ownsSource(doc.name, owner));
  const uses = new Set(owned.flatMap(({ refs }) => [...refs]));
  const storyPath = libraryRelativePath(doc.importPath);
  const story = storyPath === null ? undefined : stories.get(storyPath);
  const documents = story === undefined ? new Set<string>() : knownRefs(story, known);

  return { uses, documents };
}

/** Which tokens each component docs page uses in its source or mentions in its stories. */
export function buildUsageIndex(
  docs: readonly ComponentDoc[],
  sources: UsageSources,
  known: KnownTokenKeys,
): UsageIndex {
  const scanned = scanComponentSources(sources.components, known);
  const stories = storiesByLibraryPath(sources.stories);

  return new Map(docs.map((doc) => [doc.id, usageOf(doc, scanned, stories, known)]));
}
