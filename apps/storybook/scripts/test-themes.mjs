#!/usr/bin/env node
/**
 * Runs every Vitest theme project one after another. Running them all in a
 * single `vitest run` starts one Chromium per project at once, which on a
 * laptop times out iframes before any story renders; CI already gives each
 * project its own job. Project names are parsed from the shared matrix file
 * rather than repeated here. `--project` (either form) picks runs, as CI
 * does; any other argument is passed through to each run.
 */
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const matrix = readFileSync(path.join(appRoot, '.storybook/globals/themeMatrix.ts'), 'utf8');
const allProjects = [...matrix.matchAll(/project: '([\w-]+)'/g)].map((match) => match[1]);
/* npx is a .cmd shim on Windows; spawnSync without a shell needs the full name. */
const NPX = process.platform === 'win32' ? 'npx.cmd' : 'npx';

/**
 * Splits CLI arguments into the projects to run (`--project=x` or
 * `--project x`, repeatable) and everything else, which is passed through.
 */
function parseArgs(args) {
  const projects = [];
  const passThrough = [];

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const inline = arg.startsWith('--project=') ? arg.slice('--project='.length) : null;
    const separate = arg === '--project' ? (args[index + 1] ?? null) : null;

    if (inline !== null || separate !== null) {
      projects.push(inline ?? separate);
      index += separate !== null ? 1 : 0;
      continue;
    }

    passThrough.push(arg);
  }

  return { projects, passThrough };
}

const parsed = parseArgs(process.argv.slice(2));
const unknown = parsed.projects.filter((project) => !allProjects.includes(project));

if (unknown.length > 0) {
  console.error(
    `Unknown theme project(s): ${unknown.join(', ')}. Known: ${allProjects.join(', ')}`,
  );
  process.exit(1);
}

const projects = parsed.projects.length > 0 ? parsed.projects : allProjects;
const passThrough = parsed.passThrough;

const failed = projects.filter((project) => {
  console.log(`\n▶ ${project}`);
  const result = spawnSync(NPX, ['vitest', 'run', `--project=${project}`, ...passThrough], {
    cwd: appRoot,
    stdio: 'inherit',
  });

  return result.status !== 0;
});

if (failed.length > 0) {
  console.error(`\nFailed theme runs: ${failed.join(', ')}`);
  process.exit(1);
}
