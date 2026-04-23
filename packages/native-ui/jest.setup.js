// Jest global setup.
// - Pulls in @testing-library/jest-dom custom matchers (e.g. toBeInTheDocument).
// - Defines `__DEV__` (normally injected by Metro in RN apps) so components
//   that branch on it don't throw ReferenceError under jsdom.
// - Test suites should import `renderWithTheme` from `__tests__/test-utils` to
//   wrap components in the NativeUIProvider without boilerplate.
require('@testing-library/jest-dom');

globalThis.__DEV__ = false;
