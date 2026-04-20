import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { HStack, VStack } from '../../src/primitives/Stack';
import { Spinner } from '../../src/components/Spinner';
import { Text } from '../../src/primitives/Text';
import type { SpinnerProps } from '../../src/components/Spinner';

const meta: Meta<SpinnerProps> = {
  title: 'Components/Spinner',
  component: Spinner,
  parameters: {
    a11y: { disable: true },
    docs: {
      description: {
        component: [
          'Full-screen centered loading indicator with optional label.',
          '',
          '### When to use',
          '- Initial data loading (full screen)',
          '- Screen transitions',
          '- Long async operations',
          '',
          '### When NOT to use',
          '- Inline loading → use `Skeleton`',
          '- Button loading → use `Button` with `loading` prop',
          '- Progress indication → use `ProgressBar`',
          '',
          '### Import',
          '```tsx',
          "import { Spinner } from '@polprog/native-ui';",
          '```',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    label: { control: 'text' },
    size: { control: 'select', options: ['small', 'large'] },
  },
};

export default meta;
type Story = StoryObj<SpinnerProps>;

export const Playground: Story = {
  args: {
    size: 'large',
  },
};

export const Default: Story = {
  render: () => (
    <View style={{ height: 200 }}>
      <Spinner />
    </View>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <View style={{ height: 200 }}>
      <Spinner label="Loading entries..." />
    </View>
  ),
};

export const Sizes: Story = {
  render: () => (
    <HStack gap="3xl" justify="center">
      <VStack align="center" gap="sm">
        <View style={{ height: 80, justifyContent: 'center' }}>
          <Spinner size="small" />
        </View>
        <Text variant="caption" color="textTertiary">small</Text>
      </VStack>
      <VStack align="center" gap="sm">
        <View style={{ height: 80, justifyContent: 'center' }}>
          <Spinner size="large" />
        </View>
        <Text variant="caption" color="textTertiary">large</Text>
      </VStack>
    </HStack>
  ),
};
