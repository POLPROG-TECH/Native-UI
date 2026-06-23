// ─── Color Scheme Interface ────────────────────────────────────
export interface ColorScheme {
  background: string;
  surface: string;
  surfaceElevated: string;
  surfaceSecondary: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  error: string;
  errorLight: string;
  info: string;
  border: string;
  borderLight: string;
  divider: string;
  shadow: string;
  overlay: string;
  chart: readonly string[];
}

export type SemanticColor = 'primary' | 'success' | 'warning' | 'error' | 'info';

/** Union of all ColorScheme keys - useful for type-safe color lookups */
export type ThemeColors = keyof ColorScheme;

// ─── Theme Presets ─────────────────────────────────────────────
export type ThemePreset =
  | 'default'
  | 'midnight'
  | 'ocean'
  | 'forest'
  | 'sunset'
  | 'rose'
  | 'amoled';

/** Accent presets shipped with the Bloom theme variant. */
export type BloomPreset = 'violet' | 'grape' | 'coral' | 'ocean';

export interface ThemePresetConfig {
  id: string;
  accent: string;
  dark: {
    bg: string;
    secondary: string;
    tertiary: string;
    elevated: string;
    accent: string;
    accentLight: string;
    accentDark: string;
  };
  light: {
    bg: string;
    secondary: string;
    tertiary: string;
    accent: string;
    accentLight: string;
    accentDark: string;
  };
}

export const THEME_PRESETS: readonly ThemePresetConfig[] = [
  {
    id: 'default',
    accent: '#00E67A',
    dark: {
      bg: '#0C0C0F',
      secondary: '#161619',
      tertiary: '#1E1E23',
      elevated: '#1C1C21',
      accent: '#00E67A',
      accentLight: '#052E1A',
      accentDark: '#4ADE80',
    },
    light: {
      bg: '#FAFAFA',
      secondary: '#F2F2F7',
      tertiary: '#E5E5EA',
      accent: '#00E67A',
      accentLight: '#CFF7E0',
      accentDark: '#00B85F',
    },
  },
  {
    id: 'midnight',
    accent: '#818CF8',
    dark: {
      bg: '#0B0B1A',
      secondary: '#131328',
      tertiary: '#1C1C38',
      elevated: '#24243F',
      accent: '#A5B4FC',
      accentLight: '#312E81',
      accentDark: '#C7D2FE',
    },
    light: {
      bg: '#F8F8FF',
      secondary: '#EEEEF8',
      tertiary: '#DEDEED',
      accent: '#818CF8',
      accentLight: '#E0E7FF',
      accentDark: '#4F46E5',
    },
  },
  {
    id: 'ocean',
    accent: '#38BDF8',
    dark: {
      bg: '#0A1019',
      secondary: '#111B2A',
      tertiary: '#1A2638',
      elevated: '#223348',
      accent: '#7DD3FC',
      accentLight: '#075985',
      accentDark: '#BAE6FD',
    },
    light: {
      bg: '#F0F9FF',
      secondary: '#E0F2FE',
      tertiary: '#BAE6FD',
      accent: '#38BDF8',
      accentLight: '#E0F2FE',
      accentDark: '#0284C7',
    },
  },
  {
    id: 'forest',
    accent: '#34D399',
    dark: {
      bg: '#0A110D',
      secondary: '#111C15',
      tertiary: '#1A2A1F',
      elevated: '#223B2E',
      accent: '#34D399',
      accentLight: '#064E3B',
      accentDark: '#6EE7B7',
    },
    light: {
      bg: '#F0FDF4',
      secondary: '#DCFCE7',
      tertiary: '#BBF7D0',
      accent: '#34D399',
      accentLight: '#D1FAE5',
      accentDark: '#059669',
    },
  },
  {
    id: 'sunset',
    accent: '#FB923C',
    dark: {
      bg: '#120C08',
      secondary: '#1C1410',
      tertiary: '#2A1E16',
      elevated: '#382B21',
      accent: '#FB923C',
      accentLight: '#7C2D12',
      accentDark: '#FDBA74',
    },
    light: {
      bg: '#FFFBF5',
      secondary: '#FFF3E0',
      tertiary: '#FFE0B2',
      accent: '#FB923C',
      accentLight: '#FFEDD5',
      accentDark: '#C2410C',
    },
  },
  {
    id: 'rose',
    accent: '#EC4899',
    dark: {
      bg: '#110A0F',
      secondary: '#1C1118',
      tertiary: '#2A1A24',
      elevated: '#38232F',
      accent: '#F472B6',
      accentLight: '#831843',
      accentDark: '#FBCFE8',
    },
    light: {
      bg: '#FFF1F5',
      secondary: '#FCE7F3',
      tertiary: '#FBCFE8',
      accent: '#EC4899',
      accentLight: '#FCE7F3',
      accentDark: '#BE185D',
    },
  },
  {
    id: 'amoled',
    accent: '#94A3B8',
    dark: {
      bg: '#000000',
      secondary: '#0A0A0A',
      tertiary: '#141414',
      elevated: '#1E1E1E',
      accent: '#CBD5E1',
      accentLight: '#1E293B',
      accentDark: '#E2E8F0',
    },
    light: {
      bg: '#FAFAFA',
      secondary: '#F2F2F7',
      tertiary: '#E5E5EA',
      accent: '#94A3B8',
      accentLight: '#F1F5F9',
      accentDark: '#475569',
    },
  },
];

