import { borderWidth } from '../spacing';
import type { ComponentTokenContext } from './merge';

/**
 * Display and motion primitives (dividers, labels, indicators, celebratory
 * effects). Aggregated by `layout.ts`.
 */

export interface DividerTokens {
  /** Line thickness; also used by the hairlines between grouped list rows. */
  thickness: number;
}

export interface SectionLabelTokens {
  paddingHorizontal: number;
  marginTop: number;
  marginBottom: number;
}

export interface MarqueeTextTokens {
  /** Scroll speed in points per second. */
  speed: number;
  /** Pause at the start and end of each scroll cycle. */
  pauseDurationMs: number;
  /** Gap between the end of the text and the restart position. */
  gap: number;
  /** Overflow (points) below which the text stays static. */
  overflowTolerance: number;
}

export interface PaginationDotsTokens {
  dotWidth: number;
  /** Width of the elongated active dot. */
  activeWidth: number;
  /** Dot height; inactive dots are fully rounded at half of it. */
  height: number;
  gap: number;
  /** Width transition when the active dot changes. */
  durationMs: number;
}

export interface ConfettiTokens {
  /** Palette used when no `colors` prop is given; pieces pick it round-robin. */
  colors: readonly string[];
  particleCount: number;
  /** How long the overlay stays mounted before auto-hiding. */
  durationMs: number;
  /** Smallest piece edge; each piece adds a random share of `pieceSizeRange`. */
  pieceMinSize: number;
  pieceSizeRange: number;
  /** Height of rectangular pieces relative to their width. */
  rectHeightRatio: number;
  rectRadius: number;
  /** Every n-th piece is a circle instead of a rectangle. */
  circleEvery: number;
  /** Pieces spawn this far above the top edge, plus a random `spawnSpread`. */
  spawnOffset: number;
  spawnSpread: number;
  /** Pieces fall this far past the bottom edge. */
  exitOffset: number;
  /** Maximum horizontal drift as a fraction of the window width. */
  driftRatio: number;
  /** Upper bound of the random start delay of each piece. */
  maxDelayMs: number;
  fallDurationMs: number;
  /** Random extra fall time, so pieces do not land in lockstep. */
  fallDurationJitterMs: number;
  spinDurationMs: number;
  /** Minimum rotation in degrees; each piece adds a random `spinJitterDeg`. */
  minSpinDeg: number;
  spinJitterDeg: number;
  /** Delay (after the start delay) before a piece starts fading out. */
  fadeDelayMs: number;
  fadeDurationMs: number;
  zIndex: number;
}

export interface ErrorBoundaryTokens {
  /** Size of the icon above the message in the default fallback. */
  iconSize: number;
}

export interface DisplayTokens {
  divider: DividerTokens;
  sectionLabel: SectionLabelTokens;
  marqueeText: MarqueeTextTokens;
  paginationDots: PaginationDotsTokens;
  confetti: ConfettiTokens;
  errorBoundary: ErrorBoundaryTokens;
}

/* Unchanged from earlier releases so existing celebrations keep their look. */
const DEFAULT_CONFETTI_COLORS: readonly string[] = [
  '#FF6B6B',
  '#FECA57',
  '#4DA6FF',
  '#34D399',
  '#C084FC',
  '#FF9F43',
  '#F472B6',
  '#2DD4BF',
];

export function buildDisplayTokens({ spacing }: ComponentTokenContext): DisplayTokens {
  return {
    divider: {
      thickness: borderWidth.hairline,
    },
    sectionLabel: {
      paddingHorizontal: spacing.md,
      marginTop: spacing.lg,
      marginBottom: spacing.xs,
    },
    marqueeText: {
      speed: 30,
      pauseDurationMs: 2000,
      gap: spacing['2xl'],
      overflowTolerance: 2,
    },
    paginationDots: {
      dotWidth: 5,
      activeWidth: spacing.md,
      height: 5,
      gap: 6,
      durationMs: 220,
    },
    confetti: {
      colors: DEFAULT_CONFETTI_COLORS,
      particleCount: 40,
      durationMs: 3000,
      pieceMinSize: 6,
      pieceSizeRange: spacing.sm,
      rectHeightRatio: 1.5,
      rectRadius: 2,
      circleEvery: 3,
      spawnOffset: spacing.mdPlus,
      spawnSpread: 100,
      exitOffset: 50,
      driftRatio: 0.5,
      maxDelayMs: 600,
      fallDurationMs: 2200,
      fallDurationJitterMs: 1000,
      spinDurationMs: 2500,
      minSpinDeg: 360,
      spinJitterDeg: 720,
      fadeDelayMs: 1800,
      fadeDurationMs: 400,
      zIndex: 999,
    },
    errorBoundary: {
      iconSize: 48,
    },
  };
}
