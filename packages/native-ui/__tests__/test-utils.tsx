import React from 'react';
import { useAnimatedStyle } from 'react-native-reanimated';
import { render, renderHook, type RenderOptions, type RenderResult } from '@testing-library/react';
import { NativeUIProvider, useTheme } from '../src/theme';
import type { NativeUIConfig, Theme } from '../src/theme/types';

/** Config every helper falls back to, so suites see the same light theme. */
const DEFAULT_TEST_CONFIG: NativeUIConfig = { colorMode: 'light' };

export interface RenderWithThemeOptions extends RenderOptions {
  config?: NativeUIConfig;
}

/**
 * Render helper that wraps the UI tree in {@link NativeUIProvider} with a
 * sensible default config. Use this instead of bare `render()` in any test
 * that mounts a themed component.
 *
 * @example
 * ```tsx
 * renderWithTheme(<Button title="Save" onPress={() => {}} />);
 * ```
 */
export function renderWithTheme(
  ui: React.ReactElement,
  { config = DEFAULT_TEST_CONFIG, ...options }: RenderWithThemeOptions = {},
): RenderResult {
  return render(<NativeUIProvider config={config}>{ui}</NativeUIProvider>, options);
}

/**
 * Resolves the theme {@link NativeUIProvider} builds for `config`, so suites
 * can derive expected colors and tokens instead of hardcoding them.
 *
 * @example
 * ```tsx
 * const theme = captureTheme({ colorMode: 'dark' });
 * ```
 */
export function captureTheme(config: NativeUIConfig = DEFAULT_TEST_CONFIG): Theme {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <NativeUIProvider config={config}>{children}</NativeUIProvider>
  );

  return renderHook(() => useTheme(), { wrapper }).result.current;
}

/** The mapped reanimated mock exports `useAnimatedStyle` as a `jest.fn`. */
export function animatedStyleMock(): jest.Mock<object, [() => object]> {
  const candidate: unknown = useAnimatedStyle;

  if (!jest.isMockFunction(candidate)) {
    throw new Error('react-native-reanimated is expected to be mocked');
  }

  return candidate;
}

/**
 * The reanimated mock returns an empty animated style; evaluating the updater
 * instead exposes the style a component settles on. Restore the default with
 * `animatedStyleMock().mockImplementation(() => ({}))` in `afterEach`.
 */
export function evaluateAnimatedStyles(): void {
  animatedStyleMock().mockImplementation((updater) => updater());
}

/**
 * Types an expected style as computed CSS strings for jest-dom's
 * `toHaveStyle`, whose typings otherwise expect React Native style values.
 */
export function css(style: Record<string, string>): Record<string, string> {
  return style;
}

export { createHapticsMock } from './shared/haptics';
export { defined } from './shared/defined';
export * from '@testing-library/react';
