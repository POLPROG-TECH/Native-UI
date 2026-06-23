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

// Every (preset x mode x contrast) combination as one flat list, so the
// backward-compatibility check reads as a single-level it.each instead of a
// triple-nested loop with the assertion buried three levels deep.
const AURORA_COLOR_MATRIX = AURORA_PRESETS.flatMap((preset) =>
  ([false, true] as const).flatMap((isDark) =>
    ([false, true] as const).map((highContrast) => ({ preset, isDark, highContrast })),
  ),
);

describe('resolveThemeVariant', () => {
  it('should default to the Aurora variant when nothing or "default" is passed', () => {
    // GIVEN no theme or the explicit default name
    // WHEN resolved
    // THEN the Aurora singleton is returned both times
    expect(resolveThemeVariant(undefined)).toBe(defaultThemeVariant);
    expect(resolveThemeVariant('default')).toBe(defaultThemeVariant);
  });

  it('should resolve the "bloom" name to the shared Bloom singleton', () => {
    // GIVEN the bloom name
    // WHEN resolved
    // THEN the same registry instance is returned
    expect(resolveThemeVariant('bloom')).toBe(bloomThemeVariant);
    expect(THEME_VARIANTS.bloom).toBe(bloomThemeVariant);
  });

  it('should pass a full ThemeVariant object through unchanged', () => {
    // GIVEN a concrete variant object
    // WHEN resolved
    // THEN the same reference is returned (stable for memoisation)
    expect(resolveThemeVariant(bloomThemeVariant)).toBe(bloomThemeVariant);
  });

  it('should expose readable variant metadata', () => {
    // GIVEN the built-in variants
    // THEN their ids and labels are stable
    expect(defaultThemeVariant.id).toBe('default');
    expect(defaultThemeVariant.name).toBe('Aurora');
    expect(bloomThemeVariant.id).toBe('bloom');
    expect(bloomThemeVariant.name).toBe('Bloom');
  });

  it('should fall back to Aurora (and warn in dev) for an unrecognised variant name', () => {
    // GIVEN a name not in the registry (typo / stale persisted / cross-version value)
    withDev((warn) => {
      // WHEN resolved THEN it degrades to Aurora and surfaces a dev warning
      expect(resolveThemeVariant('nope' as ThemeVariantName)).toBe(defaultThemeVariant);
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('Unknown theme variant "nope"'));
    });
  });
});

