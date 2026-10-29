import { useState } from 'react';
import { fn, within, userEvent, expect, waitFor } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { Select } from '../../src/components/Select';
import { Text } from '../../src/primitives/Text';
import { SystemIcon } from '../../src/primitives/SystemIcon';
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

/* Render-function icons follow the theme: textSecondary, primaryText when selected. */
const priorityOptions: SelectOption<string>[] = [
  { label: 'Information', value: 'info', icon: (p) => <SystemIcon name="info" {...p} /> },
  { label: 'Warning', value: 'warning', icon: (p) => <SystemIcon name="alert" {...p} /> },
  { label: 'Done', value: 'done', icon: (p) => <SystemIcon name="check" {...p} /> },
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
    a11y: {
      /*
       * react-native-web's Modal renders aria-modal without role="dialog";
       * the native Modal has no such markup.
       */
      options: { rules: { 'aria-allowed-attr': { enabled: false } } },
    },
    docs: {
      description: {
        component: [
          'Selection control with no native dependencies. Generic over the value type `<T>`.',
          '',
          '### Features',
          '- Options open in a `BottomSheet`: drag handle, swipe and VoiceOver escape-gesture dismissal, keyboard avoidance, safe area',
          '- The sheet is capped at `bottomSheet.maxWidth` (640) and centered on tablets and web',
          '- Optional icons per option: an `IconSlot` render function `({ color, size }) => node`, a node or an emoji string',
          '- Hairline separators, checkmark on the selected option',
          '- Full-width Cancel action that closes without calling `onChange`',
          '- Keyboard focus ring on the trigger and the options',
          '- Error/required states matching Input component',
          '',
          '### Design tokens',
          '- `theme.components.select` for the trigger and option rows',
          '- `theme.components.bottomSheet` for the sheet surface, handle, paddings and width cap',
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
  props: Omit<SelectProps<string>, 'value' | 'onChange'> & {
    options: SelectOption<string>[];
    spy?: (v: string) => void;
  },
) => {
  const { spy, ...rest } = props;
  const [value, setValue] = useState<string | null>(null);

  return (
    <Select
      {...rest}
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
    /* The trigger exposes accessibilityLabel = label ?? placeholder */
    const trigger = await canvas.findByRole('button', { name: /category/i });
    await userEvent.click(trigger);
    /* The modal portals into body - query the wider screen. */
    const screen = within(document.body);
    const option = await waitFor(() => screen.getByRole('radio', { name: /food & drink/i }), {
      timeout: 3000,
    });
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
  /* The play function finds the button by its English label; pin the locale for every theme run. */
  globals: { locale: 'en' },
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
    const cancel = await waitFor(() => screen.getByRole('button', { name: /cancel/i }), {
      timeout: 3000,
    });
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

export const WithIconSlots: StoryObj = {
  name: 'With Themed Icons',
  render: () => (
    <VStack gap="md" style={{ maxWidth: 360 }}>
      <ControlledSelect label="Priority" options={priorityOptions} />
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
  parameters: {
    a11y: {
      /* WCAG 1.4.3 exempts inactive controls; the dimmed look is intentional. */
      options: { rules: { 'color-contrast': { enabled: false } } },
    },
  },
  render: () => (
    <VStack gap="md" style={{ maxWidth: 360 }}>
      <Select label="Category" value="food" options={categoryOptions} onChange={fn()} disabled />
      <Text variant="caption" color="textTertiary">
        Disabled selects show the selected value but cannot be changed
      </Text>
    </VStack>
  ),
};
