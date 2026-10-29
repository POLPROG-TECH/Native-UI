import { useMemo } from 'react';
import { PanResponder, type GestureResponderHandlers } from 'react-native';
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import type { BottomSheetTokens } from '../../tokens/components';
import { clampSheetDrag, shouldDismissSheet } from './sheetGesture';

/**
 * Handle-drag gesture: the sheet follows the finger down and dismisses past
 * the token thresholds, otherwise it springs back. Uses core `PanResponder`
 * so no gesture-handler dependency is needed.
 */
export function useSheetDrag(enabled: boolean, tokens: BottomSheetTokens, onDismiss: () => void) {
  const translateY = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const panHandlers = useMemo((): GestureResponderHandlers | undefined => {
    if (!enabled) {
      return undefined;
    }

    const springBack = () => {
      translateY.value = withTiming(0, { duration: tokens.exitDurationMs });
    };

    return PanResponder.create({
      onMoveShouldSetPanResponder: (_event, gesture) => Math.abs(gesture.dy) > Math.abs(gesture.dx),
      onPanResponderMove: (_event, gesture) => {
        translateY.value = clampSheetDrag(gesture.dy);
      },
      onPanResponderRelease: (_event, gesture) => {
        if (shouldDismissSheet(gesture.dy, gesture.vy, tokens)) {
          onDismiss();
        }

        springBack();
      },
      onPanResponderTerminate: springBack,
    }).panHandlers;
  }, [enabled, tokens, onDismiss, translateY]);

  return { animatedStyle, panHandlers };
}
