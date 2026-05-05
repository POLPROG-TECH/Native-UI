import { Text } from 'react-native';
import { useTheme } from '../theme';

export interface FieldErrorProps {
  error: string;
}

/** Shared error message rendered below form fields (Input, TextArea, Select). */
export function FieldError({ error }: FieldErrorProps) {
  const theme = useTheme();

  return (
    <Text
      style={[theme.typography.caption, { color: theme.colors.error, marginTop: 4 }]}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      {error}
    </Text>
  );
}
