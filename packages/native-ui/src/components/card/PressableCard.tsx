import type { StyleProp, ViewStyle } from 'react-native';
import { PressableScale } from '../../primitives/PressableScale';
import { useTheme } from '../../theme';
import type { CardProps } from './types';

type PressableCardProps = Pick<
  CardProps,
  'children' | 'onPress' | 'onLongPress' | 'accessibilityHint' | 'testID'
> & { style: StyleProp<ViewStyle> };

/** Card surface with spring-scale press feedback, announced as a button. */
export function PressableCard({
  children,
  style,
  onPress,
  onLongPress,
  accessibilityHint,
  testID,
}: PressableCardProps) {
  const theme = useTheme();
  const tokens = theme.components.card;

  return (
    <PressableScale
      onPress={onPress}
      onLongPress={onLongPress}
      style={style}
      scaleTo={tokens.pressScale}
      hitSlop={tokens.hitSlop}
      testID={testID}
      accessibilityRole="button"
      accessibilityHint={accessibilityHint ?? theme.labels.cardHint}
    >
      {children}
    </PressableScale>
  );
}
