import { useEffect } from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import type { ConfettiTokens } from '../../tokens/components';

const FULL_TURN_DEG = 360;

export interface ConfettiPieceProps {
  index: number;
  screenW: number;
  screenH: number;
  colors: readonly string[];
  tokens: ConfettiTokens;
}

interface PieceMotion {
  x: SharedValue<number>;
  y: SharedValue<number>;
  rotate: SharedValue<number>;
  opacity: SharedValue<number>;
}

interface PieceFlight {
  drift: number;
  delay: number;
  screenH: number;
  tokens: ConfettiTokens;
}

/** Fall with gravity-like easing while drifting sideways, spinning, then fading out. */
function launchPiece(
  { x, y, rotate, opacity }: PieceMotion,
  { drift, delay, screenH, tokens }: PieceFlight,
) {
  y.value = withDelay(
    delay,
    withTiming(screenH + tokens.exitOffset, {
      duration: tokens.fallDurationMs + Math.random() * tokens.fallDurationJitterMs,
      easing: Easing.in(Easing.quad),
    }),
  );
  x.value = withDelay(
    delay,
    withTiming(x.value + drift, {
      duration: tokens.fallDurationMs + Math.random() * tokens.fallDurationJitterMs,
    }),
  );
  rotate.value = withDelay(
    delay,
    withTiming(rotate.value + tokens.minSpinDeg + Math.random() * tokens.spinJitterDeg, {
      duration: tokens.spinDurationMs,
    }),
  );
  opacity.value = withDelay(
    delay + tokens.fadeDelayMs,
    withTiming(0, { duration: tokens.fadeDurationMs }),
  );
}

/** Every `circleEvery`-th piece is a circle; the rest are rounded rectangles. */
function pieceShape(index: number, colors: readonly string[], tokens: ConfettiTokens) {
  const size = tokens.pieceMinSize + Math.random() * tokens.pieceSizeRange;
  const isCircle = index % tokens.circleEvery === 0;

  return {
    width: size,
    height: isCircle ? size : size * tokens.rectHeightRatio,
    borderRadius: isCircle ? size / 2 : tokens.rectRadius,
    backgroundColor: colors[index % colors.length],
  };
}

/** Randomized spawn point, shape and flight for one piece, launched once on mount. */
function useConfettiPieceStyle({ index, screenW, screenH, colors, tokens }: ConfettiPieceProps) {
  const x = useSharedValue(Math.random() * screenW);
  const y = useSharedValue(-tokens.spawnOffset - Math.random() * tokens.spawnSpread);
  const rotate = useSharedValue(Math.random() * FULL_TURN_DEG);
  const opacity = useSharedValue(1);
  const shape = pieceShape(index, colors, tokens);
  /* Centred on zero so pieces drift both left and right. */
  const drift = (Math.random() - 0.5) * screenW * tokens.driftRatio;
  const delay = Math.random() * tokens.maxDelayMs;

  useEffect(() => {
    launchPiece({ x, y, rotate, opacity }, { drift, delay, screenH, tokens });
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  return useAnimatedStyle(() => ({
    position: 'absolute',
    left: x.value,
    top: y.value,
    ...shape,
    transform: [{ rotate: `${rotate.value}deg` }],
    opacity: opacity.value,
  }));
}

export function ConfettiPiece(props: ConfettiPieceProps) {
  const style = useConfettiPieceStyle(props);

  return <Animated.View style={style} />;
}
