import React, { useState } from 'react';
import { fn, within, userEvent, expect, waitFor } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
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

const ControlledSelect = (
  props: Partial<SelectProps<string>> & {
    options: SelectOption<string>[];
    spy?: (v: string) => void;
  },
) => {
  const { spy, ...rest } = props;
  const [value, setValue] = useState<string | null>(null);
  return (
    <Select
      {...(rest as any)}
      value={value}
      onChange={(v: string) => {
        setValue(v);
        spy?.(v);
      }}
    />
  );
};

export const Playground: StoryObj<{ onChange: (v: string) => void }> = {
  args: { onChange: fn() },
  render: (args) => (
    <VStack gap="md" style={{ maxWidth: 360 }}>
      <ControlledSelect
        label="Category"
        options={categoryOptions}
        placeholder="Choose a category..."
        spy={args.onChange}
      />
    </VStack>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    // The trigger exposes accessibilityLabel = label ?? placeholder
    const trigger = await canvas.findByRole('button', { name: /category/i });
    await userEvent.click(trigger);
    // The modal portals into body - query the wider screen.
    const screen = within(document.body);
    const option = await waitFor(
      () => screen.getByRole('radio', { name: /food & drink/i }),
      { timeout: 3000 },
    );
    await userEvent.click(option);
    await waitFor(
      async () => {
        await expect(args.onChange).toHaveBeenCalledWith('food');
      },
      { timeout: 3000 },
    );
  },
};

/** Cancelling the modal must NOT call `onChange`. */
export const CancelInteraction: StoryObj<{ onChange: (v: string) => void }> = {
  name: 'Interaction · Cancel does not fire onChange',
  args: { onChange: fn() },
  render: (args) => (
    <VStack gap="md" style={{ maxWidth: 360 }}>
      <ControlledSelect
        label="Category"
        options={categoryOptions}
        placeholder="Choose a category..."
        spy={args.onChange}
      />
    </VStack>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const trigger = await canvas.findByRole('button', { name: /category/i });
    await userEvent.click(trigger);
    const screen = within(document.body);
    const cancel = await waitFor(
      () => screen.getByRole('button', { name: /cancel/i }),
      { timeout: 3000 },
    );
    await userEvent.click(cancel);
    await expect(args.onChange).not.toHaveBeenCalled();
  },
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
        onChange={fn()}
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
      <Select label="Category" value="food" options={categoryOptions} onChange={fn()} disabled />
      <Text variant="caption" color="textTertiary">Disabled selects show the selected value but cannot be changed</Text>
    </VStack>
  ),
};
