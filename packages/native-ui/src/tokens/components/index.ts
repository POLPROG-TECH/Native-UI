import { mergeTokenGroup, type ComponentTokenContext, type TokenGroupOverrides } from './merge';
import { buildOverlayTokens, type OverlayTokens } from './overlays';
import { buildActionTokens, type ActionTokens } from './actions';
import { buildControlTokens, type ControlTokens } from './controls';
import { buildLayoutTokens, type LayoutTokens } from './layout';

/**
 * Per-component design tokens: every padding, size, duration and threshold a
 * component uses that is not already a global token. Components read them from
 * `theme.components`, and apps override them through `NativeUIConfig.components`.
 */
export type ComponentTokens = OverlayTokens & ActionTokens & ControlTokens & LayoutTokens;

/** Partial overrides, merged one component at a time. */
export type ComponentTokenOverrides = TokenGroupOverrides<ComponentTokens>;

/** Builds the default component tokens from the active global scales. */
export function buildComponentTokens(context: ComponentTokenContext): ComponentTokens {
  return {
    ...buildOverlayTokens(context),
    ...buildActionTokens(context),
    ...buildControlTokens(context),
    ...buildLayoutTokens(context),
  };
}

/** Builds the defaults and applies app overrides. */
export function resolveComponentTokens(
  context: ComponentTokenContext,
  overrides?: ComponentTokenOverrides,
): ComponentTokens {
  return mergeTokenGroup(buildComponentTokens(context), overrides);
}

export type { ComponentTokenContext, TokenGroupOverrides } from './merge';
export type * from './overlays';
export type * from './actions';
export type * from './controls';
export type * from './layout';
