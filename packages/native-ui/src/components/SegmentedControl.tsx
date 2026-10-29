import { View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import type { HapticsInterface } from '../utils/haptics';
import { Segment } from './segmentedControl/Segment';
import { buildTrackStyle } from './segmentedControl/segmentedControlStyles';
import { useSegmentSelection } from './segmentedControl/useSegmentSelection';
import type { SegmentedControlOption } from './segmentedControl/types';

export type { SegmentedControlOption } from './segmentedControl/types';

export interface SegmentedControlProps<T extends string> {
  options: ReadonlyArray<SegmentedControlOption<T>>;
  /** Currently selected value. */
  value: T;
  onChange: (value: T) => void;
  /** Disables every segment. @default false */
  disabled?: boolean;
  /** Haptic played on change, or `false`. @default 'light' */
  haptic?: keyof HapticsInterface | false;
  /** Accessible name of the whole group (e.g. "Theme"). */
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  segmentStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  testID?: string;
}

/**
 * Single-choice segmented control (iOS `UISegmentedControl` style): a track
 * with equally sized segments, the selected one raised on a thumb. Exposed to
 * screen readers as a radio group. Dimensions and colors come from
 * `theme.components.segmentedControl`.
 *
 * @example
 * ```tsx
 * <SegmentedControl
 *   accessibilityLabel="Theme"
 *   options={[
 *     { value: 'light', label: 'Light' },
 *     { value: 'dark', label: 'Dark' },
 *     { value: 'system', label: 'System' },
 *   ]}
 *   value={mode}
 *   onChange={setMode}
 * />
 * ```
 */
export function SegmentedControl<T extends string>(props: SegmentedControlProps<T>) {
  const { options, value, disabled = false, haptic = 'light' } = props;
  const theme = useTheme();
  const select = useSegmentSelection(value, haptic, props.onChange);

  return (
    <View
      testID={props.testID}
      accessibilityRole="radiogroup"
      accessibilityLabel={props.accessibilityLabel}
      style={buildTrackStyle(theme, disabled, props.style)}
    >
      {options.map((option) => (
        <Segment
          key={option.value}
          option={option}
          selected={option.value === value}
          disabled={disabled || option.disabled === true}
          onSelect={select}
          segmentStyle={props.segmentStyle}
          labelStyle={props.labelStyle}
        />
      ))}
    </View>
  );
}
