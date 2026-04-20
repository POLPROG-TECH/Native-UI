import React from 'react';
import { render, type RenderOptions, type RenderResult } from '@testing-library/react';
import { NativeUIProvider } from '../src/theme';
import type { NativeUIConfig } from '../src/theme/types';

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
  { config = { colorMode: 'light' }, ...options }: RenderWithThemeOptions = {},
): RenderResult {
  return render(<NativeUIProvider config={config}>{ui}</NativeUIProvider>, options);
}

export * from '@testing-library/react';
