import React from 'react';
import { render, renderHook } from '@testing-library/react';

import { NativeUIProvider, useColors, useSemantic, useTheme } from '../../src/theme';

function wrapper(config?: React.ComponentProps<typeof NativeUIProvider>['config']) {
  return ({ children }: { children: React.ReactNode }) => (
    <NativeUIProvider config={config}>{children}</NativeUIProvider>
  );
}

describe('NativeUIProvider / useTheme', () => {
  describe('GIVEN a tree without a NativeUIProvider ancestor', () => {
    describe('WHEN useTheme is invoked', () => {
      it('THEN a descriptive error mentioning NativeUIProvider is thrown', () => {
        const callOutside = () => renderHook(() => useTheme());

        expect(callOutside).toThrow(/NativeUIProvider/);
      });
    });
  });

  describe('GIVEN a provider configured with colorMode="dark"', () => {
    describe('WHEN useTheme is read inside it', () => {
      it('THEN the resolved theme is dark', () => {
        const { result } = renderHook(() => useTheme(), {
          wrapper: wrapper({ colorMode: 'dark' }),
        });

        expect(result.current.isDark).toBe(true);
      });
    });
  });

  describe('GIVEN a provider configured with colorMode="light"', () => {
    describe('WHEN useTheme is read inside it', () => {
      it('THEN the resolved theme is not dark', () => {
        const { result } = renderHook(() => useTheme(), {
          wrapper: wrapper({ colorMode: 'light' }),
        });

        expect(result.current.isDark).toBe(false);
      });
    });
  });

  describe('GIVEN the OS-level color scheme is mocked to dark', () => {
    describe('WHEN useTheme runs inside a provider with colorMode="system"', () => {
      it('THEN the resolved theme mirrors the system preference', () => {
        const rn = require('react-native') as { useColorScheme: () => string };
        const spy = jest.spyOn(rn, 'useColorScheme').mockReturnValue('dark');

        const { result } = renderHook(() => useTheme(), {
          wrapper: wrapper({ colorMode: 'system' }),
        });

        expect(result.current.isDark).toBe(true);

        spy.mockRestore();
      });
    });
  });

  describe('GIVEN two providers that differ only in fontSize preference', () => {
    describe('WHEN the bodyMedium sizes are compared', () => {
      it('THEN the large preset is bigger than the default preset', () => {
        const { result: base } = renderHook(() => useTheme(), {
          wrapper: wrapper({ colorMode: 'light' }),
        });
        const { result: large } = renderHook(() => useTheme(), {
          wrapper: wrapper({ colorMode: 'light', fontSize: 'large' }),
        });

        expect(large.current.typography.bodyMedium.fontSize).toBeGreaterThan(
          base.current.typography.bodyMedium.fontSize,
        );
      });
    });
  });

  describe('GIVEN a provider with reduceAnimations=true', () => {
    describe('WHEN useTheme is read', () => {
      it('THEN the flag is surfaced on the theme object', () => {
        const { result } = renderHook(() => useTheme(), {
          wrapper: wrapper({ colorMode: 'light', reduceAnimations: true }),
        });

        expect(result.current.reduceAnimations).toBe(true);
      });
    });
  });

  describe('GIVEN a provider overriding the `actionPrimary` semantic color', () => {
    describe('WHEN useSemantic is read', () => {
      it('THEN the override is reflected in the resolved tokens', () => {
        const { result } = renderHook(() => useSemantic(), {
          wrapper: wrapper({
            colorMode: 'light',
            semanticTokens: { colors: { actionPrimary: 'primaryLight' } },
          }),
        });

        expect(result.current.colors.actionPrimary).toBe('primaryLight');
      });
    });
  });

  describe('GIVEN a provider requesting the regular typography density', () => {
    describe('WHEN useTheme is read', () => {
      it('THEN a valid body font size is produced', () => {
        const { result } = renderHook(() => useTheme(), {
          wrapper: wrapper({ colorMode: 'light', typography: 'regular' }),
        });

        expect(result.current.typography.bodyMedium.fontSize).toBeGreaterThan(0);
      });
    });
  });

  describe('GIVEN a provider passing a pre-built typography object', () => {
    describe('WHEN useTheme is read', () => {
      it('THEN the supplied values are used verbatim', () => {
        const fake = { bodyMedium: { fontSize: 42, lineHeight: 50, fontWeight: '400' } } as never;

        const { result } = renderHook(() => useTheme(), {
          wrapper: wrapper({ colorMode: 'light', typography: fake }),
        });

        expect(result.current.typography.bodyMedium.fontSize).toBe(42);
      });
    });
  });

  describe('GIVEN a provider tree', () => {
    describe('WHEN useColors is invoked', () => {
      it('THEN it returns the colors of the current theme', () => {
        const { result: colors } = renderHook(() => useColors(), { wrapper: wrapper() });
        const { result: theme } = renderHook(() => useTheme(), { wrapper: wrapper() });

        expect(colors.current).toEqual(theme.current.colors);
      });
    });
  });

  describe('GIVEN a NativeUIProvider with default configuration', () => {
    describe('WHEN arbitrary children are rendered inside it', () => {
      it('THEN the children appear in the DOM', () => {
        const { getByText } = render(
          <NativeUIProvider>
            <span>hello</span>
          </NativeUIProvider>,
        );

        expect(getByText('hello')).toBeInTheDocument();
      });
    });
  });
});
