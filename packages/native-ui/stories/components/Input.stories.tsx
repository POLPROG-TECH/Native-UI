import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect, fn } from 'storybook/test';
import { Box } from '../../src/primitives/Box';
import { Input } from '../../src/components/Input';
import { Text } from '../../src/primitives/Text';
import { VStack } from '../../src/primitives/Stack';
import type { InputProps } from '../../src/components/Input';

const meta: Meta<InputProps> = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    docs: {
      description: {
        component: [
          'Text input field with label, error state, and accessibility support. Extends all native `TextInputProps`.',
          '',
          '### States',
          '- **Default**: Neutral border',
          '- **Focused**: Primary color border',
          '- **Error**: Error color border + error message below',
          '- **Disabled**: Reduced opacity, not editable',
          '',
          '### Accessibility',
          '- Error messages use `accessibilityLiveRegion="polite"` for screen reader announcements',
          '- Required fields add `*` to the label',
          '- Inherits all TextInput accessibility props',
          '',
          '### Design tokens',
          '- Border radius: `borderRadius.sm` (10px)',
          '- Padding: `spacing.md` (12px) vertical, `spacing.lg` (16px) horizontal',
          '- Typography: `body` (15px)',
          '- Error text: `bodySmall` in `colors.error`',
          '',
          '### Import',
          '```tsx',
          "import { Input } from '@polprog/native-ui';",
          '```',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    label: { control: 'text', description: 'Label displayed above input' },
    placeholder: { control: 'text' },
    error: { control: 'text', description: 'Error message below input' },
    required: { control: 'boolean', description: 'Adds * to label' },
    editable: { control: 'boolean', description: 'Whether input is editable (disabled when false)' },
    secureTextEntry: { control: 'boolean', description: 'Password masking' },
    keyboardType: { control: 'select', options: ['default', 'email-address', 'numeric', 'phone-pad', 'decimal-pad'] },
    onChangeText: { action: 'onChangeText' },
  },
};

export default meta;
type Story = StoryObj<InputProps>;

export const Playground: Story = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    required: false,
    error: '',
    editable: true,
    onChangeText: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('you@example.com');
    await expect(input).toBeInTheDocument();
    await userEvent.clear(input);
    await userEvent.type(input, 'test@example.com');
    await expect(input).toHaveValue('test@example.com');
  },
};

export const WithLabel: Story = {
  name: 'With Label',
  render: () => (
    <VStack gap="md" style={{ maxWidth: 360 }}>
      <Input label="Full Name" placeholder="John Doe" onChangeText={fn()} />
      <Input label="Email" placeholder="john@example.com" keyboardType="email-address" onChangeText={fn()} />
      <Input label="Password" placeholder="Enter password" secureTextEntry onChangeText={fn()} />
    </VStack>
  ),
};

export const Required: Story = {
  name: 'Required Field',
  render: () => (
    <VStack gap="md" style={{ maxWidth: 360 }}>
      <Input label="Project Name" placeholder="My Project" required onChangeText={fn()} />
      <Text variant="caption" color="textTertiary">Required fields show * next to the label</Text>
    </VStack>
  ),
};

export const ErrorState: Story = {
  name: 'Error State',
  render: () => (
    <VStack gap="md" style={{ maxWidth: 360 }}>
      <Input
        label="Email"
        value="not-an-email"
        error="Please enter a valid email address"
        onChangeText={fn()}
      />
      <Input
        label="Amount"
        value=""
        error="Amount is required"
        required
        onChangeText={fn()}
      />
    </VStack>
  ),
};

export const Disabled: Story = {
  name: 'Disabled',
  render: () => (
    <VStack gap="md" style={{ maxWidth: 360 }}>
      <Input label="Username" value="johndoe" editable={false} />
      <Text variant="caption" color="textTertiary">Disabled inputs have reduced opacity and cannot be edited</Text>
    </VStack>
  ),
};

export const KeyboardTypes: Story = {
  name: 'Keyboard Types',
  render: () => (
    <VStack gap="md" style={{ maxWidth: 360 }}>
      <Input label="Default" placeholder="Any text" keyboardType="default" onChangeText={fn()} />
      <Input label="Email" placeholder="email@example.com" keyboardType="email-address" onChangeText={fn()} />
      <Input label="Numeric" placeholder="12345" keyboardType="numeric" onChangeText={fn()} />
      <Input label="Decimal" placeholder="0.00" keyboardType="decimal-pad" onChangeText={fn()} />
      <Input label="Phone" placeholder="+48 123 456 789" keyboardType="phone-pad" onChangeText={fn()} />
    </VStack>
  ),
};

const ControlledExample = () => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const handleChange = (text: string) => {
    setValue(text);
    if (text.length > 0 && text.length < 3) {
      setError('Must be at least 3 characters');
    } else {
      setError('');
    }
  };

  return (
    <VStack gap="md" style={{ maxWidth: 360 }}>
      <Input
        label="Username"
        placeholder="At least 3 characters"
        value={value}
        onChangeText={handleChange}
        error={error}
        required
      />
      <Text variant="caption" color="textTertiary">
        Characters: {value.length}
      </Text>
    </VStack>
  );
};

export const Controlled: Story = {
  name: 'Controlled with Validation',
  render: () => <ControlledExample />,
};

export const FormLayout: Story = {
  name: 'Form Layout',
  render: () => (
    <Box p="lg" bg="surface" radius="lg" elevation="sm" style={{ maxWidth: 400 }}>
      <VStack gap="md">
        <Text variant="h2">Contact Information</Text>
        <Input label="First Name" placeholder="John" required onChangeText={fn()} />
        <Input label="Last Name" placeholder="Doe" required onChangeText={fn()} />
        <Input label="Email" placeholder="john@example.com" keyboardType="email-address" required onChangeText={fn()} />
        <Input label="Phone" placeholder="+48 123 456 789" keyboardType="phone-pad" onChangeText={fn()} />
        <Input label="Notes" placeholder="Optional notes..." onChangeText={fn()} />
      </VStack>
    </Box>
  ),
};
