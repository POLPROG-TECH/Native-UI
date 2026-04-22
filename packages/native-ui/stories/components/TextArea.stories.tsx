import React from 'react';
import { fn } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { Text } from '../../src/primitives/Text';
import { TextArea } from '../../src/components/TextArea';
import { VStack } from '../../src/primitives/Stack';
import type { TextAreaProps } from '../../src/components/TextArea';

const meta: Meta<TextAreaProps> = {
  title: 'Components/TextArea',
  component: TextArea,
  parameters: {
    docs: {
      description: {
        component: [
          'Multiline text input for longer content. Extends `TextInputProps` with `multiline` always enabled.',
          '',
          '### Props',
          '- `lines` - Number of visible lines (default: 4). Sets minimum height.',
          '- `label` - Label above the input',
          '- `error` - Error message below',
          '- `required` - Adds * to label',
          '',
          '### When to use',
          '- Notes, descriptions, comments',
          '- Any free-form text longer than a single line',
          '',
          '### When NOT to use',
          '- Single-line inputs → use `Input`',
          '- Rich text editing → not supported',
          '',
          '### Import',
          '```tsx',
          "import { TextArea } from '@polprog/native-ui';",
          '```',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    error: { control: 'text' },
    required: { control: 'boolean' },
    lines: { control: { type: 'number', min: 2, max: 12 } },
    onChangeText: { action: 'onChangeText' },
  },
};

export default meta;
type Story = StoryObj<TextAreaProps>;

export const Playground: Story = {
  args: {
    label: 'Description',
    placeholder: 'Enter a detailed description...',
    lines: 4,
    required: false,
    error: '',
  },
};

export const Default: Story = {
  render: () => (
    <VStack gap="md" style={{ maxWidth: 400 }}>
      <TextArea label="Notes" placeholder="Add your notes here..." onChangeText={fn()} />
    </VStack>
  ),
};

export const DifferentHeights: Story = {
  name: 'Different Line Counts',
  render: () => (
    <VStack gap="lg" style={{ maxWidth: 400 }}>
      {[2, 4, 6, 8].map((lines) => (
        <TextArea key={lines} label={`${lines} lines`} placeholder={`TextArea with ${lines} visible lines`} lines={lines} onChangeText={fn()} />
      ))}
    </VStack>
  ),
};

export const WithError: Story = {
  name: 'Error State',
  render: () => (
    <VStack gap="md" style={{ maxWidth: 400 }}>
      <TextArea label="Description" value="Too short" error="Description must be at least 20 characters" required onChangeText={fn()} />
    </VStack>
  ),
};
