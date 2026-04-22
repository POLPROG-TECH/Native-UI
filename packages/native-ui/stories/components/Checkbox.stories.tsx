import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Card } from '../../src/components/Card';
import type { CheckboxProps } from '../../src/components/Checkbox';
import { Checkbox } from '../../src/components/Checkbox';
import { HStack, VStack } from '../../src/primitives/Stack';
import { Text } from '../../src/primitives/Text';

const meta: Meta<CheckboxProps> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: {
    docs: {
      description: {
        component: [
          'Binary selection control with optional label. Shows a checkmark (✓) when checked.',
          '',
          '### Accessibility',
          '- `accessibilityRole="checkbox"`',
          '- `accessibilityState.checked` and `accessibilityState.disabled`',
          '- Label used as `accessibilityLabel`',
          '',
          '### Sizes',
          '- `sm`: 18px - compact lists, tables',
          '- `md`: 22px - forms, settings (default)',
          '',
          '### Design tokens',
          '- Checked: `colors.primary` background',
          '- Unchecked: `colors.border` border',
          '- Border radius: `borderRadius.xs` (6px)',
          '',
          '### Import',
          '```tsx',
          "import { Checkbox } from '@polprog/native-ui';",
          '```',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    checked: { control: 'boolean', description: 'Checked state' },
    label: { control: 'text', description: 'Label text' },
    disabled: { control: 'boolean' },
    size: { control: 'select', options: ['sm', 'md'] },
    onChange: { action: 'onChange', description: 'Fires with new checked state' },
  },
};

export default meta;
type Story = StoryObj<CheckboxProps>;

const Interactive = ({ label = 'Accept terms', ...rest }: Partial<CheckboxProps>) => {
  const [checked, setChecked] = useState(false);
  return (
    <Checkbox
      checked={checked}
      onChange={(v) => {
        setChecked(v);
        fn()(v);
      }}
      label={label}
      {...rest}
    />
  );
};

export const Playground: Story = {
  args: { checked: false, label: 'I agree to terms', disabled: false, size: 'md', onChange: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole('checkbox', { name: 'I agree to terms' });
    await expect(checkbox).toBeInTheDocument();
    await userEvent.click(checkbox);
    await expect(args.onChange).toHaveBeenCalledWith(true);
  },
};

export const Checked: Story = {
  render: () => (
    <VStack gap="md">
      <Checkbox checked={false} onChange={fn()} label="Unchecked" />
      <Checkbox checked={true} onChange={fn()} label="Checked" />
    </VStack>
  ),
};

export const Sizes: Story = {
  render: () => (
    <VStack gap="md">
      <Checkbox checked={true} onChange={fn()} label="Small (sm)" size="sm" />
      <Checkbox checked={true} onChange={fn()} label="Medium (md)" size="md" />
    </VStack>
  ),
};

export const Disabled: Story = {
  render: () => (
    <VStack gap="md">
      <Checkbox checked={false} onChange={fn()} label="Disabled unchecked" disabled />
      <Checkbox checked={true} onChange={fn()} label="Disabled checked" disabled />
    </VStack>
  ),
};

export const WithoutLabel: Story = {
  name: 'Without Label',
  render: () => (
    <HStack gap="lg">
      <Checkbox checked={false} onChange={fn()} />
      <Checkbox checked={true} onChange={fn()} />
      <Checkbox checked={true} onChange={fn()} disabled />
    </HStack>
  ),
};

export const FormExample: Story = {
  name: 'Form Checklist',
  render: () => (
    <Card style={{ maxWidth: 360 }}>
      <VStack gap="sm">
        <Text variant="h3">Preferences</Text>
        <Interactive label="Email notifications" />
        <Interactive label="Push notifications" />
        <Interactive label="Marketing emails" />
        <Interactive label="Weekly digest" />
      </VStack>
    </Card>
  ),
};
