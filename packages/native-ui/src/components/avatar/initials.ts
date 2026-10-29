const MAX_INITIALS = 2;
const UNKNOWN_INITIALS = '?';

/**
 * Initials shown when there is no image: explicit `initials` win, then the
 * first letter of the first two words of `name`, then "?". Always at most two
 * uppercase characters.
 */
export function resolveInitials(initials: string | undefined, name: string | undefined): string {
  const derivedFromName = name
    ? name
        .trim()
        .split(/\s+/)
        .slice(0, MAX_INITIALS)
        .map((word) => word.charAt(0))
        .join('')
    : undefined;

  return (initials ?? derivedFromName ?? UNKNOWN_INITIALS).slice(0, MAX_INITIALS).toUpperCase();
}
