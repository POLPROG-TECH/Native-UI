import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Box } from '../../src/primitives/Box';
import { Heading } from '../../src/primitives/Heading';
import { Text } from '../../src/primitives/Text';
import { VStack } from '../../src/primitives/Stack';
import type { HeadingProps } from '../../src/primitives/Heading';

const meta: Meta<HeadingProps> = {
  title: 'Primitives/Heading',
  component: Heading,
  parameters: {
    docs: {
      description: {
        component: [
          'Semantic heading component with `accessibilityRole="header"`. Use for all section titles and page headings.',
          '',
          '### vs Text',
          'Use `Heading` instead of `<Text variant="h1">` when the text represents a section heading - it ensures proper screen reader navigation.',
          '',
          '### Levels',
          '- `display` - 32px, splash/hero',
          '- `displayMedium` - 28px',
          '- `1` - 24px, page titles (default)',
          '- `2` - 20px, section titles',
          '- `3` - 17px, subsection titles',
          '',
          '### Import',
          '```tsx',
          "import { Heading } from '@polprog/native-ui';",
          '```',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    level: { control: 'select', options: [1, 2, 3, 'display', 'displayMedium'] },
    color: { control: 'select', options: ['textPrimary', 'textSecondary', 'primary', 'error'] },
    align: { control: 'select', options: ['auto', 'left', 'center', 'right'] },
    children: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<HeadingProps>;

export const Playground: Story = {
  args: {
    level: 1,
    children: 'Page Heading',
  },
};

export const AllLevels: Story = {
  name: 'All Heading Levels',
  render: () => (
    <VStack gap="lg">
      <Box>
        <Heading level="display">Display Heading</Heading>
        <Text variant="caption" color="textTertiary">level="display" - 32px, bold</Text>
      </Box>
      <Box>
        <Heading level="displayMedium">Display Medium</Heading>
        <Text variant="caption" color="textTertiary">level="displayMedium" - 28px, bold</Text>
      </Box>
      <Box>
        <Heading level={1}>Heading Level 1</Heading>
        <Text variant="caption" color="textTertiary">level=&#123;1&#125; - 24px, bold (default)</Text>
      </Box>
      <Box>
        <Heading level={2}>Heading Level 2</Heading>
        <Text variant="caption" color="textTertiary">level=&#123;2&#125; - 20px, semibold</Text>
      </Box>
      <Box>
        <Heading level={3}>Heading Level 3</Heading>
        <Text variant="caption" color="textTertiary">level=&#123;3&#125; - 17px, semibold</Text>
      </Box>
    </VStack>
  ),
};

export const WithBodyText: Story = {
  name: 'Heading + Body Hierarchy',
  render: () => (
    <VStack gap="xl" style={{ maxWidth: 480 }}>
      <VStack gap="sm">
        <Heading level={1}>Getting Started</Heading>
        <Text variant="body" color="textSecondary">
          Follow these steps to set up native-ui in your React Native project.
        </Text>
      </VStack>
      <VStack gap="sm">
        <Heading level={2}>Installation</Heading>
        <Text variant="body">Install the package and its peer dependencies using npm or yarn.</Text>
      </VStack>
      <VStack gap="xs">
        <Heading level={3}>Prerequisites</Heading>
        <Text variant="bodySmall" color="textSecondary">
          Make sure you have React Native 0.72+ and React 18+ installed.
        </Text>
      </VStack>
    </VStack>
  ),
};
