import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import { within, userEvent, expect } from 'storybook/test';
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

const InteractiveSearch = (props: Partial<SearchBarProps>) => {
  const [value, setValue] = useState('');
  return (
    <VStack gap="sm" style={{ maxWidth: 400 }}>
      <SearchBar
        value={value}
        onChangeText={(text) => { setValue(text); action('onChangeText')(text); }}
        placeholder="Search entries..."
        {...props}
      />
      <Text variant="caption" color="textTertiary">Current value: "{value}"</Text>
    </VStack>
  );
};

export const Playground: Story = {
  render: () => <InteractiveSearch />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('Search entries...');
    await expect(input).toBeInTheDocument();
    await userEvent.type(input, 'office');
    await expect(input).toHaveValue('office');
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
        <SearchBar value={value} onChangeText={(text) => { setValue(text); action('search')(text); }} placeholder="Search..." />
        <Text variant="caption" color="textTertiary">Shows clear button when text is present</Text>
      </VStack>
    );
  },
};
