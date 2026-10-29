import { ensureReadable, lightenHex } from './colorUtils';

/** WCAG 1.4.11: minimum contrast of UI component boundaries and states. */
export const NON_TEXT_CONTRAST = 3;

/** How far the dark-mode selected fill is lifted above its track. */
const SELECTED_LIFT_DARK = 0.12;

export interface ControlColorInputs {
  isDark: boolean;
  border: string;
  accent: string;
  background: string;
  surface: string;
  surfaceElevated: string;
  surfaceSecondary: string;
  /** Primary text of the opposite mode, used as the inverse surface / ink. */
  lightModeText: string;
  darkModeText: string;
  lightModeSurface: string;
}

export interface ControlColors {
  controlTrack: string;
  controlThumb: string;
  controlBorder: string;
  surfaceSelected: string;
  inverseSurface: string;
  onInverseSurface: string;
  inversePrimaryText: string;
}

/**
 * Colors for interactive chrome. Tracks and field borders start from the
 * palette border and are shaded only until they reach 3:1 on the surfaces
 * they sit on. The selected fill is a white card in light mode (iOS style)
 * and a lifted gray in dark mode, where a darker "elevated" tone would vanish
 * into the track. The inverse surface flips tone for high-emphasis toasts.
 */
export function resolveControlColors(input: ControlColorInputs): ControlColors {
  const surfaces = [input.background, input.surface, input.surfaceElevated];
  const inverseSurface = input.isDark ? input.lightModeSurface : input.lightModeText;
  const inverseInk = input.isDark ? input.lightModeText : input.darkModeText;

  return {
    controlTrack: ensureReadable(input.border, surfaces, NON_TEXT_CONTRAST),
    controlThumb: input.isDark ? input.darkModeText : input.surfaceElevated,
    controlBorder: ensureReadable(
      input.border,
      [...surfaces, input.surfaceSecondary],
      NON_TEXT_CONTRAST,
    ),
    surfaceSelected: input.isDark
      ? lightenHex(input.surfaceSecondary, SELECTED_LIFT_DARK)
      : input.surfaceElevated,
    inverseSurface,
    onInverseSurface: ensureReadable(inverseInk, [inverseSurface]),
    inversePrimaryText: ensureReadable(input.accent, [inverseSurface]),
  };
}
