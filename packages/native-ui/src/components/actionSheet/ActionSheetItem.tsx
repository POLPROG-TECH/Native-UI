import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusRing } from '../../hooks/useFocusRing';
import { renderIconSlot, type IconSlot } from '../../primitives/iconSlot';
import { useTheme } from '../../theme';
import type { Theme } from '../../theme/types';
import { accessibilityStateProps } from '../../utils/accessibilityStateProps';

export interface ActionSheetAction {
  label: string;
  onPress: () => void;
  icon?: IconSlot;
  /** Draws the action in the error color (delete, sign out). @default false */
  destructive?: boolean;
  /** @default false */
  disabled?: boolean;
  testID?: string;
}

export interface ActionSheetItemProps {
  action: ActionSheetAction;
  /** Called with the action after the sheet has been asked to close. */
  onSelect: (action: ActionSheetAction) => void;
  divided: boolean;
}

function itemStyle(theme: Theme, divided: boolean, disabled: boolean) {
  const tokens = theme.components.actionSheet;

  return [
    styles.item,
    {
      gap: tokens.itemGap,
      minHeight: tokens.itemMinHeight,
      paddingHorizontal: tokens.itemPaddingHorizontal,
    },
    divided && { borderTopWidth: tokens.dividerWidth, borderTopColor: theme.colors.divider },
    disabled && { opacity: theme.opacity.disabled },
  ];
}

export function ActionSheetItem({ action, onSelect, divided }: ActionSheetItemProps) {
  const theme = useTheme();
  const tokens = theme.components.actionSheet;
  const { focusProps, focusRingStyle } = useFocusRing();
  const disabled = action.disabled === true;
  const color = action.destructive ? theme.colors.errorText : theme.colors.textPrimary;

  return (
    <Pressable
      testID={action.testID}
      onPress={() => onSelect(action)}
      {...focusProps}
      disabled={disabled}
      accessibilityLabel={action.label}
      {...accessibilityStateProps('menuitem', { disabled })}
      style={[itemStyle(theme, divided, disabled), focusRingStyle]}
    >
      {action.icon ? (
        /* Decorative: the item's accessible name is the label alone. */
        <View importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
          {renderIconSlot(action.icon, { color, size: tokens.iconSize })}
        </View>
      ) : null}
      <Text style={[theme.typography[tokens.labelVariant], styles.label, { color }]}>
        {action.label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    flex: 1,
  },
});
