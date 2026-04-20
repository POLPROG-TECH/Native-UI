import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Root of the @polprog/native-ui package, resolved from this config file.
 */
const libraryRoot = path.resolve(dirname, '../../../packages/native-ui');
const nodeModulesSegment = `${path.sep}node_modules${path.sep}`;

const config: StorybookConfig = {
  stories: [
    // ── Documentation pages (owned by the docs host) ──
    '../docs/**/*.mdx',

    // ── Stories (owned by the library, close to source) ──
    `${libraryRoot}/stories/**/*.@(stories.tsx|mdx)`,
  ],

  addons: ['@storybook/addon-a11y', '@storybook/addon-docs', '@storybook/addon-links'],

  staticDirs: [{ from: '../../../docs/assets', to: '/brand' }],

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  // Autodocs is enabled in preview.tsx via `tags: ['autodocs']`.
  // The legacy `docs.autodocs` field was removed in Storybook 10.

  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      propFilter: (prop) => {
        if (!prop.parent) return true;
        const fileName = prop.parent.fileName;
        // Path-separator-safe check (works on POSIX and Windows):
        // include props only if declared inside our workspace OR inside
        // an @polprog package; exclude everything else coming from node_modules.
        if (!fileName.includes(nodeModulesSegment) && !fileName.includes('/node_modules/')) {
          return true;
        }
        return /[\\/]node_modules[\\/]@polprog[\\/]/.test(fileName);
      },
    },
  },

  async viteFinal(config) {
    return mergeConfig(config, {
      resolve: {
        alias: {
          // ── React Native → Web ──
          'react-native': 'react-native-web',

          // ── Native module mocks ──
          'react-native-reanimated': path.resolve(dirname, 'mocks/react-native-reanimated.ts'),
          'react-native-safe-area-context': path.resolve(
            dirname,
            'mocks/react-native-safe-area-context.tsx',
          ),

          // ── Library source alias (so stories' relative imports resolve) ──
          '@polprog/native-ui': `${libraryRoot}/src`,
        },
        // Dedupe single-instance packages across the monorepo to avoid
        // "Invalid hook call" / duplicate React-context bugs when multiple
        // node_modules trees hoist their own copies.
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
};

export default config;
