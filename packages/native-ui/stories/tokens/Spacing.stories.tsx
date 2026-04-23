import React from 'react';
import { View, Text as RNText } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { borderRadius, duration, iconSize, opacity, spacing, zIndex } from '../../src/tokens/spacing';
import { useTheme } from '../../src/theme/ThemeProvider';
import { Box } from '../../src/primitives/Box';
import { VStack } from '../../src/primitives/Stack';

const SpacingBar = ({ name, value }: { name: string; value: number }) => {
  const theme = useTheme();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
      <RNText style={{ width: 50, fontSize: 13, fontWeight: '500', color: theme.colors.textPrimary, fontFamily: 'monospace' }}>
        {name}
      </RNText>
      <RNText style={{ width: 50, fontSize: 12, color: theme.colors.textSecondary, textAlign: 'right', marginRight: 12 }}>
        {value}px
      </RNText>
      <View
        style={{
          width: value * 4,
          height: 24,
          backgroundColor: theme.colors.primary,
          borderRadius: 4,
          opacity: 0.8,
          minWidth: 4,
        }}
      />
    </View>
  );
};

const RadiusPreview = ({ name, value }: { name: string; value: number }) => {
  const theme = useTheme();

  return (
    <View style={{ alignItems: 'center', marginRight: 20, marginBottom: 16 }}>
      <View
        style={{
          width: 64,
          height: 64,
          backgroundColor: theme.colors.primaryLight,
          borderWidth: 2,
          borderColor: theme.colors.primary,
          borderRadius: Math.min(value, 32),
          marginBottom: 8,
        }}
      />
      <RNText style={{ fontSize: 13, fontWeight: '600', color: theme.colors.textPrimary, fontFamily: 'monospace' }}>{name}</RNText>
      <RNText style={{ fontSize: 11, color: theme.colors.textSecondary }}>{value === 9999 ? '9999 (full)' : `${value}px`}</RNText>
    </View>
  );
};

const TokenTable = ({ title, data }: { title: string; data: Record<string, number | string> }) => {
  const theme = useTheme();

  return (
    <View style={{ marginBottom: 32 }}>
      <RNText style={{ fontSize: 18, fontWeight: '700', marginBottom: 12, color: theme.colors.textPrimary }}>{title}</RNText>
      <View style={{ borderWidth: 1, borderColor: theme.colors.border, borderRadius: 10, overflow: 'hidden' }}>
        {Object.entries(data).map(([key, val], i) => (
          <View
            key={key}
            style={{
              flexDirection: 'row',
              paddingHorizontal: 16,
              paddingVertical: 10,
              backgroundColor: i % 2 === 0 ? theme.colors.surface : theme.colors.surfaceSecondary,
              borderBottomWidth: 1,
              borderBottomColor: theme.colors.divider,
            }}
          >
            <RNText style={{ flex: 1, fontSize: 13, fontWeight: '500', color: theme.colors.textPrimary, fontFamily: 'monospace' }}>
              {key}
            </RNText>
            <RNText style={{ fontSize: 13, color: theme.colors.textSecondary, fontFamily: 'monospace' }}>
              {typeof val === 'number' ? val : String(val)}
            </RNText>
          </View>
        ))}
      </View>
    </View>
  );
};

const meta: Meta = {
  title: 'Tokens/Spacing',
  parameters: {
    docs: {
      description: {
        component: [
          'native-ui uses a 4px-base spacing scale with 11 named values from `2xs` (2px) to `6xl` (64px).',
          '',
          '### Usage',
          '```tsx',
          "import { Box, VStack } from '@polprog/native-ui';",
          '',
          '// Token-based props',
          '<Box p="lg" m="md">  {/* 16px padding, 12px margin */}',
          '<VStack gap="sm">   {/* 8px gap between children */}',
          '',
          '// Direct access',
          "import { spacing } from '@polprog/native-ui';",
          'style={{ padding: spacing.lg }}  // 16px',
          '```',
        ].join('\n'),
      },
    },
  },
};

export default meta;

export const SpacingScale: StoryObj = {
  name: 'Spacing Scale',
  render: () => {
    const theme = useTheme();

    return (
      <View>
        <RNText style={{ fontSize: 14, color: theme.colors.textSecondary, marginBottom: 20 }}>
          Visual representation of the 11-step spacing scale. Bar width is 4× the token value for visibility.
        </RNText>
        {(Object.entries(spacing) as [string, number][]).map(([name, value]) => (
          <SpacingBar key={name} name={name} value={value} />
        ))}
      </View>
    );
  },
};

export const BorderRadiusScale: StoryObj = {
  name: 'Border Radius',
  render: () => {
    const theme = useTheme();

    return (
      <View>
        <RNText style={{ fontSize: 14, color: theme.colors.textSecondary, marginBottom: 20 }}>
          Border radius tokens from subtle rounding to fully circular.
        </RNText>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {(Object.entries(borderRadius) as [string, number][]).map(([name, value]) => (
            <RadiusPreview key={name} name={name} value={value} />
          ))}
        </View>
      </View>
    );
  },
};

export const IconSizes: StoryObj = {
  name: 'Icon Sizes',
  render: () => {
    const theme = useTheme();

    return (
      <View>
        <RNText style={{ fontSize: 14, color: theme.colors.textSecondary, marginBottom: 20 }}>
          Standardized icon sizes for consistent visual weight.
        </RNText>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 24 }}>
          {(Object.entries(iconSize) as [string, number][]).map(([name, value]) => (
            <View key={name} style={{ alignItems: 'center' }}>
              <View
                style={{
                  width: value,
                  height: value,
                  backgroundColor: theme.colors.primary,
                  borderRadius: value / 4,
                  marginBottom: 8,
                }}
              />
              <RNText style={{ fontSize: 13, fontWeight: '600', fontFamily: 'monospace', color: theme.colors.textPrimary }}>{name}</RNText>
              <RNText style={{ fontSize: 11, color: theme.colors.textSecondary }}>{value}px</RNText>
            </View>
          ))}
        </View>
      </View>
    );
  },
};

export const AllTokens: StoryObj = {
  name: 'All Spacing Tokens',
  render: () => (
    <View>
      <TokenTable title="Spacing" data={spacing} />
      <TokenTable title="Border Radius" data={borderRadius} />
      <TokenTable title="Icon Size" data={iconSize} />
      <TokenTable title="Duration (ms)" data={duration} />
      <TokenTable title="Z-Index" data={zIndex} />
      <TokenTable title="Opacity" data={opacity} />
    </View>
  ),
};
