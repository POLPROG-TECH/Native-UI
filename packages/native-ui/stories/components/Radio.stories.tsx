import React, { useState } from 'react';
import { fn } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { Card } from '../../src/components/Card';
import { Radio } from '../../src/components/Radio';
import { Text } from '../../src/primitives/Text';
import { VStack } from '../../src/primitives/Stack';
import type { RadioProps } from '../../src/components/Radio';

const meta: Meta<RadioProps> = {
  title: 'Components/Radio',
  component: Radio,
  parameters: {
    docs: {
      description: {
        component: [
          'Single-selection indicator. Use in a group where only one option can be selected.',
          '',
          '### Accessibility',
          '- `accessibilityRole="radio"`',
          '- `accessibilityState.selected` and `accessibilityState.disabled`',
          '',
          '### Design tokens',
          '- Selected: `colors.primary` fill',
          '- Unselected: `colors.border` ring',
          '- Size: 22px circle',
          '',
          '### Note',
          'Radio is a controlled component - manage selected state in the parent. Use multiple Radio components in a group.',
          '',
          '### Import',
          '```tsx',
          "import { Radio } from '@polprog/native-ui';",
          '```',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    selected: { control: 'boolean' },
    label: { control: 'text' },
    disabled: { control: 'boolean' },
    onPress: { action: 'onPress' },
  },
};

export default meta;
type Story = StoryObj<RadioProps>;

export const Playground: Story = {
  args: { selected: false, label: 'Option A', disabled: false, onPress: fn() },
};

export const States: Story = {
  render: () => (
    <VStack gap="md">
      <Radio selected={false} label="Unselected" onPress={fn()} />
      <Radio selected={true} label="Selected" onPress={fn()} />
      <Radio selected={false} label="Disabled (unselected)" disabled onPress={fn()} />
      <Radio selected={true} label="Disabled (selected)" disabled onPress={fn()} />
    </VStack>
  ),
};

const RadioGroupExample = () => {
  const [selected, setSelected] = useState('monthly');
  const options = [
    { value: 'monthly', label: 'Monthly - €9.99/mo' },
    { value: 'yearly', label: 'Yearly - €99.99/yr (save 17%)' },
    { value: 'lifetime', label: 'Lifetime - €199.99' },
  ];
  return (
    <Card style={{ maxWidth: 360 }}>
      <VStack gap="sm">
        <Text variant="h3">Billing Period</Text>
        {options.map((opt) => (
          <Radio
            key={opt.value}
            selected={selected === opt.value}
            label={opt.label}
            onPress={() => { setSelected(opt.value); fn()(opt.value); }}
          />
        ))}
      </VStack>
    </Card>
  );
};

export const RadioGroup: Story = {
  name: 'Radio Group (Interactive)',
  render: () => <RadioGroupExample />,
};

export const WithoutLabel: Story = {
  name: 'Without Label (indicator only)',
  render: () => (
    <VStack gap="md">
      <Text variant="caption" color="textTertiary">Used as trailing element in ListItem</Text>
      <Radio selected={false} onPress={fn()} accessibilityLabel="Option A" />
      <Radio selected={true} onPress={fn()} accessibilityLabel="Option B" />
    </VStack>
  ),
};
