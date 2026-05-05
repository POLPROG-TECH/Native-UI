import React, { useState, useCallback } from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  Modal,
  FlatList,
  Pressable,
  type ViewStyle,
  type TextStyle,
  type StyleProp,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { FieldLabel } from './FieldLabel';
import { FieldError } from './FieldError';

export interface SelectOption<T extends string = string> {
  /** Human-readable label shown in the dropdown list. */
  label: string;
  /** Unique value representing this option. */
  value: T;
  /** Optional leading emoji or icon string displayed beside the label. */
  icon?: string;
}

// ─── Compound sub-component props ──────────────────────────────

export interface SelectTriggerProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  disabled?: boolean;
}

export interface SelectOptionItemProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  selected?: boolean;
  onPress?: () => void;
}

// ─── Main select props ─────────────────────────────────────────

export interface SelectProps<T extends string = string> {
  /** Label displayed above the trigger in uppercase. */
  label?: string;
  /** The currently selected value, or `null` when nothing is selected. */
  value?: T | null;
  /** Alias for `value`. Ignored when `value` is also provided. */
  selectedValue?: T | null;
  /** Array of options displayed in the dropdown list. */
  options: SelectOption<T>[];
  /** Callback fired when the user picks an option. Receives the selected `value`. */
  onChange?: (value: T) => void;
  /** Alias for `onChange`. Invoked when both are provided. */
  onValueChange?: (value: T) => void;
  /**
   * Placeholder text shown when no value is selected.
   * @default 'Select...'
   */
  placeholder?: string;
  /** Error message displayed below the trigger in the theme's error color. */
  error?: string;
  /**
   * Marks the field as required by appending a red asterisk to the label.
   * @default false
   */
  required?: boolean;
  /**
   * When `true`, dims the trigger and prevents opening the dropdown.
   * @default false
   */
  disabled?: boolean;
  /** Additional styles applied to the outer wrapper `View`. */
  containerStyle?: ViewStyle;
}

