import React from 'react';
import { Text as RNText, View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import type { ThemePreset } from '../../src/tokens/colors';
import { getContrastText, resolveColorScheme, THEME_PRESETS } from '../../src/tokens/colors';
import { useTheme } from '../../src/theme/ThemeProvider';

const ColorSwatch = ({ name, value }: { name: string; value: string }) => {
  const theme = useTheme();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 10,
          backgroundColor: value,
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.1)',
          marginRight: 12,
        }}
      />
      <View style={{ flex: 1 }}>
        <RNText style={{ fontSize: 14, fontWeight: '600', color: theme.colors.textPrimary }}>
          {name}
        </RNText>
        <RNText
          style={{ fontSize: 12, color: theme.colors.textSecondary, fontFamily: 'monospace' }}
        >
          {value}
        </RNText>
      </View>
    </View>
  );
};

const ColorSection = ({ title, colors }: { title: string; colors: [string, string][] }) => {
  const theme = useTheme();

  return (
    <View style={{ marginBottom: 32 }}>
      <RNText
        style={{
          fontSize: 18,
          fontWeight: '700',
          marginBottom: 16,
          color: theme.colors.textPrimary,
        }}
      >
        {title}
      </RNText>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
        {colors.map(([name, value]) => (
          <View key={name} style={{ width: 200 }}>
            <ColorSwatch name={name} value={value} />
          </View>
        ))}
      </View>
    </View>
  );
};

const PresetCard = ({ preset, mode }: { preset: ThemePreset; mode: 'light' | 'dark' }) => {
  const scheme = resolveColorScheme({
    isDark: mode === 'dark',
    preset,
    fontColor: 'default',
    highContrast: false,
    customAccent: null,
  });

  return (
    <View
      style={{
        backgroundColor: scheme.background,
        borderRadius: 14,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: scheme.border,
        minWidth: 320,
      }}
    >
      <RNText
        style={{ fontSize: 16, fontWeight: '700', color: scheme.textPrimary, marginBottom: 12 }}
      >
        {preset} ({mode})
      </RNText>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {(['primary', 'success', 'warning', 'error', 'info'] as const).map((key) => (
          <View
            key={key}
            style={{
              backgroundColor: scheme[key],
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 6,
            }}
          >
            <RNText
              style={{ fontSize: 12, fontWeight: '600', color: getContrastText(scheme[key]) }}
            >
              {key}
            </RNText>
          </View>
        ))}
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
        {(['background', 'surface', 'surfaceElevated', 'surfaceSecondary'] as const).map((key) => (
          <View
            key={key}
            style={{
              backgroundColor: scheme[key],
              borderRadius: 6,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderWidth: 1,
              borderColor: scheme.border,
            }}
          >
            <RNText style={{ fontSize: 11, color: scheme.textSecondary }}>{key}</RNText>
          </View>
        ))}
      </View>
      <View style={{ marginTop: 12 }}>
        <RNText style={{ fontSize: 14, color: scheme.textPrimary }}>Primary text</RNText>
        <RNText style={{ fontSize: 13, color: scheme.textSecondary }}>Secondary text</RNText>
        <RNText style={{ fontSize: 12, color: scheme.textTertiary }}>Tertiary text</RNText>
      </View>
    </View>
  );
};

const meta: Meta = {
  title: 'Tokens/Colors',
  parameters: {
    docs: {
      description: {
        component: [
          'native-ui uses a semantic color system with 7 theme presets, each providing light and dark variants.',
          '',
          '### Color categories',
          '- **Surfaces** - background, surface, surfaceElevated, surfaceSecondary',
          '- **Text** - textPrimary, textSecondary, textTertiary, textInverse',
          '- **Accent** - primary, primaryLight, primaryDark',
          '- **Semantic** - success, warning, error, info (+ light variants)',
          '- **System** - border, borderLight, divider, shadow, overlay',
          '- **Chart** - 10-color palette for data visualization',
          '',
          '### Usage',
          '```tsx',
          "import { useColors } from '@polprog/native-ui';",
          '',
          'const colors = useColors();',
          '<View style={{ backgroundColor: colors.surface }}>',
          '  <Text style={{ color: colors.textPrimary }}>Hello</Text>',
          '</View>',
          '```',
        ].join('\n'),
      },
    },
  },
};

export default meta;

export const LightTheme: StoryObj = {
  name: 'Light Theme (Default)',
  render: () => {
    const scheme = resolveColorScheme({
      isDark: false,
      preset: 'default',
      fontColor: 'default',
      highContrast: false,
      customAccent: null,
    });
    const entries = Object.entries(scheme).filter(([_, v]) => typeof v === 'string') as [
      string,
      string,
    ][];

    const surfaces = entries.filter(([k]) => k.startsWith('surface') || k === 'background');
    const text = entries.filter(([k]) => k.startsWith('text'));
    const accent = entries.filter(([k]) => k.startsWith('primary'));
    const semantic = entries.filter(([k]) =>
      [
        'success',
        'successLight',
        'warning',
        'warningLight',
        'error',
        'errorLight',
        'info',
      ].includes(k),
    );
    const system = entries.filter(([k]) =>
      ['border', 'borderLight', 'divider', 'shadow', 'overlay'].includes(k),
    );

    return (
      <View>
        <ColorSection title="Surfaces" colors={surfaces} />
        <ColorSection title="Text" colors={text} />
        <ColorSection title="Accent" colors={accent} />
        <ColorSection title="Semantic" colors={semantic} />
        <ColorSection title="System" colors={system} />
      </View>
    );
  },
};

