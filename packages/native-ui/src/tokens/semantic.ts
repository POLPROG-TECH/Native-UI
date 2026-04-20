/**
 * Semantic tokens - intent-based aliases for primitive tokens.
 * Consumer apps override these for branding without touching primitives.
 */
import type { ColorScheme } from './colors';
import type { Spacing } from './spacing';
import type { TypographyVariant } from './typography';

// ─── Semantic Color Tokens ─────────────────────────────────────
export interface SemanticColorTokens {
  // Actions
  actionPrimary: keyof ColorScheme;
  actionSecondary: keyof ColorScheme;
  actionDanger: keyof ColorScheme;
  actionDisabled: keyof ColorScheme;

  // Feedback
  feedbackSuccess: keyof ColorScheme;
  feedbackWarning: keyof ColorScheme;
  feedbackError: keyof ColorScheme;
  feedbackInfo: keyof ColorScheme;

  // Surfaces
  surfaceApp: keyof ColorScheme;
  surfaceCard: keyof ColorScheme;
  surfaceModal: keyof ColorScheme;
  surfaceInput: keyof ColorScheme;

  // Text
  textHeading: keyof ColorScheme;
  textBody: keyof ColorScheme;
  textMuted: keyof ColorScheme;
  textInverse: keyof ColorScheme;
  textLink: keyof ColorScheme;

  // Borders
  borderDefault: keyof ColorScheme;
  borderFocused: keyof ColorScheme;
  borderError: keyof ColorScheme;
}

export const defaultSemanticColors: SemanticColorTokens = {
  actionPrimary: 'primary',
  actionSecondary: 'primaryLight',
  actionDanger: 'error',
  actionDisabled: 'textTertiary',

  feedbackSuccess: 'success',
  feedbackWarning: 'warning',
  feedbackError: 'error',
  feedbackInfo: 'info',

  surfaceApp: 'background',
  surfaceCard: 'surface',
  surfaceModal: 'surface',
  surfaceInput: 'surfaceSecondary',

  textHeading: 'textPrimary',
  textBody: 'textPrimary',
  textMuted: 'textSecondary',
  textInverse: 'textInverse',
  textLink: 'primary',

  borderDefault: 'border',
  borderFocused: 'primary',
  borderError: 'error',
};

// ─── Semantic Spacing Tokens ───────────────────────────────────
export interface SemanticSpacingTokens {
  pageHorizontal: Spacing;
  pageVertical: Spacing;
  sectionGap: Spacing;
  cardPadding: Spacing;
  inputPadding: Spacing;
  inlineGap: Spacing;
  stackGap: Spacing;
}

export const defaultSemanticSpacing: SemanticSpacingTokens = {
  pageHorizontal: 'lg',
  pageVertical: 'xl',
  sectionGap: '2xl',
  cardPadding: 'lg',
  inputPadding: 'md',
  inlineGap: 'sm',
  stackGap: 'md',
};

// ─── Semantic Typography Tokens ────────────────────────────────
export interface SemanticTypographyTokens {
  pageTitle: TypographyVariant;
  sectionTitle: TypographyVariant;
  cardTitle: TypographyVariant;
  bodyDefault: TypographyVariant;
  bodySecondary: TypographyVariant;
  labelDefault: TypographyVariant;
  captionDefault: TypographyVariant;
}

export const defaultSemanticTypography: SemanticTypographyTokens = {
  pageTitle: 'h1',
  sectionTitle: 'h2',
  cardTitle: 'h3',
  bodyDefault: 'body',
  bodySecondary: 'bodySmall',
  labelDefault: 'label',
  captionDefault: 'caption',
};

// ─── Combined ──────────────────────────────────────────────────
export interface SemanticTokens {
  colors: SemanticColorTokens;
  spacing: SemanticSpacingTokens;
  typography: SemanticTypographyTokens;
}

export const defaultSemanticTokens: SemanticTokens = {
  colors: defaultSemanticColors,
  spacing: defaultSemanticSpacing,
  typography: defaultSemanticTypography,
};
