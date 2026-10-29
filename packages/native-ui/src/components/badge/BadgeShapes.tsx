import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../../theme';
import type { ColorScheme } from '../../tokens/colors';
import type { BadgeVariant } from './types';

interface BadgeShapeProps {
  variant: BadgeVariant;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/** Text token that stays legible on each variant's solid fill. */
const ON_COLOR = {
  primary: 'onPrimary',
  error: 'onError',
  warning: 'onWarning',
  success: 'onSuccess',
  info: 'onInfo',
} as const satisfies Record<BadgeVariant, keyof ColorScheme>;

/** Status dot; hidden from screen readers since it carries no text. */
export function BadgeDot({ variant, style, testID }: BadgeShapeProps) {
  const theme = useTheme();
  const { dotSize } = theme.components.badge;
  const dotStyle: ViewStyle = {
    width: dotSize,
    height: dotSize,
    borderRadius: dotSize / 2,
    backgroundColor: theme.colors[variant],
  };

  return <View testID={testID} style={[dotStyle, style]} accessibilityElementsHidden />;
}

/** Pill with a count or label, announced by its text. */
export function BadgePill({ text, variant, style, testID }: BadgeShapeProps & { text: string }) {
  const theme = useTheme();
  const tokens = theme.components.badge;
  const pillStyle: ViewStyle = {
    minWidth: tokens.minWidth,
    height: tokens.height,
    borderRadius: tokens.height / 2,
    paddingHorizontal: tokens.paddingHorizontal,
    backgroundColor: theme.colors[variant],
  };
  const textStyle = {
    fontSize: tokens.fontSize,
    lineHeight: tokens.lineHeight,
    color: theme.colors[ON_COLOR[variant]],
  };

  return (
    <View testID={testID} style={[styles.badge, pillStyle, style]} accessibilityLabel={text}>
      <Text style={[styles.text, textStyle]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '700',
  },
});
