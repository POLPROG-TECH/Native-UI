import { useMemo } from 'react';
import { Box } from '../../primitives/Box';
import { renderIconSlot, type IconSlot } from '../../primitives/iconSlot';
import { useTheme } from '../../theme';
import type { Theme } from '../../theme/types';
import { withAlpha } from '../../tokens/colorUtils';

/**
 * Emoji to tint mapping for one row: the app-wide
 * `theme.components.settingsRow.iconColors` with the per-instance
 * `iconColorMap` prop merged on top.
 */
function useIconColorMap(
  iconColors: Readonly<Record<string, string>>,
  iconColorMap: Record<string, string> | undefined,
): Readonly<Record<string, string>> {
  return useMemo(
    () => (iconColorMap ? { ...iconColors, ...iconColorMap } : iconColors),
    [iconColors, iconColorMap],
  );
}

interface SquareColors {
  background: string;
  glyph: string;
}

/**
 * Emoji keep their historical faint tint from the color map. Vector icons sit
 * on a solid `primary` square in `onPrimary`, a pair the theme keeps readable.
 * Destructive rows use the error pair for both.
 */
function resolveSquareColors(
  theme: Theme,
  icon: IconSlot,
  colorMap: Readonly<Record<string, string>>,
  destructive: boolean,
): SquareColors {
  const tokens = theme.components.settingsRow;

  if (destructive) {
    return { background: theme.colors.errorLight, glyph: theme.colors.errorText };
  }

  if (typeof icon === 'string') {
    const tint = colorMap[icon] ?? tokens.fallbackIconColor;

    return { background: withAlpha(tint, tokens.iconTintAlpha), glyph: tint };
  }

  return { background: theme.colors.primary, glyph: theme.colors.onPrimary };
}

interface SettingsIconProps {
  icon: IconSlot;
  destructive?: boolean;
  iconColorMap?: Record<string, string>;
}

/** Renders the row icon inside a tinted rounded square. */
export function SettingsIcon({ icon, destructive = false, iconColorMap }: SettingsIconProps) {
  const theme = useTheme();
  const tokens = theme.components.settingsRow;
  const colorMap = useIconColorMap(tokens.iconColors, iconColorMap);
  const colors = resolveSquareColors(theme, icon, colorMap, destructive);
  const size = typeof icon === 'string' ? tokens.emojiFontSize : tokens.iconSize;

  return (
    <Box
      style={{
        width: tokens.iconBoxSize,
        height: tokens.iconBoxSize,
        borderRadius: tokens.iconRadius,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background,
      }}
    >
      {renderIconSlot(icon, { color: colors.glyph, size })}
    </Box>
  );
}
