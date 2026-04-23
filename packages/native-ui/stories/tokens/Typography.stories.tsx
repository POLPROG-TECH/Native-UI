import React from 'react';
import { View, Text as RNText } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { DEFAULT_TYPOGRAPHY_DENSITY, FONT_SCALE, compactTypography, typography } from '../../src/tokens/typography';
import { spaceGroteskFontFamilies, systemFontFamilies } from '../../src/tokens/fonts';
import { useTheme } from '../../src/theme/ThemeProvider';
import type { TypographyVariant } from '../../src/tokens/typography';

// `typography` is the root-level iOS-native (`regular`) scale; `compactScale`
// mirrors the new provider default, built against the Space Grotesk family
// names that `<NativeUIProvider>` resolves by default.
const compactScale = compactTypography(spaceGroteskFontFamilies);

const TypographySample = ({ variant, style }: { variant: string; style: any }) => {
  const { colors } = useTheme();

  return (
    <View style={{ marginBottom: 20, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: colors.divider }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <RNText style={{ fontSize: 12, fontWeight: '600', color: colors.primary, fontFamily: 'monospace' }}>
          {variant}
        </RNText>
        <RNText style={{ fontSize: 11, color: colors.textTertiary, fontFamily: 'monospace' }}>
          {style.fontSize}px / {style.lineHeight}px · {style.fontWeight}
          {style.letterSpacing ? ` · ls: ${style.letterSpacing}` : ''}
          {style.fontVariant ? ` · ${style.fontVariant.join(', ')}` : ''}
        </RNText>
      </View>
      <RNText style={{ ...style, color: colors.textPrimary }}>
        {variant.startsWith('mono') || variant.startsWith('amount')
          ? '€1,234,567.89'
          : 'The quick brown fox jumps over the lazy dog'}
      </RNText>
    </View>
  );
};

const meta: Meta = {
  title: 'Tokens/Typography',
  parameters: {
    a11y: { disable: true },
    docs: {
      description: {
        component: [
          `native-ui ships **two built-in scales**. The provider default is **\`${DEFAULT_TYPOGRAPHY_DENSITY}\`** (editorial / branded) and the \`regular\` scale matches iOS/Android platform metrics exactly. Pick a scale via \`<NativeUIProvider config={{ typography: 'regular' | 'compact' }}>\` or pass a fully-formed \`Typography\` object for full control.`,
          '',
          '### Scales',
          '- **`compact` (default)** - editorial scale: hero=48, h1=32, h2=26, h3=21, body=15, caption=11. Tighter line-heights and larger displays.',
          '- **`regular`** - iOS-native metrics (17px body, 28px h1, matching Apple HIG).',
          '',
          '### Default font family',
          "- The provider defaults `fontFamilies` to `spaceGroteskFontFamilies` - the branded Space Grotesk family.",
          "- Your app must load the Space Grotesk TTFs (e.g. `@expo-google-fonts/space-grotesk`).",
          "- Pass `fontFamilies={systemFontFamilies}` on the provider to fall back to San Francisco (iOS) / Roboto (Android).",
          '',
          '### Import',
          '```tsx',
          "import {",
          "  NativeUIProvider,",
          "  compactTypography,",
          "  spaceGroteskFontFamilies,",
          "  systemFontFamilies,",
          "} from '@polprog/native-ui';",
          '',
          '// Opt out of the default compact scale:',
          "<NativeUIProvider config={{ typography: 'regular', fontFamilies: systemFontFamilies }}>",
          '```',
        ].join('\n'),
      },
    },
  },
};

export default meta;

const displayVariants: TypographyVariant[] = ['displayLarge', 'displayMedium'];
const headingVariants: TypographyVariant[] = ['h1', 'h2', 'h3'];
const bodyVariants: TypographyVariant[] = ['bodyLarge', 'body', 'bodySmall'];
const labelVariants: TypographyVariant[] = ['label', 'labelSmall', 'caption'];
const monoVariants: TypographyVariant[] = ['mono', 'monoLarge', 'monoSmall'];

export const FullScale: StoryObj = {
  name: 'Full Typography Scale',
  render: () => {
    const { colors } = useTheme();

    return (
    <View>
      <RNText style={{ fontSize: 20, fontWeight: '700', color: colors.textPrimary, marginBottom: 20 }}>Display</RNText>
      {displayVariants.map((v) => (
        <TypographySample key={v} variant={v} style={typography[v]} />
      ))}
      <RNText style={{ fontSize: 20, fontWeight: '700', color: colors.textPrimary, marginBottom: 20, marginTop: 12 }}>Headings</RNText>
      {headingVariants.map((v) => (
        <TypographySample key={v} variant={v} style={typography[v]} />
      ))}
      <RNText style={{ fontSize: 20, fontWeight: '700', color: colors.textPrimary, marginBottom: 20, marginTop: 12 }}>Body</RNText>
      {bodyVariants.map((v) => (
        <TypographySample key={v} variant={v} style={typography[v]} />
      ))}
      <RNText style={{ fontSize: 20, fontWeight: '700', color: colors.textPrimary, marginBottom: 20, marginTop: 12 }}>Labels &amp; Caption</RNText>
      {labelVariants.map((v) => (
        <TypographySample key={v} variant={v} style={typography[v]} />
      ))}
      <RNText style={{ fontSize: 20, fontWeight: '700', color: colors.textPrimary, marginBottom: 20, marginTop: 12 }}>Monospace / Tabular</RNText>
      {monoVariants.map((v) => (
        <TypographySample key={v} variant={v} style={typography[v]} />
      ))}
    </View>
    );
  },
};

export const FontScaling: StoryObj = {
  name: 'Font Scale Accessibility',
  render: () => {
    const { colors } = useTheme();

    return (
    <View>
      <RNText style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 24 }}>
        native-ui supports 3 font scale levels for accessibility. Each level adds pixels to the base font size.
      </RNText>
      {Object.entries(FONT_SCALE).map(([level, adjustment]) => (
        <View key={level} style={{ marginBottom: 24, padding: 16, backgroundColor: colors.surfaceSecondary, borderRadius: 10 }}>
          <RNText style={{ fontSize: 12, fontWeight: '600', color: colors.primary, marginBottom: 8, fontFamily: 'monospace' }}>
            fontSize: "{level}" (+{adjustment}px)
          </RNText>
          <RNText style={{ fontSize: typography.body.fontSize + adjustment, lineHeight: typography.body.lineHeight + adjustment, color: colors.textPrimary }}>
            This is body text at {level} scale ({typography.body.fontSize + adjustment}px)
          </RNText>
          <RNText style={{ fontSize: typography.h2.fontSize + adjustment, fontWeight: '600', marginTop: 8, color: colors.textPrimary }}>
            This is h2 at {level} scale ({typography.h2.fontSize + adjustment}px)
          </RNText>
        </View>
      ))}
    </View>
    );
  },
};

