import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

export type ListHeaderTransform =
  | 'uppercase'
  | 'lowercase'
  | 'capitalize'
  | 'none'
  | ((input: string) => string);

export interface ListHeaderProps {
  /** Main heading text */
  title: string;
  /** Optional subtitle below the title */
  subtitle?: string;
  /**
   * Text transform applied to the `title`. Accepts the native text-transform
   * values plus a custom function for advanced cases. Pass a function to
   * localize/transform the title arbitrarily.
   * @default 'none'
   */
  transform?: ListHeaderTransform;
}

/**
 * Screen-level header for settings/list pages.
 * Renders an accessible heading with optional subtitle.
 *
 * For small uppercase section labels within a list (e.g. "ACCOUNT"), prefer
 * {@link SectionLabel} instead, which renders as an `overline` style.
 */
export function ListHeader({ title, subtitle, transform = 'none' }: ListHeaderProps) {
  const theme = useTheme();

  const { displayTitle, textTransform } = applyTransform(title, transform);

  return (
    <View style={styles.container}>
      <Text
        style={[
          theme.typography.h1,
          { color: theme.colors.textPrimary },
          textTransform ? { textTransform } : null,
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

const styles = StyleSheet.create({
  container: {
    marginBottom: 28,
  },
});
