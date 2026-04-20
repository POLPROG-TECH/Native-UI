/** @type {import('jest').Config} */
const path = require('path');
// Resolve react/react-dom from wherever npm hoists them (usually monorepo root).
const reactPath = path.dirname(require.resolve('react/package.json'));
const reactDomPath = path.dirname(require.resolve('react-dom/package.json'));

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
      jsx: 'react-jsx',
    }],
  },
  testMatch: ['**/__tests__/**/*.test.(ts|tsx)'],
  setupFilesAfterEnv: ['./jest.setup.js'],
  roots: ['<rootDir>'],
  moduleNameMapper: {
    // Force hoisted react/react-dom to avoid monorepo version conflicts
    '^react$': reactPath,
    '^react/(.*)$': path.join(reactPath, '$1'),
    '^react-dom$': reactDomPath,
    '^react-dom/(.*)$': path.join(reactDomPath, '$1'),
    // React Native mocks
    '^react-native$': '<rootDir>/__mocks__/react-native.js',
    '^react-native/(.*)$': '<rootDir>/__mocks__/react-native.js',
    '^react-native-reanimated$': '<rootDir>/__mocks__/react-native-reanimated.js',
    '^react-native-safe-area-context$': '<rootDir>/__mocks__/react-native-safe-area-context.js',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 25,
      functions: 25,
      lines: 50,
      statements: 50,
    },
  },
};
