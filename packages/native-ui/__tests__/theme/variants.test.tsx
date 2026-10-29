import React from 'react';
import { renderHook } from '@testing-library/react';

import { NativeUIProvider, useTheme } from '../../src/theme';
import {
  THEME_VARIANTS,
  defaultThemeVariant,
  bloomThemeVariant,
  resolveThemeVariant,
  type ThemeVariantName,
} from '../../src/theme/variants';
import { resolveColorScheme } from '../../src/tokens/colors';
import type { ThemePreset } from '../../src/tokens/colors';
import { bloomColorPalette } from '../../src/tokens/bloomPalette';
import { borderRadius, elevation } from '../../src/tokens/spacing';

/** Run a block with `__DEV__` forced on (the suite defaults it to false). */
function withDev(run: (warn: jest.SpyInstance) => void): void {
  const g = globalThis as typeof globalThis & { __DEV__: boolean };
  const prev = g.__DEV__;
  g.__DEV__ = true;
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

  try {
    run(warn);
  } finally {
    warn.mockRestore();
    g.__DEV__ = prev;
  }
}

function wrapper(config?: React.ComponentProps<typeof NativeUIProvider>['config']) {
  return ({ children }: { children: React.ReactNode }) => (
    <NativeUIProvider config={config}>{children}</NativeUIProvider>
  );
}

const AURORA_PRESETS: ThemePreset[] = [
  'default',
  'midnight',
  'ocean',
  'forest',
  'sunset',
  'rose',
  'amoled',
];

/*
 * Every (preset x mode x contrast) combination as one flat list, so the
 * backward-compatibility check reads as a single-level it.each instead of a
 * triple-nested loop with the assertion buried three levels deep.
 */
const AURORA_COLOR_MATRIX = AURORA_PRESETS.flatMap((preset) =>
  ([false, true] as const).flatMap((isDark) =>
    ([false, true] as const).map((highContrast) => ({ preset, isDark, highContrast })),
  ),
);

describe('resolveThemeVariant', () => {
  describe('GIVEN no theme or the explicit default name', () => {
    describe('WHEN resolved', () => {
      it('THEN the Aurora singleton is returned both times', () => {
        expect(resolveThemeVariant(undefined)).toBe(defaultThemeVariant);
        expect(resolveThemeVariant('default')).toBe(defaultThemeVariant);
      });
    });
  });

  describe('GIVEN the bloom name', () => {
    describe('WHEN resolved', () => {
      it('THEN the same registry instance is returned', () => {
        expect(resolveThemeVariant('bloom')).toBe(bloomThemeVariant);
        expect(THEME_VARIANTS.bloom).toBe(bloomThemeVariant);
      });
    });
  });

  describe('GIVEN a concrete variant object', () => {
    describe('WHEN resolved', () => {
      it('THEN the same reference is returned (stable for memoisation)', () => {
        expect(resolveThemeVariant(bloomThemeVariant)).toBe(bloomThemeVariant);
      });
    });
  });

  describe('GIVEN the built-in variants', () => {
    describe('WHEN their metadata is read', () => {
      it('THEN their ids and labels are stable', () => {
        expect(defaultThemeVariant.id).toBe('default');
        expect(defaultThemeVariant.name).toBe('Aurora');
        expect(bloomThemeVariant.id).toBe('bloom');
        expect(bloomThemeVariant.name).toBe('Bloom');
      });
    });
  });

  describe('GIVEN a name not in the registry (typo / stale persisted / cross-version value)', () => {
    describe('WHEN resolved', () => {
      it('THEN it degrades to Aurora and surfaces a dev warning', () => {
        withDev((warn) => {
          expect(resolveThemeVariant('nope' as ThemeVariantName)).toBe(defaultThemeVariant);
          expect(warn).toHaveBeenCalledWith(
            expect.stringContaining('Unknown theme variant "nope"'),
          );
        });
      });
    });
  });
});

