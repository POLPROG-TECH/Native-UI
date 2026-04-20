import { StyleSheet, View, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';

export interface DividerProps {
  /** Left/right inset for the divider line */
  inset?: number;
  style?: ViewStyle;
}

/** A thin horizontal divider line using the theme divider color. */
export function Divider({ inset = 0, style }: DividerProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.divider,
        {
          backgroundColor: theme.colors.divider,
          marginLeft: inset,
          marginRight: inset,
        },
        style,
      ]}
      accessibilityElementsHidden
    />
  );
}

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,
  },
});
