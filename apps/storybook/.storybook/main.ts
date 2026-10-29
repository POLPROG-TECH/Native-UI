import { defineMain } from '@storybook/react-vite/node';
import { mergeConfig } from 'vite';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import remarkGfm from 'remark-gfm';
import { tokenRefsPlugin } from './tokenRefsPlugin';

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Root of the @polprog/native-ui package, resolved from this config file.
 */
const libraryRoot = path.resolve(dirname, '../../../packages/native-ui');
const nodeModulesSegment = `${path.sep}node_modules${path.sep}`;

export default defineMain({
  stories: [
    /* ── Documentation pages (owned by the docs host) ── */
    '../docs/**/*.mdx',

    /* ── Storybook-host stories (MSW-backed patterns, integration demos) ── */
    '../stories/**/*.stories.@(ts|tsx)',

    /* ── Stories (owned by the library, close to source) ── */
    /*
     * Relative to this folder, not absolute: @storybook/addon-vitest joins
     * story globs onto the config dir, which breaks absolute paths.
     */
    '../../../packages/native-ui/stories/**/*.@(stories.tsx|mdx)',
  ],

  addons: [
    '@storybook/addon-a11y',
    {
      name: '@storybook/addon-docs',
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
    '@storybook/addon-links',
    /* Runs every story as a browser test (render, play, axe) via Vitest. */
    '@storybook/addon-vitest',
    /* Chromatic visual tests from the Storybook UI. */
    '@chromatic-com/storybook',
    /*
     * MCP server at /mcp so AI agents can read component docs, preview stories
     * and run story tests. All three toolsets are listed so one can be switched
     * off here; a client can also narrow them per request with the
     * `X-MCP-Toolsets` header.
     */
    {
      name: '@storybook/addon-mcp',
      options: {
        toolsets: { dev: true, docs: true, test: true },
      },
    },
    /* Sidebar / toolbar badges for tags such as `new` or `native-only`. */
    'storybook-addon-tag-badges',
  ],

  features: {
    /*
     * Component and docs manifests (/manifests/components.json, docs.json)
     * back the MCP docs toolset and `npx storybook tools docs ...`. addon-mcp
     * turns this on by itself; it is set here so the dependency is explicit.
     */
    componentsManifest: true,
    /*
     * Experimental: props are extracted on the server by React Component Meta
     * (TypeScript language service) and shared by MCP, Docs and Controls.
     * While it is on, `typescript.reactDocgen*` below is not used, and the dev
     * server answers 404 for /manifests/*.json (agents read the manifest
     * through MCP, or from a static build). Set it to false to go back to
     * react-docgen-typescript.
     */
    experimentalDocgenServer: true,
    /*
     * This is a published library's docs, not a starter project: the
     * onboarding checklist in the sidebar and menu would only add noise.
     */
    sidebarOnboardingChecklist: false,
    menuOnboardingChecklist: false,
  },

  /* The bottom-left "What's new" toast is noise for people reading the library docs. */
  core: {
    disableWhatsNewNotifications: true,
  },

  staticDirs: [{ from: '../../../docs/assets', to: '/brand' }],

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  /**
   * Autodocs is enabled in preview.tsx via `tags: ['autodocs']`.
   * The legacy `docs.autodocs` field was removed in Storybook 10.
   */

  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      shouldExtractValuesFromUnion: true,
      shouldRemoveUndefinedFromOptional: true,
      propFilter: (prop) => {
        if (!prop.parent) {
          return true;
        }

        const fileName = prop.parent.fileName;

        /*
         * Path-separator-safe check (works on POSIX and Windows):
         * include props only if declared inside our workspace OR inside
         * an @polprog package; exclude everything else coming from node_modules.
         */
        if (!fileName.includes(nodeModulesSegment) && !fileName.includes('/node_modules/')) {
          return true;
        }

        return /[\\/]node_modules[\\/]@polprog[\\/]/.test(fileName);
      },
    },
  },

  async viteFinal(config) {
    return mergeConfig(config, {
      /* Token usage for the Search page, precomputed from the library sources. */
      plugins: [tokenRefsPlugin(libraryRoot)],
      resolve: {
        alias: {
          /* ── React Native → Web ── */
          'react-native': 'react-native-web',

          /* ── Native module mocks ── */
          'react-native-reanimated': path.resolve(dirname, 'mocks/react-native-reanimated.ts'),
          'react-native-safe-area-context': path.resolve(
            dirname,
            'mocks/react-native-safe-area-context.tsx',
          ),

          /* ── Library source alias (so stories' relative imports resolve) ── */
          '@polprog/native-ui': `${libraryRoot}/src`,
        },
        /*
         * Dedupe single-instance packages across the monorepo to avoid
         * "Invalid hook call" / duplicate React-context bugs when multiple
         * node_modules trees hoist their own copies.
         */
        dedupe: ['react', 'react-dom', 'react-native-web', 'scheduler'],
        extensions: ['.web.tsx', '.web.ts', '.web.js', '.tsx', '.ts', '.js'],
      },
      define: {
        'process.env.NODE_ENV': JSON.stringify('development'),
        __DEV__: true,
      },
      optimizeDeps: {
        include: ['react-native-web'],
        esbuildOptions: {
          resolveExtensions: ['.web.tsx', '.web.ts', '.web.js', '.tsx', '.ts', '.js'],
        },
      },
    });
  },
});
