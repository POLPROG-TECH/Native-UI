import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { action as sbAction } from 'storybook/actions';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Section } from '../../src/components/Section';
import { Text } from '../../src/primitives/Text';
import { VStack } from '../../src/primitives/Stack';
import type { SectionProps } from '../../src/components/Section';

const meta: Meta<SectionProps> = {
  title: 'Components/Section',
  component: Section,
  parameters: {
    docs: {
      description: {
        component: [
          'Content section with a title header and optional action element. Used to organize screen content into labeled groups.',
          '',
          '### Anatomy',
          '- Title (h3 typography)',
          '- Optional action element (button, link)',
          '- Children content',
          '',
          '### Import',
          '```tsx',
          "import { Section } from '@polprog/native-ui';",
          '```',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    title: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<SectionProps>;

export const Playground: Story = {
  args: { title: 'Recent Entries' },
  render: (args) => (
    <Section {...args} style={{ maxWidth: 400 }}>
      <Card><Text variant="body" color="textSecondary">Section content</Text></Card>
    </Section>
  ),
};

export const WithAction: Story = {
  name: 'With Action',
  render: () => (
    <Section title="Recent Entries" action={<Button title="See All" variant="ghost" size="sm" onPress={sbAction('seeAll')} />} style={{ maxWidth: 400 }}>
      <Card><Text variant="body" color="textSecondary">List of recent entries...</Text></Card>
    </Section>
  ),
};

export const MultipleSections: Story = {
  name: 'Multiple Sections',
  render: () => (
    <VStack gap="xl" style={{ maxWidth: 400 }}>
      <Section title="This Month" action={<Button title="Details" variant="ghost" size="sm" onPress={sbAction('details')} />}>
        <Card>
          <VStack gap="xs">
            <Text variant="mono">€2,450.00</Text>
            <Text variant="bodySmall" color="textSecondary">Total spending</Text>
          </VStack>
        </Card>
      </Section>
      <Section title="Categories">
        <Card><Text variant="body" color="textSecondary">Category breakdown chart...</Text></Card>
      </Section>
      <Section title="Recent">
        <VStack gap="sm">
          <Card><Text variant="body">Entry 1</Text></Card>
          <Card><Text variant="body">Entry 2</Text></Card>
        </VStack>
      </Section>
    </VStack>
  ),
};
