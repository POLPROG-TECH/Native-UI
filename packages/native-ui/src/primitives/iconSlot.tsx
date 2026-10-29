import React from 'react';
import { Text } from 'react-native';

/** Color and size a component hands to its icon so the icon follows the theme. */
export interface IconRenderProps {
  color: string;
  size: number;
}

/**
 * The icon convention shared by every component:
 * - a render function `({ color, size }) => <Icon ... />` (preferred: the
 *   icon follows the theme, state and RTL),
 * - any React node, rendered as-is,
 * - a string such as an emoji, rendered as text at `size` (kept for
 *   backwards compatibility; emoji look different on every platform).
 */
export type IconSlot = React.ReactNode | ((props: IconRenderProps) => React.ReactNode);

/** Renders an icon slot with the component's color and size. */
export function renderIconSlot(
  slot: IconSlot | undefined,
  props: IconRenderProps,
): React.ReactNode {
  if (typeof slot === 'function') {
    return slot(props);
  }

  if (typeof slot === 'string') {
    return (
      <Text
        style={{ fontSize: props.size, lineHeight: Math.round(props.size * EMOJI_LINE_RATIO) }}
        accessibilityElementsHidden
        importantForAccessibility="no"
      >
        {slot}
      </Text>
    );
  }

  return slot;
}

/** Emoji glyphs need a little vertical room to avoid clipping. */
const EMOJI_LINE_RATIO = 1.2;
