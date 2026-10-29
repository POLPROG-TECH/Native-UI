import type { ReactNode } from 'react';
import type { Decorator } from '@storybook/react';
import type { Globals } from 'storybook/internal/types';
import { NativeUIProvider, useTheme, type NativeUIConfig } from '@polprog/native-ui';
import { LIBRARY_LOCALES } from '../globals/libraryLocales';
import { readGlobal } from '../globals/read';
import { RTL_LOCALES, StoryLocaleProvider } from '../storyI18n';
import { DeviceStage } from './device/DeviceStage';
import { SCHEME_ATTRIBUTE, schemeForMode } from '../schemeSync';

/** Breathing room around compact stories; full-bleed stories pass `canvasPadding: 0`. */
const DEFAULT_CANVAS_PADDING = 20;

/* 'system' is resolved by NativeUIProvider itself, which follows OS changes live. */
type CanvasMode = NonNullable<NativeUIConfig['colorMode']>;

/**
 * Paints the story surface with the live theme background, so dark mode and
 * preset switches never leave the canvas on a hardcoded hex. Typography is
 * left to NativeUIProvider so token changes propagate.
 */
function ThemeCanvas({
  children,
  label,
  padding = DEFAULT_CANVAS_PADDING,
}: {
  children: ReactNode;
  label?: string;
  padding?: number;
}) {
  const { colors } = useTheme();

  return (
    <div
      className="nui-theme-canvas"
      style={{ backgroundColor: colors.background, color: colors.textPrimary }}
    >
      {label ? (
        <div className="nui-theme-canvas-label" style={{ color: colors.textSecondary }}>
          {label}
        </div>
      ) : null}
      <div style={{ padding }}>{children}</div>
    </div>
  );
}

/** Provider config shared by every pane; only the colour mode differs between panes. */
function baseConfig(globals: Globals): Omit<NativeUIConfig, 'colorMode'> {
  const libraryLocale = LIBRARY_LOCALES[readGlobal(globals, 'locale')];

  return {
    locale: libraryLocale.bcp47,
    labels: libraryLocale.labels,
    theme: readGlobal(globals, 'variant'),
    preset: readGlobal(globals, 'preset'),
    fontSize: readGlobal(globals, 'fontSize'),
    highContrast: readGlobal(globals, 'highContrast') === 'on',
    reduceAnimations: readGlobal(globals, 'reduceMotion') === 'on',
  };
}

/** Colour modes to render: one pane, or light and dark next to each other. */
function canvasModes(globals: Globals): readonly CanvasMode[] {
  const mode = readGlobal(globals, 'theme');

  if (mode === 'side-by-side') {
    return ['light', 'dark'];
  }

  return [mode];
}

/*
 * In story view the iframe holds just this story, so <html> carries its
 * locale and scheme too: Modal, BottomSheet and Toast portal outside the
 * story root and would otherwise lose the direction, and docs-section CSS
 * (Search, Introduction cards) reads `data-nui-scheme`. Docs pages own
 * <html> themselves (see SchemeDocsContainer), so inline docs stories never
 * touch it. Side by side keeps the docs-wide scheme: there is no single one.
 */
function applyStoryDocument(globals: Globals, viewMode: string): void {
  if (typeof document === 'undefined' || viewMode !== 'story') {
    return;
  }

  const locale = readGlobal(globals, 'locale');
  const mode = readGlobal(globals, 'theme');

  document.documentElement.lang = locale;
  document.documentElement.dir = RTL_LOCALES.has(locale) ? 'rtl' : 'ltr';

  if (mode !== 'side-by-side') {
    document.documentElement.setAttribute(SCHEME_ATTRIBUTE, schemeForMode(mode));
  }
}

/**
 * Wraps every story in NativeUIProvider, the locale context (scoped to the
 * story with lang / dir attributes) and, in story view, an optional device frame.
 */
export const withNativeUI: Decorator = (Story, context) => {
  const { globals, parameters, viewMode } = context;
  const locale = readGlobal(globals, 'locale');
  const rtl = RTL_LOCALES.has(locale);
  const modes = canvasModes(globals);
  const padding =
    typeof parameters.canvasPadding === 'number' ? parameters.canvasPadding : undefined;
  const label = (mode: CanvasMode) => (modes.length > 1 ? mode : undefined);
  /* A device frame per inline docs story would bury the docs page; frames are for story view. */
  const device = viewMode === 'story' ? readGlobal(globals, 'device') : 'none';

  applyStoryDocument(globals, viewMode);

  return (
    <StoryLocaleProvider locale={locale}>
      <div className="nui-theme-panes" lang={locale} dir={rtl ? 'rtl' : 'ltr'}>
        {modes.map((mode) => (
          <NativeUIProvider key={mode} config={{ ...baseConfig(globals), colorMode: mode }}>
            <DeviceStage device={device}>
              <ThemeCanvas label={label(mode)} padding={padding}>
                <Story />
              </ThemeCanvas>
            </DeviceStage>
          </NativeUIProvider>
        ))}
      </div>
    </StoryLocaleProvider>
  );
};
