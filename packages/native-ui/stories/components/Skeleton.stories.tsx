import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Box } from '../../src/primitives/Box';
import { HStack, VStack } from '../../src/primitives/Stack';
import { Skeleton } from '../../src/components/Skeleton';
import { Text } from '../../src/primitives/Text';
import type { SkeletonProps } from '../../src/components/Skeleton';

const meta: Meta<SkeletonProps> = {
  title: 'Components/Skeleton',
  component: Skeleton,
  parameters: {
    docs: {
      description: {
        component: [
          'Loading placeholder with animated shimmer effect. Use to show content layout while data is loading.',
          '',
          '### Behavior',
          '- Shimmer animation using react-native-reanimated',
          '- Respects `reduceAnimations` theme setting (shows static placeholder)',
          '',
          '### When to use',
          '- Replace text, images, or cards while loading',
          '- Match the approximate size of the real content',
          '- Combine multiple skeletons to represent a full UI layout',
          '',
          '### Import',
          '```tsx',
          "import { Skeleton } from '@polprog/native-ui';",
          '```',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    width: { control: 'text', description: 'Width (number or string like "100%")' },
    height: { control: 'number' },
    borderRadius: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<SkeletonProps>;

export const Playground: Story = {
  args: { width: 200, height: 20, borderRadius: 10 },
};

export const Shapes: Story = {
  name: 'Common Shapes',
  render: () => (
    <VStack gap="lg">
      <VStack gap="xs">
        <Text variant="caption" color="textTertiary">Text line</Text>
        <Skeleton width={240} height={16} />
      </VStack>
      <VStack gap="xs">
        <Text variant="caption" color="textTertiary">Heading</Text>
        <Skeleton width={180} height={24} />
      </VStack>
      <VStack gap="xs">
        <Text variant="caption" color="textTertiary">Avatar (circle)</Text>
        <Skeleton width={48} height={48} borderRadius={24} />
      </VStack>
      <VStack gap="xs">
        <Text variant="caption" color="textTertiary">Card</Text>
        <Skeleton width="100%" height={120} borderRadius={14} />
      </VStack>
      <VStack gap="xs">
        <Text variant="caption" color="textTertiary">Button</Text>
        <Skeleton width={140} height={44} borderRadius={10} />
      </VStack>
    </VStack>
  ),
};

export const CardSkeleton: Story = {
  name: 'Card Loading State',
  render: () => (
    <Box p="lg" bg="surface" radius="lg" elevation="sm" style={{ maxWidth: 360 }}>
      <VStack gap="md">
        <HStack gap="md" align="center">
          <Skeleton width={40} height={40} borderRadius={20} />
          <VStack gap="xs" flex={1}>
            <Skeleton width={120} height={16} />
            <Skeleton width={80} height={12} />
          </VStack>
        </HStack>
        <Skeleton width="100%" height={14} />
        <Skeleton width="80%" height={14} />
        <Skeleton width="60%" height={14} />
      </VStack>
    </Box>
  ),
};

export const ListSkeleton: Story = {
  name: 'List Loading State',
  render: () => (
    <VStack gap="sm" style={{ maxWidth: 400 }}>
      {[1, 2, 3, 4].map((i) => (
        <HStack key={i} gap="md" align="center" style={{ paddingVertical: 8 }}>
          <Skeleton width={44} height={44} borderRadius={10} />
          <VStack gap="xs" flex={1}>
            <Skeleton width="70%" height={16} />
            <Skeleton width="40%" height={12} />
          </VStack>
          <Skeleton width={60} height={20} />
        </HStack>
      ))}
    </VStack>
  ),
};

export const DashboardSkeleton: Story = {
  name: 'Dashboard Loading State',
  render: () => (
    <VStack gap="lg" style={{ maxWidth: 400 }}>
      <Box p="lg" bg="surface" radius="lg" elevation="sm">
        <VStack gap="sm">
          <Skeleton width={100} height={14} />
          <Skeleton width={180} height={32} />
        </VStack>
      </Box>
      <Box p="lg" bg="surface" radius="lg" elevation="sm">
        <VStack gap="md">
          <Skeleton width={140} height={18} />
          <Skeleton width="100%" height={8} borderRadius={4} />
          <HStack justify="space-between">
            <Skeleton width={80} height={14} />
            <Skeleton width={60} height={14} />
          </HStack>
        </VStack>
      </Box>
      <Box p="lg" bg="surface" radius="lg" elevation="sm">
        <VStack gap="md">
          <Skeleton width={120} height={18} />
          {[1, 2, 3].map((i) => (
            <HStack key={i} gap="sm" align="center">
              <Skeleton width={32} height={32} borderRadius={8} />
              <Skeleton width="60%" height={14} />
              <VStack flex={1} align="flex-end">
                <Skeleton width={50} height={14} />
              </VStack>
            </HStack>
          ))}
        </VStack>
      </Box>
    </VStack>
  ),
};

export const SkeletonCardPreset: Story = {
  name: 'Skeleton.Card preset',
  parameters: {
    docs: {
      description: {
        story:
          '`Skeleton.Card` is a bordered card-shaped preset with a title bar and a configurable number of body lines. Typical use: list-loading placeholders. Pass `withAvatar` for list-item placeholders.',
      },
    },
  },
  render: () => (
    <VStack gap="md" style={{ maxWidth: 400 }}>
      <Text variant="caption" color="textTertiary">Default (2 lines)</Text>
      <Skeleton.Card />
      <Text variant="caption" color="textTertiary">Dense (4 lines)</Text>
      <Skeleton.Card lines={4} />
      <Text variant="caption" color="textTertiary">With avatar (list item)</Text>
      <Skeleton.Card withAvatar lines={2} />
    </VStack>
  ),
};
