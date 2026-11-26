import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useTheme } from '../../theme';
import type { Theme } from '../../theme/types';
import { PIN_CELL_STATE, type PinCellState } from './pinValue';

export interface PinCellProps {
  digit: string;
  state: PinCellState;
  secure: boolean;
  invalid: boolean;
}

function borderColor(theme: Theme, state: PinCellState, invalid: boolean): string {
  if (invalid) {
    return theme.colors.error;
  }

  return state === PIN_CELL_STATE.active ? theme.colors.primary : theme.colors.border;
}

function cellStyle(theme: Theme, state: PinCellState, invalid: boolean): ViewStyle {
  const tokens = theme.components.pinInput;
  const active = state === PIN_CELL_STATE.active;

  return {
    width: tokens.cellWidth,
    height: tokens.cellHeight,
    borderRadius: tokens.cellRadius,
    borderWidth: active ? tokens.activeBorderWidth : tokens.cellBorderWidth,
    borderColor: borderColor(theme, state, invalid),
    backgroundColor: theme.colors.surface,
  };
}

function SecureDot() {
  const theme = useTheme();
  const size = theme.components.pinInput.secureDotSize;

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: theme.colors.textPrimary,
      }}
    />
  );
}

/** One box of the code. Decorative: the hidden text field carries the value. */
export function PinCell({ digit, state, secure, invalid }: PinCellProps) {
  const theme = useTheme();
  const typography = theme.typography[theme.components.pinInput.digitVariant];

  return (
    <View style={[styles.cell, cellStyle(theme, state, invalid)]}>
      {digit && secure ? <SecureDot /> : null}
      {digit && !secure ? (
        <Text style={[typography, { color: theme.colors.textPrimary }]}>{digit}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
