import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { buildExports } from '../shared/exportsBuilder.mjs';
import { findExportProblems } from '../shared/exportsMap.mjs';

describe('buildExports', () => {
  describe('GIVEN source areas with subfolders', () => {
    describe('WHEN the exports map is built', () => {
      it('THEN every subfolder is closed and listed in a stable order', () => {
        const map = buildExports({ primitives: ['marquee'], components: ['toast', 'button'] });

        assert.equal(map['./components/button/*'], null);
        assert.equal(map['./components/toast/*'], null);
        assert.equal(map['./primitives/marquee/*'], null);
        assert.deepEqual(
          Object.keys(map).filter((key) => key.startsWith('./components/')),
          ['./components/*', './components/button/*', './components/toast/*'],
        );
      });

      it('THEN every code entry serves sources to Metro and typed files to the rest', () => {
        const map = buildExports({ primitives: [], components: [] });

        assert.deepEqual(map['./theme'], {
          'react-native': './src/theme/index.ts',
          import: { types: './dist/theme/index.d.mts', default: './dist/theme/index.mjs' },
          require: { types: './dist/theme/index.d.ts', default: './dist/theme/index.js' },
        });
        assert.equal(map['./package.json'], './package.json');
      });
    });
  });

  describe('GIVEN the map built for a package with an internal folder', () => {
    describe('WHEN it is checked against the published files', () => {
      it('THEN the internal file is not reachable and nothing is reported', () => {
        const map = buildExports({ primitives: [], components: ['button'] });
        const built = (base) => [`${base}.d.mts`, `${base}.mjs`, `${base}.d.ts`, `${base}.js`];
        const files = [
          'package.json',
          'src/index.ts',
          'src/theme/index.ts',
          'src/tokens/index.ts',
          'src/primitives/Box.tsx',
          'src/components/Button.tsx',
          'src/components/button/ButtonContent.tsx',
          ...built('dist/index'),
          ...built('dist/theme/index'),
          ...built('dist/tokens/index'),
          ...built('dist/primitives/Box'),
          ...built('dist/components/Button'),
        ];

        assert.deepEqual(findExportProblems(map, files), []);
      });
    });
  });
});
