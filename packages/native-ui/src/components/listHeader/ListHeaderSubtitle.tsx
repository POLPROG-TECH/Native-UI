import { Text } from 'react-native';
import { useTheme } from '../../theme';

/** Secondary line below a ListHeader title. */
export function ListHeaderSubtitle({ subtitle }: { subtitle: string }) {
  const theme = useTheme();

  return (
    <Text
      style={[
        theme.typography.bodySmall,
        {
          color: theme.colors.textSecondary,
          marginTop: theme.components.listHeader.subtitleMarginTop,
        },
      ]}
    >
      {subtitle}
    </Text>
  );
}
