import { Text, type StyleProp, type TextStyle } from 'react-native';
import { useTheme } from '../theme';

export interface FieldErrorProps {
  error: string;
  style?: StyleProp<TextStyle>;
  testID?: string;
}

/** Shared error message rendered below form fields (Input, TextArea, Select). */
export function FieldError({ error, style, testID }: FieldErrorProps) {
  const theme = useTheme();

  return (
    <Text
      testID={testID}
      style={[
        theme.typography.caption,
        { color: theme.colors.errorText, marginTop: theme.components.fieldError.marginTop },
        style,
      ]}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      {error}
    </Text>
  );
}
