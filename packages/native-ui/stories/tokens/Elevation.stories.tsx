import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Text } from '../../src/primitives/Text';
import { VStack } from '../../src/primitives/Stack';
import type { BorderRadius, Elevation } from '../../src/tokens/spacing';
import { borderRadius } from '../../src/tokens/spacing';
import { useTheme } from '../../src/theme/ThemeProvider';

const meta: Meta = {
  title: 'Tokens/Radius & Elevation',
  parameters: {
    docs: {
      description: {
        component: [
          'Border-radius and elevation tokens used across native-ui. Both scales',
          'are consumed directly by primitives (`Box`, `Card`, overlays) and via',
          '`useTheme().borderRadius` / `useTheme().elevation`.',
          '',
          '### Import',
          '```tsx',
          "import { Box, elevation, borderRadius } from '@polprog/native-ui';",
          '',
          '<Box elevation="md" radius="md">Elevated content</Box>',
          'style={{ ...elevation.lg }}',
          '```',
        ].join('\n'),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const elevationLevels: Array<{ name: Elevation; desc: string }> = [
  { name: 'none', desc: 'No shadow - flat surfaces' },
  { name: 'sm', desc: 'Subtle - cards, inputs' },
  { name: 'md', desc: 'Medium - elevated cards, dropdowns' },
  { name: 'lg', desc: 'Large - modals, floating elements' },
  { name: 'xl', desc: 'Extra large - toasts, popovers' },
];

const radiusKeys = Object.keys(borderRadius) as BorderRadius[];

const ElevationTile = ({ level, desc }: { level: Elevation; desc: string }) => {
  const theme = useTheme();
  const shadow = theme.elevation[level];
  return (
    <View style={{ width: 180 }}>
      <View
        style={[
          {
            height: 96,
            borderRadius: theme.borderRadius.md,
            backgroundColor: theme.colors.surface,
            borderWidth: level === 'none' ? 1 : 0,
            borderColor: theme.colors.border,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 10,
          },
          shadow,
        ]}
      >
        <Text variant="h3" color="primary">
          {level}
        </Text>
      </View>
      <Text variant="label">elevation.{level}</Text>
      <Text variant="caption" color="textSecondary">
        {desc}
      </Text>
    </View>
  );
};

export const ElevationScale: Story = {
  name: 'Elevation Scale',
  render: () => (
    <VStack gap="md">
      <Text variant="body" color="textSecondary">
        Shadow intensity increases from `none` to `xl`. On web, shadows render as CSS box-shadow.
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 20 }}>
        {elevationLevels.map((level) => (
          <ElevationTile key={level.name} level={level.name} desc={level.desc} />
        ))}
      </View>
    </VStack>
  ),
};

export const ElevationOnDark: Story = {
  name: 'Elevation on Dark Surfaces',
  parameters: {
    docs: {
      description: {
        story:
          'Toggle the theme toolbar to Dark to preview the same scale against a dark surface. Shadows become visually weaker in dark mode; prefer surface-color stepping (e.g. `surface` vs `surfaceSecondary`) to communicate elevation.',
      },
    },
  },
  render: () => {
    const ElevationRow = () => {
      const theme = useTheme();
      return (
        <View
          style={{
            backgroundColor: theme.colors.surfaceSecondary,
            padding: 24,
            borderRadius: theme.borderRadius.lg,
          }}
        >
          <VStack gap="md">
            <Text variant="body" color="textSecondary">
              On darker surfaces, shadows fall off quickly. Combine with a border or a surface-tint
              step.
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 20 }}>
              {elevationLevels.map((level) => (
                <ElevationTile key={level.name} level={level.name} desc={level.desc} />
              ))}
            </View>
          </VStack>
        </View>
      );
    };
    return <ElevationRow />;
  },
};

export const RadiusScale: Story = {
  name: 'Border Radius Scale',
  render: () => {
    const RadiusRow = () => {
      const theme = useTheme();
      return (
        <VStack gap="md">
          <Text variant="body" color="textSecondary">
            The radius scale maps to semantic token keys. Components default to `md` unless stated
            otherwise.
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
            {radiusKeys.map((key) => (
              <View key={String(key)} style={{ alignItems: 'center', width: 120 }}>
                <View
                  style={{
                    width: 96,
                    height: 96,
                    backgroundColor: theme.colors.primaryLight,
                    borderRadius: theme.borderRadius[key],
                    borderWidth: 1,
                    borderColor: theme.colors.primary,
                    marginBottom: 8,
                  }}
                />
                <Text variant="label">{String(key)}</Text>
                <Text variant="caption" color="textSecondary">
                  {typeof theme.borderRadius[key] === 'number'
                    ? `${theme.borderRadius[key]}px`
                    : String(theme.borderRadius[key])}
                </Text>
              </View>
            ))}
          </View>
        </VStack>
      );
    };
    return <RadiusRow />;
  },
};
