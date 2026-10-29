import { readFileSync, readdirSync } from 'node:fs';
import * as path from 'node:path';
import type { Plugin, ViteDevServer } from 'vite';
import { extractRawRefs, type RawTokenRef } from '../docs/components/search/tokens/tokenReferences';

export const TOKEN_REFS_MODULE = 'virtual:nui-token-refs';
const RESOLVED_ID = `\0${TOKEN_REFS_MODULE}`;

const SOURCE_FILE = /\.tsx?$/;
const STORY_FILE = /\.stories\.tsx$/;

function filesIn(directory: string, pattern: RegExp): string[] {
  return readdirSync(directory, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && pattern.test(entry.name))
    .map((entry) => path.join(entry.parentPath, entry.name));
}

function refsByFile(files: readonly string[]): Record<string, readonly RawTokenRef[]> {
  return Object.fromEntries(
    files.map((file) => [file, extractRawRefs(readFileSync(file, 'utf8'))] as const),
  );
}

/* Folders below the library root whose files feed the reference list. */
const SCANNED_FOLDERS = ['components', 'primitives'];

function scannedRoots(libraryRoot: string): string[] {
  return ['src', 'stories'].flatMap((base) =>
    SCANNED_FOLDERS.map((folder) => path.join(libraryRoot, base, folder) + path.sep),
  );
}

/*
 * addWatchFile only covers files that existed at the last load; a new or
 * deleted component must also rebuild the list, so the dev server reloads
 * the virtual module whenever such a file appears or disappears.
 */
function reloadOnAddOrRemove(server: ViteDevServer, libraryRoot: string): void {
  const roots = scannedRoots(libraryRoot);
  const reload = (file: string) => {
    const module = server.moduleGraph.getModuleById(RESOLVED_ID);

    if (module && roots.some((root) => file.startsWith(root))) {
      void server.reloadModule(module);
    }
  };

  /* The library lives outside the Storybook root, so its folders are watched explicitly. */
  server.watcher.add(roots);
  server.watcher.on('add', reload);
  server.watcher.on('unlink', reload);
}

/**
 * Serves `virtual:nui-token-refs`: the token references of every library
 * component, primitive and component story, computed in Node at build time.
 * The Search page used to inline the raw sources (~140 KB gzip) and scan them
 * in the browser; now it downloads only this small reference list.
 */
export function tokenRefsPlugin(libraryRoot: string): Plugin {
  const folders = SCANNED_FOLDERS;

  return {
    name: 'nui-token-refs',
    configureServer(server) {
      reloadOnAddOrRemove(server, libraryRoot);
    },
    resolveId(id) {
      return id === TOKEN_REFS_MODULE ? RESOLVED_ID : undefined;
    },
    load(id) {
      if (id !== RESOLVED_ID) {
        return undefined;
      }

      const components = folders.flatMap((folder) =>
        filesIn(path.join(libraryRoot, 'src', folder), SOURCE_FILE),
      );
      const stories = folders.flatMap((folder) =>
        filesIn(path.join(libraryRoot, 'stories', folder), STORY_FILE),
      );

      /* Dev server: editing a scanned file rebuilds the list on the next load. */
      [...components, ...stories].forEach((file) => this.addWatchFile(file));

      const sources = { components: refsByFile(components), stories: refsByFile(stories) };

      return `export const USAGE_SOURCES = ${JSON.stringify(sources)};`;
    },
  };
}
