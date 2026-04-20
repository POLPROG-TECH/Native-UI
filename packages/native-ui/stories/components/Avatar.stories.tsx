import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from '../../src/components/Avatar';
import { HStack, VStack } from '../../src/primitives/Stack';
import { Text } from '../../src/primitives/Text';
import type { AvatarProps } from '../../src/components/Avatar';

const meta: Meta<AvatarProps> = {
  title: 'Components/Avatar',
  component: Avatar,
  parameters: {
    docs: {
      description: {
        component: [
          'Circular user avatar showing an image or initials. Automatically calculates text contrast against background.',
          '',
          '### Sizes',
          '| Size | Dimensions | Font | Use case |',
          '|---|---|---|---|',
          '| `sm` | 28px | 11px | Compact lists, inline mentions |',
          '| `md` | 36px | 14px | Standard lists, comments (default) |',
          '| `lg` | 48px | 18px | Profile headers, cards |',
          '| `xl` | 64px | 24px | Profile pages, prominent display |',
          '',
          '### Behavior',
          '- Shows image when `source` is provided',
          '- Falls back to initials with colored background',
          '- Text color automatically contrasts against `color` prop',
          '',
          '### Import',
          '```tsx',
          "import { Avatar } from '@polprog/native-ui';",
          '```',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    initials: { control: 'text', description: '1-2 character initials' },
    color: { control: 'color', description: 'Background color for initials' },
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl'] },
    accessibilityLabel: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<AvatarProps>;

export const Playground: Story = {
  args: { initials: 'JD', color: '#4F46E5', size: 'md', accessibilityLabel: 'John Doe' },
};

export const AllSizes: Story = {
  name: 'All Sizes',
  render: () => (
    <HStack gap="lg" align="center">
      {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <VStack key={size} gap="xs" align="center">
          <Avatar initials="JD" size={size} accessibilityLabel="John Doe" />
          <Text variant="caption" color="textTertiary">{size}</Text>
        </VStack>
      ))}
    </HStack>
  ),
};

export const DifferentColors: Story = {
  name: 'Background Colors',
  render: () => (
    <HStack gap="md">
      {['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'].map((color) => (
        <Avatar key={color} initials="AB" color={color} size="lg" accessibilityLabel="User" />
      ))}
    </HStack>
  ),
};

export const AvatarGroup: Story = {
  name: 'Avatar Group',
  render: () => (
    <VStack gap="lg">
      <Text variant="label">Team Members</Text>
      <HStack gap="sm" align="center">
        <Avatar initials="JD" color="#4F46E5" size="md" accessibilityLabel="John Doe" />
        <Avatar initials="AK" color="#10B981" size="md" accessibilityLabel="Anna K" />
        <Avatar initials="MR" color="#F59E0B" size="md" accessibilityLabel="Mark R" />
        <Avatar initials="+3" color="#6B7280" size="md" accessibilityLabel="3 more members" />
      </HStack>
    </VStack>
  ),
};

export const WithImage: Story = {
  name: 'With Image (Placeholder)',
  render: () => (
    <VStack gap="md">
      <Text variant="caption" color="textTertiary">When source is provided, the image is shown. If it fails to load, initials are displayed.</Text>
      <HStack gap="md" align="center">
        <Avatar source={{ uri: 'https://i.pravatar.cc/100?img=1' }} size="lg" accessibilityLabel="User 1" />
        <Avatar source={{ uri: 'https://i.pravatar.cc/100?img=2' }} size="lg" accessibilityLabel="User 2" />
        <Avatar initials="FB" color="#EF4444" size="lg" accessibilityLabel="Fallback" />
      </HStack>
    </VStack>
  ),
};
