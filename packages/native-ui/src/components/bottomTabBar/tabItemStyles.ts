import { useCallback, useMemo } from 'react';
import { StyleSheet, type ViewStyle } from 'react-native';
import { useTheme } from '../../theme';
import type { BottomTabBarTokens } from '../../tokens/components';

/**
 * Vertical room the pill needs beyond the icon box. Reserved as margin so a
 * pill taller than the icon never overlaps the label or the bar edge.
 */
function indicatorOverhang(tokens: BottomTabBarTokens): number {
  if (tokens.indicator !== 'pill') {
    return 0;
  }

  return Math.max(0, (tokens.indicatorHeight - tokens.iconWrapSize) / 2);
}

/** Token-driven tab geometry. */
export function buildTabStyles(tokens: BottomTabBarTokens) {
  return StyleSheet.create({
    item: {
      paddingVertical: tokens.itemPaddingVertical,
      minHeight: tokens.itemMinHeight,
    },
    iconWrap: {
      width: tokens.iconWrapSize,
      height: tokens.iconWrapSize,
      marginVertical: indicatorOverhang(tokens),
    },
    badge: {
      top: tokens.badgeOffsetTop,
      right: tokens.badgeOffsetEnd,
      minWidth: tokens.badgeSize,
      height: tokens.badgeSize,
      borderRadius: tokens.badgeSize / 2,
      paddingHorizontal: tokens.badgePaddingHorizontal,
    },
    badgeText: {
      fontSize: tokens.badgeFontSize,
      lineHeight: tokens.badgeLineHeight,
    },
    label: {
      fontSize: tokens.labelFontSize,
      marginTop: tokens.labelMarginTop,
      letterSpacing: tokens.labelLetterSpacing,
    },
  });
}

export type TabStyles = ReturnType<typeof buildTabStyles>;

/** Memoized per token object, so re-renders reuse the same style references. */
export function useTabStyles(): TabStyles {
  const tokens = useTheme().components.bottomTabBar;

  return useMemo(() => buildTabStyles(tokens), [tokens]);
}

/** Pressable style callback that dims the tab while it is held down and draws the focus ring. */
export function usePressableTabStyle(tabStyles: TabStyles, focusRingStyle: ViewStyle | undefined) {
  const pressedOpacity = useTheme().opacity.inactive;

  return useCallback(
    ({ pressed }: { pressed: boolean }) => [
      tabLayout.item,
      tabStyles.item,
      pressed && { opacity: pressedOpacity },
      focusRingStyle,
    ],
    [tabStyles, pressedOpacity, focusRingStyle],
  );
}

/** Label tinted `primaryText` when active, `textTertiary` otherwise, in the medium font family. */
export function useTabLabelStyle(tabStyles: TabStyles, focused: boolean) {
  const theme = useTheme();
  const mediumFont = theme.fontFamilies.medium;
  const tint = focused ? theme.colors.primaryText : theme.colors.textTertiary;

  return useMemo(
    () => [tabLayout.label, tabStyles.label, { color: tint, fontFamily: mediumFont }],
    [tabStyles, tint, mediumFont],
  );
}

export const tabLayout = StyleSheet.create({
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontWeight: '700',
  },
  label: {
    fontWeight: '500',
  },
});
