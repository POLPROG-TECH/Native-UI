#!/usr/bin/env node
/**
 * Publish smoke-test: runs `npm pack --dry-run --json` in the current
 * working directory and verifies that required files are present, that every
 * target of the `exports` map is published and consistent (see
 * `shared/exportsMap.mjs`), and that the tarball stays under a sanity-check
 * size budget. Exits non-zero on any violation so CI can gate releases.
 *
 * Run from packages/native-ui/ after `npm run build`.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { findExportProblems } from './shared/exportsMap.mjs';

const REQUIRED_FILES = ['package.json', 'README.md', 'LICENSE'];
const BYTES_PER_KB = 1024;
const MAX_PACKED_BYTES = 5 * BYTES_PER_KB * BYTES_PER_KB;

function fail(title, lines) {
  console.error(title);

  for (const line of lines) {
    console.error(`   - ${line}`);
  }

  process.exit(1);
}

const toKb = (bytes) => (bytes / BYTES_PER_KB).toFixed(1);

const raw = execFileSync('npm', ['pack', '--dry-run', '--json'], { encoding: 'utf8' });
const manifest = JSON.parse(raw)[0];
const files = manifest.files.map((file) => file.path);
const missing = REQUIRED_FILES.filter((file) => !files.includes(file));

if (missing.length > 0) {
  fail('Tarball is missing required files:', missing);
}

const exportProblems = findExportProblems(
  JSON.parse(readFileSync('package.json', 'utf8')).exports,
  files,
);

if (exportProblems.length > 0) {
  fail('The exports map does not match the tarball:', exportProblems);
}

if (manifest.size > MAX_PACKED_BYTES) {
  fail('Tarball exceeds the size budget:', [
    `${toKb(manifest.size)} KB packed, limit ${toKb(MAX_PACKED_BYTES)} KB`,
  ]);
}

console.log(
  `Tarball OK: ${files.length} files, ${toKb(manifest.size)} KB packed / ${toKb(manifest.unpackedSize)} KB unpacked, exports map consistent`,
);
