import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../theme';
import { ListItemPressable } from './listItem/ListItemPressable';
import { ListItemRow } from './listItem/ListItemRow';
import { useListItemStyles } from './listItem/listItemStyles';
import type { ListItemProps } from './listItem/types';
export type { ListItemProps } from './listItem/types';

/**
 * Configurable list row for settings screens, menus, and data lists.
 * Supports leading icon, subtitle, trailing value or element, and a
 * disclosure chevron that appears automatically for pressable rows.
 *
 * Accepts render props (`renderIcon`, `renderTrailing`) as alternatives to
 * the static `icon` and `trailing` props. Render props take priority when both
 * are provided.
 *
 * @example
 * ```tsx
 * <ListItem
 *   title="Notifications"
 *   icon={({ color, size }) => <SystemIcon name="info" color={color} size={size} />}
 *   onPress={openNotifs}
 * />
 * <ListItem title="Legacy" icon="🔔" />
 * <ListItem title="Dark Mode" trailing={<Switch value={dark} />} />
 * <ListItem title="Delete Account" destructive onPress={confirmDelete} />
 * <ListItem title="Profile" renderIcon={() => <Avatar size="sm" />} />
 * ```
 */
export const ListItem = React.memo(function ListItem({
  hideDivider: _hideDivider,
  ...props
}: ListItemProps) {
  const { title, onPress, disabled = false, testID } = props;
  const theme = useTheme();
  const styles = useListItemStyles();
  const content = <ListItemRow {...props} styles={styles} />;

  if (onPress && !disabled) {
    return (
      <ListItemPressable title={title} onPress={onPress} testID={testID} styles={styles}>
        {content}
      </ListItemPressable>
    );
  }

  return (
    <View style={disabled ? { opacity: theme.opacity.disabled } : undefined} testID={testID}>
      {content}
    </View>
  );
});
