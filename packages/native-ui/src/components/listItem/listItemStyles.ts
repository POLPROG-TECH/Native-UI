import { useMemo } from 'react';
import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';
import { useTheme } from '../../theme';
import type { ListItemTokens } from '../../tokens/components';
import { useListSectionContext } from '../listSection/listSectionContext';

/** Token-driven row geometry shared by the row and its label/trailing regions. */
export function buildListItemStyles(tokens: ListItemTokens) {
  return {
    ...StyleSheet.create({
      row: { minHeight: tokens.minHeight, gap: tokens.gap },
      iconContainer: { width: tokens.iconBoxSize, height: tokens.iconBoxSize },
      subtitle: { marginTop: tokens.subtitleMarginTop },
      valueBeforeChevron: { marginRight: tokens.valueChevronGap },
      right: { gap: tokens.trailingGap },
    }),
    hitSlop: { top: tokens.pressHitSlop, bottom: tokens.pressHitSlop, left: 0, right: 0 },
  };
}

export type ListItemStyles = ReturnType<typeof buildListItemStyles>;

/** Memoized per token object, so re-renders reuse the same style references. */
export function useListItemStyles(): ListItemStyles {
  const tokens = useTheme().components.listItem;

  return useMemo(() => buildListItemStyles(tokens), [tokens]);
}

/**
 * Inside a grouped ListSection the section is the card, so the row keeps only
 * its vertical rhythm; standalone rows draw their own card surface.
 */
export function useRowSurfaceStyle(omitSpacing: boolean): ViewStyle {
  const theme = useTheme();
  const tokens = theme.components.listItem;
  const { grouped } = useListSectionContext();

  return useMemo<ViewStyle>(
    () =>
      grouped
        ? { paddingVertical: tokens.groupedPaddingVertical }
        : {
            backgroundColor: theme.colors.surface,
            borderRadius: tokens.radius,
            paddingVertical: tokens.paddingVertical,
            paddingHorizontal: tokens.paddingHorizontal,
            marginBottom: omitSpacing ? 0 : tokens.marginBottom,
          },
    [grouped, tokens, theme.colors.surface, omitSpacing],
  );
}

/** Muted color shared by the subtitle and the trailing value. */
export function useSecondaryTextStyle(): TextStyle {
  const textTertiary = useTheme().colors.textTertiary;

  return useMemo(() => ({ color: textTertiary }), [textTertiary]);
}

export const listItemLayout = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelContainer: {
    flex: 1,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
