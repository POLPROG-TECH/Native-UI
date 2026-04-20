import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import { Select } from '../../src/components/Select';
import { Text } from '../../src/primitives/Text';
import { VStack } from '../../src/primitives/Stack';
import type { SelectOption, SelectProps } from '../../src/components/Select';

const categoryOptions: SelectOption<string>[] = [
  { label: 'Food & Drink', value: 'food', icon: '🍕' },
  { label: 'Transport', value: 'transport', icon: '🚗' },
  { label: 'Shopping', value: 'shopping', icon: '🛍️' },
  { label: 'Entertainment', value: 'entertainment', icon: '🎬' },
  { label: 'Health', value: 'health', icon: '💊' },
  { label: 'Education', value: 'education', icon: '📚' },
];

const currencyOptions: SelectOption<string>[] = [
  { label: 'PLN (Polish Złoty)', value: 'PLN' },
  { label: 'EUR (Euro)', value: 'EUR' },
  { label: 'USD (US Dollar)', value: 'USD' },
  { label: 'GBP (British Pound)', value: 'GBP' },
];

const meta: Meta = {
  title: 'Components/Select',
  parameters: {
    docs: {
      description: {
        component: [
          'Modal-based selection control with no native dependencies. Generic over the value type `<T>`.',
          '',
          '### Features',
          '- Modal-based picker (no native picker dependency)',
          '- Optional icons per option',
          '- Checkmark on selected option',
          '- FlatList with max-height 320px for scrollable lists',
          '- Error/required states matching Input component',
          '',
          '### Design tokens',
          '- Same border/label styling as Input',
          '- Modal uses `colors.surfaceElevated`',
          '',
          '### Import',
          '```tsx',
          "import { Select } from '@polprog/native-ui';",
          "import type { SelectOption } from '@polprog/native-ui';",
          '```',
        ].join('\n'),
      },
    },
  },
};

export default meta;

const ControlledSelect = (props: Partial<SelectProps<string>> & { options: SelectOption<string>[] }) => {
  const [value, setValue] = useState<string | null>(null);
  return (
    <Select
      {...(props as any)}
      value={value}
      onChange={(v: string) => {
        setValue(v);
        action('onChange')(v);
      }}
    />
  );
};

export const Playground: StoryObj = {
  render: () => (
    <VStack gap="md" style={{ maxWidth: 360 }}>
      <ControlledSelect label="Category" options={categoryOptions} placeholder="Choose a category..." />
    </VStack>
  ),
};

export const WithIcons: StoryObj = {
  name: 'With Icons',
  render: () => (
    <VStack gap="md" style={{ maxWidth: 360 }}>
      <ControlledSelect label="Category" options={categoryOptions} required />
    </VStack>
  ),
};

export const WithoutIcons: StoryObj = {
  name: 'Without Icons',
  render: () => (
    <VStack gap="md" style={{ maxWidth: 360 }}>
      <ControlledSelect label="Currency" options={currencyOptions} />
    </VStack>
  ),
};

export const ErrorState: StoryObj = {
  name: 'Error State',
  render: () => (
    <VStack gap="md" style={{ maxWidth: 360 }}>
      <Select
        label="Category"
        value={null}
        options={categoryOptions}
        onChange={action('onChange')}
        error="Please select a category"
        required
      />
    </VStack>
  ),
};

export const Disabled: StoryObj = {
  name: 'Disabled',
  render: () => (
    <VStack gap="md" style={{ maxWidth: 360 }}>
      <Select label="Category" value="food" options={categoryOptions} onChange={action('onChange')} disabled />
      <Text variant="caption" color="textTertiary">Disabled selects show the selected value but cannot be changed</Text>
    </VStack>
  ),
};
