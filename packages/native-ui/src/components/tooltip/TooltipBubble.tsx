import {
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '../../theme';
import type { Theme } from '../../theme/types';
import { TOOLTIP_PLACEMENT, type TooltipPlacement, type TooltipPosition } from './tooltipPosition';

const FULL = '100%';
const HALF = '50%';

/**
 * Anchor centered on the trigger and as wide as the bubble may get, so the
 * bubble can be wider than a small trigger (an icon button).
 */
function anchorStyle(theme: Theme, placement: TooltipPlacement): ViewStyle {
  const { maxWidth, offset } = theme.components.tooltip;
  const edge: ViewStyle =
    placement === TOOLTIP_PLACEMENT.top
      ? { bottom: FULL, marginBottom: offset }
      : { top: FULL, marginTop: offset };

  return { ...edge, left: HALF, width: maxWidth, marginLeft: -maxWidth / 2 };
}

/** Hidden until it is measured, then moved sideways to stay inside the window. */
function bubbleStyle(theme: Theme, position: TooltipPosition | null): StyleProp<ViewStyle> {
  const tokens = theme.components.tooltip;

  return [
    theme.elevation[tokens.elevation],
    {
      paddingHorizontal: tokens.paddingHorizontal,
      paddingVertical: tokens.paddingVertical,
      borderRadius: tokens.radius,
      backgroundColor: theme.colors.inverseSurface,
    },
    position ? { transform: [{ translateX: position.shiftX }] } : styles.unmeasured,
  ];
}

export interface TooltipBubbleProps {
  content: string;
  /** Side the app asked for; used until the measured position is known. */
  placement: TooltipPlacement;
  position: TooltipPosition | null;
  onLayout: (event: LayoutChangeEvent) => void;
  testID: string | undefined;
}

/** The floating label. It never takes touches, so it cannot block the trigger. */
export function TooltipBubble(props: TooltipBubbleProps) {
  const { position } = props;
  const theme = useTheme();
  const typography = theme.typography[theme.components.tooltip.textVariant];
  const placement = position?.placement ?? props.placement;

  return (
    <View style={[styles.anchor, { zIndex: theme.zIndex.overlay }, anchorStyle(theme, placement)]}>
      <View
        testID={props.testID}
        role="tooltip"
        onLayout={props.onLayout}
        style={bubbleStyle(theme, position)}
      >
        <Text style={[typography, styles.text, { color: theme.colors.onInverseSurface }]}>
          {props.content}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  anchor: {
    position: 'absolute',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  text: {
    textAlign: 'center',
  },
  unmeasured: {
    opacity: 0,
  },
});
