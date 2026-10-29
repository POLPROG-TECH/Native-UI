import type React from 'react';

export interface SegmentedControlOption<T extends string> {
  value: T;
  label: string;
  /** Optional node before the label (icon, swatch). */
  leading?: React.ReactNode;
  /** Screen-reader name when the visible label is not enough. @default label */
  accessibilityLabel?: string;
  disabled?: boolean;
  testID?: string;
}
