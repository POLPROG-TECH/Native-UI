import type React from 'react';
import { useMemo } from 'react';
import { Pressable, type ViewStyle, type StyleProp } from 'react-native';
import { useTheme } from '../theme';
import { FieldFrame } from './field/FieldFrame';
import { SelectTriggerButton } from './select/SelectTriggerButton';
import { SelectOptionSheet } from './select/SelectOptionSheet';
import { useSelectState } from './select/useSelectState';
import { buildSelectRowStyles, selectStyles } from './select/selectStyles';
import { useSelectFocusRing } from './select/useSelectFocusRing';
import type { SelectProps } from './select/types';
export type { SelectOption, SelectProps } from './select/types';

export interface SelectTriggerProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  disabled?: boolean;
  testID?: string;
}

export interface SelectOptionItemProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  selected?: boolean;
  onPress?: () => void;
  testID?: string;
}

function SelectComponent<T extends string = string>(props: SelectProps<T>) {
  const { label, error, required, disabled = false, containerStyle, testID } = props;
  const theme = useTheme();
  const state = useSelectState({ ...props, disabled });

  return (
    <FieldFrame
      label={label}
      required={required}
      error={error}
      style={[{ marginBottom: theme.components.select.containerMarginBottom }, containerStyle]}
      testID={testID}
      overlay={
        <SelectOptionSheet
          {...props}
          state={state}
          testID={testID ? `${testID}-sheet` : undefined}
        />
      }
    >
      <SelectTriggerButton
        state={state}
        label={label}
        placeholder={props.placeholder}
        error={error}
        disabled={disabled}
      />
    </FieldFrame>
  );
}

/** Standalone trigger element for Select compound pattern. */
function SelectTrigger({ children, style, onPress, disabled, testID }: SelectTriggerProps) {
  const { select } = useTheme().components;
  const rowStyles = useMemo(() => buildSelectRowStyles(select), [select]);
  const { focusProps, focusRingStyle } = useSelectFocusRing('outside');

  return (
    <Pressable
      testID={testID}
      onPress={disabled ? undefined : onPress}
      {...focusProps}
      style={[selectStyles.trigger, rowStyles.trigger, style, focusRingStyle]}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
    >
      {children}
    </Pressable>
  );
}

SelectTrigger.displayName = 'Select.Trigger';

/** Standalone option row for Select compound pattern. */
function SelectOptionItem({ children, style, selected, onPress, testID }: SelectOptionItemProps) {
  const { select } = useTheme().components;
  const rowStyles = useMemo(() => buildSelectRowStyles(select), [select]);
  const { focusProps, focusRingStyle } = useSelectFocusRing('inset');

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      {...focusProps}
      style={[selectStyles.option, rowStyles.option, style, focusRingStyle]}
      accessibilityRole="radio"
      accessibilityState={{ selected: !!selected }}
    >
      {children}
    </Pressable>
  );
}

SelectOptionItem.displayName = 'Select.Option';

/**
 * Modal-based select/picker. Opens a scrollable option list in a `BottomSheet`
 * (drag handle, swipe and escape-gesture dismissal, width cap on tablets and
 * web) with a full-width Cancel action. No native picker dependencies.
 *
 * Supports both the monolithic API and a compound component pattern:
 *
 * @example Monolithic
 * ```tsx
 * const options = [
 *   { label: 'USD', value: 'usd', icon: (p) => <CashIcon {...p} /> },
 *   { label: 'EUR', value: 'eur', icon: '💶' },
 * ];
 * <Select label="Currency" value={currency} options={options} onChange={setCurrency} />
 * ```
 *
 * @example Compound
 * ```tsx
 * <Select.Trigger onPress={open}><Text>Pick...</Text></Select.Trigger>
 * <Select.Option selected={v === 'a'} onPress={() => pick('a')}><Text>A</Text></Select.Option>
 * ```
 */
export const Select = Object.assign(SelectComponent, {
  Trigger: SelectTrigger,
  Option: SelectOptionItem,
});
