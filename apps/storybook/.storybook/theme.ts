import { create } from 'storybook/theming/create';
import type { ThemeVars } from 'storybook/theming';
import { BRAND, BRAND_FONTS, type BrandPalette } from './brand';

type SchemeName = keyof typeof BRAND;

function themeFor(scheme: SchemeName): ThemeVars {
  const palette: BrandPalette = BRAND[scheme];

  return create({
    base: scheme,
    brandTitle: 'native-ui',
    brandUrl: '/',
    brandTarget: '_self',
    brandImage: scheme === 'dark' ? './brand/logo-full-dark.svg' : './brand/logo-full.svg',
    fontBase: BRAND_FONTS.base,
    fontCode: BRAND_FONTS.code,
    colorPrimary: palette.primary,
    colorSecondary: palette.primary,
    appBg: palette.appBg,
    appContentBg: palette.contentBg,
    appPreviewBg: palette.previewBg,
    appBorderColor: palette.border,
    appBorderRadius: 10,
    textColor: palette.text,
    textInverseColor: palette.textInverse,
    textMutedColor: palette.textMuted,
    barTextColor: palette.textMuted,
    barSelectedColor: palette.primary,
    barHoverColor: palette.primary,
    barBg: palette.barBg,
    inputBg: palette.inputBg,
    inputBorder: palette.inputBorder,
    inputTextColor: palette.text,
    inputBorderRadius: 8,
    booleanBg: palette.booleanBg,
    booleanSelectedBg: palette.primary,
    buttonBg: palette.buttonBg,
    buttonBorder: palette.inputBorder,
  });
}

/**
 * Storybook chrome themes (sidebar, toolbar, Docs host); they do not style
 * the stories, which follow the NativeUI theme globals.
 */
export const lightTheme = themeFor('light');
export const darkTheme = themeFor('dark');
