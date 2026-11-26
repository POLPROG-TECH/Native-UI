/**
 * Checks of the `exports` map in package.json against the files that are
 * actually published. Pure functions, so `verify-tarball.mjs` can run them
 * on the real tarball and the tests on small fixtures.
 */

/** Condition that makes Metro load the TypeScript sources instead of `dist`. */
export const SOURCE_CONDITION = 'react-native';

const WILDCARD = '*';

function isConditions(value) {
  return typeof value === 'object' && value !== null;
}

export function exportLeaves(entry, conditions = []) {
  if (typeof entry === 'string') {
    return [{ conditions, target: entry }];
  }

  if (!isConditions(entry)) {
    return [];
  }

  return Object.entries(entry).flatMap(([condition, nested]) =>
    exportLeaves(nested, [...conditions, condition]),
  );
}

function withoutDotSlash(target) {
  return target.replace(/^\.\//, '');
}

export function wildcardMatches(target, files) {
  const [prefix, suffix] = withoutDotSlash(target).split(WILDCARD);

  return files
    .filter((file) => file.startsWith(prefix) && file.endsWith(suffix))
    .map((file) => file.slice(prefix.length, file.length - suffix.length))
    .filter((name) => name.length > 0);
}

function missingTargetProblem(subpath, leaf, files) {
  const published = leaf.target.includes(WILDCARD)
    ? wildcardMatches(leaf.target, files).length > 0
    : files.includes(withoutDotSlash(leaf.target));

  if (published) {
    return null;
  }

  return `${subpath} [${leaf.conditions.join(' > ')}]: ${leaf.target} is not in the tarball`;
}

function hasSourceCondition(leaves) {
  return leaves.some((leaf) => leaf.conditions[0] === SOURCE_CONDITION);
}

/**
 * A package that serves sources to Metro on one subpath and `dist` on another
 * loads two copies of every module, so the theme context of the provider and
 * of a component imported from the other subpath no longer match.
 */
function mixedSourceProblems(entries) {
  const code = entries.filter(({ leaves }) => leaves.some((leaf) => leaf.conditions.length > 0));
  const withSource = code.filter(({ leaves }) => hasSourceCondition(leaves));

  if (withSource.length === 0 || withSource.length === code.length) {
    return [];
  }

  return code
    .filter(({ leaves }) => !hasSourceCondition(leaves))
    .map(
      ({ subpath }) =>
        `${subpath}: no "${SOURCE_CONDITION}" condition, while other subpaths have one (Metro would load a second copy of the library)`,
    );
}

function closedPatterns(exportsField) {
  return Object.entries(exportsField)
    .filter(([, entry]) => entry === null)
    .map(([subpath]) => subpath);
}

function isClosed(subpath, name, closed) {
  const concrete = subpath.replace(WILDCARD, name);

  return closed.some((pattern) => {
    const [prefix, suffix = ''] = pattern.split(WILDCARD);

    return (
      concrete.length > prefix.length && concrete.startsWith(prefix) && concrete.endsWith(suffix)
    );
  });
}

function builtOnlyProblems(subpath, leaf, sourceNames, files) {
  return wildcardMatches(leaf.target, files)
    .filter((name) => !sourceNames.has(name))
    .map((name) => `${subpath}: "${name}" resolves to ${leaf.target} but has no source file`);
}

function sourceOnlyProblems(subpath, leaf, sourceNames, files) {
  const built = new Set(wildcardMatches(leaf.target, files));

  return [...sourceNames]
    .filter((name) => !built.has(name))
    .map(
      (name) =>
        `${subpath}: "${name}" resolves through sources only (${leaf.target} is missing); close the folder with a null target or build the file`,
    );
}

/**
 * A wildcard subpath must expose the same names from sources and from `dist`.
 * A name only in `dist` breaks Metro; a name only in sources is an internal
 * file that leaks to React Native apps and to no one else.
 */
function unpairedWildcardProblems(subpath, leaves, files, closed) {
  const source = leaves.find((leaf) => leaf.conditions[0] === SOURCE_CONDITION);

  if (!source?.target.includes(WILDCARD)) {
    return [];
  }

  const sourceNames = new Set(
    wildcardMatches(source.target, files).filter((name) => !isClosed(subpath, name, closed)),
  );

  return leaves
    .filter((leaf) => leaf !== source)
    .flatMap((leaf) => [
      ...builtOnlyProblems(subpath, leaf, sourceNames, files),
      ...sourceOnlyProblems(subpath, leaf, sourceNames, files),
    ]);
}

/**
 * Every problem found in the `exports` map, as human readable messages.
 * `files` are the tarball paths relative to the package root.
 */
export function findExportProblems(exportsField, files) {
  const entries = Object.entries(exportsField).map(([subpath, entry]) => ({
    subpath,
    leaves: exportLeaves(entry),
  }));

  const missing = entries.flatMap(({ subpath, leaves }) =>
    leaves.map((leaf) => missingTargetProblem(subpath, leaf, files)).filter(Boolean),
  );
  const closed = closedPatterns(exportsField);
  const unpaired = entries.flatMap(({ subpath, leaves }) =>
    unpairedWildcardProblems(subpath, leaves, files, closed),
  );

  return [...new Set([...missing, ...mixedSourceProblems(entries), ...unpaired])];
}
