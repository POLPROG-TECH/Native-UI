import { Text, type StyleProp, type TextStyle } from 'react-native';
import { useTheme } from '../theme';

export interface FieldLabelProps {
  label: string;
  required?: boolean;
  style?: StyleProp<TextStyle>;
  testID?: string;
}

/** Shared uppercase label used above form fields (Input, TextArea, Select). */
export function FieldLabel({ label, required, style, testID }: FieldLabelProps) {
  const theme = useTheme();
  const tokens = theme.components.fieldLabel;

  return (
    <Text
      testID={testID}
      /* Screen readers hear "Amount, required" instead of "Amount star". */
      accessibilityLabel={required ? `${label}, ${theme.labels.required}` : undefined}
      style={[
        theme.typography.labelSmall,
        {
          color: theme.colors.textSecondary,
          marginBottom: tokens.marginBottom,
          textTransform: 'uppercase',
          letterSpacing: tokens.letterSpacing,
        },
        style,
      ]}
    >
      {label}
      {required && (
        <Text style={{ color: theme.colors.errorText }}>{theme.labels.requiredMarker}</Text>
      )}
    </Text>
  );
}
