import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ListHeader } from '../../src/components/ListHeader';
import { VStack } from '../../src/primitives/Stack';
import type { ListHeaderProps } from '../../src/components/ListHeader';

const meta: Meta<ListHeaderProps> = {
  title: 'Components/ListHeader',
  component: ListHeader,
  parameters: {
    docs: {
      description: {
        component: [
          'Screen-level heading for settings and list pages. Uses h1 typography for the title.',
          '',
          '### Import',
          '```tsx',
          "import { ListHeader } from '@polprog/native-ui';",
          '```',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    title: { control: 'text' },
    subtitle: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<ListHeaderProps>;

export const Playground: Story = {
  args: { title: 'Settings', subtitle: 'Manage your preferences' },
};

export const TitleOnly: Story = {
  render: () => <ListHeader title="Settings" />,
};

export const WithSubtitle: Story = {
  render: () => <ListHeader title="Account" subtitle="Manage your profile and security" />,
};

export const Transform: Story = {
  name: 'Title transforms',
  parameters: {
    docs: {
      description: {
        story:
          'The `transform` prop mirrors CSS `text-transform` and also accepts a custom function for arbitrary transformations (e.g. localization, locale-aware uppercasing).',
      },
    },
  },
  render: () => (
    <VStack gap="md">
      <ListHeader title="settings" transform="uppercase" />
      <ListHeader title="SETTINGS" transform="lowercase" />
      <ListHeader title="my account settings" transform="capitalize" />
      <ListHeader title="Settings" transform={(s) => `⚙ ${s} ⚙`} subtitle="Custom function transform" />
    </VStack>
  ),
};
