/**
 * Reads the lowest supported version out of the `peerDependencies` ranges, so
 * the compatibility check installs exactly what package.json promises.
 */

const LOWER_BOUND = /^>=\s*(\d+\.\d+\.\d+)$/;

export function minimumVersion(range) {
  const match = LOWER_BOUND.exec(range.trim());

  if (!match) {
    throw new Error(`Peer range "${range}" is not a plain ">=x.y.z" lower bound.`);
  }

  return match[1];
}

/**
 * `name@version` install specs for every required peer. Optional peers are
 * left out: an app may not install them at all.
 */
export function minimumPeerSpecs(peerDependencies, peerDependenciesMeta = {}) {
  return Object.entries(peerDependencies)
    .filter(([name]) => peerDependenciesMeta[name]?.optional !== true)
    .map(([name, range]) => `${name}@${minimumVersion(range)}`);
}
