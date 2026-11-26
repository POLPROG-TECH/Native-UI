function decimalsOf(step: number): number {
  const [, fraction = ''] = String(step).split('.');

  return fraction.length;
}

/**
 * Rounds away the float noise that adding multiples of `step` accumulates
 * (0.1 + 0.2 is 0.30000000000000004), keeping as many decimals as `step` has.
 */
export function roundToStepPrecision(value: number, step: number): number {
  return Number(value.toFixed(decimalsOf(step)));
}
