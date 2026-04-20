import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
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
      <ListItem title="Language" value="English" onPress={action('language')} />
      <ListItem title="Currency" value="EUR" onPress={action('currency')} />
      <ListItem title="Region" value="Europe" onPress={action('region')} hideDivider />
    </ListSection>
  ),
};

export const WithFooter: Story = {
  name: 'With Footer',
  render: () => (
    <ListSection title="Data" footer="Exported data will be saved as CSV to your device." style={{ maxWidth: 400 }}>
      <ListItem title="Export Data" onPress={action('export')} />
      <ListItem title="Import Data" onPress={action('import')} hideDivider />
    </ListSection>
  ),
};

export const SettingsScreen: Story = {
  name: 'Full Settings Screen',
  render: () => (
    <VStack gap="lg" style={{ maxWidth: 400 }}>
      <ListSection title="Appearance">
        <ListItem title="Theme" value="System" onPress={action('theme')} />
        <ListItem title="Color Preset" value="Default" onPress={action('preset')} />
        <ListSwitchItem label="High Contrast" value={false} onValueChange={action('contrast')} hideDivider />
      </ListSection>
      <ListSection title="Notifications">
        <ListSwitchItem label="Push Notifications" value={true} onValueChange={action('push')} />
        <ListSwitchItem label="Email Digest" value={false} onValueChange={action('email')} hideDivider />
      </ListSection>
      <ListSection title="Danger Zone" footer="This action cannot be undone.">
        <ListItem title="Reset All Data" destructive onPress={action('reset')} />
        <ListItem title="Delete Account" destructive onPress={action('delete')} hideDivider />
      </ListSection>
    </VStack>
  ),
};
