import { View, StyleSheet, type ViewStyle, type StyleProp } from 'react-native';
import { useTheme } from '../theme';
import { PaginationDot, resolveDotAppearance } from './paginationDots/PaginationDot';

export interface PaginationDotsProps {
  /** Total number of dots (typically number of pages or steps). */
  count: number;
  /** Zero-based index of the currently active dot. */
  current: number;
  /** Width of inactive dots. @default theme.components.paginationDots.dotWidth (5) */
  dotWidth?: number;
  /** Width of the active (elongated) dot. @default theme.components.paginationDots.activeWidth (16) */
  activeWidth?: number;
  /** Height (and inactive radius) of each dot. @default theme.components.paginationDots.height (5) */
  height?: number;
  /** Gap between dots. @default theme.components.paginationDots.gap (6) */
  gap?: number;
  /** Inactive dot color. Defaults to `theme.colors.border`. */
  color?: string;
  /** Active dot color. Defaults to `theme.colors.primary`. */
  activeColor?: string;
  /** Animate the dot width change when `current` moves. @default true */
  animated?: boolean;
  style?: StyleProp<ViewStyle>;
  /** Accessibility label for the whole dots group. @default labels.stepOf(current, total) */
  accessibilityLabel?: string;
  /** Test ID forwarded to the dots row. */
  testID?: string;
}

/**
 * Row of dots indicating progress or current page in a paginated view.
 * The active dot expands horizontally and uses the accent color.
 *
 * Respects `theme.reduceAnimations` - animation is disabled automatically when
 * the user has reduce-motion enabled, or when `animated={false}`.
 *
 * @example
 * ```tsx
 * <PaginationDots count={pages.length} current={pageIndex} />
 * ```
 */
export function PaginationDots(props: PaginationDotsProps) {
  const { count, current } = props;
  const theme = useTheme();
  const appearance = resolveDotAppearance(theme, props);

  return (
    <View
      style={[styles.row, { gap: props.gap ?? theme.components.paginationDots.gap }, props.style]}
      testID={props.testID}
      accessibilityRole="progressbar"
      accessibilityLabel={
        props.accessibilityLabel ?? theme.labels.stepOf(Math.min(current + 1, count), count)
      }
      accessibilityValue={{ min: 0, max: Math.max(count - 1, 0), now: current }}
    >
      {Array.from({ length: count }, (_, index) => (
        <PaginationDot key={index} isActive={index === current} appearance={appearance} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
