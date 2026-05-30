import { readdirSync } from 'node:fs';
import { defineConfig } from 'tsup';

/**
 * Auto-generate a per-file entry map for tree-shakeable subpath imports
 * (e.g. `@polprog/native-ui/components/Button`). Generating from disk avoids
 * the drift that a hand-maintained list inevitably accumulates when new
 * components are added.
 */
function entriesFrom(dir: 'components' | 'primitives'): Record<string, string> {
  const entries: Record<string, string> = {};

  for (const file of readdirSync(`src/${dir}`)) {
    if (!file.endsWith('.tsx')) continue;
    if (/\.(stories|test)\.tsx$/.test(file)) continue;
    if (file === 'index.tsx') continue;

    const name = file.replace(/\.tsx$/, '');

    entries[`${dir}/${name}`] = `src/${dir}/${file}`;
  }

  return entries;
}

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'tokens/index': 'src/tokens/index.ts',
    'theme/index': 'src/theme/index.ts',
    ...entriesFrom('primitives'),
    ...entriesFrom('components'),
  },
  format: ['esm', 'cjs'],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  outDir: 'dist',
  tsconfig: 'tsconfig.build.json',
  external: [
    'react',
    'react-native',
    'react-native-reanimated',
    'react-native-safe-area-context',
    '@react-native-community/datetimepicker',
  ],
  esbuildOptions(options) {
    options.jsx = 'automatic';
  },
});
