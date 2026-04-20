import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Box } from '../../src/primitives/Box';
import { ListItem } from '../../src/components/ListItem';
import { ListSection } from '../../src/components/ListSection';
import { SectionLabel } from '../../src/primitives/SectionLabel';
import { VStack } from '../../src/primitives/Stack';
import type { SectionLabelProps } from '../../src/primitives/SectionLabel';

const meta: Meta<SectionLabelProps> = {
  title: 'Primitives/SectionLabel',
  component: SectionLabel,
  parameters: {
    docs: {
      description: {
        component: [
          'Uppercase label placed above grouped list items. Matches the iOS Settings-style group header.',
          '',
          '- Uses the `overline` typography variant (tighter, wider-tracked than `labelSmall`).',
          '- Renders with `accessibilityRole="header"` for screen readers.',
          '- Color defaults to `theme.colors.textTertiary`; override via `color`.',
          '',
          'Pair with `ListSection` for the canonical pattern:',
          '```tsx',
          '<SectionLabel>Account</SectionLabel>',
          '<ListSection>',
          '  <ListItem title="Email" subtitle="me@acme.com" />',
          '  <ListItem title="Password" />',
          '</ListSection>',
          '```',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    children: { control: 'text' },
    transform: {
      control: 'select',
      options: ['uppercase', 'lowercase', 'capitalize', 'none'],
    },
    color: { control: 'color' },
  },
};

export default meta;
type Story = StoryObj<SectionLabelProps>;

export const Playground: Story = {
  args: { children: 'Account', transform: 'uppercase' },
};

export const Transforms: Story = {
  render: () => (
    <VStack gap="sm">
      <SectionLabel transform="uppercase">uppercase (default)</SectionLabel>
      <SectionLabel transform="capitalize">capitalize each word</SectionLabel>
      <SectionLabel transform="lowercase">LOWERCASE</SectionLabel>
      <SectionLabel transform="none">Leave As Written</SectionLabel>
    </VStack>
  ),
};

export const WithinSettingsGroup: Story = {
  name: 'Within a Settings Group',
  render: () => (
    <Box bg="background" p="md">
      <SectionLabel>Account</SectionLabel>
      <ListSection>
        <ListItem title="Email" subtitle="me@example.com" />
        <ListItem title="Password" subtitle="Last changed 3 months ago" />
        <ListItem title="Two-factor auth" subtitle="Enabled" />
      </ListSection>
      <SectionLabel>Notifications</SectionLabel>
      <ListSection>
        <ListItem title="Push" subtitle="On" />
        <ListItem title="Email digest" subtitle="Weekly" />
      </ListSection>
    </Box>
  ),
};
