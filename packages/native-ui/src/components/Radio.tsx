import React, { useCallback } from 'react';
import { StyleSheet, View, Pressable, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import { getHaptics } from '../utils/haptics';
import { SelectionLabel, useSelectionRow } from './selection/selectionRow';

export interface RadioProps {
  /** Whether this radio option is selected */
  selected: boolean;
  /** Label text */
  label?: string;
  onPress?: () => void;
  accessibilityLabel?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  /** Test ID of the root; the circle receives `{testID}-indicator`. */
  testID?: string;
}

/** Square box with fully rounded corners, used for the outer circle and the dot. */
function circle(diameter: number): ViewStyle {
  return { width: diameter, height: diameter, borderRadius: diameter / 2 };
}

/** Outer circle; filled with a centred dot when selected, outlined otherwise. */
function RadioIndicator({ selected, testID }: { selected: boolean; testID?: string }) {
  const theme = useTheme();
  const tokens = theme.components.radio;

  if (!selected) {
    return (
      <View
        testID={testID}
        style={[
          circle(tokens.size),
          { borderWidth: tokens.borderWidth, borderColor: theme.colors.controlBorder },
        ]}
      />
    );
  }

  return (
    <View
      testID={testID}
      style={[styles.center, circle(tokens.size), { backgroundColor: theme.colors.primary }]}
    >
      <View style={[circle(tokens.dotSize), { backgroundColor: theme.colors.onPrimary }]} />
    </View>
  );
}

function indicatorTestID(testID: string | undefined): string | undefined {
  return testID ? `${testID}-indicator` : undefined;
}

/** Indicator-only radio for rows that own the press handling and the label. */
function PassiveRadio({ selected, accessibilityLabel, style, testID }: RadioProps) {
  return (
    <View
      testID={testID}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={accessibilityLabel}
      style={style}
    >
      <RadioIndicator selected={selected} testID={indicatorTestID(testID)} />
    </View>
  );
}

function InteractiveRadio({
  selected,
  label,
  onPress,
  accessibilityLabel,
  disabled = false,
  style,
  testID,
}: RadioProps) {
  const handlePress = useHapticPress(onPress);
  const { focusProps, rowStyle } = useSelectionRow('radio', disabled, style);

  return (
    <Pressable
      testID={testID}
      onPress={handlePress}
      {...focusProps}
      disabled={disabled}
      style={rowStyle}
      accessibilityRole="radio"
      accessibilityState={{ selected, disabled }}
      accessibilityLabel={accessibilityLabel ?? label}
    >
      <RadioIndicator selected={selected} testID={indicatorTestID(testID)} />
      {label && <SelectionLabel label={label} />}
    </Pressable>
  );
}

/**
 * Radio button with optional label. Use within a group to allow single selection.
 * Without `onPress` and `label` it renders a non-interactive indicator, for
 * rows that own the press handling themselves.
 */
export const Radio = React.memo(function Radio(props: RadioProps) {
  if (!props.onPress && !props.label) {
    return <PassiveRadio {...props} />;
  }

  return <InteractiveRadio {...props} />;
});

/** Light haptic tick followed by `onPress`; a no-op without a handler. */
function useHapticPress(onPress: (() => void) | undefined): () => void {
  return useCallback(() => {
    if (!onPress) {
      return;
    }

    getHaptics().light();
    onPress();
  }, [onPress]);
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
