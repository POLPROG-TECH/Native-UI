import type React from 'react';
import { View } from 'react-native';
import { renderIconSlot, type IconSlot } from '../../primitives/iconSlot';
import { useTheme } from '../../theme';
import type { ListItemProps } from './types';
import { ListItemLabel } from './ListItemLabel';
import { ListItemTrailing } from './ListItemTrailing';
import { resolveListItemSlots } from './listItemSlots';
import { listItemLayout, useRowSurfaceStyle, type ListItemStyles } from './listItemStyles';

interface ListItemRowProps extends Omit<ListItemProps, 'disabled' | 'hideDivider'> {
  styles: ListItemStyles;
}

/** Leading icons are muted like secondary text, or red on destructive rows. */
function useLeadingIcon(slot: IconSlot, destructive: boolean): React.ReactNode {
  const theme = useTheme();
  const color = destructive ? theme.colors.errorText : theme.colors.textSecondary;

  return renderIconSlot(slot, { color, size: theme.components.listItem.iconSize });
}

/** Visual row (leading icon, label, trailing region) shared by both press states. */
export function ListItemRow({ styles, ...props }: ListItemRowProps) {
  const slots = resolveListItemSlots(props);
  const surfaceStyle = useRowSurfaceStyle(props.omitSpacing ?? false);
  const leadingIcon = useLeadingIcon(slots.icon, props.destructive ?? false);

  return (
    <View style={[listItemLayout.row, styles.row, surfaceStyle, props.style]}>
      {Boolean(slots.icon) && leadingIcon != null ? (
        <View style={[listItemLayout.iconContainer, styles.iconContainer]}>{leadingIcon}</View>
      ) : null}
      <ListItemLabel
        title={props.title}
        subtitle={props.subtitle}
        destructive={props.destructive ?? false}
        styles={styles}
      />
      <ListItemTrailing
        value={props.value}
        trailing={slots.trailing}
        showChevron={slots.showChevron}
        renderChevron={props.renderChevron}
        testID={props.testID}
        styles={styles}
      />
    </View>
  );
}
