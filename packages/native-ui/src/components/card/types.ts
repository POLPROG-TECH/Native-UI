import type React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export type CardSize = 'compact' | 'regular' | 'spacious';

export type CardElevation = 'xs' | 'sm' | 'md' | 'lg';

export interface CardProps {
  /** Content rendered inside the card surface. */
  children: React.ReactNode;
  /** Additional styles applied to the card container. */
  style?: StyleProp<ViewStyle>;
  /** Test ID forwarded to the card container. */
  testID?: string;
  /**
   * Whether to apply the default inner padding.
   * @default true
   */
  padded?: boolean;
  /**
   * Density preset controlling inner padding and border radius, read from
   * `theme.components.card[size]`:
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
  /** Accessibility hint for pressable cards. @default labels.cardHint */
  accessibilityHint?: string;
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
