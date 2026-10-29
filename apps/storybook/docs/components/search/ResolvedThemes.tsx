import type { ReactNode } from 'react';
import { NativeUIProvider, useTheme, type Theme } from '@polprog/native-ui';
import { THEME_CONFIG } from './searchConfig';

/** The library theme resolved in both color modes. */
export interface ThemePair {
  light: Theme;
  dark: Theme;
}

function ThemeReader({ children }: { children: (theme: Theme) => ReactNode }) {
  return children(useTheme());
}

/**
 * Resolves token values the way an app does: through `NativeUIProvider`, once
 * per color mode. Rendering the providers (rather than calling the resolvers)
 * keeps the values identical to what components receive, including variant
 * radii and the default type density. The providers render no DOM.
 */
export function ResolvedThemes({ children }: { children: (themes: ThemePair) => ReactNode }) {
  return (
    <NativeUIProvider config={THEME_CONFIG.light}>
      <ThemeReader>
        {(light) => (
          <NativeUIProvider config={THEME_CONFIG.dark}>
            <ThemeReader>{(dark) => children({ light, dark })}</ThemeReader>
          </NativeUIProvider>
        )}
      </ThemeReader>
    </NativeUIProvider>
  );
}
