import React, { useState } from 'react';
import { fn } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../../src/components/Button';
import { InputPrompt } from '../../src/components/InputPrompt';
import { Text } from '../../src/primitives/Text';
import { VStack } from '../../src/primitives/Stack';
import type { InputPromptProps } from '../../src/components/InputPrompt';

const meta: Meta<InputPromptProps> = {
  title: 'Components/InputPrompt',
  component: InputPrompt,
  parameters: {
    docs: {
      description: {
        component: [
          'Cross-platform text-input prompt. Uses native `Alert.prompt` on iOS for a seamless experience, and falls back to a custom `Modal` with a `TextInput` on Android/web.',
          '',
          '> **Storybook note:** In the web Storybook context, the Android/web fallback (custom Modal) is always shown. On iOS devices the native prompt will be used instead.',
          '',
          '### Features',
          '- Native iOS prompt via `Alert.prompt`',
          '- Custom modal fallback for Android & web',
          '- Configurable keyboard type (default, decimal-pad, numeric)',
          '- Customizable submit/cancel labels',
          '',
          '### When to use',
          '- Quick single-value input (rename, set amount, add note)',
          '- When a full form screen would be overkill',
          '',
          '### Import',
          '```tsx',
          "import { InputPrompt } from '@polprog/native-ui';",
          '```',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    visible: { control: 'boolean', description: 'Whether the prompt is visible' },
    title: { control: 'text', description: 'Prompt title' },
    message: { control: 'text', description: 'Optional message below title' },
    placeholder: { control: 'text', description: 'Input placeholder text' },
    keyboardType: {
      control: 'select',
      options: ['default', 'decimal-pad', 'numeric'],
      description: 'Keyboard type for the input',
    },
    submitLabel: { control: 'text', description: 'Submit button label' },
    cancelLabel: { control: 'text', description: 'Cancel button label' },
    onSubmit: { action: 'onSubmit' },
    onCancel: { action: 'onCancel' },
  },
};

export default meta;
type Story = StoryObj<InputPromptProps>;

export const Playground: Story = {
  args: {
    visible: true,
    title: 'Rename Item',
    placeholder: 'Enter new name',
    onSubmit: fn(),
    onCancel: fn(),
  },
};

const PromptDemo = (props: Omit<InputPromptProps, 'visible' | 'onSubmit' | 'onCancel'>) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button title="Open Prompt" onPress={() => setVisible(true)} />
      <InputPrompt
        {...props}
        visible={visible}
        onSubmit={(value) => { setVisible(false); fn()(value); }}
        onCancel={() => { setVisible(false); fn()(); }}
      />
    </>
  );
};

export const Default: Story = {
  render: () => (
    <PromptDemo title="Rename Item" placeholder="Enter new name" />
  ),
};

export const WithMessage: Story = {
  name: 'With Message',
  render: () => (
    <PromptDemo
      title="Add Note"
      message="Enter a short description for this entry."
      placeholder="e.g. Coffee with friends"
    />
  ),
};

export const NumericInput: Story = {
  name: 'Numeric Input',
  render: () => (
    <PromptDemo
      title="Set Budget"
      message="Enter your monthly budget amount."
      placeholder="0.00"
      keyboardType="decimal-pad"
    />
  ),
};

export const CustomLabels: Story = {
  name: 'Custom Labels',
  render: () => (
    <PromptDemo
      title="Set Goal"
      message="How much would you like to save this month?"
      placeholder="Amount"
      keyboardType="numeric"
      submitLabel="Save Goal"
      cancelLabel="Not Now"
    />
  ),
};

export const Hidden: Story = {
  name: 'Hidden (visible=false)',
  render: () => (
    <VStack gap="md">
      <Text variant="body" color="textSecondary">
        The InputPrompt below has visible=false. Nothing is rendered.
      </Text>
      <InputPrompt
        visible={false}
        title="Hidden Prompt"
        onSubmit={fn()}
        onCancel={fn()}
      />
    </VStack>
  ),
};
