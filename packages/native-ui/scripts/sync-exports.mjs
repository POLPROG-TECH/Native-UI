#!/usr/bin/env node
/**
 * Keeps the `exports` map in package.json in sync with the source folders:
 * every subfolder of `src/components` and `src/primitives` gets a `null`
 * target, so internal files cannot be imported through the wildcard
 * subpaths. `--check` only compares and fails on a difference (CI).
 *
 * Usage: node scripts/sync-exports.mjs [--check]
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { buildExports } from './shared/exportsBuilder.mjs';

const MANIFEST = 'package.json';
const AREAS = ['primitives', 'components'];

function subfolders(area) {
  return readdirSync(`src/${area}`, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
const expected = buildExports(Object.fromEntries(AREAS.map((area) => [area, subfolders(area)])));
const inSync = JSON.stringify(manifest.exports) === JSON.stringify(expected);

if (inSync) {
  console.log('The exports map matches the source folders.');
  process.exit(0);
}

if (process.argv.includes('--check')) {
  console.error(
    'The exports map is out of date. Run `npm run exports:sync` and commit the result.',
  );
  process.exit(1);
}

writeFileSync(MANIFEST, `${JSON.stringify({ ...manifest, exports: expected }, null, 2)}\n`);
console.log('Updated the exports map in package.json.');
