import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect, fn } from 'storybook/test';
import { Card } from '../../src/components/Card';
import { Switch } from '../../src/components/Switch';
import { Text } from '../../src/primitives/Text';
import { VStack } from '../../src/primitives/Stack';
import type { SwitchProps } from '../../src/components/Switch';

const meta: Meta<SwitchProps> = {
  title: 'Components/Switch',
  component: Switch,
  parameters: {
    docs: {
      description: {
        component: [
          'Toggle control with optional label and subtitle. Wraps React Native\'s `Switch` with consistent styling.',
          '',
          '### Accessibility',
          '- Uses native `Switch` semantics (automatically announced as toggle)',
          '- 44px minimum row height for touch target',
          '',
          '### Design tokens',
          '- Track on: `colors.primary`',
          '- Track off: `colors.border`',
          '',
          '### Import',
          '```tsx',
          "import { Switch } from '@polprog/native-ui';",
          '```',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    value: { control: 'boolean' },
    label: { control: 'text' },
    subtitle: { control: 'text' },
    disabled: { control: 'boolean' },
    onValueChange: { action: 'onValueChange' },
  },
};

export default meta;
type Story = StoryObj<SwitchProps>;

const Interactive = (props: Partial<SwitchProps> & { label?: string }) => {
  const [val, setVal] = useState(false);
  return <Switch value={val} onValueChange={(v) => { setVal(v); fn()(v); }} {...props} />;
};

export const Playground: Story = {
  args: { value: false, label: 'Dark Mode', disabled: false, onValueChange: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByLabelText('Dark Mode');
    await expect(toggle).toBeInTheDocument();
    await userEvent.click(toggle);
    await expect(args.onValueChange).toHaveBeenCalled();
  },
};

export const States: Story = {
  render: () => (
    <VStack gap="md" style={{ maxWidth: 360 }}>
      <Switch value={false} onValueChange={fn()} label="Off" />
      <Switch value={true} onValueChange={fn()} label="On" />
      <Switch value={false} onValueChange={fn()} label="Disabled (off)" disabled />
      <Switch value={true} onValueChange={fn()} label="Disabled (on)" disabled />
    </VStack>
  ),
};

export const WithSubtitle: Story = {
  name: 'With Subtitle',
  render: () => (
    <VStack gap="md" style={{ maxWidth: 360 }}>
      <Interactive label="Push Notifications" subtitle="Receive alerts for new activity" />
      <Interactive label="Auto-Save" subtitle="Automatically save drafts every 30 seconds" />
    </VStack>
  ),
};

export const SettingsPattern: Story = {
  name: 'Settings Screen Pattern',
  render: () => (
    <Card style={{ maxWidth: 400 }}>
      <VStack gap="sm">
        <Text variant="h3">Notifications</Text>
        <Interactive label="Push Notifications" subtitle="Alerts for important updates" />
        <Interactive label="Email Notifications" subtitle="Weekly summary and reports" />
        <Interactive label="Sound" subtitle="Play sound for notifications" />
        <Interactive label="Vibration" />
      </VStack>
    </Card>
  ),
};
