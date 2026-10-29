/*
 * Public entry point. Each area's barrel decides what it exposes; the full
 * surface is recorded in api/native-ui.api.md and checked in CI
 * (`npm run api:check`), so additions and removals are always reviewed.
 */
export * from './theme';
export * from './tokens';
export * from './utils';
export * from './hooks';
export * from './primitives';
export * from './components';
export { buildComponentTokens, resolveComponentTokens } from './tokens/components';
export type {
  ComponentTokens,
  ComponentTokenOverrides,
  ComponentTokenContext,
} from './tokens/components';