// ─── Font Color Variants ───────────────────────────────────────
export type FontColor = 'default' | 'warm' | 'cool';

const FONT_COLORS: Record<
  FontColor,
  {
    dark: { textPrimary: string; textSecondary: string; textTertiary: string };
    light: { textPrimary: string; textSecondary: string; textTertiary: string };
  }
> = {
  default: {
    dark: {
      textPrimary: '#F5F5F7',
      textSecondary: '#8E8E93',
      textTertiary: '#636366',
    },
    light: {
      textPrimary: '#1C1C1E',
      textSecondary: '#636366',
      textTertiary: '#AEAEB2',
    },
  },
  warm: {
    dark: {
      textPrimary: '#FFF8F0',
      textSecondary: '#B0956E',
      textTertiary: '#8A7055',
    },
    light: {
      textPrimary: '#3D2E1C',
      textSecondary: '#7A6548',
      textTertiary: '#B8A88E',
    },
  },
  cool: {
    dark: {
      textPrimary: '#F0F4FF',
      textSecondary: '#7E99B8',
      textTertiary: '#5A7694',
    },
    light: {
      textPrimary: '#1A2A3D',
      textSecondary: '#4A6580',
      textTertiary: '#8EA8BF',
    },
  },
};

const HIGH_CONTRAST_COLORS = {
  dark: {
    textPrimary: '#FFFFFF',
    textSecondary: '#C7C7CC',
    textTertiary: '#A1A1A6',
  },
  light: {
    textPrimary: '#000000',
    textSecondary: '#3A3A3C',
    textTertiary: '#636366',
  },
};

const HIGH_CONTRAST_SEMANTIC = {
  dark: {
    success: '#4ADE80',
    successLight: '#052E16',
    warning: '#FDE047',
    warningLight: '#713F12',
    error: '#FCA5A5',
    errorLight: '#450A0A',
  },
  light: {
    success: '#059669',
    successLight: '#D1FAE5',
    warning: '#D97706',
    warningLight: '#FEF3C7',
    error: '#DC2626',
    errorLight: '#FEE2E2',
  },
};

// ─── Color Palette (token foundation per theme variant) ────────
/** Text colour ramp (primary/secondary/tertiary) for one mode. */
export interface TextRamp {
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
}

/** Feedback colours, each with a tinted `*Light` background, for one mode. */
export interface SemanticRamp {
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  error: string;
  errorLight: string;
}

/** Chrome colours that are neither accent, text, nor a surface tier. */
export interface NeutralRamp {
  border: string;
  borderLight: string;
  divider: string;
  shadow: string;
  overlay: string;
  info: string;
}

/**
 * The colour foundation a theme variant resolves against. Bundles the accent
 * presets with the neutral, text, and feedback ramps that `resolveColorScheme`
 * maps into a `ColorScheme`. `defaultColorPalette` reproduces the library's
 * original values; a different palette (e.g. `bloomColorPalette`) swaps the
 * whole set without touching the resolver or any component.
 */
export interface ColorPalette {
  id: string;
  /** Accent presets selectable via `preset`. */
  presets: readonly ThemePresetConfig[];
  /** Preset applied when the consumer doesn't pass one. */
  defaultPreset: string;
  /** Text ramps per `fontColor` variant. */
  fontColors: Record<FontColor, { dark: TextRamp; light: TextRamp }>;
  /** Text ramps used when `highContrast` is enabled. */
  highContrastText: { dark: TextRamp; light: TextRamp };
  /** Feedback ramps in normal contrast. */
  semantic: { dark: SemanticRamp; light: SemanticRamp };
  /** Feedback ramps when `highContrast` is enabled. */
  highContrastSemantic: { dark: SemanticRamp; light: SemanticRamp };
  /** Border / divider / shadow / overlay / info chrome per mode. */
  neutrals: { dark: NeutralRamp; light: NeutralRamp };
  /** Flat light-mode card surfaces (dark surfaces come from the preset tiers). */
  lightSurface: string;
  lightSurfaceElevated: string;
  /** Text colour drawn on accent fills in light mode. */
  lightTextInverse: string;
  /** Chart series palette per mode. */
  chart: { dark: readonly string[]; light: readonly string[] };
  /**
   * Optional override for the on-accent text colour. When omitted the resolver
   * keeps the original behaviour: dark mode uses the preset background, light
   * mode uses `lightTextInverse`. Bloom sets a light value so text stays
   * legible on its violet accent in dark mode.
   */
  textInverse?: { dark?: string; light?: string };
}

