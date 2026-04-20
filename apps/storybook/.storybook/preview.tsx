import React from 'react';
import type { Decorator, Loader, Preview } from '@storybook/react';
import { NativeUIProvider, useTheme, type NativeUIConfig } from '@polprog/native-ui';
import { nativeTheme } from './theme';
import { fontsReady } from './fonts';

type ColorMode = NonNullable<NativeUIConfig['colorMode']>;
type Preset = NonNullable<NativeUIConfig['preset']>;
type ThemeGlobal = ColorMode | 'side-by-side';

/**
 * Storybook loader: runs *before* the story and its decorators render.
 * Awaiting `fontsReady` here blocks every mount - including every Canvas
 * inside <Stories /> on Docs pages - until all Space Grotesk weights
 * have actually loaded.
 *
 * Why a loader rather than a per-story <FontGate> or a top-level await
 * at module scope:
 *   - A per-story gate renders a placeholder div with near-zero height;
 *     @storybook/blocks' Canvas measures its child once at mount and
 *     locks its container to that height. When the gate flips, the
 *     real content overflows the cached height → the classic
 *     "rozjechane Stories" glitch that fixes itself on F5 (fonts
 *     cached → synchronous resolution → first measure correct).
 *   - A top-level `await` in preview.tsx breaks Storybook's Rollup
 *     build pipeline for the preview bundle.
 *   - A loader is officially supported, runs once per story render,
 *     and after the first story the promise is already resolved so the
 *     `await` is a single microtask - zero perceptible overhead.
 */
const awaitFonts: Loader = async () => {
  await fontsReady;
  return {};
};

/**
 * Keep our Docs-canvas overflow override the *last* stylesheet in <head>.
 *
 * @storybook/blocks injects Emotion rules (e.g. `overflow: auto` on the
 * Docs Canvas/Story containers) *after* our preview-head.html <style>
 * when Storybook does client-side navigation between Docs pages. At
 * equal specificity the later rule wins → stories render with an inner
 * scroll ("rozjechane") until a hard refresh pushes our rules back to
 * the end. A small, single MutationObserver re-appends the tag whenever
 * new stylesheets are inserted.
 */
const OVERRIDE_STYLE_ID = 'native-ui-docs-overflow-fix';
const OVERRIDE_CSS = `
  .sb-show-main .docs-story,
  .sb-show-main .docs-story > div,
  .sb-show-main .sbdocs-preview { overflow: visible !important; }
`;

if (typeof document !== 'undefined') {
  let overrideEl = document.getElementById(OVERRIDE_STYLE_ID) as HTMLStyleElement | null;
  if (!overrideEl) {
    overrideEl = document.createElement('style');
    overrideEl.id = OVERRIDE_STYLE_ID;
    overrideEl.textContent = OVERRIDE_CSS;
    document.head.appendChild(overrideEl);
  }

  let reAppending = false;
  const observer = new MutationObserver(() => {
    if (reAppending) return;
    if (document.head.lastElementChild !== overrideEl) {
      reAppending = true;
      document.head.appendChild(overrideEl!);
      reAppending = false;
    }
  });
  observer.observe(document.head, { childList: true });
}

/**
 * Container that reads the current theme and paints itself with the live
 * background colour, so dark mode and preset switches don't leave the canvas
 * stuck on a hardcoded hex. Typography/fontFamily is intentionally NOT set
 * here - it should inherit from NativeUIProvider so token changes propagate.
 */
const ThemeCanvas = ({ children, label }: { children: React.ReactNode; label?: string }) => {
  const theme = useTheme();
  return (
    <div
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.textPrimary,
        borderRadius: 8,
        width: '100%',
      }}
    >
      {label && (
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 1,
            color: theme.colors.textSecondary,
            padding: '12px 16px 0',
          }}
        >
          {label}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};

const ThemedStory = ({
  Story,
  colorMode,
  preset,
  label,
}: {
  Story: React.ComponentType;
  colorMode: ColorMode;
  preset: Preset;
  label?: string;
}) => (
  <NativeUIProvider config={{ colorMode, preset }}>
    <ThemeCanvas label={label}>
      <Story />
    </ThemeCanvas>
  </NativeUIProvider>
);

/** Decorator that wraps every story in NativeUIProvider. */
const withNativeUI: Decorator = (Story, context) => {
  const themeGlobal = (context.globals.theme ?? 'light') as ThemeGlobal;
  const preset = (context.globals.preset ?? 'default') as Preset;

  if (themeGlobal === 'side-by-side') {
    return (
      <div style={{ display: 'flex', gap: 16 }}>
        <ThemedStory Story={Story} colorMode="light" preset={preset} label="Light" />
        <ThemedStory Story={Story} colorMode="dark" preset={preset} label="Dark" />
      </div>
    );
  }

  return (
    <NativeUIProvider config={{ colorMode: themeGlobal, preset }}>
      <ThemeCanvas>
        <Story />
      </ThemeCanvas>
    </NativeUIProvider>
  );
};

