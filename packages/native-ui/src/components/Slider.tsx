import { useMemo } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { useFocusRing } from '../hooks/useFocusRing';
import { useTheme } from '../theme';
import { accessibilityValueProps } from '../utils/accessibilityValueProps';
import {
  fractionOf,
  sliderAccessibilityValue,
  sliderWebValue,
  type SliderRange,
} from './slider/sliderMath';
import {
  buildFillStyle,
  buildRowStyle,
  buildThumbStyle,
  buildTrackStyle,
  styles,
} from './slider/sliderStyles';
import { ADJUST_ACCESSIBILITY_ACTIONS, useSliderAdjust } from './slider/useSliderAdjust';
import { useSliderDrag } from './slider/useSliderDrag';
import { useSliderKeyboard } from './slider/useSliderKeyboard';
import { accessibilityStateProps } from '../utils/accessibilityStateProps';

export interface SliderProps {
  value: number;
  /** Called while dragging and for every accessibility adjustment. */
  onValueChange: (value: number) => void;
  /** Called once when the finger lifts or an accessibility adjustment ends. */
  onSlidingComplete?: (value: number) => void;
  /** @default 0 */
  minimumValue?: number;
  /** @default 1 */
  maximumValue?: number;
  /** Granularity of the value; 0 makes the slider continuous. @default 0 */
  step?: number;
  /** @default false */
  disabled?: boolean;
  /** Accessible name of the slider (e.g. "Volume"). */
  accessibilityLabel: string;
  /** Spoken form of the value (e.g. `(v) => `${v}%``). @default String */
  formatValue?: (value: number) => string;
  /** Fill of the selected range. @default theme.components.slider.fillColor ?? colors.primary */
  color?: string;
  style?: StyleProp<ViewStyle>;
  /** Test ID of the row; the thumb receives `{testID}-thumb`. */
  testID?: string;
}

interface SliderVisualProps {
  fraction: number;
  color: string | undefined;
  thumbTestID: string | undefined;
}

/** Track, fill and thumb; none of them takes touches (the row does). */
function SliderVisual({ fraction, color, thumbTestID }: SliderVisualProps) {
  const theme = useTheme();

  return (
    <>
      <View style={[styles.untouchable, buildTrackStyle(theme)]}>
        <View style={[styles.fill, buildFillStyle(theme, fraction, color)]} />
      </View>
      <View testID={thumbTestID} style={buildThumbStyle(theme, fraction)} />
    </>
  );
}

function useSliderHandlers(props: SliderProps, range: SliderRange) {
  const { value, disabled = false, onValueChange, onSlidingComplete } = props;
  const tokens = useTheme().components.slider;
  const adjustOptions = {
    value,
    range,
    continuousStepRatio: tokens.continuousStepRatio,
    onValueChange,
    onSlidingComplete,
  };
  const drag = useSliderDrag({
    value,
    range,
    disabled,
    thumbSize: tokens.thumbSize,
    onValueChange,
    onSlidingComplete,
  });

  return {
    drag,
    adjust: useSliderAdjust(adjustOptions),
    keyboard: useSliderKeyboard(adjustOptions, disabled),
  };
}

function sliderAccessibilityProps(props: SliderProps, range: SliderRange) {
  const { value, disabled = false, formatValue = String } = props;

  return {
    accessible: true,
    /* Keyboard and D-pad focus; a disabled slider is skipped. */
    focusable: !disabled,
    accessibilityLabel: props.accessibilityLabel,
    ...accessibilityValueProps(
      sliderAccessibilityValue(value, range, formatValue),
      sliderWebValue(value, range, formatValue),
    ),
    ...accessibilityStateProps('adjustable', { disabled }),
    accessibilityActions: disabled ? undefined : ADJUST_ACCESSIBILITY_ACTIONS,
  };
}

/**
 * Picks a number from a range by dragging a thumb along a track. Screen
 * readers adjust it with the increment and decrement gestures (swipe up or
 * down in VoiceOver, volume keys in TalkBack). On web it takes keyboard
 * focus and answers to the arrow, Home and End keys. Dimensions and colors
 * come from `theme.components.slider`.
 *
 * @example
 * ```tsx
 * <Slider
 *   accessibilityLabel="Volume"
 *   value={volume}
 *   onValueChange={setVolume}
 *   maximumValue={100}
 *   step={5}
 *   formatValue={(v) => `${v}%`}
 * />
 * ```
 */
export function Slider(props: SliderProps) {
  const { value, minimumValue = 0, maximumValue = 1, step = 0, disabled = false } = props;
  const theme = useTheme();
  const range = useMemo<SliderRange>(
    () => ({ min: minimumValue, max: maximumValue, step }),
    [minimumValue, maximumValue, step],
  );
  const { drag, adjust, keyboard } = useSliderHandlers(props, range);
  const { focusProps, focusRingStyle } = useFocusRing();

  return (
    <View
      testID={props.testID}
      onLayout={drag.onLayout}
      {...drag.panHandlers}
      {...focusProps}
      {...keyboard}
      {...sliderAccessibilityProps(props, range)}
      onAccessibilityAction={adjust}
      style={[buildRowStyle(theme, disabled, props.style), focusRingStyle]}
    >
      <SliderVisual
        fraction={fractionOf(value, range)}
        color={props.color}
        thumbTestID={props.testID ? `${props.testID}-thumb` : undefined}
      />
    </View>
  );
}
