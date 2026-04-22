import React from 'react';
import { fn, within, userEvent, expect } from 'storybook/test';
import { Text as RNText } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Box } from '../../src/primitives/Box';
import { HStack, VStack } from '../../src/primitives/Stack';
import { IconButton } from '../../src/components/IconButton';
import { Text } from '../../src/primitives/Text';
import type { IconButtonProps } from '../../src/components/IconButton';

const EmojiIcon = ({ children }: { children: string }) => (
  <RNText style={{ fontSize: 20 }}>{children}</RNText>
);

const meta: Meta<IconButtonProps> = {
  title: 'Components/IconButton',
  component: IconButton,
  parameters: {
    docs: {
      description: {
        component: [
          'Circular icon-only button with variants. **Requires `accessibilityLabel`** - icon-only buttons must always have a screen reader label.',
          '',
          '### Variants',
          '| Variant | Background | Use case |',
          '|---|---|---|',
          '| `default` | surfaceSecondary | General actions |',
          '| `primary` | primaryLight | Emphasized actions |',
          '| `ghost` | transparent | Minimal UI (toolbars) |',
          '| `danger` | errorLight | Destructive actions |',
          '',
          '### Sizes',
          '- `sm`: 32px (toolbar, compact)',
          '- `md`: 40px (default)',
          '- `lg`: 48px (prominent actions)',
          '',
          '### Import',
          '```tsx',
          "import { IconButton } from '@polprog/native-ui';",
          '```',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    variant: { control: 'select', options: ['default', 'primary', 'ghost', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    accessibilityLabel: { control: 'text' },
    onPress: { action: 'pressed' },
  },
};

export default meta;
type Story = StoryObj<IconButtonProps>;

export const Playground: Story = {
  args: {
    icon: <EmojiIcon>⚙️</EmojiIcon>,
    accessibilityLabel: 'Settings',
    variant: 'default',
    size: 'md',
    disabled: false,
    onPress: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: /settings/i });
    await expect(button).toBeInTheDocument();
    await userEvent.click(button);
    await expect(args.onPress).toHaveBeenCalledTimes(1);
    await new Promise((resolve) => setTimeout(resolve, 350));
    await userEvent.click(button);
    await expect(args.onPress).toHaveBeenCalledTimes(2);
  },
};

/** Disabled button must NOT fire `onPress` even when clicked. */
export const DisabledDoesNotFire: Story = {
  name: 'Interaction · Disabled never fires',
  args: {
    icon: <EmojiIcon>⚙️</EmojiIcon>,
    accessibilityLabel: 'Settings (disabled)',
    disabled: true,
    onPress: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: /settings/i });
    await userEvent.click(button);
    await userEvent.click(button);
    await expect(args.onPress).not.toHaveBeenCalled();
  },
};

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => (
    <HStack gap="lg">
      {(['default', 'primary', 'ghost', 'danger'] as const).map((variant) => (
        <VStack key={variant} gap="xs" align="center">
          <IconButton icon={<EmojiIcon>⚙️</EmojiIcon>} variant={variant} accessibilityLabel={variant} onPress={fn()} />
          <Text variant="caption" color="textTertiary">{variant}</Text>
        </VStack>
      ))}
    </HStack>
  ),
};

export const AllSizes: Story = {
  name: 'All Sizes',
  render: () => (
    <HStack gap="lg" align="center">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <VStack key={size} gap="xs" align="center">
          <IconButton icon={<EmojiIcon>🔔</EmojiIcon>} size={size} accessibilityLabel={`Notifications ${size}`} onPress={fn()} />
          <Text variant="caption" color="textTertiary">{size}</Text>
        </VStack>
      ))}
    </HStack>
  ),
};

export const DisabledState: Story = {
  name: 'Disabled',
  render: () => (
    <HStack gap="lg">
      {(['default', 'primary', 'ghost', 'danger'] as const).map((variant) => (
        <IconButton key={variant} icon={<EmojiIcon>🔒</EmojiIcon>} variant={variant} disabled accessibilityLabel="Locked" onPress={fn()} />
      ))}
    </HStack>
  ),
};

export const ToolbarExample: Story = {
  name: 'Toolbar Pattern',
  render: () => (
    <Box p="sm" bg="surface" radius="md" elevation="sm" style={{ maxWidth: 360 }}>
      <HStack justify="space-between">
        <HStack gap="xs">
          <IconButton icon={<EmojiIcon>◀️</EmojiIcon>} variant="ghost" size="sm" accessibilityLabel="Back" onPress={fn()} />
        </HStack>
        <Text variant="label">Document Title</Text>
        <HStack gap="xs">
          <IconButton icon={<EmojiIcon>🔍</EmojiIcon>} variant="ghost" size="sm" accessibilityLabel="Search" onPress={fn()} />
          <IconButton icon={<EmojiIcon>⋯</EmojiIcon>} variant="ghost" size="sm" accessibilityLabel="More options" onPress={fn()} />
        </HStack>
      </HStack>
    </Box>
  ),
};
