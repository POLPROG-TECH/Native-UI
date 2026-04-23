import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect, fn, waitFor } from 'storybook/test';
import { SearchBar } from '../../src/components/SearchBar';
import { Text } from '../../src/primitives/Text';
import { VStack } from '../../src/primitives/Stack';
import type { SearchBarProps } from '../../src/components/SearchBar';

const meta: Meta<SearchBarProps> = {
  title: 'Components/SearchBar',
  component: SearchBar,
  parameters: {
    docs: {
      description: {
        component: [
          'Search input with built-in debounce and clear button. Fires `onChangeText` after the debounce delay.',
          '',
          '### Features',
          '- Built-in debounce (default 300ms)',
          '- Clear button (✕) appears when text is entered',
          '- Search icon prefix',
          '',
          '### Accessibility',
          '- `accessibilityRole="search"` (via semantic wrapper)',
          '',
          '### Design tokens',
          '- Background: `colors.surfaceSecondary`',
          '- Border radius: `borderRadius.sm`',
          '',
          '### Import',
          '```tsx',
          "import { SearchBar } from '@polprog/native-ui';",
          '```',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    placeholder: { control: 'text' },
    debounceMs: { control: { type: 'number', min: 0, max: 1000, step: 50 } },
    onChangeText: { action: 'onChangeText (debounced)' },
  },
};

export default meta;
type Story = StoryObj<SearchBarProps>;

const InteractiveSearch = (
  props: Partial<SearchBarProps> & { spy?: (t: string) => void } = {},
) => {
  const { spy, ...rest } = props;
  const [value, setValue] = useState('');

  return (
    <VStack gap="sm" style={{ maxWidth: 400 }}>
      <SearchBar
        value={value}
        onChangeText={(text) => { setValue(text); spy?.(text); }}
        placeholder="Search entries..."
        {...rest}
      />
      <Text variant="caption" color="textTertiary">Current value: "{value}"</Text>
    </VStack>
  );
};

export const Playground: Story = {
  args: { onChangeText: fn() },
  render: (args) => <InteractiveSearch spy={args.onChangeText} />,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('Search entries...');
    await expect(input).toBeInTheDocument();
    await userEvent.type(input, 'office');
    await expect(input).toHaveValue('office');
    // Debounced `onChangeText` must eventually be called with the final value.
    await waitFor(
      async () => {
        const calls = (args.onChangeText as ReturnType<typeof fn>).mock.calls;
        await expect(calls[calls.length - 1]?.[0]).toBe('office');
      },
      { timeout: 2000 },
    );
  },
};

/** Typing then clearing must leave the input empty and trigger the spy with ''. */
export const ClearInteraction: Story = {
  name: 'Interaction · Type then clear',
  args: { onChangeText: fn() },
  render: (args) => <InteractiveSearch spy={args.onChangeText} />,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('Search entries...') as HTMLInputElement;
    await userEvent.type(input, 'query');
    await expect(input).toHaveValue('query');
    await userEvent.clear(input);
    await expect(input).toHaveValue('');
    await waitFor(
      async () => {
        const calls = (args.onChangeText as ReturnType<typeof fn>).mock.calls;
        await expect(calls[calls.length - 1]?.[0]).toBe('');
      },
      { timeout: 2000 },
    );
  },
};

export const WithPlaceholder: Story = {
  name: 'Custom Placeholder',
  render: () => <InteractiveSearch placeholder="Search projects, budgets, entries..." />,
};

export const CustomDebounce: Story = {
  name: 'Custom Debounce',
  render: () => (
    <VStack gap="lg">
      <VStack gap="xs">
        <Text variant="labelSmall" color="textTertiary">No debounce (0ms)</Text>
        <InteractiveSearch debounceMs={0} placeholder="Instant search..." />
      </VStack>
      <VStack gap="xs">
        <Text variant="labelSmall" color="textTertiary">Slow debounce (800ms)</Text>
        <InteractiveSearch debounceMs={800} placeholder="Slow search..." />
      </VStack>
    </VStack>
  ),
};

export const PrefilledSearch: Story = {
  name: 'Pre-filled Value',
  render: () => {
    const [value, setValue] = useState('office supplies');

    return (
      <VStack gap="sm" style={{ maxWidth: 400 }}>
        <SearchBar value={value} onChangeText={(text) => { setValue(text); fn()(text); }} placeholder="Search..." />
        <Text variant="caption" color="textTertiary">Shows clear button when text is present</Text>
      </VStack>
    );
  },
};