describe('default variant backward compatibility', () => {
  it.each(AURORA_COLOR_MATRIX)(
    'resolves identically to the palette-less resolver (preset=$preset, dark=$isDark, highContrast=$highContrast)',
    ({ preset, isDark, highContrast }) => {
      // GIVEN one Aurora preset/mode/contrast combination
      // WHEN resolved with the default variant palette vs. the default argument
      // THEN the colour schemes are byte-identical
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

  it('should keep the Aurora radius scale by reference (md 14, lg 18)', () => {
    // GIVEN the default variant
    // THEN it reuses the original radius object so the default render path is unchanged
    expect(defaultThemeVariant.borderRadius).toBe(borderRadius);
    expect(defaultThemeVariant.borderRadius.md).toBe(14);
    expect(defaultThemeVariant.borderRadius.lg).toBe(18);
  });
});

describe('bloom color palette', () => {
  const base = { fontColor: 'default' as const, highContrast: false, customAccent: null };

  it('should use the violet accent as primary by default', () => {
    // GIVEN the bloom default preset in dark mode
    const scheme = resolveColorScheme(
      { ...base, isDark: true, preset: bloomColorPalette.defaultPreset },
      bloomColorPalette,
    );

    // THEN the primary is the Bloom violet accent
    expect(scheme.primary).toBe('#7c5cff');
  });

  it('should paint purple-tinted backgrounds per mode', () => {
    // GIVEN the violet preset in each mode
    const dark = resolveColorScheme({ ...base, isDark: true, preset: 'violet' }, bloomColorPalette);
    const light = resolveColorScheme(
      { ...base, isDark: false, preset: 'violet' },
      bloomColorPalette,
    );

    // THEN the backgrounds match the Bloom neutrals
    expect(dark.background).toBe('#16111b');
    expect(light.background).toBe('#fdf9fe');
  });

  it('should keep light text on the accent in dark mode via the textInverse override', () => {
    // GIVEN dark mode (where the default rule would use the near-black background)
    const scheme = resolveColorScheme(
      { ...base, isDark: true, preset: 'violet' },
      bloomColorPalette,
    );

    // THEN on-accent text stays white so it reads on the violet fill
    expect(scheme.textInverse).toBe('#FFFFFF');
  });

  it('should derive on-accent text from a custom accent instead of the static white override', () => {
    // GIVEN bloom dark with a LIGHT custom accent (static white would be unreadable on it)
    const light = resolveColorScheme(
      { ...base, isDark: true, preset: 'violet', customAccent: '#EADCFF' },
      bloomColorPalette,
    );

    // THEN the accent drives primary and on-accent text flips to dark for contrast
    expect(light.primary).toBe('#EADCFF');
    expect(light.textInverse).toBe('#0C0C0F');

    // AND a dark custom accent yields light on-accent text
    const dark = resolveColorScheme(
      { ...base, isDark: true, preset: 'violet', customAccent: '#3B0A75' },
      bloomColorPalette,
    );
    expect(dark.textInverse).toBe('#F5F5F7');
  });

  it('should warn and fall back to the default preset for an unknown preset id (dev)', () => {
    withDev((warn) => {
      // GIVEN an Aurora-only preset id passed to the Bloom palette
      const scheme = resolveColorScheme(
        { ...base, isDark: true, preset: 'midnight' },
        bloomColorPalette,
      );

      // THEN it warns and falls back to Bloom's declared default (violet)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('Unknown preset "midnight"'));
      expect(scheme.primary).toBe('#7c5cff');
    });
  });
});

describe('bloom elevation', () => {
  it('should ship distinct light and dark elevation maps with mode-specific shadow colours', () => {
    // GIVEN bloom is the first variant whose elevation differs by colour mode
    const { light, dark } = bloomThemeVariant.elevation;

    // THEN the maps are separate, with a violet-tinted light shadow and a black dark shadow
    expect(light).not.toBe(dark);
    expect((light.md as { shadowColor?: string }).shadowColor).toBe('#5028a0');
    expect((dark.md as { shadowColor?: string }).shadowColor).toBe('#000000');
  });

  it('should reuse the shared flat elevation.none rather than re-inlining it', () => {
    expect(bloomThemeVariant.elevation.light.none).toBe(elevation.none);
    expect(bloomThemeVariant.elevation.dark.none).toBe(elevation.none);
  });
});

describe('NativeUIProvider with theme="bloom"', () => {
  it('should apply the rounder bloom radius scale (md 16, lg 20)', () => {
    // GIVEN a provider switched to the bloom variant
    const { result } = renderHook(() => useTheme(), {
      wrapper: wrapper({ theme: 'bloom', colorMode: 'dark' }),
    });

    // THEN components read the bloom corner radii
    expect(result.current.borderRadius.md).toBe(16);
    expect(result.current.borderRadius.lg).toBe(20);
  });

  it('should resolve the violet accent and purple background', () => {
    // GIVEN a dark bloom provider
    const { result } = renderHook(() => useTheme(), {
      wrapper: wrapper({ theme: 'bloom', colorMode: 'dark' }),
    });

    // THEN the resolved colours are the bloom defaults
    expect(result.current.colors.primary).toBe('#7c5cff');
    expect(result.current.colors.background).toBe('#16111b');
  });

  it('should still honour an explicit bloom preset', () => {
    // GIVEN a bloom provider with the coral preset
    const { result } = renderHook(() => useTheme(), {
      wrapper: wrapper({ theme: 'bloom', colorMode: 'light', preset: 'coral' }),
    });

    // THEN the coral accent wins
    expect(result.current.colors.primary).toBe('#ff5d7d');
  });

  it('should leave the Aurora default look unchanged', () => {
    // GIVEN a default provider (green accent on near-black)
    const { result } = renderHook(() => useTheme(), {
      wrapper: wrapper({ colorMode: 'dark' }),
    });

    // THEN the original tokens still resolve
    expect(result.current.colors.primary).toBe('#00E67A');
    expect(result.current.borderRadius.md).toBe(14);
  });
});

describe('dual-font typography', () => {
  it('should route display variants through Outfit and body through Plus Jakarta Sans', () => {
    // GIVEN the bloom variant (Outfit display + Plus Jakarta Sans text)
    const { result } = renderHook(() => useTheme(), {
      wrapper: wrapper({ theme: 'bloom', colorMode: 'light' }),
    });

    // THEN headings/numerals use Outfit and body/labels use Plus Jakarta Sans
    expect(result.current.typography.h1.fontFamily).toBe('Outfit_600SemiBold');
    expect(result.current.typography.displayLarge.fontFamily).toBe('Outfit_700Bold');
    expect(result.current.typography.mono.fontFamily).toBe('Outfit_700Bold');
    expect(result.current.typography.body.fontFamily).toBe('PlusJakartaSans_400Regular');
    expect(result.current.typography.label.fontFamily).toBe('PlusJakartaSans_600SemiBold');
  });

  it('should leave single-family scales unchanged (Aurora ships one family)', () => {
    // GIVEN the default variant with no display family
    const { result } = renderHook(() => useTheme(), {
      wrapper: wrapper({ colorMode: 'light' }),
    });

    // THEN every variant keeps its Space Grotesk weight family
    expect(result.current.typography.h1.fontFamily).toBe('SpaceGrotesk_600SemiBold');
    expect(result.current.typography.body.fontFamily).toBe('SpaceGrotesk_400Regular');
  });
});
