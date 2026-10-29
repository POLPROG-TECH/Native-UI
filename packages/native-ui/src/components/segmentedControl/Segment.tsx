import { Pressable, Text, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { useFocusRing } from '../../hooks/useFocusRing';
import { useTheme } from '../../theme';
import { buildSegmentLabelStyle, buildSegmentStyle } from './segmentedControlStyles';
import type { SegmentedControlOption } from './types';

export interface SegmentProps<T extends string> {
  option: SegmentedControlOption<T>;
  selected: boolean;
  disabled: boolean;
  onSelect: (value: T) => void;
  segmentStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
}

/** One radio segment of a SegmentedControl. */
export function Segment<T extends string>(props: SegmentProps<T>) {
  const { option, selected, disabled } = props;
  const theme = useTheme();
  const { focusProps, focusRingStyle } = useFocusRing();

  return (
    <Pressable
      testID={option.testID}
      onPress={() => props.onSelect(option.value)}
      {...focusProps}
      disabled={disabled}
      accessibilityRole="radio"
      accessibilityLabel={option.accessibilityLabel ?? option.label}
      accessibilityState={{ checked: selected, selected, disabled }}
      style={[buildSegmentStyle(theme, selected, props.segmentStyle), focusRingStyle]}
    >
      {option.leading}
      <Text numberOfLines={1} style={buildSegmentLabelStyle(theme, selected, props.labelStyle)}>
        {option.label}
      </Text>
    </Pressable>
  );
}
