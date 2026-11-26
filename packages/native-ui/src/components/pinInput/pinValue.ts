const NON_DIGITS = /\D/g;

export function sanitizePin(text: string, length: number): string {
  return text.replace(NON_DIGITS, '').slice(0, length);
}

export const PIN_CELL_STATE = {
  empty: 'empty',
  filled: 'filled',
  active: 'active',
} as const;

export type PinCellState = (typeof PIN_CELL_STATE)[keyof typeof PIN_CELL_STATE];

/**
 * The cell that receives the next digit is active while the field has focus;
 * when every cell is filled, the last one stays active.
 */
export function pinCellState(
  index: number,
  value: string,
  length: number,
  focused: boolean,
): PinCellState {
  const nextIndex = Math.min(value.length, length - 1);

  if (focused && index === nextIndex) {
    return PIN_CELL_STATE.active;
  }

  return index < value.length ? PIN_CELL_STATE.filled : PIN_CELL_STATE.empty;
}
