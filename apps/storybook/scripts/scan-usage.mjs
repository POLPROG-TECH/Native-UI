#!/usr/bin/env node
/**
 * Scans the production apps for the native-ui components they import or
 * re-export and writes docs/data/production-usage.json, which component
 * docs pages show as "Part of the UI kit of". A re-export counts: CostBoard
 * builds its UI layer (src/shared/ui) on top of these components. The output is committed: CI has no access
 * to the app repositories, so the snapshot is refreshed by hand with
 * `npm run scan-usage` whenever an app changes. Apps missing on disk are
 * skipped with a warning instead of being reported as unused.
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const libraryRoot = path.resolve(appRoot, '../../packages/native-ui');
const outputFile = path.join(appRoot, 'docs', 'data', 'production-usage.json');

/** Apps to scan, relative to the monorepo's parent folder (workspace layout). */
const APPS = [
  {
    name: 'CostBoard',
    url: 'https://polprog.pl/apps/CostBoard/',
    source: '../MobileApps/CostBoard/src',
  },
  {
    name: 'PhotoToPuzzle',
    url: 'https://polprog.pl/apps/PhotoToPuzzle/',
    source: '../MobileApps/PhotoToPuzzle/src',
  },
];

const SOURCE_FILE = /\.(ts|tsx|js|jsx)$/;
/*
 * Named imports and re-exports, with either quote style, an optional default
 * import before the braces, and deep paths such as '@polprog/native-ui/x'.
 */
const LIBRARY_SPECIFIER = String.raw`['"]@polprog\/native-ui(?:\/[^'"]*)?['"]`;
const FROM_LIBRARY = new RegExp(
  String.raw`(?:import|export)\s+(?:type\s+)?(?:[\w$]+\s*,\s*)?\{([^}]+)\}\s*from\s*` +
    LIBRARY_SPECIFIER,
  'g',
);
/* `export * from '@polprog/native-ui'` puts the whole library into the app's kit. */
const EXPORT_ALL = new RegExp(String.raw`export\s*\*\s*from\s*` + LIBRARY_SPECIFIER);

function libraryExports() {
  const barrels = ['src/components/index.ts', 'src/primitives/index.ts'];
  const text = barrels.map((file) => readFileSync(path.join(libraryRoot, file), 'utf8')).join('\n');

  return new Set(
    [...text.matchAll(/^export \{([^}]+)\} from/gm)].flatMap((match) =>
      match[1].split(',').map((name) => name.trim()),
    ),
  );
}

function sourceFiles(directory) {
  return readdirSync(directory, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && SOURCE_FILE.test(entry.name))
    .map((entry) => path.join(entry.parentPath, entry.name));
}

/** Imported names, with `Original as Alias` reduced to the library's name. */
function importedNames(file, known) {
  const text = readFileSync(file, 'utf8');

  if (EXPORT_ALL.test(text)) {
    return [...known];
  }

  return [...text.matchAll(FROM_LIBRARY)].flatMap((match) =>
    match[1].split(',').map((part) =>
      part
        .replace(/^\s*type\s+/, '')
        .split(/\s+as\s+/)[0]
        .trim(),
    ),
  );
}

function scanApp(app, known) {
  const directory = path.resolve(appRoot, '..', '..', '..', app.source);

  if (!existsSync(directory)) {
    console.warn(`skip ${app.name}: ${directory} not found`);

    return null;
  }

  const names = sourceFiles(directory).flatMap((file) => importedNames(file, known));

  return [...new Set(names)].filter((name) => known.has(name) && /^[A-Z]/.test(name)).sort();
}

function invert(appUsage) {
  const usage = {};

  appUsage.forEach(({ app, components }) => {
    components.forEach((component) => {
      usage[component] = [...(usage[component] ?? []), app];
    });
  });

  return usage;
}

const known = libraryExports();
const scanned = APPS.map((app) => ({ app: app.name, components: scanApp(app, known) })).filter(
  (entry) => entry.components !== null,
);

const snapshot = {
  scannedAt: new Date().toISOString().slice(0, 10),
  apps: APPS.filter((app) => scanned.some((entry) => entry.app === app.name)).map(
    ({ name, url }) => ({ name, url }),
  ),
  usage: invert(scanned),
};

writeFileSync(outputFile, `${JSON.stringify(snapshot, null, 2)}\n`);
scanned.forEach((entry) => console.log(`${entry.app}: ${entry.components.length} components`));
