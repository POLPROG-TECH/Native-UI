import type { StyleProp, TextStyle } from 'react-native';
import type { Theme } from '../../theme/types';
import type { ListHeaderSize, ListHeaderTransform } from './types';

type NativeTextTransform = 'uppercase' | 'lowercase' | 'capitalize';

/** Typography and color role per size; geometry lives in the component tokens. */
interface SizeConfig {
  typographyKey: 'h1' | 'h3' | 'title' | 'overline';
  useMutedColor: boolean;
  defaultTransform: ListHeaderTransform;
}

const SIZE_CONFIG: Record<ListHeaderSize, SizeConfig> = {
  lg: { typographyKey: 'h1', useMutedColor: false, defaultTransform: 'none' },
  md: { typographyKey: 'h3', useMutedColor: false, defaultTransform: 'none' },
  sm: { typographyKey: 'title', useMutedColor: false, defaultTransform: 'none' },
  xs: { typographyKey: 'overline', useMutedColor: true, defaultTransform: 'uppercase' },
};

export interface ResolvedHeaderTitle {
  displayTitle: string;
  textTransform?: NativeTextTransform;
}

/**
 * Native transforms are applied as a style, so the rendered string stays the
 * source title; a function transform rewrites the string itself.
 */
export function applyHeaderTransform(
  title: string,
  transform: ListHeaderTransform,
): ResolvedHeaderTitle {
  if (typeof transform === 'function') {
    return { displayTitle: transform(title) };
  }

  if (transform === 'uppercase' || transform === 'lowercase' || transform === 'capitalize') {
    return { displayTitle: title, textTransform: transform };
  }

  return { displayTitle: title };
}

/** Applies the explicit `transform`, falling back to the size's default. */
export function resolveHeaderTitle(
  title: string,
  size: ListHeaderSize,
  transform: ListHeaderTransform | undefined,
): ResolvedHeaderTitle {
  return applyHeaderTransform(title, transform ?? SIZE_CONFIG[size].defaultTransform);
}

/** Title text style for a size: typography role, color role and token letter spacing. */
export function buildHeaderTitleStyle(
  theme: Theme,
  size: ListHeaderSize,
  textTransform: NativeTextTransform | undefined,
): StyleProp<TextStyle> {
  const config = SIZE_CONFIG[size];
  const { letterSpacing } = theme.components.listHeader[size];

  return [
    theme.typography[config.typographyKey],
    { color: config.useMutedColor ? theme.colors.textTertiary : theme.colors.textPrimary },
    textTransform ? { textTransform } : null,
    letterSpacing !== undefined ? { letterSpacing } : null,
  ];
}
