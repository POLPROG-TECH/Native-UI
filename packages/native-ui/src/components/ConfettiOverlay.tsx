import { useTheme } from '../theme';
import { ConfettiBurst } from './confetti/ConfettiBurst';
import { useConfettiBurst } from './confetti/useConfettiBurst';

export interface ConfettiOverlayProps {
  /** Triggers the burst when it transitions from `false` to `true`. */
  visible: boolean;
  /**
   * Total number of confetti pieces rendered.
   * @default theme.components.confetti.particleCount (40)
   */
  particleCount?: number;
  /**
   * How long the overlay remains visible before auto-hiding (ms).
   * @default theme.components.confetti.durationMs (3000)
   */
  duration?: number;
  /**
   * Color palette; pieces are picked round-robin.
   * @default theme.components.confetti.colors
   */
  colors?: readonly string[];
  /** Called when the overlay auto-hides. */
  onComplete?: () => void;
  /**
   * When `true`, overrides `theme.reduceAnimations` and forces the burst to
   * render. Useful for celebration moments where motion is the point; leave
   * `false` (default) to honor the accessibility preference.
   * @default false
   */
  forceAnimation?: boolean;
  /** Test ID forwarded to the overlay container while it is shown. */
  testID?: string;
}

/**
 * Celebratory confetti burst overlay. Mount once near the root of a screen and
 * toggle `visible` to fire it. The overlay ignores pointer events so it never
 * blocks user interaction.
 *
 * Defaults and the particle physics come from `theme.components.confetti`.
 *
 * Honors `theme.reduceAnimations` by default - pass `forceAnimation` to opt
 * out when the animation is essential to the moment being celebrated.
 *
 * @example
 * ```tsx
 * <ConfettiOverlay
 *   visible={justCompletedGoal}
 *   duration={2500}
 *   onComplete={() => setJustCompletedGoal(false)}
 * />
 * ```
 */
export function ConfettiOverlay({
  visible,
  particleCount,
  duration,
  colors,
  onComplete,
  forceAnimation = false,
  testID,
}: ConfettiOverlayProps) {
  const tokens = useTheme().components.confetti;
  const { show, burstKey } = useConfettiBurst({
    visible,
    forceAnimation,
    duration: duration ?? tokens.durationMs,
    onComplete,
  });

  if (!show) {
    return null;
  }

  return (
    <ConfettiBurst
      burstKey={burstKey}
      particleCount={particleCount ?? tokens.particleCount}
      colors={colors ?? tokens.colors}
      tokens={tokens}
      testID={testID}
    />
  );
}
