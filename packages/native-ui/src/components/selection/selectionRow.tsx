import {
  StyleSheet,
  Text,
  type PressableStateCallbackType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useFocusRing, type FocusRingResult } from '../../hooks/useFocusRing';
import { useTheme } from '../../theme';
import type { Theme } from '../../theme/types';

/** Row geometry shared by the Checkbox and Radio token sets. */
interface SelectionRowTokens {
  gap: number;
  minHeight: number;
}

/**
 * Pressable style of a labelled Checkbox / Radio row: the whole row dims while
 * pressed and stays dimmed while disabled, so both controls give identical
 * feedback.
 */
export function buildSelectionRowStyle(
  theme: Theme,
  tokens: SelectionRowTokens,
  disabled: boolean,
  style: StyleProp<ViewStyle>,
): (state: PressableStateCallbackType) => StyleProp<ViewStyle> {
  return ({ pressed }) => [
    styles.row,
    { gap: tokens.gap, minHeight: tokens.minHeight },
    pressed && { opacity: theme.opacity.pressed },
    disabled && { opacity: theme.opacity.disabled },
    style,
  ];
}

/**
 * Pressable wiring shared by Checkbox and Radio: the row style above with the
 * keyboard focus ring appended after the consumer's style, plus the focus
 * handlers that toggle it.
 */
export function useSelectionRow(
  kind: 'checkbox' | 'radio',
  disabled: boolean,
  style: StyleProp<ViewStyle>,
): {
  focusProps: FocusRingResult['focusProps'];
  rowStyle: ReturnType<typeof buildSelectionRowStyle>;
} {
  const theme = useTheme();
  const { focusProps, focusRingStyle } = useFocusRing();
  const tokens = theme.components[kind];

  return {
    focusProps,
    rowStyle: buildSelectionRowStyle(theme, tokens, disabled, [style, focusRingStyle]),
  };
}

/** Label text beside a Checkbox / Radio indicator. */
export function SelectionLabel({ label }: { label: string }) {
  const theme = useTheme();

  return (
    <Text style={[theme.typography.body, styles.label, { color: theme.colors.textPrimary }]}>
      {label}
    </Text>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    flex: 1,
  },
});
