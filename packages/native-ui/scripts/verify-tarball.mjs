#!/usr/bin/env node
/**
 * Publish smoke-test: runs `npm pack --dry-run --json` in the current
 * working directory, verifies that required files are present in the
 * resulting tarball, and that the tarball stays under a sanity-check
 * size budget. Exits non-zero on any violation so CI can gate releases.
 *
 * Run from packages/native-ui/ (or pass --cwd).
 */
import { execFileSync } from 'node:child_process';

const REQUIRED_FILES = [
  'package.json',
  'README.md',
  'LICENSE',
  'dist/index.js',
  'dist/index.mjs',
  'dist/index.d.ts',
];
const MAX_PACKED_BYTES = 5 * 1024 * 1024;

const raw = execFileSync('npm', ['pack', '--dry-run', '--json'], {
  encoding: 'utf8',
});
const manifest = JSON.parse(raw)[0];
const present = new Set(manifest.files.map((f) => f.path));

const missing = REQUIRED_FILES.filter((p) => !present.has(p));
if (missing.length > 0) {
  console.error('❌ Tarball is missing required files:');
  for (const p of missing) console.error('   - ' + p);
  process.exit(1);
}

if (manifest.size > MAX_PACKED_BYTES) {
  console.error(
    `❌ Tarball exceeds ${(MAX_PACKED_BYTES / 1024 / 1024).toFixed(1)} MB budget: ${(
      manifest.size /
      1024 /
      1024
    ).toFixed(2)} MB`,
  );
  process.exit(1);
}

console.log(
  `✅ Tarball OK - ${manifest.files.length} files, ${(manifest.size / 1024).toFixed(
    1,
  )} KB packed / ${(manifest.unpackedSize / 1024).toFixed(1)} KB unpacked`,
);
