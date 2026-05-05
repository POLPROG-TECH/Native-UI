import { Text } from 'react-native';
import { useTheme } from '../theme';

export interface FieldLabelProps {
  label: string;
  required?: boolean;
}

/** Shared uppercase label used above form fields (Input, TextArea, Select). */
export function FieldLabel({ label, required }: FieldLabelProps) {
  const theme = useTheme();

  return (
    <Text
      style={[
        theme.typography.labelSmall,
        {
          color: theme.colors.textSecondary,
          marginBottom: 6,
          textTransform: 'uppercase',
          letterSpacing: 0.6,
        },
      ]}
    >
      {label}
      {required && <Text style={{ color: theme.colors.error }}> *</Text>}
    </Text>
  );
}
