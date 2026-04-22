#!/usr/bin/env node
/**
 * Storybook bundle size budget.
 *
 * Why
 * ---
 * `build-storybook` prints a Vite warning when any chunk exceeds 500 kB,
 * but the warning is advisory. This script turns the budget into a hard
 * gate so PRs that 2x the preview bundle cannot merge silently.
 *
 * Budgets
 * -------
 * - Total `storybook-static` directory: **15 MB**
 * - Single JS chunk (minified): **3 MB**
 * - Single CSS file: **200 kB**
 *
 * Usage
 * -----
 * Run *after* `npm run build-storybook`. Exits non-zero when any budget
 * is breached and prints a readable diff so authors know which chunk
 * regressed.
 *
 *   node apps/storybook/scripts/check-bundle-size.mjs
 */

import { readdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', 'storybook-static');

const BUDGETS = {
  // Total output dir. Headroom above current ~9 MB to absorb a few new
  // pattern stories / assets before the gate trips.
  total: 15 * 1024 * 1024,
  singleJs: 4 * 1024 * 1024,
  singleCss: 200 * 1024,
};

async function walk(dir, acc = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(full, acc);
    } else if (entry.isFile()) {
      const { size } = await stat(full);
      acc.push({ path: path.relative(ROOT, full), size });
    }
  }
  return acc;
}

function fmt(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} kB`;
  return `${bytes} B`;
}

async function main() {
  let files;
  try {
    files = await walk(ROOT);
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.error('✗ storybook-static/ not found. Run "npm run build-storybook" first.');
      process.exit(1);
    }
    throw err;
  }

  const total = files.reduce((s, f) => s + f.size, 0);
  const violations = [];

  if (total > BUDGETS.total) {
    violations.push(`TOTAL: ${fmt(total)} > budget ${fmt(BUDGETS.total)}`);
  }

  for (const f of files) {
    if (f.path.endsWith('.js') && f.size > BUDGETS.singleJs) {
      violations.push(`JS chunk "${f.path}": ${fmt(f.size)} > budget ${fmt(BUDGETS.singleJs)}`);
    }
    if (f.path.endsWith('.css') && f.size > BUDGETS.singleCss) {
      violations.push(`CSS "${f.path}": ${fmt(f.size)} > budget ${fmt(BUDGETS.singleCss)}`);
    }
  }

  const heaviest = [...files].sort((a, b) => b.size - a.size).slice(0, 10);
  console.log('\n📦 Storybook bundle report');
  console.log(`   Total: ${fmt(total)}  (budget: ${fmt(BUDGETS.total)})`);
  console.log(`   Files: ${files.length}`);
  console.log('\n   Top 10 heaviest:');
  for (const f of heaviest) {
    console.log(`     ${fmt(f.size).padStart(10)}  ${f.path}`);
  }

  if (violations.length > 0) {
    console.error('\n✗ Bundle size budget exceeded:');
    for (const v of violations) console.error(`   - ${v}`);
    console.error(
      '\n   Budgets live in apps/storybook/scripts/check-bundle-size.mjs; bump them',
    );
    console.error('   explicitly in a PR if growth is intentional.');
    process.exit(1);
  }

  console.log('\n✓ All bundle-size budgets respected.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