describe('default variant backward compatibility', () => {
  describe('GIVEN one Aurora preset/mode/contrast combination', () => {
    describe('WHEN resolved with the default variant palette vs. the default argument', () => {
      it.each(AURORA_COLOR_MATRIX)(
        'THEN the colour schemes are byte-identical ($preset, $isDark, $highContrast)',
        ({ preset, isDark, highContrast }) => {
          const options = {
            isDark,
            preset,
            fontColor: 'default' as const,
            highContrast,
            customAccent: null,
          };

          expect(resolveColorScheme(options, defaultThemeVariant.colorPalette)).toEqual(
            resolveColorScheme(options),
          );
        },
      );
    });
  });

  describe('GIVEN the default variant', () => {
    describe('WHEN its radius scale is read', () => {
      it('THEN it reuses the original radius object so the default render path is unchanged', () => {
        expect(defaultThemeVariant.borderRadius).toBe(borderRadius);
        expect(defaultThemeVariant.borderRadius.md).toBe(14);
        expect(defaultThemeVariant.borderRadius.lg).toBe(18);
      });
    });
  });
});

describe('bloom color palette', () => {
  const base = { fontColor: 'default' as const, highContrast: false, customAccent: null };

  describe('GIVEN the bloom default preset in dark mode', () => {
    describe('WHEN the scheme is resolved', () => {
      it('THEN the primary is the Bloom violet accent', () => {
        const scheme = resolveColorScheme(
          { ...base, isDark: true, preset: bloomColorPalette.defaultPreset },
          bloomColorPalette,
        );

        expect(scheme.primary).toBe('#7658f3');
      });
    });
  });

  describe('GIVEN the violet preset in each mode', () => {
    describe('WHEN both schemes are resolved', () => {
      it('THEN the backgrounds match the Bloom neutrals', () => {
        const dark = resolveColorScheme(
          { ...base, isDark: true, preset: 'violet' },
          bloomColorPalette,
        );
        const light = resolveColorScheme(
          { ...base, isDark: false, preset: 'violet' },
          bloomColorPalette,
        );

        expect(dark.background).toBe('#16111b');
        expect(light.background).toBe('#fdf9fe');
      });
    });
  });

  describe('GIVEN dark mode (where the default rule would use the near-black background)', () => {
    describe('WHEN the on-accent text is resolved', () => {
      it('THEN on-accent text stays white so it reads on the violet fill', () => {
        const scheme = resolveColorScheme(
          { ...base, isDark: true, preset: 'violet' },
          bloomColorPalette,
        );

        expect(scheme.textInverse).toBe('#FFFFFF');
      });
    });
  });

  describe('GIVEN bloom dark with a LIGHT custom accent (static white would be unreadable on it)', () => {
    describe('WHEN the scheme is resolved', () => {
      it('THEN the accent drives primary and on-accent text flips to dark for contrast', () => {
        const light = resolveColorScheme(
          { ...base, isDark: true, preset: 'violet', customAccent: '#EADCFF' },
          bloomColorPalette,
        );

        expect(light.primary).toBe('#EADCFF');
        expect(light.textInverse).toBe('#0C0C0F');

        /* AND a dark custom accent yields light on-accent text */
        const dark = resolveColorScheme(
          { ...base, isDark: true, preset: 'violet', customAccent: '#3B0A75' },
          bloomColorPalette,
        );
        expect(dark.textInverse).toBe('#F5F5F7');
      });
    });
  });

  describe('GIVEN an Aurora-only preset id passed to the Bloom palette', () => {
    describe('WHEN the scheme is resolved', () => {
      it("THEN it warns and falls back to Bloom's declared default (violet)", () => {
        withDev((warn) => {
          const scheme = resolveColorScheme(
            { ...base, isDark: true, preset: 'midnight' },
            bloomColorPalette,
          );

          expect(warn).toHaveBeenCalledWith(expect.stringContaining('Unknown preset "midnight"'));
          expect(scheme.primary).toBe('#7658f3');
        });
      });
    });
  });
});