export const TypeComparison: StoryObj = {
  name: 'Side-by-Side Comparison',
  render: () => {
    const { colors } = useTheme();

    return (
    <View>
      <RNText style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 16 }}>
        Compare all typography variants at a glance. Each row shows the variant name, specs, and a text sample.
      </RNText>
      <View style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 10, overflow: 'hidden' }}>
        <View style={{ flexDirection: 'row', backgroundColor: colors.surfaceSecondary, paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border }}>
          <RNText style={{ width: 140, fontSize: 12, fontWeight: '600', color: colors.textSecondary }}>Variant</RNText>
          <RNText style={{ width: 60, fontSize: 12, fontWeight: '600', color: colors.textSecondary }}>Size</RNText>
          <RNText style={{ width: 60, fontSize: 12, fontWeight: '600', color: colors.textSecondary }}>Line</RNText>
          <RNText style={{ width: 60, fontSize: 12, fontWeight: '600', color: colors.textSecondary }}>Weight</RNText>
          <RNText style={{ flex: 1, fontSize: 12, fontWeight: '600', color: colors.textSecondary }}>Preview</RNText>
        </View>
        {(Object.keys(typography) as TypographyVariant[])
          .filter((k) => !['amount', 'amountLarge', 'amountSmall'].includes(k))
          .map((variant, i) => {
            const t = typography[variant];

            return (
              <View
                key={variant}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  backgroundColor: i % 2 === 0 ? colors.surface : colors.surfaceSecondary,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.divider,
                }}
              >
                <RNText style={{ width: 140, fontSize: 13, fontWeight: '500', color: colors.textPrimary, fontFamily: 'monospace' }}>
                  {variant}
                </RNText>
                <RNText style={{ width: 60, fontSize: 12, color: colors.textSecondary }}>{t.fontSize}px</RNText>
                <RNText style={{ width: 60, fontSize: 12, color: colors.textSecondary }}>{t.lineHeight}px</RNText>
                <RNText style={{ width: 60, fontSize: 12, color: colors.textSecondary }}>{t.fontWeight}</RNText>
                <RNText
                  style={{ flex: 1, ...t, color: colors.textPrimary }}
                  numberOfLines={1}
                >
                  Abc 123
                </RNText>
              </View>
            );
          })}
      </View>
    </View>
    );
  },
};

