import type React from 'react';
import type { IconSlot } from '../../primitives/iconSlot';

/** Slot inputs of a ListItem: static nodes, their render-prop alternatives, and press state. */
export interface ListItemSlotInput {
  icon?: IconSlot;
  renderIcon?: () => React.ReactNode;
  trailing?: React.ReactNode;
  renderTrailing?: () => React.ReactNode;
  showChevron?: boolean;
  onPress?: () => void;
}

export interface ListItemSlots {
  /** Still a slot: the row renders it with its own color and size. */
  icon: IconSlot;
  trailing: React.ReactNode;
  showChevron: boolean;
}

/**
 * Resolves what the row actually renders. Render props win over static nodes,
 * and the chevron defaults on only for pressable rows without a custom
 * trailing element, so it never competes with a Switch or Badge.
 */
export function resolveListItemSlots({
  icon,
  renderIcon,
  trailing,
  renderTrailing,
  showChevron,
  onPress,
}: ListItemSlotInput): ListItemSlots {
  const resolvedIcon = renderIcon ? renderIcon() : icon;
  const resolvedTrailing = renderTrailing ? renderTrailing() : trailing;

  return {
    icon: resolvedIcon,
    trailing: resolvedTrailing,
    showChevron: showChevron ?? (onPress !== undefined && !resolvedTrailing),
  };
}
