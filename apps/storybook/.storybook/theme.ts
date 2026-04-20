import { create } from 'storybook/theming/create';

/**
 * Storybook *manager* chrome theme. These values style the sidebar,
 * toolbar and Docs iframe host - not the rendered stories themselves.
 * The manager bundle is compiled separately from the preview and cannot
 * import runtime tokens from the library, so hex values are duplicated
 * here intentionally and should be kept visually consistent with the
 * `default` preset in `packages/native-ui/src/tokens/colors.ts`.
 */
export const nativeTheme = create({
  base: 'light',

  // Brand
  brandTitle: 'native-ui',
  brandUrl: '/',
  brandTarget: '_self',
  brandImage: './brand/logo-full.svg',

  // Typography
  fontBase: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontCode: '"SF Mono", "Fira Code", "Fira Mono", monospace',

  // Colors
  colorPrimary: '#4F46E5',
  colorSecondary: '#4F46E5',

  // UI
  appBg: '#F9FAFB',
  appContentBg: '#FFFFFF',
  appPreviewBg: '#FFFFFF',
  appBorderColor: '#E5E7EB',
  appBorderRadius: 8,

  // Text
  textColor: '#111827',
  textInverseColor: '#FFFFFF',
  textMutedColor: '#6B7280',

  // Toolbar
  barTextColor: '#6B7280',
  barSelectedColor: '#4F46E5',
  barHoverColor: '#4F46E5',
  barBg: '#FFFFFF',

  // Form
  inputBg: '#FFFFFF',
  inputBorder: '#D1D5DB',
  inputTextColor: '#111827',
  inputBorderRadius: 6,

  // Booleans
  booleanBg: '#E5E7EB',
  booleanSelectedBg: '#4F46E5',

  // Button
  buttonBg: '#F3F4F6',
  buttonBorder: '#D1D5DB',
});
