import type { Meta, StoryObj } from '@storybook/react';
import { SystemIcon } from '../../src/primitives/SystemIcon';
import type { SystemIconName, SystemIconProps } from '../../src/primitives/SystemIcon';
import { HStack, VStack } from '../../src/primitives/Stack';
import { Text } from '../../src/primitives/Text';

const NAMES: readonly SystemIconName[] = [
  'close',
  'check',
  'alert',
  'info',
  'chevronDown',
  'chevronUp',
  'chevronLeft',
  'chevronRight',
  'plus',
  'minus',
  'search',
  'more',
];

const meta: Meta<SystemIconProps> = {
  title: 'Primitives/SystemIcon',
  tags: ['new'],
  component: SystemIcon,
  parameters: {
    docs: {
      description: {
        component: [
          'Interface glyphs drawn with plain Views. Unlike Unicode characters they look the same on iOS and Android, follow the theme color and scale with `size`.',
          '',
          'Decorative: hidden from screen readers, so the owning control provides the accessible name.',
          '',
          '### Import',
          '```tsx',
          "import { SystemIcon } from '@polprog/native-ui';",
          '```',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    name: { control: 'select', options: NAMES },
    size: { control: { type: 'number', min: 8, max: 64 } },
    color: { control: 'color' },
  },
};

export default meta;
type Story = StoryObj<SystemIconProps>;

export const Playground: Story = {
  args: { name: 'check', size: 24 },
};

export const Gallery: Story = {
  render: () => (
    <HStack gap="lg" wrap>
      {NAMES.map((name) => (
        <VStack key={name} gap="xs" align="center">
          <SystemIcon name={name} size={24} />
          <Text variant="caption" color="textTertiary">
            {name}
          </Text>
        </VStack>
      ))}
    </HStack>
  ),
};