const CompactVsRegularRow = ({ variant }: { variant: TypographyVariant }) => {
  const { colors } = useTheme();
  const reg = typography[variant];
  const com = compactScale[variant];
  const delta = com.fontSize - reg.fontSize;
  const deltaLabel = delta === 0 ? '=' : delta > 0 ? `+${delta}` : `${delta}`;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.divider,
      }}
    >
      <RNText style={{ width: 130, fontSize: 12, fontFamily: 'monospace', color: colors.textPrimary }}>{variant}</RNText>
      <View style={{ flex: 1 }}>
        <RNText style={{ fontSize: reg.fontSize, lineHeight: reg.lineHeight, fontWeight: reg.fontWeight as any, color: colors.textPrimary }} numberOfLines={1}>
          Regular - {reg.fontSize}/{reg.lineHeight}
        </RNText>
      </View>
      <View style={{ flex: 1 }}>
        <RNText style={{ fontSize: com.fontSize, lineHeight: com.lineHeight, fontWeight: com.fontWeight as any, color: colors.primary }} numberOfLines={1}>
          Compact - {com.fontSize}/{com.lineHeight}
        </RNText>
      </View>
      <RNText style={{ width: 50, fontSize: 11, fontFamily: 'monospace', color: delta === 0 ? colors.textTertiary : delta > 0 ? colors.success : colors.error, textAlign: 'right' }}>
        Δ {deltaLabel}
      </RNText>
    </View>
  );
};

export const CompactVsRegular: StoryObj = {
  name: 'Compact (default) vs Regular',
  parameters: {
    docs: {
      description: {
        story:
          'Side-by-side comparison of the two built-in scales. The provider default is `compact` (editorial). Opt out with `<NativeUIProvider config={{ typography: "regular" }}>` for the iOS-native scale.',
      },
    },
  },
  render: () => {
    const { colors } = useTheme();

    return (
    <View>
      <RNText style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 16 }}>
        Left: `regular` (iOS-native). Right: `compact` (default). Δ is the font-size delta.
      </RNText>
      <View style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 10, overflow: 'hidden' }}>
        {(['displayLarge', 'displayMedium', 'h1', 'h2', 'h3', 'heading', 'title', 'bodyLarge', 'body', 'bodySmall', 'label', 'labelSmall', 'caption', 'overline'] as TypographyVariant[]).map((v) => (
          <CompactVsRegularRow key={v} variant={v} />
        ))}
      </View>
    </View>
    );
  },
};

export const DefaultFontFamilies: StoryObj = {
  name: 'Default font families',
  parameters: {
    docs: {
      description: {
        story:
          '`NativeUIProvider` defaults `fontFamilies` to `spaceGroteskFontFamilies`. Apps that do not load those TTFs can pass `fontFamilies={systemFontFamilies}` to fall back to the platform default.',
      },
    },
  },
  render: () => {
    const { colors } = useTheme();

    return (
    <View style={{ gap: 12 }}>
      <View style={{ padding: 12, borderWidth: 1, borderColor: colors.border, borderRadius: 10 }}>
        <RNText style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 6, fontFamily: 'monospace' }}>
          spaceGroteskFontFamilies (provider default)
        </RNText>
        {(Object.keys(spaceGroteskFontFamilies) as Array<keyof typeof spaceGroteskFontFamilies>).map((w) => (
          <RNText key={w} style={{ fontSize: 13 }}>
            <RNText style={{ fontFamily: 'monospace', color: colors.primary }}>{w}</RNText>
            {' → '}
            <RNText style={{ color: colors.textPrimary }}>{spaceGroteskFontFamilies[w]}</RNText>
          </RNText>
        ))}
      </View>
      <View style={{ padding: 12, borderWidth: 1, borderColor: colors.border, borderRadius: 10 }}>
        <RNText style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 6, fontFamily: 'monospace' }}>
          systemFontFamilies (opt-out)
        </RNText>
        {(Object.keys(systemFontFamilies) as Array<keyof typeof systemFontFamilies>).map((w) => (
          <RNText key={w} style={{ fontSize: 13 }}>
            <RNText style={{ fontFamily: 'monospace', color: colors.primary }}>{w}</RNText>
            {' → '}
            <RNText style={{ color: colors.textPrimary }}>{systemFontFamilies[w] ?? '(platform default)'}</RNText>
          </RNText>
        ))}
      </View>
    </View>
    );
  },
};
