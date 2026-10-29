/**
 * Whether an error boundary's `resetKeys` changed between renders.
 * `undefined` and `[]` are equivalent (no keys), so only a change in contents
 * counts: a length change or any index whose value differs by identity.
 */
export function resetKeysChanged(
  prev: ReadonlyArray<unknown> | undefined,
  next: ReadonlyArray<unknown> | undefined,
): boolean {
  const previousKeys = prev ?? [];
  const nextKeys = next ?? [];

  if (previousKeys.length !== nextKeys.length) {
    return true;
  }

  for (let index = 0; index < previousKeys.length; index++) {
    if (previousKeys[index] !== nextKeys[index]) {
      return true;
    }
  }

  return false;
}