const preview: Preview = {
  loaders: [awaitFonts],
  decorators: [withNativeUI],

  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /date$/i,
      },
      sort: 'requiredFirst',
    },
    docs: {
      theme: nativeTheme,
      // Render every story inline in Docs (no fixed-height iframe wrapper
      // that caused "collapsed with inner scroll" on tall stories).
      story: { inline: true },
      // Source snippet collapsed by default; users expand it on demand.
      source: { state: 'closed', type: 'dynamic', excludeDecorators: true },
      canvas: { sourceState: 'hidden' },
    },
    // `padded` keeps Storybook's outer padding (~1rem). The inner ThemeCanvas
    // no longer adds extra padding of its own, so you get a single consistent
    // breathing room rather than the old stacked `padding: 24` + `padding: 16`.
    layout: 'padded',
    backgrounds: {
      disable: true,
    },
    a11y: {
      // `violation` fails the test run on actual a11y breakage; 'todo' keeps
      // the report visible in the panel without blocking CI.
      config: {
        rules: [
          // react-native-web renders some absolute-positioned overlays
          // outside the story root; this rule generates noisy false positives
          // for those portals.
          { id: 'region', enabled: false },
        ],
      },
      options: {},
    },
    viewport: {
      viewports: {
        iphoneSE: { name: 'iPhone SE', styles: { width: '375px', height: '667px' } },
        iphone13: { name: 'iPhone 13', styles: { width: '390px', height: '844px' } },
        pixel6: { name: 'Pixel 6', styles: { width: '412px', height: '915px' } },
        ipadMini: { name: 'iPad mini', styles: { width: '768px', height: '1024px' } },
      },
    },
    options: {
      storySort: {
        order: [
          'Introduction',
          'Getting Started',
          'Theming',
          'Tokens',
          ['Colors', 'Typography', 'Spacing', 'Radius & Elevation', 'SemanticTokens'],
          'Brand',
          'Primitives',
          [
            'Box',
            'Stack',
            'Text',
            'Heading',
            'SectionLabel',
            'Divider',
            'PressableScale',
            'MarqueeText',
            'PaginationDots',
          ],
          'Components',
          [
            // Inputs & controls
            'Button',
            'IconButton',
            'Input',
            'TextArea',
            'Select',
            'Checkbox',
            'Switch',
            'Radio',
            'SearchBar',
            // Data display
            'Card',
            'Chip',
            'Badge',
            'Avatar',
            'ProgressBar',
            'Skeleton',
            'EmptyState',
            'Spinner',
            // Lists
            'ListItem',
            'ListSection',
            'ListSwitchItem',
            'ListHeader',
            'Section',
            'SettingsRow',
            // Layout / chrome
            'HeaderBar',
            'ScreenContainer',
            // Overlays
            'Modal',
            'BottomSheet',
            'Toast',
            'InputPrompt',
            'ConfettiOverlay',
            // Utility
            'ErrorBoundary',
          ],
          'Patterns',
          [
            'Forms',
            'Lists & Data',
            'Settings',
            'Dialogs & Sheets',
            'Loading States',
            'Web Compatibility',
            'Platform Aware',
          ],
          'Migration',
          'Accessibility',
        ],
      },
    },
  },

  globalTypes: {
    theme: {
      description: 'Theme mode',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
          { value: 'side-by-side', title: 'Side by Side', icon: 'sidebar' },
        ],
        dynamicTitle: true,
      },
    },
    preset: {
      name: 'Theme Preset',
      description: 'Select color preset',
      defaultValue: 'default',
      toolbar: {
        title: 'Preset',
        icon: 'paintbrush',
        items: [
          { value: 'default', title: 'Default (Indigo)' },
          { value: 'midnight', title: 'Midnight' },
          { value: 'ocean', title: 'Ocean' },
          { value: 'forest', title: 'Forest' },
          { value: 'sunset', title: 'Sunset' },
          { value: 'rose', title: 'Rose' },
          { value: 'amoled', title: 'AMOLED' },
        ],
        dynamicTitle: true,
      },
    },
  },

  // Autodocs stays on globally. Imperative overlay demos (Toast, Modal,
  // BottomSheet, InputPrompt, Dialog patterns) opt out via `tags: ['!autodocs']`
  // on their meta so the Docs page doesn't mount several overlay roots on the
  // same page.
  tags: ['autodocs'],
};

export default preview;
