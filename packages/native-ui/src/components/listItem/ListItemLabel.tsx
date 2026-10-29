import { useMemo } from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../../theme';
import { listItemLayout, useSecondaryTextStyle, type ListItemStyles } from './listItemStyles';

interface ListItemLabelProps {
  title: string;
  subtitle?: string;
  destructive: boolean;
  styles: ListItemStyles;
}

/** Title and optional subtitle stack that takes the row's remaining width. */
export function ListItemLabel({ title, subtitle, destructive, styles }: ListItemLabelProps) {
  const theme = useTheme();
  const tokens = theme.components.listItem;
  const secondaryTextStyle = useSecondaryTextStyle();
  const titleStyle = useMemo(
    () => ({ color: destructive ? theme.colors.errorText : theme.colors.textPrimary }),
    [destructive, theme.colors.errorText, theme.colors.textPrimary],
  );

  return (
    <View style={listItemLayout.labelContainer}>
      <Text style={[theme.typography.body, titleStyle]} numberOfLines={tokens.titleMaxLines}>
        {title}
      </Text>
      {subtitle && (
        <Text
          style={[theme.typography.bodySmall, secondaryTextStyle, styles.subtitle]}
          numberOfLines={tokens.subtitleMaxLines}
        >
          {subtitle}
        </Text>
      )}
    </View>
  );
}
