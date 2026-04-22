import React from 'react';
import { fn } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { ListItem } from '../../src/components/ListItem';
import { ListSection } from '../../src/components/ListSection';
import { ListSwitchItem } from '../../src/components/ListSwitchItem';
import { VStack } from '../../src/primitives/Stack';
import type { ListSectionProps } from '../../src/components/ListSection';

const meta: Meta<ListSectionProps> = {
  title: 'Components/ListSection',
  component: ListSection,
  parameters: {
    docs: {
      description: {
        component: [
          'Groups ListItem rows into a titled, rounded section. Typically used on settings screens.',
          '',
          '### Anatomy',
          '- Optional uppercase title above',
          '- Surface-colored rounded container for children',
          '- Optional footer note below',
          '',
          '### Import',
          '```tsx',
          "import { ListSection } from '@polprog/native-ui';",
          '```',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    title: { control: 'text' },
    footer: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<ListSectionProps>;

export const Playground: Story = {
  args: { title: 'General' },
  render: (args) => (
    <ListSection {...args} style={{ maxWidth: 400 }}>
      <ListItem title="Language" value="English" onPress={fn()} />
      <ListItem title="Currency" value="EUR" onPress={fn()} />
      <ListItem title="Region" value="Europe" onPress={fn()} hideDivider />
    </ListSection>
  ),
};

export const WithFooter: Story = {
  name: 'With Footer',
  render: () => (
    <ListSection title="Data" footer="Exported data will be saved as CSV to your device." style={{ maxWidth: 400 }}>
      <ListItem title="Export Data" onPress={fn()} />
      <ListItem title="Import Data" onPress={fn()} hideDivider />
    </ListSection>
  ),
};

export const SettingsScreen: Story = {
  name: 'Full Settings Screen',
  render: () => (
    <VStack gap="lg" style={{ maxWidth: 400 }}>
      <ListSection title="Appearance">
        <ListItem title="Theme" value="System" onPress={fn()} />
        <ListItem title="Color Preset" value="Default" onPress={fn()} />
        <ListSwitchItem label="High Contrast" value={false} onValueChange={fn()} hideDivider />
      </ListSection>
      <ListSection title="Notifications">
        <ListSwitchItem label="Push Notifications" value={true} onValueChange={fn()} />
        <ListSwitchItem label="Email Digest" value={false} onValueChange={fn()} hideDivider />
      </ListSection>
      <ListSection title="Danger Zone" footer="This action cannot be undone.">
        <ListItem title="Reset All Data" destructive onPress={fn()} />
        <ListItem title="Delete Account" destructive onPress={fn()} hideDivider />
      </ListSection>
    </VStack>
  ),
};
