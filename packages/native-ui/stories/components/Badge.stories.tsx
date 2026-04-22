import React from 'react';
import { fn } from 'storybook/test';
import { View, Text as RNText } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '../../src/components/Badge';
import { HStack, VStack } from '../../src/primitives/Stack';
import { IconButton } from '../../src/components/IconButton';
import { Text } from '../../src/primitives/Text';
import type { BadgeProps } from '../../src/components/Badge';

const meta: Meta<BadgeProps> = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    docs: {
      description: {
        component: [
          'Notification indicator showing a count or dot. Used for unread counts, status indicators, and alerts.',
          '',
          '### Behavior',
          '- **No count**: Renders as a small dot',
          '- **Count ≤ max**: Shows the number',
          '- **Count > max**: Shows "N+" (e.g., "99+")',
          '- **Count = 0 + hideZero**: Hidden (default behavior)',
          '',
          '### Variants',
          '| Variant | Color | Use case |',
          '|---|---|---|',
          '| `error` | Red | Unread counts, alerts (default) |',
          '| `primary` | Blue | Informational badges |',
          '| `warning` | Yellow | Pending items |',
          '| `success` | Green | Completed items |',
          '',
          '### Import',
          '```tsx',
          "import { Badge } from '@polprog/native-ui';",
          '```',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    count: { control: { type: 'number', min: 0, max: 200 } },
    variant: { control: 'select', options: ['error', 'primary', 'warning', 'success'] },
    max: { control: { type: 'number', min: 1, max: 999 } },
    hideZero: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<BadgeProps>;

export const Playground: Story = {
  args: { count: 5, variant: 'error', max: 99, hideZero: true },
};

export const Variants: Story = {
  render: () => (
    <HStack gap="xl">
      {(['error', 'primary', 'warning', 'success'] as const).map((variant) => (
        <VStack key={variant} gap="xs" align="center">
          <Badge count={7} variant={variant} />
          <Text variant="caption" color="textTertiary">{variant}</Text>
        </VStack>
      ))}
    </HStack>
  ),
};

export const Counts: Story = {
  name: 'Count Values',
  render: () => (
    <HStack gap="lg">
      {[undefined, 0, 1, 5, 42, 99, 100, 150].map((count, i) => (
        <VStack key={i} gap="xs" align="center">
          <Badge count={count} />
          <Text variant="caption" color="textTertiary">{count === undefined ? 'dot' : String(count)}</Text>
        </VStack>
      ))}
    </HStack>
  ),
};

export const MaxOverflow: Story = {
  name: 'Max Overflow',
  render: () => (
    <VStack gap="md">
      <HStack gap="lg">
        <VStack gap="xs" align="center">
          <Badge count={150} max={99} />
          <Text variant="caption" color="textTertiary">max=99 → "99+"</Text>
        </VStack>
        <VStack gap="xs" align="center">
          <Badge count={15} max={9} />
          <Text variant="caption" color="textTertiary">max=9 → "9+"</Text>
        </VStack>
        <VStack gap="xs" align="center">
          <Badge count={999} max={999} />
          <Text variant="caption" color="textTertiary">max=999</Text>
        </VStack>
      </HStack>
    </VStack>
  ),
};

export const OnIconButton: Story = {
  name: 'On Icon Button',
  render: () => (
    <HStack gap="xl">
      <View style={{ position: 'relative' }}>
        <IconButton icon={<RNText style={{ fontSize: 20 }}>🔔</RNText>} accessibilityLabel="Notifications" onPress={fn()} />
        <View style={{ position: 'absolute', top: -4, right: -4 }}>
          <Badge count={3} />
        </View>
      </View>
      <View style={{ position: 'relative' }}>
        <IconButton icon={<RNText style={{ fontSize: 20 }}>✉️</RNText>} accessibilityLabel="Messages" onPress={fn()} />
        <View style={{ position: 'absolute', top: -4, right: -4 }}>
          <Badge count={12} variant="primary" />
        </View>
      </View>
      <View style={{ position: 'relative' }}>
        <IconButton icon={<RNText style={{ fontSize: 20 }}>⚙️</RNText>} accessibilityLabel="Settings" onPress={fn()} />
        <View style={{ position: 'absolute', top: -4, right: -4 }}>
          <Badge />
        </View>
      </View>
    </HStack>
  ),
};
