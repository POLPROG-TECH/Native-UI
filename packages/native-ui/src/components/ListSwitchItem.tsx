import type { StyleProp, ViewStyle } from 'react-native';
import type { IconSlot } from '../primitives/iconSlot';
import { ListItem } from './ListItem';
import { ListRowSwitch } from './listItem/ListRowSwitch';

export interface ListSwitchItemProps {
  /** Primary label */
  label: string;
  /** Secondary text below the label */
  subtitle?: string;
  /**
   * Leading icon, rendered like `ListItem`'s `icon`: prefer a render function
   * (`({ color, size }) => <SystemIcon ... />`); emoji strings are kept for
   * backwards compatibility.
   */
  icon?: IconSlot;
  /** Current toggle value */
  value: boolean;
  /** Called when the switch is toggled */
  onValueChange: (value: boolean) => void;
  /** When true, omits the bottom margin on the self-contained card (last row in a section). */
  omitSpacing?: boolean;
  /** When `true` and rendered inside a grouped `ListSection`, suppresses the hairline divider after this row. */
  hideDivider?: boolean;
  /** Additional styles applied to the row container. */
  style?: StyleProp<ViewStyle>;
  /** Test ID forwarded to the row's outermost element. */
  testID?: string;
}

/**
 * List row with an integrated Switch toggle.
 * Composed from ListItem + React Native Switch, so its geometry follows
 * `theme.components.listItem`.
 */
export function ListSwitchItem({ label, value, onValueChange, ...rowProps }: ListSwitchItemProps) {
  return (
    <ListItem
      {...rowProps}
      title={label}
      showChevron={false}
      trailing={<ListRowSwitch value={value} onValueChange={onValueChange} />}
    />
  );
}
