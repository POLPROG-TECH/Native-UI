import React from 'react';
import { fn } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '../../src/components/Badge';
import { Box } from '../../src/primitives/Box';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { HStack, VStack } from '../../src/primitives/Stack';
import { Heading } from '../../src/primitives/Heading';
import { Text } from '../../src/primitives/Text';
import { useTheme } from '../../src/theme/ThemeProvider';
import type { CardProps } from '../../src/components/Card';

const meta: Meta<CardProps> = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    docs: {
      description: {
        component: [
          'Surface container with elevation, rounded corners, and optional press interaction.',
          '',
          '### Behavior',
          '- Static by default (no press feedback)',
          '- Becomes pressable when `onPress` or `onLongPress` is provided',
          '- Scales to 0.98 on press with haptic feedback',
          '',
          '### Design tokens used',
          '- Background: `colors.surface`',
          '- Border radius: `borderRadius.lg` (18px)',
          '- Elevation: `elevation.sm`',
          '- Padding (when `padded`): `spacing.lg` (16px)',
          '',
          '### Import',
          '```tsx',
          "import { Card } from '@polprog/native-ui';",
          '```',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    padded: { control: 'boolean', description: 'Add default padding (16px)' },
    onPress: { action: 'pressed', description: 'Makes card pressable' },
    onLongPress: { action: 'longPressed', description: 'Long-press handler' },
    accessibilityHint: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<CardProps>;

export const Playground: Story = {
  args: {
    padded: true,
    children: (
      <VStack gap="sm">
        <Heading level={2}>Card Title</Heading>
        <Text variant="body" color="textSecondary">Card content goes here. Cards are surface containers with elevation.</Text>
      </VStack>
    ),
  },
};

export const Static: Story = {
  name: 'Static (Non-Pressable)',
  render: () => (
    <Card>
      <VStack gap="sm">
        <Heading level={2}>Static Card</Heading>
        <Text variant="body" color="textSecondary">
          This card has no onPress - it's a static container.
        </Text>
      </VStack>
    </Card>
  ),
};

export const Pressable: Story = {
  name: 'Pressable',
  render: () => (
    <Card onPress={fn()} accessibilityHint="Opens details">
      <VStack gap="sm">
        <Heading level={2}>Pressable Card</Heading>
        <Text variant="body" color="textSecondary">
          Tap to see scale animation and action log.
        </Text>
      </VStack>
    </Card>
  ),
};

export const NoPadding: Story = {
  name: 'Without Padding',
  render: () => {
    const theme = useTheme();

    return (
      <Card padded={false} style={{ maxWidth: 360, overflow: 'hidden' }}>
        <Box style={{ height: 160, backgroundColor: theme.colors.primaryLight, alignItems: 'center', justifyContent: 'center' }}>
          <Text variant="label" color="primary">Image Area</Text>
        </Box>
        <VStack gap="sm" style={{ padding: 16 }}>
          <Heading level={3}>Media Card</Heading>
          <Text variant="bodySmall" color="textSecondary">Card with padded=false for edge-to-edge image at top.</Text>
        </VStack>
      </Card>
    );
  },
};

export const ComplexContent: Story = {
  name: 'Complex Content',
  render: () => {
    const theme = useTheme();

    return (
      <VStack gap="lg" style={{ maxWidth: 400 }}>
        <Card>
          <VStack gap="md">
            <HStack justify="space-between">
              <Heading level={3}>Monthly Budget</Heading>
              <Badge count={3} variant="warning" />
            </HStack>
            <VStack gap="xs">
              <HStack justify="space-between">
                <Text variant="bodySmall" color="textSecondary">Spent</Text>
                <Text variant="mono">€2,450.00</Text>
              </HStack>
              <HStack justify="space-between">
                <Text variant="bodySmall" color="textSecondary">Budget</Text>
                <Text variant="mono" color="textTertiary">€3,000.00</Text>
              </HStack>
            </VStack>
            <HStack gap="sm" justify="flex-end">
              <Button title="Details" variant="ghost" size="sm" onPress={fn()} />
              <Button title="Add Entry" size="sm" onPress={fn()} />
            </HStack>
          </VStack>
        </Card>
        <Card onPress={fn()}>
          <HStack gap="md" align="center">
            <Box style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: theme.colors.primaryLight, alignItems: 'center', justifyContent: 'center' }}>
              <Text variant="h2">📊</Text>
            </Box>
            <VStack gap="2xs" flex={1}>
              <Text variant="label">Analytics</Text>
              <Text variant="bodySmall" color="textSecondary">View spending trends and reports</Text>
            </VStack>
            <Text variant="body" color="textTertiary">›</Text>
          </HStack>
        </Card>
      </VStack>
    );
  },
};
