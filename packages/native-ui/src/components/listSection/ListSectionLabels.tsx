import { Text } from 'react-native';
import { useTheme } from '../../theme';

/** Uppercase, muted section title announced as a header. */
export function ListSectionTitle({ title }: { title: string }) {
  const theme = useTheme();
  const tokens = theme.components.listSection;

  return (
    <Text
      style={[
        theme.typography.overline,
        {
          color: theme.colors.textTertiary,
          marginTop: tokens.titleMarginTop,
          marginBottom: tokens.titleMarginBottom,
          textTransform: 'uppercase',
        },
      ]}
      accessibilityRole="header"
    >
      {title}
    </Text>
  );
}

/** Caption-sized note rendered below the section body. */
export function ListSectionFooter({ footer }: { footer: string }) {
  const theme = useTheme();

  return (
    <Text
      style={[
        theme.typography.caption,
        {
          color: theme.colors.textTertiary,
          marginTop: theme.components.listSection.footerMarginTop,
        },
      ]}
    >
      {footer}
    </Text>
  );
}