/** Palette reproducing the library's original (Aurora) colour values. */
export const defaultColorPalette: ColorPalette = {
  id: 'default',
  presets: THEME_PRESETS,
  defaultPreset: 'default',
  fontColors: FONT_COLORS,
  highContrastText: HIGH_CONTRAST_COLORS,
  highContrastSemantic: HIGH_CONTRAST_SEMANTIC,
  semantic: {
    dark: {
      success: '#34D399',
      successLight: '#064E3B',
      warning: '#FBBF24',
      warningLight: '#78350F',
      error: '#EF4444',
      errorLight: '#7F1D1D',
    },
    light: {
      success: '#34D399',
      successLight: '#D1FAE5',
      warning: '#FBBF24',
      warningLight: '#FEF3C7',
      error: '#EF4444',
      errorLight: '#FEE2E2',
    },
  },
  neutrals: {
    dark: {
      border: '#2C2C2E',
      borderLight: '#1E1E23',
      divider: '#1E1E23',
      shadow: 'rgba(0, 0, 0, 0.3)',
      overlay: 'rgba(0, 0, 0, 0.7)',
      info: '#60A5FA',
    },
    light: {
      border: '#D1D1D6',
      borderLight: '#E5E5EA',
      divider: '#E5E5EA',
      shadow: 'rgba(0, 0, 0, 0.04)',
      overlay: 'rgba(0, 0, 0, 0.5)',
      info: '#60A5FA',
    },
  },
  lightSurface: '#FFFFFF',
  lightSurfaceElevated: '#FFFFFF',
  lightTextInverse: '#FFFFFF',
  chart: {
    dark: [
      '#60A5FA',
      '#34D399',
      '#FBBF24',
      '#F87171',
      '#A78BFA',
      '#F472B6',
      '#22D3EE',
      '#A3E635',
      '#FB923C',
      '#818CF8',
    ],
    light: [
      '#3B82F6',
      '#10B981',
      '#F59E0B',
      '#EF4444',
      '#8B5CF6',
      '#EC4899',
      '#06B6D4',
      '#84CC16',
      '#F97316',
      '#6366F1',
    ],
  },
};

// ─── Color Resolver ────────────────────────────────────────────
export interface ResolveColorOptions {
  isDark: boolean;
  preset: string;
  fontColor: FontColor;
  highContrast: boolean;
  customAccent: string | null;
}

