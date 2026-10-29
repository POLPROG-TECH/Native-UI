import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import { GLYPH_RENDERERS, type SystemIconName } from './systemIcon/glyphs';

export type { SystemIconName } from './systemIcon/glyphs';

export interface SystemIconProps {
  name: SystemIconName;
  /** Edge length of the square icon box. @default theme.iconSize.md */
  size?: number;
  /** Stroke color. @default theme.colors.textPrimary */
  color?: string;
  /** Stroke thickness as a fraction of `size`. @default 0.12 */
  strokeRatio?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const DEFAULT_STROKE_RATIO = 0.12;

/**
 * Small set of interface glyphs drawn with plain Views. Unlike Unicode
 * characters (`✕`, `✓`, `▼`), they render identically on iOS and Android,
 * follow the theme color, scale with `size`, and never depend on the active
 * font. Decorative by default: hidden from screen readers, so the owning
 * control supplies the accessible name.
 */
export function SystemIcon(props: SystemIconProps) {
  const { name, strokeRatio = DEFAULT_STROKE_RATIO } = props;
  const theme = useTheme();
  const box = props.size ?? theme.iconSize.md;
  const color = props.color ?? theme.colors.textPrimary;
  const stroke = Math.max(1, Math.round(box * strokeRatio));

  return (
    <View
      testID={props.testID}
      style={[styles.box, { width: box, height: box }, props.style]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {GLYPH_RENDERERS[name]({ box, stroke, color })}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
