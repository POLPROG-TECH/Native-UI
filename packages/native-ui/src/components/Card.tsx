import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import { PressableScale } from '../primitives/PressableScale';

export type CardSize = 'compact' | 'regular' | 'spacious';
export type CardElevation = 'xs' | 'sm' | 'md' | 'lg';

export interface CardProps {
  /** Content rendered inside the card surface. */
  children: React.ReactNode;
  /** Additional styles applied to the card container. */
  style?: ViewStyle;
  /**
   * Whether to apply the default inner padding.
   * @default true
   */
  padded?: boolean;
  /**
   * Density preset controlling inner padding and border radius.
   * - `compact`  - list-row cards (padding `md`, radius `md`)
   * - `regular`  - default (padding `lg`, radius `lg`)
   * - `spacious` - hero cards (padding `xl`, radius `lg`)
   * @default 'regular'
   */
  size?: CardSize;
  /**
   * Shadow depth. Use `xs`/`sm` for list cards, `md` for standard cards
   * (default), and `lg` for floating emphasis.
   * @default 'md'
   */
  elevation?: CardElevation;
  /** Tap handler - when provided the card becomes pressable with scale feedback. */
  onPress?: () => void;
  /** Long-press handler - when provided the card becomes pressable. */
  onLongPress?: () => void;
  /** Accessibility hint for pressable cards. */
  accessibilityHint?: string;
  /**
   * @deprecated Use `accessibilityHint` instead.
   */
  longPressHint?: string;
  /**
   * Render prop for a header element rendered above children.
   * @example
   * ```tsx
   * <Card renderHeader={() => <Heading level={3}>Stats</Heading>}>
   *   <Text>Body content</Text>
   * </Card>
   * ```
   */
  renderHeader?: () => React.ReactNode;
  /**
   * Render prop for a footer element rendered below children.
   * @example
   * ```tsx
   * <Card renderFooter={() => <Button title="View" onPress={view} />}>
   *   <Text>Body content</Text>
   * </Card>
   * ```
   */
  renderFooter?: () => React.ReactNode;
}

/**
 * Elevated surface container with themed background and border.
 * Automatically becomes pressable (with spring-scale feedback) when
 * `onPress` or `onLongPress` is provided.
 *
 * Accepts `renderHeader` and `renderFooter` render props for structured layout.
 *
 * @example
 * ```tsx
 * <Card>
 *   <Text>Static content</Text>
 * </Card>
 * <Card onPress={openDetails} padded={false}>
 *   <Image source={banner} />
 * </Card>
 * <Card renderHeader={() => <Heading level={3}>Title</Heading>}>
 *   <Text>Body</Text>
 * </Card>
 * ```
 */
export function Card({
  children,
  style,
  padded = true,
  size = 'regular',
  elevation = 'md',
  onPress,
  onLongPress,
  accessibilityHint,
  longPressHint,
  renderHeader,
  renderFooter,
}: CardProps) {
  const theme = useTheme();
  const hint = accessibilityHint ?? longPressHint;

  const paddingValue =
    size === 'compact'
      ? theme.spacing.md
      : size === 'spacious'
      ? theme.spacing.xl
      : theme.spacing.lg;
  const radiusValue = size === 'compact' ? theme.borderRadius.md : theme.borderRadius.lg;

  const elevationStyle = theme.elevation[elevation] as ViewStyle;

  const cardStyle: ViewStyle[] = [
    styles.card,
    {
      backgroundColor: theme.colors.surface,
      borderRadius: radiusValue,
      borderColor: theme.colors.borderLight,
    },
    elevationStyle,
    padded ? { padding: paddingValue } : undefined,
    style,
  ].filter(Boolean) as ViewStyle[];

  const inner = (
    <>
      {renderHeader?.()}
      {children}
      {renderFooter?.()}
    </>
  );

  if (onPress || onLongPress) {
    return (
      <PressableScale
        onPress={onPress}
        onLongPress={onLongPress}
        style={cardStyle}
        scaleTo={0.98}
        hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
        accessibilityRole="button"
        accessibilityHint={hint ?? 'Tap for details'}
      >
        {inner}
      </PressableScale>
    );
  }

  return <View style={cardStyle}>{inner}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderWidth: StyleSheet.hairlineWidth,
  },
});
