import React from 'react';
import { View, Text as RNText } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import { within, userEvent, expect, fn } from 'storybook/test';
import { Box } from '../../src/primitives/Box';
import { Button } from '../../src/components/Button';
import { HStack, VStack } from '../../src/primitives/Stack';
import { Text } from '../../src/primitives/Text';
import type { ButtonProps } from '../../src/components/Button';

const meta: Meta<ButtonProps> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: [
          'Primary interactive element for triggering actions. Supports 5 visual variants, 3 sizes, loading state, and optional leading icon.',
          '',
          '### Variants',
          '| Variant | Use case |',
          '|---|---|',
          '| `primary` | Main actions (Submit, Save, Continue) |',
          '| `secondary` | Supporting actions with less emphasis |',
          '| `outline` | Bordered button for secondary actions |',
          '| `ghost` | Minimal emphasis (Cancel, Close) |',
          '| `danger` | Destructive actions (Delete, Remove) |',
          '',
          '### Accessibility',
          '- `accessibilityRole="button"` is set automatically',
          '- `accessibilityState.disabled` is set when disabled or loading',
          '- Uses `accessibilityLabel` from `title` by default',
          '- Haptic feedback on press (when configured)',
          '',
          '### Import',
          '```tsx',
          "import { Button } from '@polprog/native-ui';",
          '```',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    title: { control: 'text', description: 'Button label text' },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
      description: 'Visual variant',
    },
    size: { control: 'select', options: ['sm', 'md', 'lg'], description: 'Button size' },
    disabled: { control: 'boolean', description: 'Disabled state' },
    loading: { control: 'boolean', description: 'Shows spinner, hides label' },
    fullWidth: { control: 'boolean', description: 'Expand to 100% width' },
    onPress: { action: 'pressed', description: 'Press handler' },
  },
};

export default meta;
type Story = StoryObj<ButtonProps>;

export const Playground: Story = {
  args: {
    title: 'Click Me',
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
    fullWidth: false,
    onPress: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Click Me' });
    await expect(button).toBeInTheDocument();
    await userEvent.click(button);
    await expect(args.onPress).toHaveBeenCalled();
  },
};

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => (
    <VStack gap="md" style={{ maxWidth: 300 }}>
      {(['primary', 'secondary', 'outline', 'ghost', 'danger'] as const).map((variant) => (
        <Button key={variant} title={variant} variant={variant} onPress={action(`${variant} pressed`)} />
      ))}
    </VStack>
  ),
};

export const Sizes: Story = {
  name: 'All Sizes',
  render: () => (
    <VStack gap="md" style={{ alignItems: 'flex-start' }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <HStack key={size} gap="md" align="center">
          <Box style={{ width: 40 }}>
            <Text variant="caption" color="textTertiary">{size}</Text>
          </Box>
          <Button title={`Size ${size}`} size={size} onPress={action(`${size} pressed`)} />
        </HStack>
      ))}
    </VStack>
  ),
};

export const FullWidth: Story = {
  name: 'Full Width',
  render: () => (
    <VStack gap="md" style={{ maxWidth: 360 }}>
      <Button title="Full Width Primary" fullWidth onPress={action('pressed')} />
      <Button title="Full Width Outline" variant="outline" fullWidth onPress={action('pressed')} />
      <Button title="Full Width Danger" variant="danger" fullWidth onPress={action('pressed')} />
    </VStack>
  ),
};

export const States: Story = {
  name: 'States',
  render: () => (
    <VStack gap="lg">
      <VStack gap="sm">
        <Text variant="label" color="textSecondary">Normal</Text>
        <Button title="Enabled Button" onPress={action('pressed')} />
      </VStack>
      <VStack gap="sm">
        <Text variant="label" color="textSecondary">Disabled</Text>
        <HStack gap="sm" wrap>
          {(['primary', 'secondary', 'outline', 'ghost', 'danger'] as const).map((v) => (
            <Button key={v} title={v} variant={v} disabled onPress={action('pressed')} />
          ))}
        </HStack>
      </VStack>
      <VStack gap="sm">
        <Text variant="label" color="textSecondary">Loading</Text>
        <HStack gap="sm" wrap>
          {(['primary', 'secondary', 'outline', 'danger'] as const).map((v) => (
            <Button key={v} title={v} variant={v} loading onPress={action('pressed')} />
          ))}
        </HStack>
      </VStack>
    </VStack>
  ),
};

export const WithIcon: Story = {
  name: 'With Icon',
  render: () => (
    <VStack gap="md" style={{ alignItems: 'flex-start' }}>
      <Button
        title="Add Item"
        icon={<RNText style={{ fontSize: 16 }}>＋</RNText>}
        onPress={action('pressed')}
      />
      <Button
        title="Delete"
        variant="danger"
        icon={<RNText style={{ fontSize: 16 }}>🗑</RNText>}
        onPress={action('pressed')}
      />
      <Button
        title="Settings"
        variant="outline"
        icon={<RNText style={{ fontSize: 16 }}>⚙</RNText>}
        onPress={action('pressed')}
      />
    </VStack>
  ),
};

export const SizeComparison: Story = {
  name: 'All Sizes × All Variants',
  render: () => (
    <VStack gap="xl">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <VStack key={size} gap="sm">
          <Text variant="labelSmall" color="textTertiary">size="{size}"</Text>
          <HStack gap="sm" wrap>
            {(['primary', 'secondary', 'outline', 'ghost', 'danger'] as const).map((variant) => (
              <Button key={`${size}-${variant}`} title={variant} size={size} variant={variant} onPress={action('pressed')} />
            ))}
          </HStack>
        </VStack>
      ))}
    </VStack>
  ),
};

export const InFormContext: Story = {
  name: 'Form Footer Pattern',
  render: () => (
    <Box p="lg" bg="surface" radius="lg" elevation="sm" style={{ maxWidth: 400 }}>
      <VStack gap="md">
        <Text variant="h2">Edit Profile</Text>
        <Box p="md" bg="surfaceSecondary" radius="sm">
          <Text variant="bodySmall" color="textTertiary">Form fields here...</Text>
        </Box>
        <HStack gap="sm" justify="flex-end">
          <Button title="Cancel" variant="ghost" onPress={action('cancel')} />
          <Button title="Save Changes" onPress={action('save')} />
        </HStack>
      </VStack>
    </Box>
  ),
};

export const WithGlow: Story = {
  name: 'Glow (accent shadow)',
  parameters: {
    docs: {
      description: {
        story:
          'The `glow` prop adds a themed colored shadow useful for primary CTAs. Pass `true` to glow with the variant accent (primary / error) or any CSS color string.',
      },
    },
  },
  render: () => (
    <VStack gap="lg" style={{ maxWidth: 360 }}>
      <VStack gap="sm">
        <Text variant="label" color="textSecondary">glow = true (variant-based)</Text>
        <Button title="Save Entry" glow onPress={action('pressed')} />
        <Button title="Delete Account" variant="danger" glow onPress={action('pressed')} />
      </VStack>
      <VStack gap="sm">
        <Text variant="label" color="textSecondary">glow = custom color</Text>
        <Button title="Promo Action" glow="#F59E0B" onPress={action('pressed')} />
        <Button title="Alt Accent" variant="outline" glow="#10B981" onPress={action('pressed')} />
      </VStack>
      <VStack gap="sm">
        <Text variant="label" color="textSecondary">glow suppressed while disabled</Text>
        <Button title="Disabled + glow" glow disabled onPress={action('pressed')} />
      </VStack>
    </VStack>
  ),
};
