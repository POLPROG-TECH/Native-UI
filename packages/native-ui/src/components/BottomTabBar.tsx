import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import { TabItem } from './bottomTabBar/TabItem';
import type { BottomTabBarItem } from './bottomTabBar/types';
export type { BottomTabBarItem } from './bottomTabBar/types';

export interface BottomTabBarProps {
  readonly items: readonly BottomTabBarItem[];
  readonly activeKey: string;
  readonly onSelect: (key: string) => void;
  /** Bottom safe-area inset (e.g. from `useSafeAreaInsets().bottom`). */
  readonly safeBottomInset?: number;
  readonly style?: StyleProp<ViewStyle>;
  /**
   * Test ID of the bar. Each tab receives `{testID}-{key}` and its indicator
   * pill `{testID}-{key}-indicator`.
   */
  readonly testID?: string;
}

/**
 * Opinionated bottom navigation bar modelled 1:1 on DailyForma's tab rail.
 *
 * Layout rules (match reference app exactly):
 *   • Surface = `colors.surface` (not `background`) - sits visually above canvas.
 *   • Top border hairline with `colors.border` (subtle).
 *   • Active label = `colors.primaryText`, inactive label = `colors.textTertiary`.
 *   • Icon renderers receive `colors.primaryText` (active) or `colors.textSecondary`.
 *   • The active icon sits on a pill (`colors.primaryLight` by default) that
 *     grows and fades in unless `reduceAnimations` is on; the
 *     `bottomTabBar.indicator` token set to `'none'` removes it.
 *   • Icon size, label size, paddings, badge geometry and the 44 pt minimum
 *     tap target come from `theme.components.bottomTabBar`; the platform
 *     bottom padding is added on top of `safeBottomInset`.
 */
export function BottomTabBar({
  items,
  activeKey,
  onSelect,
  safeBottomInset = 0,
  style,
  testID,
}: BottomTabBarProps) {
  const containerStyle = useBarStyle(safeBottomInset, style);

  return (
    <View testID={testID} style={containerStyle} accessibilityRole="tablist">
      {items.map((item) => (
        <TabItem
          key={item.key}
          item={item}
          focused={item.key === activeKey}
          onSelect={onSelect}
          testID={testID ? `${testID}-${item.key}` : undefined}
        />
      ))}
    </View>
  );
}

/** Surface, hairline and token paddings; the platform bottom padding sits on top of the inset. */
function useBarStyle(safeBottomInset: number, style: StyleProp<ViewStyle>): StyleProp<ViewStyle> {
  const theme = useTheme();
  const tokens = theme.components.bottomTabBar;
  const basePad = Platform.OS === 'ios' ? tokens.paddingBottomIos : tokens.paddingBottomAndroid;

  return [
    styles.bar,
    {
      backgroundColor: theme.colors.surface,
      borderTopColor: theme.colors.border,
      borderTopWidth: theme.borderWidth.hairline,
      paddingTop: tokens.paddingTop,
      paddingBottom: basePad + safeBottomInset,
    },
    style,
  ];
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
});
