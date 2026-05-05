import { View, Text } from 'react-native';
import { useTheme } from '../theme';

export type ListHeaderTransform =
  | 'uppercase'
  | 'lowercase'
  | 'capitalize'
  | 'none'
  | ((input: string) => string);

export type ListHeaderSize = 'lg' | 'md' | 'sm' | 'xs';

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
   * @default 'lg'
   */
  size?: ListHeaderSize;
}

interface SizeConfig {
  typographyKey: 'h1' | 'h3' | 'title' | 'overline';
  marginTop: number;
  marginBottom: number;
  useMutedColor: boolean;
  defaultTransform: ListHeaderTransform;
  letterSpacing?: number;
}

const SIZE_CONFIG: Record<ListHeaderSize, SizeConfig> = {
  lg: { typographyKey: 'h1', marginTop: 0, marginBottom: 28, useMutedColor: false, defaultTransform: 'none' },
  md: { typographyKey: 'h3', marginTop: 0, marginBottom: 20, useMutedColor: false, defaultTransform: 'none' },
  sm: { typographyKey: 'title', marginTop: 0, marginBottom: 12, useMutedColor: false, defaultTransform: 'none' },
  xs: { typographyKey: 'overline', marginTop: 24, marginBottom: 8, useMutedColor: true, defaultTransform: 'uppercase', letterSpacing: 0.8 },
};

/**
 * Versatile list/settings header with four size variants.
 *
 * Use `size="xs"` for iOS-style uppercase section labels in settings screens.
 * Use `size="lg"` (default) for prominent page-level headings.
 */
export function ListHeader({ title, subtitle, transform, size = 'lg' }: ListHeaderProps) {
  const theme = useTheme();
  const config = SIZE_CONFIG[size];

  const resolvedTransform = transform ?? config.defaultTransform;
  const { displayTitle, textTransform } = applyTransform(title, resolvedTransform);

  return (
    <View style={{ marginTop: config.marginTop, marginBottom: config.marginBottom }}>
      <Text
        style={[
          theme.typography[config.typographyKey],
          { color: config.useMutedColor ? theme.colors.textTertiary : theme.colors.textPrimary },
          textTransform ? { textTransform } : null,
          config.letterSpacing != null ? { letterSpacing: config.letterSpacing } : null,
        ]}
        accessibilityRole="header"
      >
        {displayTitle}
      </Text>
      {subtitle && (
        <Text
          style={[theme.typography.bodySmall, { color: theme.colors.textSecondary, marginTop: 2 }]}
        >
          {subtitle}
        </Text>
      )}
    </View>
  );
}

function applyTransform(
  title: string,
  transform: ListHeaderTransform,
): { displayTitle: string; textTransform?: 'uppercase' | 'lowercase' | 'capitalize' } {
  if (typeof transform === 'function') {
    return { displayTitle: transform(title) };
  }
  if (transform === 'uppercase' || transform === 'lowercase' || transform === 'capitalize') {
    return { displayTitle: title, textTransform: transform };
  }

  return { displayTitle: title };
}
