import React from 'react';
import { View, Text as RNText } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { defaultSemanticColors, defaultSemanticSpacing, defaultSemanticTypography } from '../../src/tokens/semantic';
import { resolveColorScheme } from '../../src/tokens/colors';
import { spacing } from '../../src/tokens/spacing';
import { typography } from '../../src/tokens/typography';
import { useTheme, useSemantic } from '../../src/theme/ThemeProvider';
import type { SemanticColorTokens, SemanticSpacingTokens, SemanticTypographyTokens } from '../../src/tokens/semantic';

const scheme = resolveColorScheme({
  isDark: false,
  preset: 'default',
  fontColor: 'default',
  highContrast: false,
  customAccent: null,
});

// ─── Color Mapping Table ───────────────────────────────────────
const ColorRow = ({ semantic, primitive }: { semantic: string; primitive: string }) => {
  const theme = useTheme();
  const value = scheme[primitive as keyof typeof scheme];
  const isColor = typeof value === 'string' && value.startsWith('#');

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: theme.colors.border }}>
      {isColor && (
        <View
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            backgroundColor: value,
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.1)',
            marginRight: 12,
          }}
        />
      )}
      <RNText style={{ width: 160, fontSize: 13, fontWeight: '600', color: theme.colors.textPrimary }}>{semantic}</RNText>
      <RNText style={{ fontSize: 13, color: theme.colors.textSecondary, fontFamily: 'monospace' }}>→ {primitive}</RNText>
      {isColor && (
        <RNText style={{ fontSize: 11, color: theme.colors.textTertiary, fontFamily: 'monospace', marginLeft: 8 }}>
          {value}
        </RNText>
      )}
    </View>
  );
};

// ─── Spacing Mapping Table ─────────────────────────────────────
const SpacingRow = ({ semantic, primitive }: { semantic: string; primitive: string }) => {
  const theme = useTheme();
  const px = spacing[primitive as keyof typeof spacing];

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: theme.colors.border }}>
      <View
        style={{
          width: px,
          height: 12,
          borderRadius: 3,
          backgroundColor: theme.colors.primary,
          marginRight: 12,
          minWidth: 4,
        }}
      />
      <RNText style={{ width: 160, fontSize: 13, fontWeight: '600', color: theme.colors.textPrimary }}>{semantic}</RNText>
      <RNText style={{ fontSize: 13, color: theme.colors.textSecondary, fontFamily: 'monospace' }}>→ {primitive}</RNText>
      <RNText style={{ fontSize: 11, color: theme.colors.textTertiary, fontFamily: 'monospace', marginLeft: 8 }}>
        {px}px
      </RNText>
    </View>
  );
};

// ─── Typography Mapping Table ──────────────────────────────────
const TypographyRow = ({ semantic, primitive }: { semantic: string; primitive: string }) => {
  const theme = useTheme();
  const style = typography[primitive as keyof typeof typography];

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: theme.colors.border }}>
      <RNText style={{ width: 160, fontSize: 13, fontWeight: '600', color: theme.colors.textPrimary }}>{semantic}</RNText>
      <RNText style={{ fontSize: 13, color: theme.colors.textSecondary, fontFamily: 'monospace' }}>→ {primitive}</RNText>
      <RNText style={{ fontSize: 11, color: theme.colors.textTertiary, fontFamily: 'monospace', marginLeft: 8 }}>
        {style.fontSize}px / {style.fontWeight}
      </RNText>
    </View>
  );
};

// ─── Section Helper ────────────────────────────────────────────
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const theme = useTheme();
  return (
    <View style={{ marginBottom: 40 }}>
      <RNText style={{ fontSize: 20, fontWeight: '700', color: theme.colors.textPrimary, marginBottom: 16 }}>
        {title}
      </RNText>
      {children}
    </View>
  );
};

const entries = (obj: Record<string, string>) =>
  Object.entries(obj) as [string, string][];

// ─── Story Component ───────────────────────────────────────────
const SemanticTokensStory = () => {
  const theme = useTheme();
  return (
    <View style={{ backgroundColor: theme.colors.surfaceSecondary, padding: 24 }}>
      <RNText style={{ fontSize: 28, fontWeight: '700', color: theme.colors.textPrimary, marginBottom: 8 }}>
        Semantic Tokens
      </RNText>
      <RNText style={{ fontSize: 15, color: theme.colors.textSecondary, marginBottom: 32, maxWidth: 600 }}>
        Intent-based aliases that map to primitive tokens. Override these per-app for branding without
        touching the underlying design primitives.
      </RNText>

      <Section title="Colors">
        {entries(defaultSemanticColors as unknown as Record<string, string>).map(([semantic, primitive]) => (
          <ColorRow key={semantic} semantic={semantic} primitive={primitive} />
        ))}
      </Section>

      <Section title="Spacing">
        {entries(defaultSemanticSpacing as unknown as Record<string, string>).map(([semantic, primitive]) => (
          <SpacingRow key={semantic} semantic={semantic} primitive={primitive} />
        ))}
      </Section>

      <Section title="Typography">
        {entries(defaultSemanticTypography as unknown as Record<string, string>).map(([semantic, primitive]) => (
          <TypographyRow key={semantic} semantic={semantic} primitive={primitive} />
        ))}
      </Section>
    </View>
  );
};

const meta: Meta = {
  title: 'Tokens/SemanticTokens',
  parameters: {
    docs: {
      description: {
        component: [
          'Semantic tokens provide an intent-based abstraction layer on top of primitive tokens.',
          'Consumer apps override these for branding without touching the underlying design primitives.',
          '',
          '### Categories',
          '- **Colors** - action, feedback, surface, text, and border intents',
          '- **Spacing** - page, card, input, and layout gap intents',
          '- **Typography** - page title, section title, body, label, and caption intents',
          '',
          '### Usage',
          '```tsx',
          "import { useSemantic } from '@polprog/native-ui';",
          '',
          'const { colors, spacing, typography } = useSemantic();',
          '// colors.actionPrimary  → "primary"',
          '// spacing.cardPadding   → "lg"',
          '// typography.pageTitle  → "h1"',
          '```',
          '',
          '### Overriding',
          '```tsx',
          '<NativeUIProvider config={{',
          '  semanticTokens: {',
          "    colors: { actionPrimary: 'success' },",
          "    spacing: { cardPadding: 'xl' },",
          '  },',
          '}}>',
          '```',
        ].join('\n'),
      },
    },
  },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <SemanticTokensStory />,
};
