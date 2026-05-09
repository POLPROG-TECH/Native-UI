import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { Text } from '../../src/primitives/Text';
import { VStack } from '../../src/primitives/Stack';
import { DateRangePickerInput } from '../../src/components/DateRangePickerInput';
import type {
  DateRangePickerInputProps,
  DateRangeValue,
} from '../../src/components/DateRangePickerInput';

const meta: Meta<DateRangePickerInputProps> = {
  title: 'Components/DateRangePickerInput',
  component: DateRangePickerInput,
  parameters: {
    docs: {
      description: {
        component: [
          'A date-range input composed of two `DatePickerInput` pickers displayed side-by-side.',
          '',
          'The start date automatically constrains the end picker minimum, and the',
          'end date constrains the start picker maximum - preventing invalid ranges.',
          '',
          '### Features',
          '- Cross-constraint validation between start and end pickers',
          '- Independent error messages for each picker',
          '- Custom labels and placeholders for start/end',
          '- Clearable selection on each picker',
          '- Disabled state for both pickers',
          '- Min/Max global date constraints',
          '- Optional top-level label with required indicator',
          '',
          '### Import',
          '```tsx',
          "import { DateRangePickerInput } from '@polprog/native-ui';",
          '```',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    label: { control: 'text', description: 'Label above the range picker' },
    startLabel: { control: 'text', description: 'Label for the start picker' },
    endLabel: { control: 'text', description: 'Label for the end picker' },
    startPlaceholder: { control: 'text', description: 'Placeholder for the start picker' },
    endPlaceholder: { control: 'text', description: 'Placeholder for the end picker' },
    startError: { control: 'text', description: 'Error message for the start picker' },
    endError: { control: 'text', description: 'Error message for the end picker' },
    disabled: { control: 'boolean', description: 'Disable both pickers' },
    clearable: { control: 'boolean', description: 'Show clear button when value is set' },
    required: { control: 'boolean', description: 'Adds * to the label' },
    onChange: { action: 'onChange' },
  },
};

export default meta;
type Story = StoryObj<DateRangePickerInputProps>;

export const Playground: Story = {
  args: {
    label: 'Booking period',
    value: { start: '2024-06-01', end: '2024-06-14' },
    startLabel: 'Start',
    endLabel: 'End',
    startPlaceholder: 'Check-in',
    endPlaceholder: 'Check-out',
    disabled: false,
    clearable: false,
    required: false,
    startError: '',
    endError: '',
    onChange: fn(),
  },
};

export const WithValues: Story = {
  name: 'With Values',
  render: () => (
    <VStack gap="md" style={{ maxWidth: 480 }}>
      <DateRangePickerInput
        label="Project timeline"
        value={{ start: '2024-03-01', end: '2024-09-30' }}
        onChange={fn()}
      />
      <Text variant="caption" color="textTertiary">
        Default start/end labels are used when not specified
      </Text>
    </VStack>
  ),
};

export const CustomLabels: Story = {
  name: 'Custom Labels',
  render: () => (
    <VStack gap="md" style={{ maxWidth: 480 }}>
      <DateRangePickerInput
        label="Travel dates"
        value={{ start: '2024-07-10', end: '2024-07-24' }}
        onChange={fn()}
        startLabel="Departure"
        endLabel="Return"
        startPlaceholder="Fly out"
        endPlaceholder="Fly back"
      />
    </VStack>
  ),
};

export const EmptyWithPlaceholders: Story = {
  name: 'Empty with Placeholders',
  render: () => (
    <VStack gap="md" style={{ maxWidth: 480 }}>
      <DateRangePickerInput
        label="Rental period"
        value={{ start: '', end: '' }}
        onChange={fn()}
        startPlaceholder="Pick-up date"
        endPlaceholder="Drop-off date"
      />
      <Text variant="caption" color="textTertiary">
        Placeholders are shown when values are empty
      </Text>
    </VStack>
  ),
};

export const WithErrors: Story = {
  name: 'With Errors',
  render: () => (
    <VStack gap="md" style={{ maxWidth: 480 }}>
      <DateRangePickerInput
        label="Event period"
        value={{ start: '', end: '' }}
        onChange={fn()}
        startError="Start date is required"
        endError="End date is required"
        required
      />
    </VStack>
  ),
};

export const Disabled: Story = {
  name: 'Disabled',
  render: () => (
    <VStack gap="md" style={{ maxWidth: 480 }}>
      <DateRangePickerInput
        label="Locked range"
        value={{ start: '2024-01-01', end: '2024-12-31' }}
        onChange={fn()}
        disabled
      />
      <Text variant="caption" color="textTertiary">
        Disabled ranges have reduced opacity and cannot be edited
      </Text>
    </VStack>
  ),
};

export const DateConstraints: Story = {
  name: 'Min/Max Constraints',
  render: () => (
    <VStack gap="md" style={{ maxWidth: 480 }}>
      <DateRangePickerInput
        label="Q2 2024 only"
        value={{ start: '2024-04-15', end: '2024-05-30' }}
        onChange={fn()}
        minimumDate={new Date(2024, 3, 1)}
        maximumDate={new Date(2024, 5, 30)}
      />
      <Text variant="caption" color="textTertiary">
        Constrained to Apr 1 - Jun 30, 2024
      </Text>
    </VStack>
  ),
};

export const Clearable: Story = {
  name: 'Clearable',
  render: () => {
    const ClearableExample = () => {
      const [value, setValue] = useState<DateRangeValue>({
        start: '2024-06-01',
        end: '2024-06-14',
      });

      return (
        <VStack gap="md" style={{ maxWidth: 480 }}>
          <DateRangePickerInput
            label="Flexible dates"
            value={value}
            onChange={setValue}
            clearable
            startPlaceholder="From"
            endPlaceholder="To"
          />
          <Text variant="caption" color="textTertiary">
            Start: {value.start || '(empty)'} | End: {value.end || '(empty)'}
          </Text>
        </VStack>
      );
    };

    return <ClearableExample />;
  },
};
