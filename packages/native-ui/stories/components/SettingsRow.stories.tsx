import React, { useState } from 'react';
import { Text as RNText } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import { Box } from '../../src/primitives/Box';
import { SettingsRow, SettingsSwitchRow } from '../../src/components/SettingsRow';
import { Text } from '../../src/primitives/Text';
import { VStack } from '../../src/primitives/Stack';
import type { SettingsRowProps } from '../../src/components/SettingsRow';

const meta: Meta<SettingsRowProps> = {
  title: 'Components/SettingsRow',
  component: SettingsRow,
  parameters: {
    docs: {
      description: {
        component: [
          'High-level settings row that wraps `ListItem` with emoji icon backgrounds. Designed for building iOS-style settings screens quickly.',
          '',
          '### Anatomy',
          '- Emoji icon with colored background circle',
          '- Title + optional subtitle',
          '- Optional right-aligned value text',
          '- Optional trailing element or auto chevron',
          '',
          '### Related',
          '- `SettingsSwitchRow` - toggle variant using `ListSwitchItem`',
          '- `ListItem` - lower-level building block',
          '',
          '### Import',
          '```tsx',
          "import { SettingsRow, SettingsSwitchRow } from '@polprog/native-ui';",
          '```',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    label: { control: 'text', description: 'Row label' },
    subtitle: { control: 'text', description: 'Secondary text below label' },
    value: { control: 'text', description: 'Right-aligned value text' },
    icon: { control: 'text', description: 'Emoji icon character' },
    showChevron: { control: 'boolean', description: 'Show trailing chevron' },
    destructive: { control: 'boolean', description: 'Red destructive styling' },
    disabled: { control: 'boolean', description: 'Disabled state' },
    isLast: { control: 'boolean', description: 'Hide bottom divider' },
    onPress: { action: 'onPress' },
  },
};

export default meta;
type Story = StoryObj<SettingsRowProps>;

export const Playground: Story = {
  args: {
    label: 'General',
    icon: '⚙️',
    subtitle: '',
    value: '',
    destructive: false,
    disabled: false,
    isLast: false,
    onPress: action('onPress'),
  },
};

export const Default: Story = {
  name: 'Navigation Rows',
  render: () => (
    <Box bg="surface" radius="lg" style={{ maxWidth: 400, overflow: 'hidden' }}>
      <SettingsRow label="General" icon="⚙️" onPress={action('general')} />
      <SettingsRow label="Notifications" icon="🔔" onPress={action('notifications')} />
      <SettingsRow label="Appearance" icon="🎨" onPress={action('appearance')} />
      <SettingsRow label="Privacy" icon="🔒" onPress={action('privacy')} isLast />
    </Box>
  ),
};

export const WithSubtitle: Story = {
  name: 'With Subtitle',
  render: () => (
    <Box bg="surface" radius="lg" style={{ maxWidth: 400, overflow: 'hidden' }}>
      <SettingsRow label="Account" subtitle="john@example.com" icon="👤" onPress={action('account')} />
      <SettingsRow label="Storage" subtitle="2.3 GB of 5 GB used" icon="💾" onPress={action('storage')} />
      <SettingsRow label="Backup" subtitle="Last backup: 2 hours ago" icon="☁️" onPress={action('backup')} isLast />
    </Box>
  ),
};

export const WithValue: Story = {
  name: 'With Value',
  render: () => (
    <Box bg="surface" radius="lg" style={{ maxWidth: 400, overflow: 'hidden' }}>
      <SettingsRow label="Language" icon="🌐" value="English" onPress={action('language')} />
      <SettingsRow label="Currency" icon="💱" value="EUR (€)" onPress={action('currency')} />
      <SettingsRow label="Theme" icon="🎨" value="System" onPress={action('theme')} isLast />
    </Box>
  ),
};

export const WithSwitch: Story = {
  name: 'With Switch (SettingsSwitchRow)',
  render: () => {
    const SwitchDemo = () => {
      const [darkMode, setDarkMode] = useState(false);
      const [notifs, setNotifs] = useState(true);
      const [haptics, setHaptics] = useState(true);
      return (
        <Box bg="surface" radius="lg" style={{ maxWidth: 400, overflow: 'hidden' }}>
          <SettingsSwitchRow label="Dark Mode" icon="🌙" value={darkMode} onValueChange={(v) => { setDarkMode(v); action('darkMode')(v); }} />
          <SettingsSwitchRow label="Notifications" icon="🔔" value={notifs} onValueChange={(v) => { setNotifs(v); action('notifications')(v); }} />
          <SettingsSwitchRow label="Haptic Feedback" icon="📳" value={haptics} onValueChange={(v) => { setHaptics(v); action('haptics')(v); }} isLast />
        </Box>
      );
    };
    return <SwitchDemo />;
  },
};

export const Destructive: Story = {
  name: 'Destructive',
  render: () => (
    <Box bg="surface" radius="lg" style={{ maxWidth: 400, overflow: 'hidden' }}>
      <SettingsRow label="Sign Out" icon="🚪" destructive onPress={action('signout')} />
      <SettingsRow label="Delete Account" icon="🗑️" destructive onPress={action('delete')} isLast />
    </Box>
  ),
};

export const Disabled: Story = {
  name: 'Disabled',
  render: () => (
    <Box bg="surface" radius="lg" style={{ maxWidth: 400, overflow: 'hidden' }}>
      <SettingsRow label="Available Feature" icon="✅" onPress={action('press')} />
      <SettingsRow label="Premium Feature" icon="👑" subtitle="Upgrade to unlock" disabled onPress={action('press')} />
      <SettingsRow label="Coming Soon" icon="🔮" subtitle="Not yet available" disabled isLast />
    </Box>
  ),
};

export const CompleteSettingsScreen: Story = {
  name: 'Complete Settings Screen',
  render: () => {
    const FullScreen = () => {
      const [darkMode, setDarkMode] = useState(false);
      const [notifs, setNotifs] = useState(true);
      return (
        <VStack gap="lg" style={{ maxWidth: 400 }}>
          <Text variant="h2">Settings</Text>

          <VStack gap="xs">
            <Text variant="label" color="textTertiary" style={{ paddingLeft: 16 }}>ACCOUNT</Text>
            <Box bg="surface" radius="lg" style={{ overflow: 'hidden' }}>
              <SettingsRow label="Profile" icon="👤" subtitle="John Doe" onPress={action('profile')} />
              <SettingsRow label="Subscription" icon="⭐" value="Pro" onPress={action('subscription')} isLast />
            </Box>
          </VStack>

          <VStack gap="xs">
            <Text variant="label" color="textTertiary" style={{ paddingLeft: 16 }}>PREFERENCES</Text>
            <Box bg="surface" radius="lg" style={{ overflow: 'hidden' }}>
              <SettingsRow label="Language" icon="🌐" value="English" onPress={action('language')} />
              <SettingsRow label="Currency" icon="💱" value="EUR (€)" onPress={action('currency')} />
              <SettingsSwitchRow label="Dark Mode" icon="🌙" value={darkMode} onValueChange={(v) => { setDarkMode(v); action('darkMode')(v); }} />
              <SettingsSwitchRow label="Notifications" icon="🔔" value={notifs} onValueChange={(v) => { setNotifs(v); action('notifications')(v); }} isLast />
            </Box>
          </VStack>

          <VStack gap="xs">
            <Text variant="label" color="textTertiary" style={{ paddingLeft: 16 }}>SUPPORT</Text>
            <Box bg="surface" radius="lg" style={{ overflow: 'hidden' }}>
              <SettingsRow label="Help Center" icon="❓" onPress={action('help')} />
              <SettingsRow label="Contact Us" icon="✉️" onPress={action('contact')} />
              <SettingsRow label="Rate App" icon="⭐" onPress={action('rate')} isLast />
            </Box>
          </VStack>

          <Box bg="surface" radius="lg" style={{ overflow: 'hidden' }}>
            <SettingsRow label="Sign Out" icon="🚪" destructive onPress={action('signout')} isLast />
          </Box>
        </VStack>
      );
    };
    return <FullScreen />;
  },
};
