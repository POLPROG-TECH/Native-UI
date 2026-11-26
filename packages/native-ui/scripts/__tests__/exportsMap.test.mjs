import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { exportLeaves, findExportProblems, wildcardMatches } from '../shared/exportsMap.mjs';

const dualEntry = (source, dist) => ({
  'react-native': source,
  import: { types: `${dist}.d.mts`, default: `${dist}.mjs` },
  require: { types: `${dist}.d.ts`, default: `${dist}.js` },
});

const distFiles = (base) => [`${base}.d.mts`, `${base}.mjs`, `${base}.d.ts`, `${base}.js`];

describe('exportLeaves', () => {
  describe('GIVEN an entry with nested conditions', () => {
    describe('WHEN it is flattened', () => {
      it('THEN every target keeps its condition path', () => {
        const leaves = exportLeaves(dualEntry('./src/index.ts', './dist/index'));

        assert.deepEqual(leaves[0], { conditions: ['react-native'], target: './src/index.ts' });
        assert.deepEqual(leaves[1], {
          conditions: ['import', 'types'],
          target: './dist/index.d.mts',
        });
        assert.equal(leaves.length, 5);
      });
    });
  });
});

describe('wildcardMatches', () => {
  describe('GIVEN a wildcard target and published files', () => {
    describe('WHEN the files are matched', () => {
      it('THEN only names with the exact prefix and suffix are returned', () => {
        const names = wildcardMatches('./dist/components/*.mjs', [
          'dist/components/Button.mjs',
          'dist/components/Button.mjs.map',
          'dist/index.mjs',
        ]);

        assert.deepEqual(names, ['Button']);
      });
    });
  });
});

describe('findExportProblems', () => {
  describe('GIVEN every subpath maps sources and dist consistently', () => {
    describe('WHEN the map is checked against the tarball', () => {
      it('THEN no problem is reported', () => {
        const exportsField = {
          '.': dualEntry('./src/index.ts', './dist/index'),
          './components/*': dualEntry('./src/components/*.tsx', './dist/components/*'),
          './package.json': './package.json',
        };
        const files = [
          'package.json',
          'src/index.ts',
          'src/components/Button.tsx',
          ...distFiles('dist/index'),
          ...distFiles('dist/components/Button'),
        ];

        assert.deepEqual(findExportProblems(exportsField, files), []);
      });
    });
  });

  describe('GIVEN one subpath lacks the react-native condition', () => {
    describe('WHEN the map is checked', () => {
      it('THEN the subpath is reported as loading a second copy', () => {
        const exportsField = {
          '.': dualEntry('./src/index.ts', './dist/index'),
          './theme': { import: './dist/theme/index.mjs' },
        };
        const files = ['src/index.ts', ...distFiles('dist/index'), 'dist/theme/index.mjs'];

        const problems = findExportProblems(exportsField, files);

        assert.equal(problems.length, 1);
        assert.match(problems[0], /^\.\/theme: no "react-native" condition/);
      });
    });
  });

  describe('GIVEN a target that was not published', () => {
    describe('WHEN the map is checked', () => {
      it('THEN the missing file is named with its condition path', () => {
        const exportsField = { '.': dualEntry('./src/index.ts', './dist/index') };
        const files = ['src/index.ts', 'dist/index.mjs', 'dist/index.js', 'dist/index.d.ts'];

        assert.deepEqual(findExportProblems(exportsField, files), [
          '. [import > types]: ./dist/index.d.mts is not in the tarball',
        ]);
      });
    });
  });

  describe('GIVEN a built wildcard entry without a source file', () => {
    describe('WHEN the map is checked', () => {
      it('THEN the unpaired name is reported once', () => {
        const exportsField = {
          './components/*': dualEntry('./src/components/*.tsx', './dist/components/*'),
        };
        const files = [
          'src/components/Button.tsx',
          ...distFiles('dist/components/Button'),
          'dist/components/Ghost.mjs',
        ];

        assert.deepEqual(findExportProblems(exportsField, files), [
          './components/*: "Ghost" resolves to ./dist/components/*.mjs but has no source file',
        ]);
      });
    });
  });

  describe('GIVEN no subpath serves sources', () => {
    describe('WHEN the map is checked', () => {
      it('THEN a dist-only package is accepted', () => {
        const exportsField = { '.': { import: './dist/index.mjs' } };

        assert.deepEqual(findExportProblems(exportsField, ['dist/index.mjs']), []);
      });
    });
  });

  describe('GIVEN a nested source file reachable through a wildcard', () => {
    const exportsField = {
      './components/*': dualEntry('./src/components/*.tsx', './dist/components/*'),
    };
    const files = [
      'src/components/Button.tsx',
      'src/components/button/ButtonContent.tsx',
      ...distFiles('dist/components/Button'),
    ];

    describe('WHEN the folder is not closed', () => {
      it('THEN the internal file is reported as reachable through sources only', () => {
        const problems = findExportProblems(exportsField, files);

        assert.equal(problems.length, 4);
        assert.match(problems[0], /"button\/ButtonContent" resolves through sources only/);
      });
    });

    describe('WHEN the folder is closed with a null target', () => {
      it('THEN no problem is reported', () => {
        const closed = { ...exportsField, './components/button/*': null };

        assert.deepEqual(findExportProblems(closed, files), []);
      });
    });
  });
});
