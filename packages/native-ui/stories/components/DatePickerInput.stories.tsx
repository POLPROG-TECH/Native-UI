import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { Box } from '../../src/primitives/Box';
import { Text } from '../../src/primitives/Text';
import { VStack } from '../../src/primitives/Stack';
import { DatePickerInput } from '../../src/components/DatePickerInput';
import type { DatePickerInputProps } from '../../src/components/DatePickerInput';

const meta: Meta<DatePickerInputProps> = {
  title: 'Components/DatePickerInput',
  component: DatePickerInput,
  parameters: {
    docs: {
      description: {
        component: [
          'Cross-platform date/time picker that adapts to iOS and Android native pickers.',
          'Falls back to a read-only text display if `@react-native-community/datetimepicker` is not installed.',
          '',
          '### Modes',
          '- **date** (default): Pick a date → value format `YYYY-MM-DD`',
          '- **time**: Pick a time → value format `HH:MM`',
          '- **datetime**: Pick date then time → value format `YYYY-MM-DDTHH:MM`',
          '',
          '### Features',
          '- Controlled open/close with `isOpen` / `onOpen` / `onClose`',
          '- Clearable selection with `clearable` / `onClear`',
          '- Disabled state with reduced opacity',
          '- Placeholder text when no value is set',
          '- Min/Max date constraints',
          '- Error state with message',
          '- Custom icon support',
          '',
          '### Accessibility',
          '- Trigger row is pressable with proper disabled state',
          '- Error messages shown below the field',
          '- Required indicator `*` in label',
          '',
          '### Design tokens',
          '- Border radius: `borderRadius.md`',
          '- Disabled opacity: `opacity.disabled` (0.5)',
          '- Placeholder color: `colors.textTertiary`',
          '- Error border: `colors.error`',
          '',
          '### Import',
          '```tsx',
          "import { DatePickerInput } from '@polprog/native-ui';",
          '```',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    label: { control: 'text', description: 'Label displayed above the picker' },
    placeholder: { control: 'text', description: 'Placeholder text when no value selected' },
    mode: {
      control: 'select',
      options: ['date', 'time', 'datetime'],
      description: 'Picker mode',
    },
    disabled: { control: 'boolean', description: 'Disable interaction' },
    clearable: { control: 'boolean', description: 'Show clear button when value is set' },
    required: { control: 'boolean', description: 'Adds * to label' },
    error: { control: 'text', description: 'Error message below field' },
    value: { control: 'text', description: 'Current value (ISO format)' },
    onChange: { action: 'onChange' },
    onClear: { action: 'onClear' },
    onOpen: { action: 'onOpen' },
    onClose: { action: 'onClose' },
  },
};

export default meta;
type Story = StoryObj<DatePickerInputProps>;

export const Playground: Story = {
  args: {
    label: 'Date of Birth',
    placeholder: 'Select a date',
    mode: 'date',
    value: '',
    disabled: false,
    clearable: false,
    required: false,
    error: '',
    onChange: fn(),
  },
};

export const WithValue: Story = {
  name: 'With Value',
  render: () => (
    <VStack gap="md" style={{ maxWidth: 360 }}>
      <DatePickerInput label="Start Date" value="2024-06-15" onChange={fn()} />
      <DatePickerInput label="Meeting Time" value="14:30" mode="time" onChange={fn()} />
      <DatePickerInput
        label="Event Start"
        value="2024-06-15T14:30"
        mode="datetime"
        onChange={fn()}
      />
    </VStack>
  ),
};

export const Placeholder: Story = {
  name: 'Placeholder',
  render: () => (
    <VStack gap="md" style={{ maxWidth: 360 }}>
      <DatePickerInput
        label="Appointment"
        placeholder="Choose a date..."
        value=""
        onChange={fn()}
      />
      <Text variant="caption" color="textTertiary">
        Placeholder is shown when value is empty
      </Text>
    </VStack>
  ),
};

export const Clearable: Story = {
  name: 'Clearable',
  render: () => {
    const ClearableExample = () => {
      const [value, setValue] = useState('2024-03-20');

      return (
        <VStack gap="md" style={{ maxWidth: 360 }}>
          <DatePickerInput
            label="Due Date"
            value={value}
            onChange={setValue}
            clearable
            onClear={() => setValue('')}
            placeholder="No date selected"
          />
          <Text variant="caption" color="textTertiary">
            Current value: {value || '(empty)'}
          </Text>
        </VStack>
      );
    };

    return <ClearableExample />;
  },
};

export const Disabled: Story = {
  name: 'Disabled',
  render: () => (
    <VStack gap="md" style={{ maxWidth: 360 }}>
      <DatePickerInput label="Locked Date" value="2024-01-01" disabled onChange={fn()} />
      <Text variant="caption" color="textTertiary">
        Disabled pickers have reduced opacity and cannot be opened
      </Text>
    </VStack>
  ),
};

export const ErrorState: Story = {
  name: 'Error State',
  render: () => (
    <VStack gap="md" style={{ maxWidth: 360 }}>
      <DatePickerInput
        label="Deadline"
        value=""
        error="Please select a deadline"
        required
        placeholder="Required"
        onChange={fn()}
      />
      <DatePickerInput
        label="Start Date"
        value="2024-12-31"
        error="Date cannot be in the future"
        onChange={fn()}
      />
    </VStack>
  ),
};

export const DateConstraints: Story = {
  name: 'Min/Max Date Constraints',
  render: () => (
    <VStack gap="md" style={{ maxWidth: 360 }}>
      <DatePickerInput
        label="Booking Date"
        value="2024-06-15"
        minimumDate={new Date(2024, 0, 1)}
        maximumDate={new Date(2024, 11, 31)}
        onChange={fn()}
      />
      <Text variant="caption" color="textTertiary">
        Constrained to year 2024 (Jan 1 - Dec 31)
      </Text>
    </VStack>
  ),
};

export const Modes: Story = {
  name: 'All Modes',
  render: () => (
    <VStack gap="lg" style={{ maxWidth: 360 }}>
      <Box>
        <Text variant="caption" color="textTertiary">
          mode=&quot;date&quot;
        </Text>
        <DatePickerInput label="Date" value="2024-06-15" mode="date" onChange={fn()} />
      </Box>
      <Box>
        <Text variant="caption" color="textTertiary">
          mode=&quot;time&quot;
        </Text>
        <DatePickerInput label="Time" value="09:30" mode="time" onChange={fn()} />
      </Box>
      <Box>
        <Text variant="caption" color="textTertiary">
          mode=&quot;datetime&quot;
        </Text>
        <DatePickerInput
          label="DateTime"
          value="2024-06-15T09:30"
          mode="datetime"
          onChange={fn()}
        />
      </Box>
    </VStack>
  ),
};

const ControlledExample = () => {
  const [value, setValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <VStack gap="md" style={{ maxWidth: 360 }}>
      <DatePickerInput
        label="Controlled Picker"
        value={value}
        onChange={setValue}
        isOpen={isOpen}
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
        clearable
        onClear={() => setValue('')}
        placeholder="Pick a date"
      />
      <Text variant="caption" color="textTertiary">
        isOpen: {String(isOpen)} | value: {value || '(none)'}
      </Text>
    </VStack>
  );
};

export const Controlled: Story = {
  name: 'Controlled Open/Close',
  render: () => <ControlledExample />,
};