export function resolveColorScheme(
  options: ResolveColorOptions,
  palette: ColorPalette = defaultColorPalette,
): ColorScheme {
  const { isDark, preset, fontColor, highContrast, customAccent } = options;
  const found = palette.presets.find((p) => p.id === preset);

  if (!found && __DEV__) {
    // eslint-disable-next-line no-console
    console.warn(
      `[native-ui] Unknown preset "${preset}" for palette "${palette.id}" - falling back to "${palette.defaultPreset}".`,
    );
  }
  const presetConfig = (found ??
    palette.presets.find((p) => p.id === palette.defaultPreset) ??
    palette.presets[0]) as ThemePresetConfig;

  const fc = palette.fontColors[fontColor] ?? palette.fontColors.default;
  const textBase = isDark ? fc.dark : fc.light;
  const hc = highContrast
    ? isDark
      ? palette.highContrastText.dark
      : palette.highContrastText.light
    : null;
  const text = hc ?? textBase;
  const semanticBase = isDark ? palette.semantic.dark : palette.semantic.light;
  const semantic = highContrast
    ? isDark
      ? palette.highContrastSemantic.dark
      : palette.highContrastSemantic.light
    : semanticBase;
  const neutrals = isDark ? palette.neutrals.dark : palette.neutrals.light;

  if (isDark) {
    const p = presetConfig.dark;
    const accentColor = resolveCustomAccent(customAccent, p.accent);
    const hasCustom = customAccent != null && normaliseHex(customAccent) != null;
    const accentLight = hasCustom ? darkenHex(accentColor, 0.7) : p.accentLight;
    const accentDark = hasCustom ? lightenHex(accentColor, 0.3) : p.accentDark;

    return {
      background: p.bg,
      surface: p.secondary,
      surfaceElevated: p.elevated,
      surfaceSecondary: p.tertiary,
      textPrimary: text.textPrimary,
      textSecondary: text.textSecondary,
      textTertiary: text.textTertiary,
      textInverse: hasCustom ? getContrastText(accentColor) : (palette.textInverse?.dark ?? p.bg),
      primary: accentColor,
      primaryLight: accentLight,
      primaryDark: accentDark,
      success: semantic.success,
      successLight: semantic.successLight,
      warning: semantic.warning,
      warningLight: semantic.warningLight,
      error: semantic.error,
      errorLight: semantic.errorLight,
      info: neutrals.info,
      border: neutrals.border,
      borderLight: neutrals.borderLight,
      divider: neutrals.divider,
      shadow: neutrals.shadow,
      overlay: neutrals.overlay,
      chart: palette.chart.dark,
    };
  }

  const p = presetConfig.light;
  const accentColor = resolveCustomAccent(customAccent, p.accent);
  const hasCustom = customAccent != null && normaliseHex(customAccent) != null;
  const accentLight = hasCustom ? lightenHex(accentColor, 0.85) : p.accentLight;
  const accentDark = hasCustom ? darkenHex(accentColor, 0.3) : p.accentDark;

  return {
    background: p.bg,
    surface: palette.lightSurface,
    surfaceElevated: palette.lightSurfaceElevated,
    surfaceSecondary: p.secondary,
    textPrimary: text.textPrimary,
    textSecondary: text.textSecondary,
    textTertiary: text.textTertiary,
    textInverse: hasCustom
      ? getContrastText(accentColor)
      : (palette.textInverse?.light ?? palette.lightTextInverse),
    primary: accentColor,
    primaryLight: accentLight,
    primaryDark: accentDark,
    success: semantic.success,
    successLight: semantic.successLight,
    warning: semantic.warning,
    warningLight: semantic.warningLight,
    error: semantic.error,
    errorLight: semantic.errorLight,
    info: neutrals.info,
    border: neutrals.border,
    borderLight: neutrals.borderLight,
    divider: neutrals.divider,
    shadow: neutrals.shadow,
    overlay: neutrals.overlay,
    chart: palette.chart.light,
  };
}

// ─── Hex Color Utilities ───────────────────────────────────────

const HEX_RE = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

/** Returns true for `#RGB` or `#RRGGBB` strings only. */
export function isValidHex(value: string): boolean {
  return HEX_RE.test(value);
}

/** Normalises `#RGB` to `#RRGGBB`, preserving the original case. Returns null on invalid input. */
export function normaliseHex(value: string): string | null {
  if (!HEX_RE.test(value)) return null;

  if (value.length === 4) {
    const r = value[1];
    const g = value[2];
    const b = value[3];

    return `#${r}${r}${g}${g}${b}${b}`;
  }

  return value;
}

function hexToRgb(hex: string): [number, number, number] {
  const n = normaliseHex(hex);
  if (!n) return [0, 0, 0];

  const h = n.slice(1);

  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((v) =>
        Math.round(Math.min(255, Math.max(0, v)))
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')
  );
}

function lightenHex(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);

  return rgbToHex(r + (255 - r) * amount, g + (255 - g) * amount, b + (255 - b) * amount);
}

function darkenHex(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);

  return rgbToHex(r * (1 - amount), g * (1 - amount), b * (1 - amount));
}

function resolveCustomAccent(value: string | null | undefined, fallback: string): string {
  if (value == null) return fallback;

  const n = normaliseHex(value);
  if (n) return n;

  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.warn(
      `[native-ui] Invalid customAccent "${value}" - expected #RGB or #RRGGBB. Falling back to preset accent.`,
    );
  }

  return fallback;
}

/** Returns contrasting text color (light or dark) for any background */
export function getContrastText(hex: string): string {
  if (!HEX_RE.test(hex)) return '#F5F5F7';

  const [r, g, b] = hexToRgb(hex);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? '#0C0C0F' : '#F5F5F7';
}

// ─── Static Fallback Colors ───────────────────────────────────
/** Pre-resolved default colors for use outside ThemeProvider (e.g. ErrorBoundary) */
export const colors = {
  light: resolveColorScheme({
    isDark: false,
    preset: 'default',
    fontColor: 'default',
    highContrast: false,
    customAccent: null,
  }),
  dark: resolveColorScheme({
    isDark: true,
    preset: 'default',
    fontColor: 'default',
    highContrast: false,
    customAccent: null,
  }),
};
