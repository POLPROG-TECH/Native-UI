import type React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import { TooltipBubble } from './tooltip/TooltipBubble';
import { TOOLTIP_PLACEMENT, type TooltipPlacement } from './tooltip/tooltipPosition';
import { useTooltipPosition } from './tooltip/useTooltipPosition';
import { useTooltipVisibility } from './tooltip/useTooltipVisibility';

export { TOOLTIP_PLACEMENT } from './tooltip/tooltipPosition';
export type { TooltipPlacement } from './tooltip/tooltipPosition';

export interface TooltipProps {
  content: string;
  children: React.ReactNode;
  /** Preferred side; the other one is used when this one has no room. @default 'top' */
  placement?: TooltipPlacement;
  /** Controlled visibility; overrides hover, focus and long press. */
  visible?: boolean;
  /** @default false */
  disabled?: boolean;
  /** Held touch time before the bubble shows. @default theme.duration.slow */
  longPressDelayMs?: number;
  style?: StyleProp<ViewStyle>;
  /** Test ID of the wrapper; the bubble receives `{testID}-bubble`. */
  testID?: string;
}

/**
 * Short hint anchored to its child: shown on hover and keyboard focus (web,
 * mouse, hardware keyboard) and after a long press on touch screens. The
 * bubble is a visual aid only, so the child still needs its own
 * `accessibilityLabel`; never put information in a tooltip that is not
 * available elsewhere. `placement` is a preference: the bubble flips to the
 * other side when there is no room and slides sideways to stay inside the
 * window. Dimensions come from `theme.components.tooltip`.
 *
 * @example
 * ```tsx
 * <Tooltip content="Copy link">
 *   <IconButton icon={<CopyIcon />} accessibilityLabel="Copy link" onPress={copy} />
 * </Tooltip>
 * ```
 */
export function Tooltip(props: TooltipProps) {
  const { content, placement = TOOLTIP_PLACEMENT.top, disabled = false, testID } = props;
  const theme = useTheme();
  const visibility = useTooltipVisibility({
    longPressDelayMs: props.longPressDelayMs ?? theme.duration.slow,
    visibleDurationMs: theme.components.tooltip.visibleDurationMs,
    disabled,
  });
  const visible = props.visible ?? visibility.visible;
  const { triggerRef, onBubbleLayout, position } = useTooltipPosition(placement, visible);

  return (
    <View
      ref={triggerRef}
      testID={testID}
      style={[styles.wrapper, props.style]}
      {...visibility.handlers}
    >
      {props.children}
      {visible ? (
        <TooltipBubble
          content={content}
          placement={placement}
          position={position}
          onLayout={onBubbleLayout}
          testID={testID ? `${testID}-bubble` : undefined}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'flex-start',
  },
});
