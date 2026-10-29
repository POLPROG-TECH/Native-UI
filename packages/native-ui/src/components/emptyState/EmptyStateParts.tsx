import { StyleSheet, Text, View } from 'react-native';
import { renderIconSlot, type IconSlot } from '../../primitives/iconSlot';
import { useTheme } from '../../theme';
import type { EmptyStateSizeTokens } from '../../tokens/components';
import type { TypographyVariant } from '../../tokens/typography';

interface EmptyStateIconProps {
  icon: IconSlot | undefined;
  preset: EmptyStateSizeTokens;
}

/**
 * Decorative leading visual, hidden from screen readers because the title
 * already carries the meaning. Rendered in `textSecondary` at the preset's
 * icon size (emoji strings use it as their font size).
 */
export function EmptyStateIcon({ icon, preset }: EmptyStateIconProps) {
  const theme = useTheme();

  if (icon == null || icon === false || icon === '') {
    return null;
  }

  return (
    <View
      style={{ marginBottom: preset.iconMarginBottom }}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {renderIconSlot(icon, { color: theme.colors.textSecondary, size: preset.iconSize })}
    </View>
  );
}

interface EmptyStateTextProps {
  text: string;
  /** Overrides the preset's typography for this line. */
  variant: TypographyVariant | undefined;
  preset: EmptyStateSizeTokens;
}

export function EmptyStateTitle({ text, variant, preset }: EmptyStateTextProps) {
  const theme = useTheme();

  return (
    <Text
      style={[
        theme.typography[variant ?? preset.titleVariant],
        styles.centered,
        { color: theme.colors.textPrimary },
      ]}
      accessibilityRole="header"
    >
      {text}
    </Text>
  );
}

export function EmptyStateMessage({ text, variant, preset }: EmptyStateTextProps) {
  const theme = useTheme();

  return (
    <Text
      style={[
        theme.typography[variant ?? preset.messageVariant],
        styles.centered,
        { color: theme.colors.textSecondary, marginTop: preset.messageMarginTop },
      ]}
    >
      {text}
    </Text>
  );
}

const styles = StyleSheet.create({
  centered: {
    textAlign: 'center',
  },
});
