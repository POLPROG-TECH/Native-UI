import React, { useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Switch as RNSwitch,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '../theme';
import type { Theme } from '../theme/types';
import { getHaptics } from '../utils/haptics';

export interface SwitchProps {
  /** Whether the switch is on */
  value: boolean;
  onValueChange: (value: boolean) => void;
  /** Label displayed next to the switch */
  label?: string;
  /** Secondary text below the label */
  subtitle?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  /** Test ID of the row (or of the bare wrapper when there is no text). */
  testID?: string;
}

function buildSwitchRowStyle(
  theme: Theme,
  disabled: boolean,
  style: StyleProp<ViewStyle>,
): StyleProp<ViewStyle> {
  const tokens = theme.components.switch;

  return [
    styles.row,
    { minHeight: tokens.minHeight, gap: tokens.gap },
    disabled && { opacity: theme.opacity.disabled },
    style,
  ];
}

/** Light haptic tick, then forwards the new value. */
function useHapticValueChange(onValueChange: (value: boolean) => void): (value: boolean) => void {
  return useCallback(
    (newValue: boolean) => {
      getHaptics().light();
      onValueChange(newValue);
    },
    [onValueChange],
  );
}

/** Handlers for a labelled row, where a row press flips the value like a tap on the switch. */
function useRowToggle(value: boolean, disabled: boolean, onValueChange: (value: boolean) => void) {
  const handleChange = useHapticValueChange(onValueChange);
  const handleToggle = useCallback(() => {
    if (!disabled) {
      handleChange(!value);
    }
  }, [disabled, handleChange, value]);

  return { handleChange, handleToggle };
}

interface SwitchControlProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled: boolean;
  /** The surrounding row carries the switch role, state and label. */
  labelledByRow?: boolean;
}

function SwitchControl({ value, onValueChange, disabled, labelledByRow }: SwitchControlProps) {
  const theme = useTheme();

  return (
    <RNSwitch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      trackColor={{ false: theme.colors.controlTrack, true: theme.colors.primary }}
      thumbColor={theme.colors.controlThumb}
      ios_backgroundColor={theme.colors.controlTrack}
      /*
       * When the row carries the switch semantics, hide the native control from
       * the screen reader to avoid a duplicate, unlabeled toggle announcement.
       */
      {...(labelledByRow
        ? { importantForAccessibility: 'no-hide-descendants' as const, accessible: false }
        : {
            accessibilityRole: 'switch' as const,
            accessibilityState: { checked: value, disabled },
          })}
    />
  );
}

/** Visual label and subtitle; hidden because the row announces them as its label. */
function SwitchText({ label, subtitle }: Pick<SwitchProps, 'label' | 'subtitle'>) {
  const theme = useTheme();
  const subtitleStyle = [
    theme.typography.caption,
    { color: theme.colors.textTertiary, marginTop: theme.components.switch.subtitleMarginTop },
  ];

  return (
    <View
      style={styles.labelContainer}
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
    >
      {label && (
        <Text style={[theme.typography.body, { color: theme.colors.textPrimary }]}>{label}</Text>
      )}
      {subtitle && <Text style={subtitleStyle}>{subtitle}</Text>}
    </View>
  );
}

function BareSwitch({ value, onValueChange, disabled = false, style, testID }: SwitchProps) {
  const theme = useTheme();
  const handleChange = useHapticValueChange(onValueChange);

  return (
    <View testID={testID} style={buildSwitchRowStyle(theme, disabled, style)}>
      <SwitchControl value={value} onValueChange={handleChange} disabled={disabled} />
    </View>
  );
}

function LabelledSwitch({
  value,
  onValueChange,
  label,
  subtitle,
  disabled = false,
  style,
  testID,
}: SwitchProps) {
  const theme = useTheme();
  const { handleChange, handleToggle } = useRowToggle(value, disabled, onValueChange);

  return (
    <Pressable
      testID={testID}
      onPress={handleToggle}
      disabled={disabled}
      style={buildSwitchRowStyle(theme, disabled, style)}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      accessibilityLabel={[label, subtitle].filter(Boolean).join(', ')}
    >
      <SwitchText label={label} subtitle={subtitle} />
      <SwitchControl value={value} onValueChange={handleChange} disabled={disabled} labelledByRow />
    </Pressable>
  );
}

/**
 * A toggle switch with optional label and subtitle. When a label or subtitle
 * is provided the whole row is tappable (matching native settings rows) and
 * the subtitle is announced as part of the accessible label.
 */
export const Switch = React.memo(function Switch(props: SwitchProps) {
  if (!props.label && !props.subtitle) {
    return <BareSwitch {...props} />;
  }

  return <LabelledSwitch {...props} />;
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  labelContainer: {
    flex: 1,
  },
});
