import React from 'react';
import { render, renderHook } from '@testing-library/react';

import {
  NativeUIProvider,
  useColors,
  useSemantic,
  useTheme,
  useThemeColors,
} from '../../src/theme';

function wrapper(config?: React.ComponentProps<typeof NativeUIProvider>['config']) {
  return ({ children }: { children: React.ReactNode }) => (
    <NativeUIProvider config={config}>{children}</NativeUIProvider>
  );
}

describe('NativeUIProvider / useTheme', () => {
  it('should throw a descriptive error when useTheme is called outside the provider', () => {
    // GIVEN a tree without a NativeUIProvider ancestor
    // WHEN useTheme is invoked
    const callOutside = () => renderHook(() => useTheme());

    // THEN a descriptive error mentioning NativeUIProvider is thrown
    expect(callOutside).toThrow(/NativeUIProvider/);
  });

  it('should resolve to dark mode when colorMode is explicitly dark', () => {
    // GIVEN a provider configured with colorMode="dark"
    // WHEN useTheme is read inside it
    const { result } = renderHook(() => useTheme(), { wrapper: wrapper({ colorMode: 'dark' }) });

    // THEN the resolved theme is dark
    expect(result.current.isDark).toBe(true);
  });

  it('should resolve to light mode when colorMode is explicitly light', () => {
    // GIVEN a provider configured with colorMode="light"
    // WHEN useTheme is read inside it
    const { result } = renderHook(() => useTheme(), { wrapper: wrapper({ colorMode: 'light' }) });

    // THEN the resolved theme is not dark
    expect(result.current.isDark).toBe(false);
  });

  it('should follow the system color scheme when colorMode is `system`', () => {
    // GIVEN the OS-level color scheme is mocked to dark
    const rn = require('react-native') as { useColorScheme: () => string };
    const spy = jest.spyOn(rn, 'useColorScheme').mockReturnValue('dark');

    // WHEN useTheme runs inside a provider with colorMode="system"
    const { result } = renderHook(() => useTheme(), {
      wrapper: wrapper({ colorMode: 'system' }),
    });

    // THEN the resolved theme mirrors the system preference
    expect(result.current.isDark).toBe(true);

    spy.mockRestore();
  });

  it('should scale typography font sizes when a non-default `fontSize` is set', () => {
    // GIVEN two providers that differ only in fontSize preference
    const { result: base } = renderHook(() => useTheme(), {
      wrapper: wrapper({ colorMode: 'light' }),
    });
    const { result: large } = renderHook(() => useTheme(), {
      wrapper: wrapper({ colorMode: 'light', fontSize: 'large' }),
    });

    // WHEN the bodyMedium sizes are compared
    // THEN the large preset is bigger than the default preset
    expect(large.current.typography.bodyMedium.fontSize).toBeGreaterThan(
      base.current.typography.bodyMedium.fontSize,
    );
  });

  it('should propagate the `reduceAnimations` flag to the theme', () => {
    // GIVEN a provider with reduceAnimations=true
    // WHEN useTheme is read
    const { result } = renderHook(() => useTheme(), {
      wrapper: wrapper({ colorMode: 'light', reduceAnimations: true }),
    });

    // THEN the flag is surfaced on the theme object
    expect(result.current.reduceAnimations).toBe(true);
  });

  it('should merge semantic token overrides over the defaults', () => {
    // GIVEN a provider overriding the `actionPrimary` semantic color
    // WHEN useSemantic is read
    const { result } = renderHook(() => useSemantic(), {
      wrapper: wrapper({
        colorMode: 'light',
        semanticTokens: { colors: { actionPrimary: 'primaryLight' } },
      }),
    });

    // THEN the override is reflected in the resolved tokens
    expect(result.current.colors.actionPrimary).toBe('primaryLight');
  });

  it('should expose the `regular` typography density when selected by name', () => {
    // GIVEN a provider requesting the regular typography density
    // WHEN useTheme is read
    const { result } = renderHook(() => useTheme(), {
      wrapper: wrapper({ colorMode: 'light', typography: 'regular' }),
    });

    // THEN a valid body font size is produced
    expect(result.current.typography.bodyMedium.fontSize).toBeGreaterThan(0);
  });

  it('should accept a fully pre-built Typography object as override', () => {
    // GIVEN a provider passing a pre-built typography object
    const fake = { bodyMedium: { fontSize: 42, lineHeight: 50, fontWeight: '400' } } as never;

    // WHEN useTheme is read
    const { result } = renderHook(() => useTheme(), {
      wrapper: wrapper({ colorMode: 'light', typography: fake }),
    });

    // THEN the supplied values are used verbatim
    expect(result.current.typography.bodyMedium.fontSize).toBe(42);
  });

  it('should expose `useColors` and `useThemeColors` as equivalent color accessors', () => {
    // GIVEN the same provider tree
    // WHEN both hooks are invoked
    const { result: a } = renderHook(() => useColors(), { wrapper: wrapper() });
    const { result: b } = renderHook(() => useThemeColors(), { wrapper: wrapper() });

    // THEN they yield identical color scheme objects
    expect(a.current).toEqual(b.current);
  });

  it('should render children without crashing when no config is provided', () => {
    // GIVEN a NativeUIProvider with default configuration
    // WHEN arbitrary children are rendered inside it
    const { getByText } = render(
      <NativeUIProvider>
        <span>hello</span>
      </NativeUIProvider>,
    );

    // THEN the children appear in the DOM
    expect(getByText('hello')).toBeInTheDocument();
  });
});
