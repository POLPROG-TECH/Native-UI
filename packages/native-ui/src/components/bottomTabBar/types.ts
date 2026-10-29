import type React from 'react';

export interface BottomTabBarItem {
  /** Stable key identifying the tab. */
  readonly key: string;
  /** Display label rendered under the icon. */
  readonly label: string;
  /**
   * Icon renderer. Receives `color` & `size` so the consumer can plug any icon
   * library (lucide, react-native-vector-icons, custom SVG) without the design
   * system taking a hard dependency on a specific icon lib.
   */
  readonly icon: (props: { color: string; size: number; focused: boolean }) => React.ReactNode;
  /** Optional accessibility label; defaults to `label`. */
  readonly accessibilityLabel?: string;
  /** Optional badge count / text - renders a small dot-pill on the icon. */
  readonly badge?: number | string;
}