export const DarkTheme: StoryObj = {
  name: 'Dark Theme (Default)',
  render: () => {
    const scheme = resolveColorScheme({
      isDark: true,
      preset: 'default',
      fontColor: 'default',
      highContrast: false,
      customAccent: null,
    });
    const entries = Object.entries(scheme).filter(([_, v]) => typeof v === 'string') as [
      string,
      string,
    ][];

    const surfaces = entries.filter(([k]) => k.startsWith('surface') || k === 'background');
    const text = entries.filter(([k]) => k.startsWith('text'));
    const accent = entries.filter(([k]) => k.startsWith('primary'));
    const semantic = entries.filter(([k]) =>
      [
        'success',
        'successLight',
        'warning',
        'warningLight',
        'error',
        'errorLight',
        'info',
      ].includes(k),
    );

    return (
      <View style={{ backgroundColor: scheme.background, padding: 16, borderRadius: 14 }}>
        <ColorSection title="Surfaces" colors={surfaces} />
        <ColorSection title="Text" colors={text} />
        <ColorSection title="Accent" colors={accent} />
        <ColorSection title="Semantic" colors={semantic} />
      </View>
    );
  },
};

export const AllPresets: StoryObj = {
  name: 'All Theme Presets',
  render: () => {
    const theme = useTheme();

    return (
      <View>
        <RNText style={{ fontSize: 14, color: theme.colors.textSecondary, marginBottom: 24 }}>
          native-ui ships with 7 color presets. Each preset defines both light and dark variants
          with unique accent, surface, and text colors.
        </RNText>
        {THEME_PRESETS.map((p) => (
          <View key={p.id} style={{ marginBottom: 24 }}>
            <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap' }}>
              <View style={{ flex: 1, minWidth: 320 }}>
                <PresetCard preset={p.id} mode="light" />
              </View>
              <View style={{ flex: 1, minWidth: 320 }}>
                <PresetCard preset={p.id} mode="dark" />
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  },
};

export const ChartColors: StoryObj = {
  name: 'Chart Palette',
  render: () => {
    const theme = useTheme();
    const light = resolveColorScheme({
      isDark: false,
      preset: 'default',
      fontColor: 'default',
      highContrast: false,
      customAccent: null,
    });

    return (
      <View>
        <RNText style={{ fontSize: 14, color: theme.colors.textSecondary, marginBottom: 16 }}>
          10-color palette designed for data visualization. Optimized for contrast and colorblind
          accessibility.
        </RNText>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {light.chart.map((color, i) => (
            <View key={i} style={{ alignItems: 'center' }}>
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 10,
                  backgroundColor: color,
                  marginBottom: 4,
                }}
              />
              <RNText
                style={{ fontSize: 10, color: theme.colors.textSecondary, fontFamily: 'monospace' }}
              >
                {color}
              </RNText>
              <RNText style={{ fontSize: 10, color: theme.colors.textTertiary }}>chart[{i}]</RNText>
            </View>
          ))}
        </View>
      </View>
    );
  },
};

export const ContrastTextDemo: StoryObj = {
  name: 'Contrast Text',
  render: () => {
    const theme = useTheme();
    const testColors = [
      '#3B82F6',
      '#EF4444',
      '#10B981',
      '#F59E0B',
      '#8B5CF6',
      '#EC4899',
      '#000000',
      '#FFFFFF',
      '#6B7280',
      '#1F2937',
    ];

    return (
      <View>
        <RNText style={{ fontSize: 14, color: theme.colors.textSecondary, marginBottom: 16 }}>
          The <RNText style={{ fontFamily: 'monospace' }}>getContrastText()</RNText> utility
          automatically returns a light or dark text color that ensures WCAG AA contrast against any
          background.
        </RNText>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {testColors.map((bg) => (
            <View
              key={bg}
              style={{
                backgroundColor: bg,
                borderRadius: 10,
                padding: 16,
                width: 120,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,0.1)',
              }}
            >
              <RNText style={{ color: getContrastText(bg), fontWeight: '600', fontSize: 13 }}>
                Text
              </RNText>
              <RNText
                style={{
                  color: getContrastText(bg),
                  fontSize: 10,
                  fontFamily: 'monospace',
                  marginTop: 4,
                }}
              >
                {bg}
              </RNText>
            </View>
          ))}
        </View>
      </View>
    );
  },
};
