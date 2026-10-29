import addonLinks from '@storybook/addon-links';
import addonDocs from '@storybook/addon-docs';
import addonA11y from '@storybook/addon-a11y';
import { definePreview } from '@storybook/react-vite';
import { ComponentDocsPage } from './docs/ComponentDocsPage';
import { previewGlobalTypes, previewInitialGlobals } from './globals/read';
import { THEME_MATRIX } from './globals/themeMatrix';
import { A11Y_PARAMETERS } from './preview/a11y';
import { keepOverrideStyleLast } from './preview/docsOverflowFix';
import { SchemeDocsContainer, startDocsGlobalsSync } from './preview/docsScheme';
import { previewLoaders } from './preview/loaders';
import { VIEWPORTS } from './preview/viewports';
import { withNativeUI } from './preview/withNativeUI';
import './preview/preview.css';

keepOverrideStyleLast();
const stopDocsGlobalsSync = startDocsGlobalsSync();

/* Without this, every hot reload of the preview would add another set of listeners. */
import.meta.hot?.dispose(stopDocsGlobalsSync);

export default definePreview({
  loaders: previewLoaders,
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
      /* Light or dark docs chrome from the Mode global (Appearance menu), live. */
      container: SchemeDocsContainer,
      /* One layout for every autodocs page: header, primary story, props, guidelines, stories. */
      page: ComponentDocsPage,
      /**
       * Render every story inline in Docs (no fixed-height iframe wrapper
       * that caused "collapsed with inner scroll" on tall stories).
       */
      story: { inline: true },
      /** Source snippet hidden by default (canvas.sourceState); users expand it on demand. */
      source: { type: 'dynamic', excludeDecorators: true },
      canvas: { sourceState: 'hidden' },
    },
    /**
     * `padded` keeps Storybook's outer padding; ThemeCanvas adds its own
     * breathing room, and full-bleed stories opt out with `canvasPadding: 0`.
     */
    layout: 'padded',
    backgrounds: { disable: true },
    a11y: A11Y_PARAMETERS,
    /*
     * Chromatic snapshots every story once per theme run (light, dark, RTL,
     * large text + high contrast), the same matrix Vitest runs. Each mode is a
     * paid snapshot, so a story can narrow it with its own `chromatic.modes`.
     */
    chromatic: {
      modes: Object.fromEntries(THEME_MATRIX.map((run) => [run.mode, run.globals])),
    },
    /* Storybook 10 reads `options`; the old `viewports` key was silently ignored. */
    viewport: { options: VIEWPORTS },
    options: {
      /* Must stay inline: Storybook reads storySort statically from this file. */
      storySort: {
        order: [
          'Introduction',
          'Getting Started',
          'Search',
          'Changelog',
          'Theming',
          'Tokens',
          [
            'Colors',
            'Typography',
            'Spacing & Radii',
            'Spacing',
            'Radius & Elevation',
            'SemanticTokens',
          ],
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
            /* Inputs & controls */
            'Button',
            'IconButton',
            'Input',
            'TextArea',
            'Select',
            'Checkbox',
            'Switch',
            'Radio',
            'SearchBar',
            /* Data display */
            'Card',
            'Chip',
            'Badge',
            'Avatar',
            'ProgressBar',
            'Skeleton',
            'EmptyState',
            'Spinner',
            /* Lists */
            'ListItem',
            'ListSection',
            'ListSwitchItem',
            'ListHeader',
            'Section',
            'SettingsRow',
            /* Layout / chrome */
            'HeaderBar',
            'ScreenContainer',
            /* Overlays */
            'Modal',
            'BottomSheet',
            'Toast',
            'InputPrompt',
            'ConfettiOverlay',
            /* Utility */
            'ErrorBoundary',
          ],
          'Patterns',
          [
            'AppShell',
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

  globalTypes: previewGlobalTypes(),
  initialGlobals: previewInitialGlobals(),

  /**
   * Autodocs stays on globally. Imperative overlay demos (Toast, Modal,
   * BottomSheet, InputPrompt, Dialog patterns) opt out via `tags: ['!autodocs']`
   * on their meta so the Docs page doesn't mount several overlay roots on the
   * same page.
   */
  tags: ['autodocs'],

  addons: [
    addonA11y(),
    addonDocs(),
    addonLinks(),
    /* storybook-addon-tag-badges is manager-only: its preview annotations are empty. */
  ],
});
