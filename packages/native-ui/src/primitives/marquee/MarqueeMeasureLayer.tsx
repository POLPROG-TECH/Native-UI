import { Text, View, type LayoutChangeEvent, type StyleProp, type TextStyle } from 'react-native';

/**
 * Wide enough that the hidden measurement layer never wraps or clips the
 * text, so `onLayout` reports its intrinsic single-line width. Structural,
 * not a visual dimension.
 */
const UNCONSTRAINED_MEASURE_WIDTH = 99999;

export interface MarqueeMeasureLayerProps {
  text: string;
  style?: StyleProp<TextStyle>;
  onLayout: (event: LayoutChangeEvent) => void;
}

/**
 * Invisible, unconstrained copy of the text that reports its intrinsic width
 * regardless of the container's constraints. Hidden from assistive technology.
 */
export function MarqueeMeasureLayer({ text, style, onLayout }: MarqueeMeasureLayerProps) {
  return (
    <View
      style={{
        position: 'absolute',
        opacity: 0,
        width: UNCONSTRAINED_MEASURE_WIDTH,
        alignItems: 'flex-start',
      }}
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Text key={text} style={style} onLayout={onLayout}>
        {text}
      </Text>
    </View>
  );
}
