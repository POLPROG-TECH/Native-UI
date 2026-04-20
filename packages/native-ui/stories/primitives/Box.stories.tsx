import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Box } from '../../src/primitives/Box';
import { Text } from '../../src/primitives/Text';
import type { BoxProps } from '../../src/primitives/Box';

const meta: Meta<BoxProps> = {
  title: 'Primitives/Box',
  component: Box,
  parameters: {
    docs: {
      description: {
        component: [
          'Low-level layout primitive - a View wrapper accepting token-based props for consistent styling.',
          '',
          '### When to use',
          '- As a container for any layout that needs token-based spacing, colors, or elevation',
          '- When you need a quick wrapper with padding, background, or border radius',
          '- As the building block for custom composed components',
          '',
          '### When NOT to use',
          '- For vertical stacks with gap → use `VStack`',
          '- For horizontal rows with gap → use `HStack`',
          '- When you just need a View with no token props → use plain `View`',
          '',
          '### Import',
          '```tsx',
          "import { Box } from '@polprog/native-ui';",
          '```',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    p: { control: 'select', options: ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'], description: 'Uniform padding (spacing token)' },
    px: { control: 'select', options: ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'], description: 'Horizontal padding' },
    py: { control: 'select', options: ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'], description: 'Vertical padding' },
    m: { control: 'select', options: ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'], description: 'Uniform margin' },
    bg: { control: 'select', options: ['surface', 'surfaceSecondary', 'primary', 'primaryLight', 'error', 'errorLight', 'success', 'successLight'], description: 'Background color token' },
    radius: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', 'full'], description: 'Border radius token' },
    elevation: { control: 'select', options: ['none', 'sm', 'md', 'lg', 'xl'], description: 'Shadow elevation' },
    flex: { control: 'number', description: 'Flex value' },
  },
};

export default meta;
type Story = StoryObj<BoxProps>;

export const Playground: Story = {
  args: {
    p: 'lg',
    bg: 'surface',
    radius: 'md',
    elevation: 'sm',
    children: <Text variant="body">Box content with token-based spacing</Text>,
  },
};

export const Spacing: Story = {
  name: 'Spacing Tokens',
  render: () => (
    <Box>
      {(['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const).map((size) => (
        <Box key={size} p={size} bg="primaryLight" radius="sm" m="xs">
          <Text variant="bodySmall">
            p="{size}"
          </Text>
        </Box>
      ))}
    </Box>
  ),
};

export const BackgroundColors: Story = {
  name: 'Background Tokens',
  render: () => (
    <Box style={{ gap: 8 }}>
      {(['surface', 'surfaceSecondary', 'primaryLight', 'successLight', 'errorLight', 'warningLight'] as const).map((color) => (
        <Box key={color} p="md" bg={color} radius="sm">
          <Text variant="bodySmall">bg="{color}"</Text>
        </Box>
      ))}
    </Box>
  ),
};

export const ElevationLevels: Story = {
  name: 'Elevation',
  render: () => (
    <Box style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
      {(['none', 'sm', 'md', 'lg', 'xl'] as const).map((level) => (
        <Box key={level} p="lg" bg="surface" radius="md" elevation={level} style={{ width: 120, alignItems: 'center' }}>
          <Text variant="label">{level}</Text>
        </Box>
      ))}
    </Box>
  ),
};

export const Composition: Story = {
  name: 'Real-World Composition',
  render: () => (
    <Box p="lg" bg="surface" radius="lg" elevation="md" style={{ maxWidth: 360 }}>
      <Box py="sm">
        <Text variant="h2">Card Title</Text>
      </Box>
      <Box py="xs">
        <Text variant="body" color="textSecondary">
          Box is the building block for composed layouts. Combine padding, background, radius, and elevation tokens.
        </Text>
      </Box>
      <Box p="md" bg="primaryLight" radius="sm" m="xs" style={{ marginTop: 12 }}>
        <Text variant="label" color="primary">Nested Box with token props</Text>
      </Box>
    </Box>
  ),
};
