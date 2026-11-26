import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { PinInput, type PinInputProps } from '../../src/components/PinInput';
import { VStack } from '../../src/primitives/Stack';
import { Text } from '../../src/primitives/Text';

const meta: Meta<PinInputProps> = {
  title: 'Components/PinInput',
  tags: ['new'],
  component: PinInput,
  parameters: {
    docs: {
      description: {
        component: [
          'Fixed-length numeric code entry (one-time code or PIN) drawn as separate cells. A single transparent text field sits over the cells, so paste, SMS autofill and the hardware keyboard work as for any text field.',
          '',
          '### Accessibility',
          '- Announced as one text field named by `accessibilityLabel` (required); the cells are decorative.',
          '- Progress is spoken as its value ("3 of 6 digits entered", from `labels.pinProgress`).',
          '- `invalid` changes the border color only: pair it with a visible error text such as `FieldError`.',
          '',
          '### Theming',
          'Cell size, radius, gap and the default length come from `components.pinInput` and can be overridden in `NativeUIProvider`.',
          '',
          '### Import',
          '```tsx',
          "import { PinInput } from '@polprog/native-ui';",
          '```',
        ].join('\n'),
      },
    },
  },
};

export default meta;
type Story = StoryObj<PinInputProps>;

function Code(props: Partial<PinInputProps>) {
  const [code, setCode] = useState('');
  const [done, setDone] = useState(false);

  return (
    <VStack gap="sm">
      <PinInput
        accessibilityLabel="Verification code"
        value={code}
        onChangeText={(next) => {
          setCode(next);
          setDone(false);
        }}
        onComplete={() => setDone(true)}
        {...props}
      />
      <Text variant="caption" color="textTertiary">
        {done ? 'Code complete' : 'Enter the code from the message'}
      </Text>
    </VStack>
  );
}

export const Playground: Story = {
  render: () => <Code length={4} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByLabelText('Verification code'), '4821');

    await expect(canvas.getByText('Code complete')).toBeVisible();
  },
};

export const Secure: Story = {
  render: () => <Code length={4} secure accessibilityLabel="PIN" />,
};

export const Invalid: Story = {
  render: () => (
    <VStack gap="xs">
      <PinInput
        accessibilityLabel="Verification code, the code is incorrect"
        value="1234"
        onChangeText={() => {}}
        length={4}
        invalid
      />
      <Text variant="caption" color="error">
        The code is incorrect.
      </Text>
    </VStack>
  ),
};

export const Disabled: Story = {
  render: () => <Code length={4} disabled />,
};
