import { View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';

export interface DividerProps {
  /** Left/right inset for the divider line */
  inset?: number;
  style?: StyleProp<ViewStyle>;
  /** Test ID forwarded to the divider line. */
  testID?: string;
}

/**
 * A thin horizontal divider line using the theme divider color. Its thickness
 * comes from `theme.components.divider.thickness` (a hairline by default).
 */
export function Divider({ inset = 0, style, testID }: DividerProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        {
          height: theme.components.divider.thickness,
          backgroundColor: theme.colors.divider,
          marginLeft: inset,
          marginRight: inset,
        },
        style,
      ]}
      testID={testID}
      accessibilityElementsHidden
    />
  );
}
