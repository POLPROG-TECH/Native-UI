import React from 'react';
import { fn } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { ActionTile } from '../../src/components/ActionTile';
import type { ActionTileProps } from '../../src/components/ActionTile';
import { HStack } from '../../src/primitives/Stack';
import { Text } from '../../src/primitives/Text';

const meta: Meta<ActionTileProps> = {
  title: 'Components/ActionTile',
  component: ActionTile,
  parameters: {
    docs: {
      description: {
        component: [
          'Compact tappable tile with a tinted icon chip and a label below it.',
          '',
          'Designed for quick-action grids on dashboards and home screens. Lay several out in an `HStack` with `flex: 1` each. Press handling is debounced and fires light haptics, matching the other interactive components.',
          '',
          '### Tones',
          'The `tone` prop tints the icon chip background:',
          '',
          '| Tone | Background key |',
          '|---|---|',
          '| `primary` | `primaryLight` (default) |',
          '| `success` | `successLight` |',
          '| `warning` | `warningLight` |',
          '| `error`   | `errorLight` |',
          '| `neutral` | `surfaceSecondary` |',
          '',
          '### Import',
          '```tsx',
          "import { ActionTile } from '@polprog/native-ui';",
          '```',
        ].join('\n'),
      },
    },
  },
  args: {
    onPress: fn(),
  },
  argTypes: {
    label: { control: 'text' },
    tone: { control: 'select', options: ['primary', 'success', 'warning', 'error', 'neutral'] },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<ActionTileProps>;

export const Playground: Story = {
  args: {
    icon: <Text variant="h3">＋</Text>,
    label: 'Add entry',
    tone: 'primary',
    disabled: false,
  },
};

export const QuickActions: Story = {
  name: 'Quick actions grid',
  render: (args) => (
    <HStack gap="md" style={{ width: 360 }}>
      <ActionTile {...args} icon={<Text variant="h3">＋</Text>} label="Add" tone="primary" />
      <ActionTile {...args} icon={<Text variant="h3">◎</Text>} label="Budgets" tone="success" />
      <ActionTile {...args} icon={<Text variant="h3">◔</Text>} label="Analytics" tone="warning" />
    </HStack>
  ),
};

export const Disabled: Story = {
  args: {
    icon: <Text variant="h3">＋</Text>,
    label: 'Disabled',
    disabled: true,
  },
};
