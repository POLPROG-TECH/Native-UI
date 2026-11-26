import { useCallback, useEffect, useRef, useState, type ComponentRef, type RefObject } from 'react';
import { useWindowDimensions, type LayoutChangeEvent, type View } from 'react-native';
import { useTheme } from '../../theme';
import {
  resolveTooltipPosition,
  type Rect,
  type Size,
  type TooltipPlacement,
  type TooltipPosition,
} from './tooltipPosition';

/** Since React Native 0.87 `View` as a type is the component, not its instance. */
type ViewRef = ComponentRef<typeof View>;

/** Explicit type keeps the emitted declaration portable across React Native versions. */
export interface TooltipPositionResult {
  triggerRef: RefObject<ViewRef | null>;
  onBubbleLayout: (event: LayoutChangeEvent) => void;
  /** `null` until both the trigger and the bubble are measured. */
  position: TooltipPosition | null;
}

/**
 * Measures the trigger each time the tooltip opens (it may have scrolled
 * since) and the bubble once it is laid out. Until both are known the
 * position is `null` and the bubble stays invisible, so it never flashes on
 * the wrong side.
 */
export function useTooltipPosition(
  placement: TooltipPlacement,
  visible: boolean,
): TooltipPositionResult {
  const triggerRef = useRef<ViewRef>(null);
  const [trigger, setTrigger] = useState<Rect | null>(null);
  const [bubble, setBubble] = useState<Size | null>(null);
  const window = useWindowDimensions();
  const { offset, edgeInset } = useTheme().components.tooltip;

  useEffect(() => {
    if (!visible) {
      setTrigger(null);

      return;
    }

    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setTrigger({ x, y, width, height });
    });
  }, [visible]);

  const onBubbleLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;

    setBubble({ width, height });
  }, []);

  const position: TooltipPosition | null =
    trigger && bubble
      ? resolveTooltipPosition({ placement, trigger, bubble, window, offset, edgeInset })
      : null;

  return { triggerRef, onBubbleLayout, position };
}
