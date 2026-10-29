import React from 'react';
import { NativeUIProvider, useTheme } from '../../src/theme/ThemeProvider';
import type { TypographyDensity } from '../../src/tokens';

/**
 * Nested provider for density comparisons. A bare nested provider falls back
 * to the OS colour mode, so a dark story would show light-mode text; this
 * one inherits the surrounding story's mode and only swaps the density.
 */
export function DensityProvider({
  typography,
  children,
}: {
  typography: TypographyDensity;
  children: React.ReactNode;
}) {
  const { isDark } = useTheme();

  return (
    <NativeUIProvider config={{ typography, colorMode: isDark ? 'dark' : 'light' }}>
      {children}
    </NativeUIProvider>
  );
}
