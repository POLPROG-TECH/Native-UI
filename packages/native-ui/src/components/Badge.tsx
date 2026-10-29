import type { StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import { resolveBadgeContent } from './badge/badgeContent';
import { BadgeDot, BadgePill } from './badge/BadgeShapes';
import type { BadgeVariant } from './badge/types';
export type { BadgeVariant } from './badge/types';

export interface BadgeProps {
  /** Number to display. If omitted (and no `label`), renders as a dot. */
  count?: number;
  /** Text label to display instead of a numeric count. Takes priority over `count`. */
  label?: string;
  variant?: BadgeVariant;
  /**
   * Maximum count to display (shows "N+" above).
   * @default theme.components.badge.maxCount (99)
   */
  max?: number;
  /** Hide when count is 0 (default: true) */
  hideZero?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/**
 * Numeric badge, text label, or status dot indicator.
 */
export function Badge({
  count,
  label,
  variant = 'error',
  max,
  hideZero = true,
  style,
  testID,
}: BadgeProps) {
  const theme = useTheme();
  const content = resolveBadgeContent(
    { count, label, max: max ?? theme.components.badge.maxCount, hideZero },
    theme.labels.countOverflow,
  );

  if (content.kind === 'hidden') {
    return null;
  }

  if (content.kind === 'dot') {
    return <BadgeDot variant={variant} style={style} testID={testID} />;
  }

  return <BadgePill text={content.text} variant={variant} style={style} testID={testID} />;
}
