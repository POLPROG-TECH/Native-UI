/** @type {import('jest').Config} */
const path = require('path');
/* Resolve react/react-dom from wherever npm hoists them (usually monorepo root). */
const reactPath = path.dirname(require.resolve('react/package.json'));
const reactDomPath = path.dirname(require.resolve('react-dom/package.json'));

/*
 * Forces the hoisted React copy in both projects so a nested duplicate can
 * never produce "invalid hook call" errors in the monorepo.
 */
const hoistedReactMapper = {
  '^react$': reactPath,
  '^react/(.*)$': path.join(reactPath, '$1'),
};

const NATIVE_TESTS_DIR = '<rootDir>/__tests__/native/';

/**
 * `dom` project: fast jsdom suite. Renders components through the hand-written
 * `__mocks__/react-native.js` and `@testing-library/react`, so it covers logic
 * and markup but not real React Native host component behaviour.
 */
const domProject = {
  displayName: 'dom',
  rootDir: __dirname,
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
        jsx: 'react-jsx',
      },
    ],
  },
  testMatch: ['**/__tests__/**/*.test.(ts|tsx)'],
  testPathIgnorePatterns: ['/node_modules/', NATIVE_TESTS_DIR],
  setupFilesAfterEnv: ['./jest.setup.js'],
  roots: ['<rootDir>'],
  moduleNameMapper: {
    ...hoistedReactMapper,
    '^react-dom$': reactDomPath,
    '^react-dom/(.*)$': path.join(reactDomPath, '$1'),
    /** React Native mocks */
    '^react-native$': '<rootDir>/__mocks__/react-native.js',
    '^react-native/(.*)$': '<rootDir>/__mocks__/react-native.js',
    '^react-native-reanimated$': '<rootDir>/__mocks__/react-native-reanimated.js',
    '^react-native-safe-area-context$': '<rootDir>/__mocks__/react-native-safe-area-context.js',
  },
};

/**
 * `native` project: runs `__tests__/native` against the real `react-native`
 * Jest preset (published as `@react-native/jest-preset`, no longer inside the
 * `react-native` package) with `@testing-library/react-native`. Use it for
 * behaviour the jsdom mock cannot prove: accessibility props, Modal,
 * Pressable, AccessibilityInfo.
 */
const nativeProject = {
  displayName: 'native',
  rootDir: __dirname,
  preset: '@react-native/jest-preset',
  /**
   * `<rootDir>/__mocks__` must stay outside `roots`: Jest auto-applies root
   * level `__mocks__` to node modules, which would swap real `react-native`
   * for the jsdom mock.
   */
  roots: [NATIVE_TESTS_DIR, '<rootDir>/src/'],
  testMatch: [`${NATIVE_TESTS_DIR}**/*.test.ts?(x)`],
  transform: {
    /**
     * Same key as the preset so this entry replaces it: TS/TSX (including
     * `src/**\/*.tsx`) and RN's Flow sources go through the RN Babel preset.
     * The preset is passed inline so no babel.config.js leaks into other tools.
     */
    '^.+\\.(js|ts|tsx)$': [
      'babel-jest',
      { presets: ['module:@react-native/babel-preset'], babelrc: false, configFile: false },
    ],
  },
  /**
   * The preset only transforms `react-native` and `@react-native/*`; the
   * animation and safe-area packages also publish untranspiled sources.
   */
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|react-native-reanimated|react-native-safe-area-context|react-native-worklets)/)',
  ],
  /** Replaces the preset's resolver with one that chains it after Reanimated's. */
  resolver: '<rootDir>/jest.native-resolver.js',
  /**
   * Coverage comes from the `dom` project only. Babel and ts-jest instrument
   * the same file differently, and Istanbul merges the mismatched maps by
   * adding both sets of statements and branches, which skews the thresholds.
   */
  coveragePathIgnorePatterns: ['/node_modules/', '<rootDir>/src/'],
  moduleNameMapper: {
    ...hoistedReactMapper,
    /**
     * Official mocks published by the libraries themselves; the real modules
     * need native code (worklets, native insets) that does not exist in Jest.
     */
    '^react-native-reanimated$': require.resolve('react-native-reanimated/mock'),
    '^react-native-safe-area-context$': '<rootDir>/__tests__/native/mocks/safe-area-context.js',
  },
};

module.exports = {
  projects: [domProject, nativeProject],
  /** Coverage options are global; the `native` project opts out (see above). */
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts', '!src/**/index.ts'],
  /** Jest defaults plus `json-summary`, which the Storybook stats page reads. */
  coverageReporters: ['clover', 'json', 'json-summary', 'lcov', 'text'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 88,
      lines: 90,
      statements: 90,
    },
  },
};
