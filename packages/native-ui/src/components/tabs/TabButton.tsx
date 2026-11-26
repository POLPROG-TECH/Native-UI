import type React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusRing } from '../../hooks/useFocusRing';
import { useTheme } from '../../theme';
import type { Theme } from '../../theme/types';
import { accessibilityStateProps } from '../../utils/accessibilityStateProps';

export interface TabItem<T extends string> {
  value: T;
  label: string;
  /** Rendered before the label (an icon or a Badge). */
  leading?: React.ReactNode;
  /** @default false */
  disabled?: boolean;
  /** Accessible name when it should differ from `label`. */
  accessibilityLabel?: string;
  testID?: string;
}

export interface TabButtonProps<T extends string> {
  tab: TabItem<T>;
  selected: boolean;
  disabled: boolean;
  /** Equal-width tabs share the row; scrollable tabs keep their own width. */
  stretch: boolean;
  onSelect: (value: T) => void;
}

function buttonStyle(theme: Theme, stretch: boolean, disabled: boolean) {
  const tokens = theme.components.tabs;

  return [
    styles.button,
    stretch && styles.stretch,
    {
      gap: tokens.gap,
      minHeight: tokens.minHeight,
      paddingHorizontal: tokens.paddingHorizontal,
    },
    disabled && { opacity: theme.opacity.disabled },
  ];
}

function indicatorStyle(theme: Theme, selected: boolean) {
  const tokens = theme.components.tabs;

  return [
    styles.indicator,
    {
      height: tokens.indicatorHeight,
      borderRadius: tokens.indicatorRadius,
      backgroundColor: selected ? (tokens.activeColor ?? theme.colors.primary) : 'transparent',
    },
  ];
}

export function TabButton<T extends string>(props: TabButtonProps<T>) {
  const { tab, selected, disabled } = props;
  const theme = useTheme();
  const tokens = theme.components.tabs;
  const { focusProps, focusRingStyle } = useFocusRing();
  const color = selected
    ? (tokens.activeColor ?? theme.colors.primaryText)
    : theme.colors.textSecondary;

  return (
    <Pressable
      testID={tab.testID}
      onPress={() => props.onSelect(tab.value)}
      {...focusProps}
      disabled={disabled}
      accessibilityLabel={tab.accessibilityLabel ?? tab.label}
      {...accessibilityStateProps('tab', { selected, disabled })}
      style={[buttonStyle(theme, props.stretch, disabled), focusRingStyle]}
    >
      {tab.leading}
      <Text numberOfLines={1} style={[theme.typography[tokens.labelVariant], { color }]}>
        {tab.label}
      </Text>
      <View style={indicatorStyle(theme, selected)} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stretch: {
    flex: 1,
  },
  indicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});
