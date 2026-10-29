import { USAGE_SOURCES as GENERATED } from 'virtual:nui-token-refs';
import type { TokenKind } from '../searchTypes';
import type { RawTokenRef } from './tokenReferences';
import type { RefFiles, UsageSources } from './tokenUsage';

const TOKEN_KINDS: readonly TokenKind[] = ['color', 'spacing', 'radius', 'typography'];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isTokenKind(value: unknown): value is TokenKind {
  return TOKEN_KINDS.some((kind) => kind === value);
}

function isRawRef(value: unknown): value is RawTokenRef {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    isTokenKind(value[0]) &&
    typeof value[1] === 'string'
  );
}

function isRefFiles(value: unknown): value is RefFiles {
  return (
    isRecord(value) &&
    Object.values(value).every((refs) => Array.isArray(refs) && refs.every(isRawRef))
  );
}

export function isUsageSources(value: unknown): value is UsageSources {
  return isRecord(value) && isRefFiles(value.components) && isRefFiles(value.stories);
}

/**
 * Token references of the library sources and component stories, computed at
 * build time by .storybook/tokenRefsPlugin.ts. The browser gets a short list
 * of [kind, key] pairs per file instead of the source text. The shape is
 * checked here because the virtual module is untyped across the build step.
 */
export function loadUsageSources(): UsageSources {
  if (!isUsageSources(GENERATED)) {
    throw new Error('virtual:nui-token-refs has an unexpected shape');
  }

  return GENERATED;
}
