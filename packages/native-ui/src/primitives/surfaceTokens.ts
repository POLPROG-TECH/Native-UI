import type { ViewStyle } from 'react-native';
import type { Theme } from '../theme/types';
import type { ColorScheme } from '../tokens/colors';
import type { BorderRadius, Spacing } from '../tokens/spacing';
import type { Mutable } from '../utils/types';

/** Color tokens usable as a background (excludes composite tokens like `chart`). */
export type ColorToken = Exclude<keyof ColorScheme, 'chart'>;

type SpacingShorthand = 'p' | 'px' | 'py' | 'm' | 'mx' | 'my';
type SpacingStyleKey =
  | 'padding'
  | 'paddingHorizontal'
  | 'paddingVertical'
  | 'margin'
  | 'marginHorizontal'
  | 'marginVertical';

/** Token shorthand props shared by `Box`, `VStack` and `HStack`. */
export interface SurfaceTokenProps extends Partial<Record<SpacingShorthand, Spacing>> {
  bg?: ColorToken;
  radius?: BorderRadius;
  flex?: number;
}

const SPACING_STYLE_KEYS: ReadonlyArray<readonly [SpacingShorthand, SpacingStyleKey]> = [
  ['p', 'padding'],
  ['px', 'paddingHorizontal'],
  ['py', 'paddingVertical'],
  ['m', 'margin'],
  ['mx', 'marginHorizontal'],
  ['my', 'marginVertical'],
];

/** Separates the token shorthand props from the props forwarded to the `View`. */
export function takeSurfaceTokens<P extends SurfaceTokenProps>(props: P) {
  const { p, px, py, m, mx, my, bg, radius, flex, ...rest } = props;
  const tokens: SurfaceTokenProps = { p, px, py, m, mx, my, bg, radius, flex };

  return { tokens, rest };
}

/**
 * Resolves token shorthands to a style. Only props that are set produce a
 * key, so an unset shorthand never overrides a value from `style`.
 */
export function buildSurfaceStyle(theme: Theme, tokens: SurfaceTokenProps): Mutable<ViewStyle> {
  const style: Mutable<ViewStyle> = {};

  for (const [shorthand, styleKey] of SPACING_STYLE_KEYS) {
    const spacing = tokens[shorthand];

    if (spacing !== undefined) {
      style[styleKey] = theme.spacing[spacing];
    }
  }

  if (tokens.bg !== undefined) {
    style.backgroundColor = theme.colors[tokens.bg];
  }

  if (tokens.radius !== undefined) {
    style.borderRadius = theme.borderRadius[tokens.radius];
  }

  if (tokens.flex !== undefined) {
    style.flex = tokens.flex;
  }

  return style;
}
