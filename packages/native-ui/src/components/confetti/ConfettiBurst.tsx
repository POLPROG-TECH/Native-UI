import { useMemo } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Animated from 'react-native-reanimated';
import type { ConfettiTokens } from '../../tokens/components';
import { ConfettiPiece } from './ConfettiPiece';

interface ConfettiBurstProps {
  burstKey: number;
  particleCount: number;
  colors: readonly string[];
  tokens: ConfettiTokens;
  testID?: string;
}

/** Full-screen layer of falling pieces that never intercepts touches. */
export function ConfettiBurst({
  burstKey,
  particleCount,
  colors,
  tokens,
  testID,
}: ConfettiBurstProps) {
  const { width: screenW, height: screenH } = useWindowDimensions();
  const pieces = useMemo(() => Array.from({ length: particleCount }, (_, i) => i), [particleCount]);

  return (
    <Animated.View
      style={[styles.container, { zIndex: tokens.zIndex }]}
      pointerEvents="none"
      testID={testID}
    >
      {pieces.map((i) => (
        <ConfettiPiece
          key={`${burstKey}-${i}`}
          index={i}
          screenW={screenW}
          screenH={screenH}
          colors={colors}
          tokens={tokens}
        />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
