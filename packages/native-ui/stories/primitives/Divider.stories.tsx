import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Box } from '../../src/primitives/Box';
import { Divider } from '../../src/primitives/Divider';
import { Text } from '../../src/primitives/Text';
import { VStack } from '../../src/primitives/Stack';
import type { DividerProps } from '../../src/primitives/Divider';

const meta: Meta<DividerProps> = {
  title: 'Primitives/Divider',
  component: Divider,
  parameters: {
    docs: {
      description: {
        component: [
          'Thin horizontal separator using theme divider color and hairline width.',
          '',
          '### When to use',
          '- Between list items',
          '- Between content sections',
          '- Visual separation within cards',
          '',
          '### Import',
          '```tsx',
          "import { Divider } from '@polprog/native-ui';",
          '```',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    inset: { control: { type: 'number', min: 0, max: 64, step: 4 }, description: 'Left and right margin inset in pixels' },
  },
};

export default meta;
type Story = StoryObj<DividerProps>;

export const Playground: Story = {
  args: { inset: 0 },
  render: (args) => (
    <VStack gap="md" style={{ maxWidth: 400 }}>
      <Text variant="body">Content above divider</Text>
      <Divider {...args} />
      <Text variant="body">Content below divider</Text>
    </VStack>
  ),
};

export const FullWidth: Story = {
  name: 'Full Width',
  render: () => (
    <Box bg="surface" radius="md" p="md" style={{ maxWidth: 400 }}>
      <VStack gap="md">
        <Text variant="body">Item One</Text>
        <Divider />
        <Text variant="body">Item Two</Text>
        <Divider />
        <Text variant="body">Item Three</Text>
      </VStack>
    </Box>
  ),
};

export const InsetStory: Story = {
  name: 'With Inset',
  render: () => (
    <Box bg="surface" radius="md" style={{ maxWidth: 400, overflow: 'hidden' }}>
      {['Profile', 'Settings', 'Notifications', 'Sign Out'].map((item, idx, arr) => (
        <React.Fragment key={item}>
          <Box px="md" py="md">
            <Text variant="body">{item}</Text>
          </Box>
          {idx < arr.length - 1 && <Divider inset={16} />}
        </React.Fragment>
      ))}
    </Box>
  ),
};
