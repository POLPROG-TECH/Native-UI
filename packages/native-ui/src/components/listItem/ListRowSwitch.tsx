import { Switch } from 'react-native';
import { useTheme } from '../../theme';

interface ListRowSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

/**
 * Platform Switch tinted with theme colors. iOS paints the off state from
 * `ios_backgroundColor` rather than `trackColor.false`, so both are set.
 */
export function ListRowSwitch({ value, onValueChange }: ListRowSwitchProps) {
  const theme = useTheme();

  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{
        false: theme.colors.controlTrack,
        true: theme.colors.primary,
      }}
      thumbColor={theme.colors.controlThumb}
      ios_backgroundColor={theme.colors.controlTrack}
    />
  );
}
