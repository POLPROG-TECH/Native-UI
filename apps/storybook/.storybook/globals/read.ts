import type { Globals, GlobalTypes } from 'storybook/internal/types';
import { GLOBALS, type GlobalDefinition, type GlobalKey } from './definitions';

/** Value type of one global, derived from its option list. */
export type GlobalValue<Key extends GlobalKey> = (typeof GLOBALS)[Key]['options'][number]['value'];

function isOptionOf<Value extends string>(
  definition: GlobalDefinition<Value>,
  raw: unknown,
): raw is Value {
  return definition.options.some((option) => option.value === raw);
}

/**
 * Reads a global with a type guard instead of a cast: a stale URL value
 * or a removed option falls back to the declared default.
 */
export function readGlobal<Key extends GlobalKey>(globals: Globals, key: Key): GlobalValue<Key> {
  const definition: GlobalDefinition<GlobalValue<Key>> = GLOBALS[key];
  const raw: unknown = globals[key];

  return isOptionOf(definition, raw) ? raw : definition.defaultValue;
}

/**
 * Global types for the preview. No `toolbar` entries: the manager's
 * Appearance menu renders every global from the same definitions.
 */
export function previewGlobalTypes(): GlobalTypes {
  return Object.fromEntries(
    Object.entries(GLOBALS).map(([key, definition]) => [
      key,
      { name: definition.title, description: definition.description },
    ]),
  );
}

/** Defaults for `initialGlobals`, so stories render without a URL. */
export function previewInitialGlobals(): Globals {
  return Object.fromEntries(
    Object.entries(GLOBALS).map(([key, definition]) => [key, definition.defaultValue]),
  );
}
