import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { Stepper, type StepperProps } from '../../src/components/Stepper';
import { HStack } from '../../src/primitives/Stack';
import { Text } from '../../src/primitives/Text';

const meta: Meta<StepperProps> = {
  title: 'Components/Stepper',
  tags: ['new'],
  component: Stepper,
  parameters: {
    docs: {
      description: {
        component: [
          'Small number input with a decrease and an increase button, for counts the user changes by a few steps (guests, quantity).',
          '',
          '### Accessibility',
          '- Both buttons are named by `labels.decrease` / `labels.increase` and are disabled at their bound.',
          '- The value is a live region labelled with `accessibilityLabel`, so each change is announced ("Guests: 3").',
          '',
          '### Theming',
          'Button size, radius, value width and type variant come from `components.stepper` and can be overridden in `NativeUIProvider`.',
          '',
          '### Import',
          '```tsx',
          "import { Stepper } from '@polprog/native-ui';",
          '```',
        ].join('\n'),
      },
    },
  },
};

export default meta;
type Story = StoryObj<StepperProps>;

function Guests(props: Partial<StepperProps>) {
  const [guests, setGuests] = useState(2);

  return (
    <HStack gap="md" align="center">
      <Text>Guests</Text>
      <Stepper
        accessibilityLabel="Guests"
        value={guests}
        onChange={setGuests}
        min={1}
        max={4}
        testID="guests"
        {...props}
      />
    </HStack>
  );
}

export const Playground: Story = {
  render: () => <Guests />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const increase = canvas.getByTestId('guests-increase');

    await userEvent.click(increase);
    await userEvent.click(increase);

    await expect(canvas.getByLabelText('Guests: 4')).toBeVisible();
    await expect(increase).toHaveAttribute('aria-disabled', 'true');
  },
};

function Weight() {
  const [weight, setWeight] = useState(2.5);

  return (
    <Stepper
      accessibilityLabel="Weight"
      value={weight}
      onChange={setWeight}
      step={0.5}
      max={10}
      formatValue={(value) => `${value.toFixed(1)} kg`}
    />
  );
}

export const DecimalStep: Story = {
  render: () => <Weight />,
};

export const Disabled: Story = {
  render: () => <Guests disabled />,
};
