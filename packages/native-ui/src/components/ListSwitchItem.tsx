import React from 'react';
import { Switch } from 'react-native';
import { useTheme } from '../theme';
import { ListItem } from './ListItem';

export interface ListSwitchItemProps {
  /** Primary label */
  label: string;
  /** Secondary text below the label */
  subtitle?: string;
  /** Leading icon (emoji or rendered element) */
  icon?: React.ReactNode;
  /** Current toggle value */
  value: boolean;
  /** Called when the switch is toggled */
  onValueChange: (value: boolean) => void;
  /** When true, omits the bottom margin on the self-contained card (last row in a section). */
  omitSpacing?: boolean;
  /** When `true` and rendered inside a grouped `ListSection`, suppresses the hairline divider after this row. */
  hideDivider?: boolean;
}

/**
 * List row with an integrated Switch toggle.
 * Composed from ListItem + React Native Switch.
 */
export function ListSwitchItem({
  label,
  subtitle,
  icon,
  value,
  onValueChange,
  omitSpacing,
  hideDivider,
}: ListSwitchItemProps) {
  const theme = useTheme();

  return (
    <ListItem
      title={label}
      subtitle={subtitle}
      icon={icon}
      showChevron={false}
      omitSpacing={omitSpacing}
      hideDivider={hideDivider}
      trailing={
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{
            false: theme.colors.surfaceSecondary,
            true: theme.colors.primary,
          }}
          thumbColor={theme.colors.surface}
          ios_backgroundColor={theme.colors.surfaceSecondary}
        />
      }
    />
  );
}
