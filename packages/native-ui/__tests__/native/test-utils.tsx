import React from 'react';
import {
  render,
  renderHook,
  type RenderOptions,
  type RenderResult,
} from '@testing-library/react-native';
import { NativeUIProvider, useTheme } from '../../src/theme';
import type { NativeUIConfig, Theme } from '../../src/theme/types';

/** Same default as the `dom` test-utils, so both projects see one theme. */
const DEFAULT_TEST_CONFIG: NativeUIConfig = { colorMode: 'light' };

export interface RenderWithThemeOptions extends RenderOptions {
  config?: NativeUIConfig;
}

/**
 * Native counterpart of `__tests__/test-utils.tsx`: renders the UI tree with
 * the real React Native renderer inside {@link NativeUIProvider}. Only use it
 * from `__tests__/native`, which runs under the `native` Jest project.
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
 * Resolves the theme {@link NativeUIProvider} builds for `config` under the
 * real React Native renderer.
 *
 * @example
 * ```tsx
 * const outline = captureTheme().colors.focusRing;
 * ```
 */
export function captureTheme(config: NativeUIConfig = DEFAULT_TEST_CONFIG): Theme {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <NativeUIProvider config={config}>{children}</NativeUIProvider>
  );

  return renderHook(() => useTheme(), { wrapper }).result.current;
}

export { createHapticsMock } from '../shared/haptics';
export * from '@testing-library/react-native';