describe('bloom elevation', () => {
  describe('GIVEN bloom is the first variant whose elevation differs by colour mode', () => {
    describe('WHEN the light and dark maps are compared', () => {
      it('THEN the maps are separate, with a violet-tinted light shadow and a black dark shadow', () => {
        const { light, dark } = bloomThemeVariant.elevation;

        expect(light).not.toBe(dark);
        expect((light.md as { shadowColor?: string }).shadowColor).toBe('#5028a0');
        expect((dark.md as { shadowColor?: string }).shadowColor).toBe('#000000');
      });
    });
  });

  describe('GIVEN the bloom elevation maps', () => {
    describe('WHEN their flat entries are compared to the shared scale', () => {
      it('THEN both modes reuse the same elevation.none object', () => {
        expect(bloomThemeVariant.elevation.light.none).toBe(elevation.none);
        expect(bloomThemeVariant.elevation.dark.none).toBe(elevation.none);
      });
    });
  });
});

describe('NativeUIProvider with theme="bloom"', () => {
  describe('GIVEN a provider switched to the bloom variant', () => {
    describe('WHEN the theme is read', () => {
      it('THEN components read the bloom corner radii', () => {
        const { result } = renderHook(() => useTheme(), {
          wrapper: wrapper({ theme: 'bloom', colorMode: 'dark' }),
        });

        expect(result.current.borderRadius.md).toBe(16);
        expect(result.current.borderRadius.lg).toBe(20);
      });
    });
  });

  describe('GIVEN a dark bloom provider', () => {
    describe('WHEN the theme is read', () => {
      it('THEN the resolved colours are the bloom defaults', () => {
        const { result } = renderHook(() => useTheme(), {
          wrapper: wrapper({ theme: 'bloom', colorMode: 'dark' }),
        });

        expect(result.current.colors.primary).toBe('#7658f3');
        expect(result.current.colors.background).toBe('#16111b');
      });
    });
  });

  describe('GIVEN a bloom provider with the coral preset', () => {
    describe('WHEN the theme is read', () => {
      it('THEN the coral accent wins', () => {
        const { result } = renderHook(() => useTheme(), {
          wrapper: wrapper({ theme: 'bloom', colorMode: 'light', preset: 'coral' }),
        });

        expect(result.current.colors.primary).toBe('#ff5d7d');
      });
    });
  });

  describe('GIVEN a default provider (green accent on near-black)', () => {
    describe('WHEN the theme is read', () => {
      it('THEN the original tokens still resolve', () => {
        const { result } = renderHook(() => useTheme(), {
          wrapper: wrapper({ colorMode: 'dark' }),
        });

        expect(result.current.colors.primary).toBe('#00E67A');
        expect(result.current.borderRadius.md).toBe(14);
      });
    });
  });
});

describe('dual-font typography', () => {
  describe('GIVEN the bloom variant (Outfit display + Plus Jakarta Sans text)', () => {
    describe('WHEN the typography is read', () => {
      it('THEN headings/numerals use Outfit and body/labels use Plus Jakarta Sans', () => {
        const { result } = renderHook(() => useTheme(), {
          wrapper: wrapper({ theme: 'bloom', colorMode: 'light' }),
        });

        expect(result.current.typography.h1.fontFamily).toBe('Outfit_600SemiBold');
        expect(result.current.typography.displayLarge.fontFamily).toBe('Outfit_700Bold');
        expect(result.current.typography.mono.fontFamily).toBe('Outfit_700Bold');
        expect(result.current.typography.body.fontFamily).toBe('PlusJakartaSans_400Regular');
        expect(result.current.typography.label.fontFamily).toBe('PlusJakartaSans_600SemiBold');
      });
    });
  });

  describe('GIVEN the default variant with no display family', () => {
    describe('WHEN the typography is read', () => {
      it('THEN every variant keeps its Space Grotesk weight family', () => {
        const { result } = renderHook(() => useTheme(), {
          wrapper: wrapper({ colorMode: 'light' }),
        });

        expect(result.current.typography.h1.fontFamily).toBe('SpaceGrotesk_600SemiBold');
        expect(result.current.typography.body.fontFamily).toBe('SpaceGrotesk_400Regular');
      });
    });
  });
});
