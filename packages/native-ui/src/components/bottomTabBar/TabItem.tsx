import React, { useCallback } from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '../../primitives';
import { useFocusRing } from '../../hooks/useFocusRing';
import { useTheme } from '../../theme';
import type { BottomTabBarItem } from './types';
import { TabIndicator } from './TabIndicator';
import { formatBadge, shouldRenderBadge } from './tabBadge';
import {
  tabLayout,
  usePressableTabStyle,
  useTabLabelStyle,
  useTabStyles,
  type TabStyles,
} from './tabItemStyles';

interface TabBadgeProps {
  badge: BottomTabBarItem['badge'];
  tabStyles: TabStyles;
}

/** Count or text pill pinned to the icon's top-end corner. */
function TabBadge({ badge, tabStyles }: TabBadgeProps) {
  const theme = useTheme();

  if (!shouldRenderBadge(badge)) {
    return null;
  }

  return (
    <View style={[tabLayout.badge, tabStyles.badge, { backgroundColor: theme.colors.primary }]}>
      <Text style={[tabLayout.badgeText, tabStyles.badgeText, { color: theme.colors.onPrimary }]}>
        {formatBadge(
          badge,
          theme.components.bottomTabBar.maxNumericBadge,
          theme.labels.countOverflow,
        )}
      </Text>
    </View>
  );
}

interface TabIconProps {
  readonly item: BottomTabBarItem;
  readonly focused: boolean;
  readonly tabStyles: TabStyles;
  readonly testID?: string;
}

/**
 * Icon box: optional indicator pill, the consumer's icon and the badge. The
 * icon is tinted `primaryText` when active (readable on the pill fill) and
 * `textSecondary` when inactive.
 */
function TabIcon({ item, focused, tabStyles, testID }: TabIconProps) {
  const theme = useTheme();
  const tokens = theme.components.bottomTabBar;
  const color = focused ? theme.colors.primaryText : theme.colors.textSecondary;

  return (
    <View style={[tabLayout.iconWrap, tabStyles.iconWrap]}>
      {tokens.indicator === 'pill' && (
        <TabIndicator active={focused} testID={testID ? `${testID}-indicator` : undefined} />
      )}
      {item.icon({ color, size: tokens.iconSize, focused })}
      <TabBadge badge={item.badge} tabStyles={tabStyles} />
    </View>
  );
}

interface TabItemProps {
  readonly item: BottomTabBarItem;
  readonly focused: boolean;
  readonly onSelect: (key: string) => void;
  /** Tab root; the indicator pill receives `{testID}-indicator`. */
  readonly testID?: string;
}

/** One tab: icon with optional badge over a label, announced as a selectable tab. */
export const TabItem = React.memo(function TabItem({
  item,
  focused,
  onSelect,
  testID,
}: TabItemProps) {
  const theme = useTheme();
  const tabStyles = useTabStyles();
  const { focusProps, focusRingStyle } = useFocusRing();
  const handlePress = useCallback(() => onSelect(item.key), [item.key, onSelect]);
  const pressableStyle = usePressableTabStyle(tabStyles, focusRingStyle);
  const labelStyle = useTabLabelStyle(tabStyles, focused);

  return (
    <Pressable
      testID={testID}
      onPress={handlePress}
      {...focusProps}
      accessibilityRole="tab"
      accessibilityLabel={item.accessibilityLabel ?? item.label}
      accessibilityState={{ selected: focused }}
      style={pressableStyle}
      hitSlop={theme.components.bottomTabBar.hitSlop}
    >
      <TabIcon item={item} focused={focused} tabStyles={tabStyles} testID={testID} />
      <Text numberOfLines={1} style={labelStyle}>
        {item.label}
      </Text>
    </Pressable>
  );
});
