import type { Decorator, Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '../../src/components/Button';
import { Tooltip, type TooltipProps } from '../../src/components/Tooltip';
import { Box } from '../../src/primitives/Box';
import { HStack, VStack } from '../../src/primitives/Stack';

const meta: Meta<TooltipProps> = {
  title: 'Components/Tooltip',
  tags: ['new'],
  component: Tooltip,
  args: {
    content: 'Copies the invite link',
    placement: 'top',
  },
  argTypes: {
    placement: { control: 'inline-radio', options: ['top', 'bottom'] },
  },
  parameters: {
    docs: {
      description: {
        component: [
          'Short hint anchored to its child: shown on hover and keyboard focus, and after a long press on touch screens.',
          '',
          '### Accessibility',
          '- The bubble is a visual aid. The child still needs its own `accessibilityLabel`, and nothing essential may live only in a tooltip.',
          '- The bubble never takes touches, so it cannot block the element it describes.',
          '',
          '### Placement',
          '`placement` is a preference. The bubble flips to the other side when the requested one has no room, and slides sideways so it never leaves the window (`components.tooltip.edgeInset`).',
          '',
          '### Theming',
          'Padding, radius, offset, maximum width and timing come from `components.tooltip` and can be overridden in `NativeUIProvider`.',
          '',
          '### Import',
          '```tsx',
          "import { Tooltip } from '@polprog/native-ui';",
          '```',
        ].join('\n'),
      },
    },
  },
};

export default meta;
type Story = StoryObj<TooltipProps>;

const withRoom: Decorator = (Story) => (
  <Box p="3xl">
    <VStack align="center">
      <Story />
    </VStack>
  </Box>
);

export const Playground: Story = {
  decorators: [withRoom],
  render: (args) => (
    <Tooltip {...args} testID="copy-tip">
      <Button title="Copy link" variant="secondary" onPress={() => {}} />
    </Tooltip>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.hover(canvas.getByTestId('copy-tip'));

    await expect(canvas.getByRole('tooltip')).toHaveTextContent('Copies the invite link');

    await userEvent.unhover(canvas.getByTestId('copy-tip'));

    await expect(canvas.queryByRole('tooltip')).not.toBeInTheDocument();
  },
};

export const Placements: Story = {
  decorators: [withRoom],
  render: () => (
    <HStack gap="3xl">
      <Tooltip content="Shown above" placement="top" visible>
        <Button title="Top" variant="secondary" onPress={() => {}} />
      </Tooltip>
      <Tooltip content="Shown below" placement="bottom" visible>
        <Button title="Bottom" variant="secondary" onPress={() => {}} />
      </Tooltip>
    </HStack>
  ),
};

/** No room above or to the left of the trigger: the bubble flips below it and slides right. */
export const NearEdges: Story = {
  render: () => (
    <Tooltip content="Stays inside the window" placement="top" visible testID="corner-tip">
      <Button title="Corner" variant="secondary" onPress={() => {}} />
    </Tooltip>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bubble = await canvas.findByTestId('corner-tip-bubble');

    await waitFor(() => expect(bubble).toBeVisible());

    const box = bubble.getBoundingClientRect();
    const trigger = canvas.getByRole('button', { name: 'Corner' }).getBoundingClientRect();

    await expect(box.left).toBeGreaterThanOrEqual(0);
    await expect(box.top).toBeGreaterThanOrEqual(trigger.bottom);
  },
};

export const Disabled: Story = {
  decorators: [withRoom],
  args: { disabled: true },
  render: (args) => (
    <Tooltip {...args}>
      <Button title="No tooltip" variant="secondary" onPress={() => {}} />
    </Tooltip>
  ),
};
