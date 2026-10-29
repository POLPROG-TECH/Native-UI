import { View, Text, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import { ListHeaderSubtitle } from './listHeader/ListHeaderSubtitle';
import { buildHeaderTitleStyle, resolveHeaderTitle } from './listHeader/listHeaderTitle';
import type { ListHeaderTransform, ListHeaderSize } from './listHeader/types';
export type { ListHeaderTransform, ListHeaderSize } from './listHeader/types';

export interface ListHeaderProps {
  /** Main heading text */
  title: string;
  /** Optional subtitle below the title */
  subtitle?: string;
  /**
   * Text transform applied to the `title`. Accepts the native text-transform
   * values plus a custom function for advanced cases. Pass a function to
   * localize/transform the title arbitrarily.
   *
   * When `size` is `'xs'`, defaults to `'uppercase'` (matching iOS-style
   * grouped section labels). All other sizes default to `'none'`.
   */
  transform?: ListHeaderTransform;
  /**
   * Controls the visual prominence of the header.
   *
   * - `'lg'` - Page-level heading (h1, 28px). Use at the top of a screen.
   * - `'md'` - Section heading (h3, 20px). Use to separate major sections.
   * - `'sm'` - Subsection heading (title, 17px). Use for grouped list labels.
   * - `'xs'` - Overline label (11px, uppercase, muted). iOS-style section
   *   divider for settings/list screens. Matches Apple HIG grouped list pattern.
   *
   * Margins and letter spacing per size come from
   * `theme.components.listHeader[size]`.
   *
   * @default 'lg'
   */
  size?: ListHeaderSize;
  /** Additional styles applied to the header container. */
  style?: StyleProp<ViewStyle>;
  /** Test ID forwarded to the header container. */
  testID?: string;
}

/**
 * Versatile list/settings header with four size variants.
 *
 * Use `size="xs"` for iOS-style uppercase section labels in settings screens.
 * Use `size="lg"` (default) for prominent page-level headings.
 */
export function ListHeader({
  title,
  subtitle,
  transform,
  size = 'lg',
  style,
  testID,
}: ListHeaderProps) {
  const theme = useTheme();
  const sizeTokens = theme.components.listHeader[size];
  const { displayTitle, textTransform } = resolveHeaderTitle(title, size, transform);

  return (
    <View
      style={[{ marginTop: sizeTokens.marginTop, marginBottom: sizeTokens.marginBottom }, style]}
      testID={testID}
    >
      <Text style={buildHeaderTitleStyle(theme, size, textTransform)} accessibilityRole="header">
        {displayTitle}
      </Text>
      {subtitle && <ListHeaderSubtitle subtitle={subtitle} />}
    </View>
  );
}
