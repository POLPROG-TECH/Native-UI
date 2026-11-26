/**
 * Builds the `exports` map of package.json from the source folders, so the
 * list of closed subpaths can never drift from what is on disk.
 */

function dualEntry(source, dist) {
  return {
    'react-native': source,
    import: { types: `${dist}.d.mts`, default: `${dist}.mjs` },
    require: { types: `${dist}.d.ts`, default: `${dist}.js` },
  };
}

/**
 * A wildcard such as `./components/*` also matches paths with slashes, which
 * would let Metro reach internal files (`components/button/buttonStyles`)
 * that are not built into `dist`. A `null` target for each subfolder closes
 * them on every platform.
 */
function closedSubfolders(area, folders) {
  return Object.fromEntries([...folders].sort().map((folder) => [`./${area}/${folder}/*`, null]));
}

/**
 * The full `exports` map. `folders` lists the subfolders of each wildcard
 * area: `{ primitives: ['marquee'], components: ['button', 'toast'] }`.
 */
export function buildExports(folders) {
  return {
    '.': dualEntry('./src/index.ts', './dist/index'),
    './primitives/*': dualEntry('./src/primitives/*.tsx', './dist/primitives/*'),
    ...closedSubfolders('primitives', folders.primitives),
    './components/*': dualEntry('./src/components/*.tsx', './dist/components/*'),
    ...closedSubfolders('components', folders.components),
    './tokens': dualEntry('./src/tokens/index.ts', './dist/tokens/index'),
    './theme': dualEntry('./src/theme/index.ts', './dist/theme/index'),
    './package.json': './package.json',
  };
}
