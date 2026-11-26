import type { ComponentTokenContext } from './merge';
import type { TypographyVariant } from '../typography';
import type { Elevation } from '../spacing';

/** Value inputs: Slider, Stepper and PinInput. */

/** Minimum touch target shared by these controls (iOS HIG 44pt). */
const MIN_TOUCH_TARGET = 44;

export interface SliderTokens {
  trackHeight: number;
  thumbSize: number;
  thumbBorderWidth: number;
  thumbElevation: Elevation;
  minHeight: number;
  /**
   * Share of the range one accessibility increment or decrement moves the
   * value when `step` is 0 (a continuous slider).
   */
  continuousStepRatio: number;
  /** Fill of the selected range. @default colors.primary */
  fillColor: string | undefined;
}

export interface StepperTokens {
  buttonSize: number;
  iconSize: number;
  radius: number;
  borderWidth: number;
  /** Width reserved for the value so the buttons do not move as it changes. */
  valueMinWidth: number;
  valuePaddingHorizontal: number;
  valueVariant: TypographyVariant;
}

export interface PinInputTokens {
  cellWidth: number;
  cellHeight: number;
  cellRadius: number;
  cellBorderWidth: number;
  /** Border of the cell that receives the next digit. */
  activeBorderWidth: number;
  gap: number;
  secureDotSize: number;
  digitVariant: TypographyVariant;
  /** Digits collected when `length` is not passed. */
  defaultLength: number;
}

export interface ValueInputTokens {
  slider: SliderTokens;
  stepper: StepperTokens;
  pinInput: PinInputTokens;
}

export function buildValueInputTokens({
  spacing,
  borderRadius,
}: ComponentTokenContext): ValueInputTokens {
  return {
    slider: {
      trackHeight: spacing.xs,
      thumbSize: spacing.lg,
      thumbBorderWidth: 1,
      thumbElevation: 'sm',
      minHeight: MIN_TOUCH_TARGET,
      continuousStepRatio: 0.1,
      fillColor: undefined,
    },
    stepper: {
      buttonSize: MIN_TOUCH_TARGET,
      iconSize: spacing.md,
      radius: borderRadius.md,
      borderWidth: 1,
      valueMinWidth: 48,
      valuePaddingHorizontal: spacing.sm,
      valueVariant: 'bodyMedium',
    },
    pinInput: {
      cellWidth: MIN_TOUCH_TARGET,
      cellHeight: 52,
      cellRadius: borderRadius.sm,
      cellBorderWidth: 1,
      activeBorderWidth: 2,
      gap: spacing.sm,
      secureDotSize: spacing.smPlus,
      digitVariant: 'h3',
      defaultLength: 6,
    },
  };
}
