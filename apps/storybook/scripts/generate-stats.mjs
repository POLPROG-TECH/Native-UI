#!/usr/bin/env node
/**
 * Writes generated/stats.json for the Introduction and Dashboard pages, so
 * their numbers come from the repository instead of being typed by hand.
 *
 * Inventory (components, primitives, presets, stories) is read from source.
 * Test and coverage numbers come from the last Jest report
 * (`npm run test:report` or `test:ci` in packages/native-ui); without one
 * they are `null` and the pages print "n/a" rather than a guess.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const libraryRoot = path.resolve(appRoot, '../../packages/native-ui');
const outputFile = path.join(appRoot, 'generated', 'stats.json');

const read = (relative) => readFileSync(path.join(libraryRoot, relative), 'utf8');

/** PascalCase value exports of a barrel file (types and helpers excluded). */
function componentExports(relative) {
  const names = [...read(relative).matchAll(/^export \{([^}]+)\} from/gm)].flatMap((match) =>
    match[1].split(',').map((name) => name.trim()),
  );

  return names.filter((name) => /^[A-Z][A-Za-z]+$/.test(name) && !name.endsWith('Props'));
}

function countMatches(relative, pattern) {
  return [...read(relative).matchAll(pattern)].length;
}

function storyFiles(directory) {
  return readdirSync(directory, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.stories.tsx'))
    .map((entry) => path.join(entry.parentPath, entry.name));
}

/** Story exports across the library and host story folders (one Vitest test each). */
function storyCount() {
  const files = [
    ...storyFiles(path.join(libraryRoot, 'stories')),
    ...storyFiles(path.join(appRoot, 'stories')),
  ];

  return files.reduce(
    (sum, file) =>
      sum + [...readFileSync(file, 'utf8').matchAll(/^export const [A-Z]\w*/gm)].length,
    0,
  );
}

function documentedComponents(components) {
  const titles = storyFiles(path.join(libraryRoot, 'stories')).flatMap((file) =>
    [...readFileSync(file, 'utf8').matchAll(/title: '(?:Components|Primitives)\/(\w+)'/g)].map(
      (match) => match[1],
    ),
  );

  return components.filter((name) => titles.includes(name)).length;
}

function readJson(relative) {
  const file = path.join(libraryRoot, relative);

  return existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : null;
}

function testStats() {
  const report = readJson('coverage/jest-results.json');

  if (!report) {
    return null;
  }

  return {
    total: report.numTotalTests,
    passed: report.numPassedTests,
    suites: report.numTotalTestSuites,
  };
}

function coverageStats() {
  const summary = readJson('coverage/coverage-summary.json');

  if (!summary) {
    return null;
  }

  const { lines, branches, functions, statements } = summary.total;

  return {
    lines: lines.pct,
    branches: branches.pct,
    functions: functions.pct,
    statements: statements.pct,
  };
}

function inventory() {
  const components = componentExports('src/components/index.ts');
  const primitives = componentExports('src/primitives/index.ts');

  return {
    components: components.length,
    primitives: primitives.length,
    documented: documentedComponents([...components, ...primitives]),
    presets:
      countMatches('src/tokens/palettes/presets.ts', /id: '/g) +
      countMatches('src/tokens/bloomPalette.ts', /bloomPreset\('/g),
    typeVariants: countMatches('src/tokens/typeScales/types.ts', /^\s+\w+: TypographyStyle;/gm),
    stories: storyCount(),
    patterns: storyFiles(path.join(libraryRoot, 'stories', 'patterns')).length,
  };
}

const stats = {
  version: JSON.parse(read('package.json')).version,
  generatedAt: new Date().toISOString(),
  ...inventory(),
  tests: testStats(),
  coverage: coverageStats(),
};

mkdirSync(path.dirname(outputFile), { recursive: true });
writeFileSync(outputFile, `${JSON.stringify(stats, null, 2)}\n`);
console.log(
  `stats.json: ${stats.components} components, ${stats.stories} stories, tests ${stats.tests ? stats.tests.total : 'n/a'}`,
);
