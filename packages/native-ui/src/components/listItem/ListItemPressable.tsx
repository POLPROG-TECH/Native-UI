import type React from 'react';
import { TouchableOpacity } from 'react-native';
import { useFocusRing } from '../../hooks/useFocusRing';
import { useTheme } from '../../theme';
import type { ListItemStyles } from './listItemStyles';

interface ListItemPressableProps {
  title: string;
  onPress: () => void;
  testID?: string;
  styles: ListItemStyles;
  children: React.ReactNode;
}

/**
 * Pressable wrapper of an enabled row. Draws the themed keyboard focus ring,
 * rounded like the row card so the outline hugs it.
 */
export function ListItemPressable({
  title,
  onPress,
  testID,
  styles,
  children,
}: ListItemPressableProps) {
  const theme = useTheme();
  const { focusProps, focusRingStyle } = useFocusRing();

  return (
    <TouchableOpacity
      {...focusProps}
      onPress={onPress}
      activeOpacity={theme.opacity.inactive}
      hitSlop={styles.hitSlop}
      style={[{ borderRadius: theme.components.listItem.radius }, focusRingStyle]}
      accessibilityRole="button"
      accessibilityLabel={title}
      testID={testID}
    >
      {children}
    </TouchableOpacity>
  );
}
