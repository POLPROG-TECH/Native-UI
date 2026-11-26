import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { Slider, type SliderProps } from '../../src/components/Slider';
import { VStack } from '../../src/primitives/Stack';
import { Text } from '../../src/primitives/Text';

const meta: Meta<SliderProps> = {
  title: 'Components/Slider',
  tags: ['new'],
  component: Slider,
  parameters: {
    docs: {
      description: {
        component: [
          'Picks a number from a range by dragging a thumb along a track. A tap on the track moves the value to that point; a vertical swipe that starts on the slider scrolls the page and leaves the value alone.',
          '',
          '### Accessibility',
          '- Exposed as an `adjustable` (web: `slider`) with its range, value and the text from `formatValue`.',
          '- Screen readers change it with the increment and decrement gestures; one gesture moves one `step`, or 10% of the range for a continuous slider.',
          '- `accessibilityLabel` is required: a slider has no visible text of its own.',
          '- On web it takes keyboard focus: arrows move one step, Home and End jump to the bounds.',
          '',
          '### Theming',
          'Track height, thumb size and colors come from `components.slider` and can be overridden in `NativeUIProvider`.',
          '',
          '### Import',
          '```tsx',
          "import { Slider } from '@polprog/native-ui';",
          '```',
        ].join('\n'),
      },
    },
  },
};

export default meta;
type Story = StoryObj<SliderProps>;

const percent = (value: number) => `${value}%`;

function Volume(props: Partial<SliderProps>) {
  const [volume, setVolume] = useState(40);

  return (
    <VStack gap="sm">
      <Slider
        accessibilityLabel="Volume"
        value={volume}
        onValueChange={setVolume}
        maximumValue={100}
        step={5}
        formatValue={percent}
        {...props}
      />
      <Text variant="caption" color="textTertiary">
        Volume: {percent(volume)}
      </Text>
    </VStack>
  );
}

export const Playground: Story = {
  render: () => <Volume />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const slider = canvas.getByRole('slider', { name: 'Volume' });

    await expect(slider).toHaveAttribute('aria-valuenow', '40');

    slider.focus();
    await userEvent.keyboard('{ArrowRight}{ArrowRight}');

    await expect(slider).toHaveAttribute('aria-valuenow', '50');
    await expect(canvas.getByText('Volume: 50%')).toBeVisible();

    await userEvent.keyboard('{End}');

    await expect(slider).toHaveAttribute('aria-valuetext', '100%');
  },
};

function Opacity() {
  const [opacity, setOpacity] = useState(0.5);

  return (
    <VStack gap="sm">
      <Slider
        accessibilityLabel="Opacity"
        value={opacity}
        onValueChange={setOpacity}
        formatValue={(value) => value.toFixed(2)}
      />
      <Text variant="caption" color="textTertiary">
        Opacity: {opacity.toFixed(2)}
      </Text>
    </VStack>
  );
}

export const Continuous: Story = {
  render: () => <Opacity />,
};

export const Disabled: Story = {
  render: () => <Volume disabled />,
};