/**
 * Modal-based select/picker. Opens a scrollable option list in a bottom sheet modal.
 * No native picker dependencies required - works on both iOS and Android.
 *
 * Supports both the monolithic API and a compound component pattern:
 *
 * @example Monolithic
 * ```tsx
 * const options = [
 *   { label: 'USD', value: 'usd', icon: '💵' },
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
interface SelectRowRenderProps {
  label: string;
  icon?: string;
  isSelected: boolean;
  value: string;
  onSelect: (value: string) => void;
  primaryColor: string;
  primaryLightColor: string;
  textPrimaryColor: string;
  bodyStyle: TextStyle;
}

const SelectRow = React.memo(function SelectRow({
  label,
  icon,
  isSelected,
  value,
  onSelect,
  primaryColor,
  primaryLightColor,
  textPrimaryColor,
  bodyStyle,
}: SelectRowRenderProps) {
  const handlePress = useCallback(() => onSelect(value), [onSelect, value]);

  return (
    <Pressable
      onPress={handlePress}
      style={[styles.option, isSelected && { backgroundColor: primaryLightColor }]}
      accessibilityRole="radio"
      accessibilityState={{ selected: isSelected }}
    >
      {icon && <Text style={styles.optionIcon}>{icon}</Text>}
      <Text
        style={[
          bodyStyle,
          {
            color: isSelected ? primaryColor : textPrimaryColor,
            flex: 1,
          },
        ]}
      >
        {label}
      </Text>
      {isSelected && <Text style={{ color: primaryColor }}>✓</Text>}
    </Pressable>
  );
});

function SelectComponent<T extends string = string>({
  label,
  value,
  selectedValue,
  options,
  onChange,
  onValueChange,
  placeholder = 'Select...',
  error,
  required,
  disabled = false,
  containerStyle,
}: SelectProps<T>) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [isOpen, setIsOpen] = useState(false);

  const resolvedValue = value !== undefined ? value : selectedValue ?? null;
  const selectedOption = options.find((o) => o.value === resolvedValue);

  const handleSelect = useCallback(
    (optionValue: T) => {
      onChange?.(optionValue);
      onValueChange?.(optionValue);
      setIsOpen(false);
    },
    [onChange, onValueChange],
  );

  const renderOption = useCallback(
    ({ item }: { item: SelectOption<T> }) => (
      <SelectRow
        label={item.label}
        icon={item.icon}
        isSelected={item.value === resolvedValue}
        value={item.value}
        onSelect={handleSelect as (value: string) => void}
        primaryColor={theme.colors.primary}
        primaryLightColor={theme.colors.primaryLight}
        textPrimaryColor={theme.colors.textPrimary}
        bodyStyle={theme.typography.body}
      />
    ),
    [
      resolvedValue,
      handleSelect,
      theme.colors.primary,
      theme.colors.primaryLight,
      theme.colors.textPrimary,
      theme.typography.body,
    ],
  );

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <FieldLabel label={label} required={required} />}

      <Pressable
        onPress={() => !disabled && setIsOpen(true)}
        style={[
          styles.trigger,
          {
            backgroundColor: theme.colors.surfaceSecondary,
            borderColor: error ? theme.colors.error : theme.colors.border,
            borderRadius: theme.borderRadius.lg,
          },
          disabled && { opacity: theme.opacity.disabled },
        ]}
        accessibilityRole="button"
        accessibilityLabel={label ?? placeholder}
        accessibilityState={{ disabled, expanded: isOpen }}
      >
        <Text
          style={[
            theme.typography.body,
            {
              color: selectedOption ? theme.colors.textPrimary : theme.colors.textTertiary,
              flex: 1,
            },
          ]}
          numberOfLines={1}
        >
          {selectedOption?.label ?? placeholder}
        </Text>
        <Text style={{ color: theme.colors.textTertiary, fontSize: 12 }}>▼</Text>
      </Pressable>

      {error && <FieldError error={error} />}

      <Modal
        visible={isOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
      >
        {/*
         * Layout:
         *   - Absolute-fill Pressable backdrop: catches taps outside the sheet.
         *   - Sheet View: catches its own taps via onStartShouldSetResponder
         *     so taps on the header/padding inside the sheet do NOT bubble
         *     up to the backdrop and close the modal.
         */}
        <View style={styles.overlay}>
          <Pressable
            style={[StyleSheet.absoluteFill, { backgroundColor: theme.colors.overlay }]}
            onPress={() => setIsOpen(false)}
            accessibilityRole="button"
            accessibilityLabel="Close"
          />
          <View
            onStartShouldSetResponder={() => true}
            style={[
              styles.sheet,
              {
                backgroundColor: theme.colors.surface,
                borderTopLeftRadius: theme.borderRadius.xl,
                borderTopRightRadius: theme.borderRadius.xl,
                paddingBottom: Math.max(insets.bottom, 16),
              },
            ]}
          >
            {label && (
              <Text
                style={[
                  theme.typography.h3,
                  {
                    color: theme.colors.textPrimary,
                    paddingHorizontal: 20,
                    paddingTop: 20,
                    paddingBottom: 12,
                  },
                ]}
              >
                {label}
              </Text>
            )}
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              style={{ maxHeight: Dimensions.get('window').height * 0.4 }}
              accessibilityRole="radiogroup"
              renderItem={renderOption}
            />
            <Pressable
              onPress={() => setIsOpen(false)}
              style={[styles.cancelButton, { borderTopColor: theme.colors.divider }]}
              accessibilityRole="button"
              accessibilityLabel="Cancel"
            >
              <Text style={[theme.typography.label, { color: theme.colors.textSecondary }]}>
                Cancel
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ─── Compound sub-components ───────────────────────────────────

/** Standalone trigger element for Select compound pattern. */
function SelectTrigger({ children, style, onPress, disabled }: SelectTriggerProps) {
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={[styles.trigger, style]}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
    >
      {children}
    </Pressable>
  );
}
SelectTrigger.displayName = 'Select.Trigger';

/** Standalone option row for Select compound pattern. */
function SelectOptionItem({ children, style, selected, onPress }: SelectOptionItemProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.option, style]}
      accessibilityRole="radio"
      accessibilityState={{ selected: !!selected }}
    >
      {children}
    </Pressable>
  );
}
SelectOptionItem.displayName = 'Select.Option';

// ─── Assemble compound component ──────────────────────────────

export const Select = Object.assign(SelectComponent, {
  Trigger: SelectTrigger,
  Option: SelectOptionItem,
});

// ─── Styles ───────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 44,
    gap: 8,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {},
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 10,
    minHeight: 48,
  },
  optionIcon: {
    fontSize: 16,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: 8,
  },
});
