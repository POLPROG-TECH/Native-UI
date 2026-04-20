import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import { PressableScale } from '../primitives/PressableScale';

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
  onPress,
  onLongPress,
  accessibilityHint,
  longPressHint,
  renderHeader,
  renderFooter,
}: CardProps) {
  const theme = useTheme();
  const hint = accessibilityHint ?? longPressHint;

  const cardStyle: ViewStyle[] = [
    styles.card,
    {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      borderColor: theme.colors.borderLight,
    },
    theme.elevation.md as ViewStyle,
    padded ? { padding: theme.spacing.lg } : undefined,
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
