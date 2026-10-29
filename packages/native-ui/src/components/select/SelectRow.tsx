import React, { useCallback, useMemo } from 'react';
import { Pressable, Text, View, type TextStyle, type ViewStyle } from 'react-native';
import { useTheme } from '../../theme';
import { SystemIcon } from '../../primitives/SystemIcon';
import { renderIconSlot, type IconSlot } from '../../primitives/iconSlot';
import { buildSelectRowStyles, selectStyles } from './selectStyles';
import { useSelectFocusRing } from './useSelectFocusRing';

/**
 * Everything a row needs from the theme, memoized once per theme so the
 * memoized rows only re-render when their own selection changes.
 */
export interface SelectRowAppearance {
  primaryColor: string;
  primaryLightColor: string;
  textPrimaryColor: string;
  textSecondaryColor: string;
  bodyStyle: TextStyle;
  optionStyle: ViewStyle;
  /** Size of the leading icon and of the selected checkmark. */
  iconSize: number;
}

export function useSelectRowAppearance(): SelectRowAppearance {
  const theme = useTheme();

  return useMemo(
    () => ({
      primaryColor: theme.colors.primaryText,
      primaryLightColor: theme.colors.primaryLight,
      textPrimaryColor: theme.colors.textPrimary,
      textSecondaryColor: theme.colors.textSecondary,
      bodyStyle: theme.typography.body,
      optionStyle: buildSelectRowStyles(theme.components.select).option,
      iconSize: theme.components.select.optionIconSize,
    }),
    [theme],
  );
}

interface SelectRowProps {
  label: string;
  icon?: IconSlot;
  value: string;
  isSelected: boolean;
  onSelect: (value: string) => void;
  appearance: SelectRowAppearance;
}

/** One option of the built-in sheet, announced as a radio of the list's radiogroup. */
export const SelectRow = React.memo(function SelectRow(props: SelectRowProps) {
  const { value, isSelected, onSelect, appearance } = props;
  const handlePress = useCallback(() => onSelect(value), [onSelect, value]);
  const { focusProps, focusRingStyle } = useSelectFocusRing('inset');

  return (
    <Pressable
      onPress={handlePress}
      {...focusProps}
      style={[
        selectStyles.option,
        appearance.optionStyle,
        isSelected && { backgroundColor: appearance.primaryLightColor },
        focusRingStyle,
      ]}
      accessibilityRole="radio"
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={props.label}
    >
      <SelectRowContent {...props} />
    </Pressable>
  );
});

/** Icon, label and the selected checkmark, tinted by the selection state. */
function SelectRowContent({ label, icon, isSelected, appearance }: SelectRowProps) {
  const labelColor = isSelected ? appearance.primaryColor : appearance.textPrimaryColor;
  const iconColor = isSelected ? appearance.primaryColor : appearance.textSecondaryColor;

  return (
    <>
      {icon ? (
        /* Decorative: the row's accessible name is the label alone. */
        <View importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
          {renderIconSlot(icon, { color: iconColor, size: appearance.iconSize })}
        </View>
      ) : null}
      <Text style={[appearance.bodyStyle, { color: labelColor, flex: 1 }]}>{label}</Text>
      {isSelected && (
        <SystemIcon name="check" color={appearance.primaryColor} size={appearance.iconSize} />
      )}
    </>
  );
}
