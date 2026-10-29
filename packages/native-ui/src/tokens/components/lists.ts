import type { ComponentTokenContext } from './merge';

/** List rows, headers and grouped sections. Aggregated by `layout.ts`. */

export interface ListItemTokens {
  /** Minimum row height (touch target). */
  minHeight: number;
  paddingVertical: number;
  paddingHorizontal: number;
  /** Vertical padding of rows inside a grouped `ListSection`, which supplies the card. */
  groupedPaddingVertical: number;
  /** Space between the icon, the labels and the trailing column. */
  gap: number;
  radius: number;
  /** Space below a standalone row; `omitSpacing` removes it. */
  marginBottom: number;
  /** Edge length of the box the leading icon is centred in. */
  iconBoxSize: number;
  /** Size handed to the leading `icon` (emoji font size or render-function `size`). */
  iconSize: number;
  /** Space between the value, the trailing element and the chevron. */
  trailingGap: number;
  subtitleMarginTop: number;
  /** Extra space between the value text and the chevron. */
  valueChevronGap: number;
  /** Size of the default disclosure chevron. */
  chevronSize: number;
  /** Extra vertical touch area of pressable rows. */
  pressHitSlop: number;
  titleMaxLines: number;
  subtitleMaxLines: number;
}

export interface ListHeaderSizeTokens {
  marginTop: number;
  marginBottom: number;
  /** Title letter spacing; `undefined` keeps the typography default. */
  letterSpacing: number | undefined;
}

export interface ListHeaderTokens {
  lg: ListHeaderSizeTokens;
  md: ListHeaderSizeTokens;
  sm: ListHeaderSizeTokens;
  xs: ListHeaderSizeTokens;
  subtitleMarginTop: number;
}

export interface ListSectionTokens {
  marginBottom: number;
  titleMarginTop: number;
  titleMarginBottom: number;
  footerMarginTop: number;
  /** Corner radius of the shared card in `grouped` mode. */
  groupedRadius: number;
  groupedPaddingVertical: number;
  groupedPaddingHorizontal: number;
  /** Space above and below the hairline between grouped rows. */
  dividerMarginVertical: number;
}

export interface SettingsRowTokens {
  /**
   * Emoji to opaque hex color used for the tinted icon square. Replace or
   * extend it app-wide via `components.settingsRow.iconColors`; the
   * per-instance `iconColorMap` prop is merged on top.
   */
  iconColors: Readonly<Record<string, string>>;
  /** Tint used for emojis missing from `iconColors`. */
  fallbackIconColor: string;
  /** Alpha (0-1) of the icon square tint. */
  iconTintAlpha: number;
  iconBoxSize: number;
  iconRadius: number;
  /** Font size of an emoji (string) `icon`. */
  emojiFontSize: number;
  /** Size handed to a render-function or node `icon` drawn in the square. */
  iconSize: number;
}

export interface ListTokens {
  listItem: ListItemTokens;
  listHeader: ListHeaderTokens;
  listSection: ListSectionTokens;
  settingsRow: SettingsRowTokens;
}

/* Unchanged from earlier releases so existing settings screens keep their look. */
const DEFAULT_SETTINGS_ICON_COLORS: Readonly<Record<string, string>> = {
  '📁': '#3B82F6',
  '💰': '#10B981',
  '🎨': '#8B5CF6',
  '🌙': '#6366F1',
  '☀️': '#F59E0B',
  '📱': '#64748B',
  '🌐': '#06B6D4',
  '💱': '#F59E0B',
  '📤': '#3B82F6',
  '📥': '#10B981',
  '📄': '#3B82F6',
  '📊': '#8B5CF6',
  ℹ️: '#64748B',
  '🔒': '#10B981',
  '⚠️': '#EF4444',
  '🗑️': '#EF4444',
  '❤️': '#EF4444',
  '📅': '#F59E0B',
};
const SETTINGS_FALLBACK_ICON_COLOR = '#64748B';
/* ~9% alpha: the historical `'18'` hex suffix (0x18 / 255). */
const SETTINGS_ICON_TINT_ALPHA = 0.094;

export function buildListTokens({ spacing, borderRadius }: ComponentTokenContext): ListTokens {
  return {
    listItem: {
      minHeight: 48,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      groupedPaddingVertical: spacing.sm,
      gap: spacing.md,
      radius: borderRadius.lg,
      marginBottom: spacing.sm,
      iconBoxSize: spacing.xl,
      iconSize: spacing.mdPlus,
      trailingGap: spacing.xs,
      subtitleMarginTop: spacing['2xs'],
      valueChevronGap: spacing.xs,
      chevronSize: spacing.smPlus,
      pressHitSlop: spacing['2xs'],
      titleMaxLines: 1,
      subtitleMaxLines: 2,
    },
    listHeader: {
      lg: { marginTop: 0, marginBottom: 28, letterSpacing: undefined },
      md: { marginTop: 0, marginBottom: spacing.mdPlus, letterSpacing: undefined },
      sm: { marginTop: 0, marginBottom: spacing.smPlus, letterSpacing: undefined },
      xs: { marginTop: spacing.lg, marginBottom: spacing.sm, letterSpacing: 0.8 },
      subtitleMarginTop: spacing['2xs'],
    },
    listSection: {
      marginBottom: spacing.lg,
      titleMarginTop: spacing.lg,
      titleMarginBottom: spacing.sm,
      footerMarginTop: spacing.sm,
      groupedRadius: borderRadius.lg,
      groupedPaddingVertical: spacing.xs,
      groupedPaddingHorizontal: spacing.md,
      dividerMarginVertical: spacing.xs,
    },
    settingsRow: {
      iconColors: DEFAULT_SETTINGS_ICON_COLORS,
      fallbackIconColor: SETTINGS_FALLBACK_ICON_COLOR,
      iconTintAlpha: SETTINGS_ICON_TINT_ALPHA,
      iconBoxSize: spacing.xl,
      iconRadius: borderRadius.sm,
      emojiFontSize: 17,
      iconSize: 18,
    },
  };
}
