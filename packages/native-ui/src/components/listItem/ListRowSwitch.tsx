import { Switch } from 'react-native';
import { useTheme } from '../../theme';

interface ListRowSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  /** The row's text: the native control has no label of its own. */
  accessibilityLabel: string;
}

/**
 * Platform Switch tinted with theme colors and named by the row it sits in,
 * so a screen reader announces "Notifications, switch, off" instead of a bare
 * switch. iOS paints the off state from `ios_backgroundColor` rather than
 * `trackColor.false`, so both are set.
 */
export function ListRowSwitch({ value, onValueChange, accessibilityLabel }: ListRowSwitchProps) {
  const theme = useTheme();

  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      accessibilityLabel={accessibilityLabel}
      trackColor={{
        false: theme.colors.controlTrack,
        true: theme.colors.primary,
      }}
      thumbColor={theme.colors.controlThumb}
      ios_backgroundColor={theme.colors.controlTrack}
    />
  );
}
