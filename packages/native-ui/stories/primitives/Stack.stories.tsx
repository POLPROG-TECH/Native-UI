import React from 'react';
import { View, Text as RNText } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Box } from '../../src/primitives/Box';
import { HStack, VStack } from '../../src/primitives/Stack';
import { useTheme } from '../../src/theme/ThemeProvider';

const Placeholder = ({ label, color }: { label: string; color?: string }) => {
  const theme = useTheme();
  const bg = color ?? theme.colors.primaryLight;

  return (
    <View style={{ backgroundColor: bg, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 }}>
      <RNText style={{ color: theme.colors.primary, fontSize: 13, fontWeight: '600' }}>{label}</RNText>
    </View>
  );
};

const meta: Meta = {
  title: 'Primitives/Stack',
  parameters: {
    docs: {
      description: {
        component: [
          'Vertical and horizontal stack primitives with token-based gap spacing.',
          '',
          '- **VStack** - `flexDirection: column` with gap',
          '- **HStack** - `flexDirection: row` with gap, default `alignItems: center`',
          '',
          '### Import',
          '```tsx',
          "import { VStack, HStack } from '@polprog/native-ui';",
          '```',
          '',
          '### Usage',
          '```tsx',
          '<VStack gap="md">',
          '  <Text>First</Text>',
          '  <Text>Second</Text>',
          '</VStack>',
          '',
          '<HStack gap="sm" justify="space-between">',
          '  <Button title="Cancel" variant="ghost" />',
          '  <Button title="Save" />',
          '</HStack>',
          '```',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    gap: { control: 'select', options: ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] },
    align: { control: 'select', options: ['flex-start', 'flex-end', 'center', 'stretch', 'baseline'] },
    justify: { control: 'select', options: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'] },
    wrap: { control: 'boolean' },
  },
};

export default meta;
type StoryType = StoryObj;

export const Playground: StoryType = {
  args: { gap: 'md' },
  render: (args: any) => (
    <VStack gap={args.gap}>
      <Placeholder label="Item 1" />
      <Placeholder label="Item 2" />
      <Placeholder label="Item 3" />
    </VStack>
  ),
};

export const VStackBasic: StoryObj = {
  name: 'VStack - Basic',
  render: () => {
    const theme = useTheme();

    return (
      <VStack gap="md" style={{ maxWidth: 300 }}>
        <Placeholder label="Item 1" />
        <Placeholder label="Item 2" color={theme.colors.success} />
        <Placeholder label="Item 3" color={theme.colors.warning} />
      </VStack>
    );
  },
};

export const VStackGaps: StoryObj = {
  name: 'VStack - Gap Sizes',
  render: () => {
    const theme = useTheme();

    return (
    <HStack gap="3xl" align="flex-start" wrap>
      {(['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const).map((gap) => (
        <VStack key={gap} gap={gap}>
          <RNText style={{ fontSize: 12, fontWeight: '600', color: theme.colors.primary, marginBottom: 4, fontFamily: 'monospace' }}>gap="{gap}"</RNText>
          <Placeholder label="A" />
          <Placeholder label="B" />
          <Placeholder label="C" />
        </VStack>
      ))}
    </HStack>
    );
  },
};

export const HStackBasic: StoryObj = {
  name: 'HStack - Basic',
  render: () => {
    const theme = useTheme();

    return (
      <HStack gap="md">
        <Placeholder label="Left" />
        <Placeholder label="Center" color={theme.colors.success} />
        <Placeholder label="Right" color={theme.colors.warning} />
      </HStack>
    );
  },
};

export const HStackJustify: StoryObj = {
  name: 'HStack - Justify',
  render: () => {
    const theme = useTheme();

    return (
    <VStack gap="lg" style={{ maxWidth: 500 }}>
      {(['flex-start', 'center', 'flex-end', 'space-between', 'space-around'] as const).map((justify) => (
        <Box key={justify} p="sm" bg="surfaceSecondary" radius="sm">
          <RNText style={{ fontSize: 11, color: theme.colors.textSecondary, marginBottom: 8, fontFamily: 'monospace' }}>justify="{justify}"</RNText>
          <HStack gap="sm" justify={justify}>
            <Placeholder label="A" />
            <Placeholder label="B" color={theme.colors.success} />
            <Placeholder label="C" color={theme.colors.warning} />
          </HStack>
        </Box>
      ))}
    </VStack>
    );
  },
};

export const HStackAlign: StoryObj = {
  name: 'HStack - Align',
  render: () => {
    const theme = useTheme();

    return (
    <HStack gap="xl" align="flex-start" wrap>
      {(['flex-start', 'center', 'flex-end', 'stretch'] as const).map((align) => (
        <Box key={align} p="sm" bg="surfaceSecondary" radius="sm" style={{ height: 120 }}>
          <RNText style={{ fontSize: 11, color: theme.colors.textSecondary, marginBottom: 8, fontFamily: 'monospace' }}>align="{align}"</RNText>
          <HStack gap="sm" align={align} style={{ flex: 1 }}>
            <View style={{ backgroundColor: theme.colors.primary, borderRadius: 6, padding: 8, height: 30 }}>
              <RNText style={{ color: theme.colors.textInverse, fontSize: 12 }}>S</RNText>
            </View>
            <View style={{ backgroundColor: theme.colors.success, borderRadius: 6, padding: 8, height: 50 }}>
              <RNText style={{ color: theme.colors.textInverse, fontSize: 12 }}>M</RNText>
            </View>
            <View style={{ backgroundColor: theme.colors.warning, borderRadius: 6, padding: 8, height: 70 }}>
              <RNText style={{ color: theme.colors.textInverse, fontSize: 12 }}>L</RNText>
            </View>
          </HStack>
        </Box>
      ))}
    </HStack>
    );
  },
};

export const NestedStacks: StoryObj = {
  name: 'Nested Stacks',
  render: () => {
    const theme = useTheme();

    return (
    <Box p="lg" bg="surface" radius="lg" elevation="sm" style={{ maxWidth: 400 }}>
      <VStack gap="md">
        <RNText style={{ fontSize: 18, fontWeight: '700', color: theme.colors.textPrimary }}>Form Layout</RNText>
        <Box p="md" bg="surfaceSecondary" radius="md">
          <RNText style={{ fontSize: 14, color: theme.colors.textSecondary }}>Input placeholder</RNText>
        </Box>
        <Box p="md" bg="surfaceSecondary" radius="md">
          <RNText style={{ fontSize: 14, color: theme.colors.textSecondary }}>Input placeholder</RNText>
        </Box>
        <HStack gap="sm" justify="flex-end">
          <Placeholder label="Cancel" color={theme.colors.textSecondary} />
          <Placeholder label="Submit" />
        </HStack>
      </VStack>
    </Box>
    );
  },
};
