import React, { useState } from 'react';
import { fn } from 'storybook/test';
import { Text as RNText } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Box } from '../../src/primitives/Box';
import { SettingsRow, SettingsSwitchRow } from '../../src/components/SettingsRow';
import { Text } from '../../src/primitives/Text';
import { VStack, HStack } from '../../src/primitives/Stack';
import { NativeUIProvider } from '../../src/theme/ThemeProvider';
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
    onPress: fn(),
  },
};

export const Default: Story = {
  name: 'Navigation Rows',
  render: () => (
    <Box bg="surface" radius="lg" style={{ maxWidth: 400, overflow: 'hidden' }}>
      <SettingsRow label="General" icon="⚙️" onPress={fn()} />
      <SettingsRow label="Notifications" icon="🔔" onPress={fn()} />
      <SettingsRow label="Appearance" icon="🎨" onPress={fn()} />
      <SettingsRow label="Privacy" icon="🔒" onPress={fn()} isLast />
    </Box>
  ),
};

export const WithSubtitle: Story = {
  name: 'With Subtitle',
  render: () => (
    <Box bg="surface" radius="lg" style={{ maxWidth: 400, overflow: 'hidden' }}>
      <SettingsRow label="Account" subtitle="john@example.com" icon="👤" onPress={fn()} />
      <SettingsRow label="Storage" subtitle="2.3 GB of 5 GB used" icon="💾" onPress={fn()} />
      <SettingsRow label="Backup" subtitle="Last backup: 2 hours ago" icon="☁️" onPress={fn()} isLast />
    </Box>
  ),
};

export const WithValue: Story = {
  name: 'With Value',
  render: () => (
    <Box bg="surface" radius="lg" style={{ maxWidth: 400, overflow: 'hidden' }}>
      <SettingsRow label="Language" icon="🌐" value="English" onPress={fn()} />
      <SettingsRow label="Currency" icon="💱" value="EUR (€)" onPress={fn()} />
      <SettingsRow label="Theme" icon="🎨" value="System" onPress={fn()} isLast />
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
          <SettingsSwitchRow label="Dark Mode" icon="🌙" value={darkMode} onValueChange={(v) => { setDarkMode(v); fn()(v); }} />
          <SettingsSwitchRow label="Notifications" icon="🔔" value={notifs} onValueChange={(v) => { setNotifs(v); fn()(v); }} />
          <SettingsSwitchRow label="Haptic Feedback" icon="📳" value={haptics} onValueChange={(v) => { setHaptics(v); fn()(v); }} isLast />
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
      <SettingsRow label="Sign Out" icon="🚪" destructive onPress={fn()} />
      <SettingsRow label="Delete Account" icon="🗑️" destructive onPress={fn()} isLast />
    </Box>
  ),
};

export const Disabled: Story = {
  name: 'Disabled',
  render: () => (
    <Box bg="surface" radius="lg" style={{ maxWidth: 400, overflow: 'hidden' }}>
      <SettingsRow label="Available Feature" icon="✅" onPress={fn()} />
      <SettingsRow label="Premium Feature" icon="👑" subtitle="Upgrade to unlock" disabled onPress={fn()} />
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
              <SettingsRow label="Profile" icon="👤" subtitle="John Doe" onPress={fn()} />
              <SettingsRow label="Subscription" icon="⭐" value="Pro" onPress={fn()} isLast />
            </Box>
          </VStack>

          <VStack gap="xs">
            <Text variant="label" color="textTertiary" style={{ paddingLeft: 16 }}>PREFERENCES</Text>
            <Box bg="surface" radius="lg" style={{ overflow: 'hidden' }}>
              <SettingsRow label="Language" icon="🌐" value="English" onPress={fn()} />
              <SettingsRow label="Currency" icon="💱" value="EUR (€)" onPress={fn()} />
              <SettingsSwitchRow label="Dark Mode" icon="🌙" value={darkMode} onValueChange={(v) => { setDarkMode(v); fn()(v); }} />
              <SettingsSwitchRow label="Notifications" icon="🔔" value={notifs} onValueChange={(v) => { setNotifs(v); fn()(v); }} isLast />
            </Box>
          </VStack>

          <VStack gap="xs">
            <Text variant="label" color="textTertiary" style={{ paddingLeft: 16 }}>SUPPORT</Text>
            <Box bg="surface" radius="lg" style={{ overflow: 'hidden' }}>
              <SettingsRow label="Help Center" icon="❓" onPress={fn()} />
              <SettingsRow label="Contact Us" icon="✉️" onPress={fn()} />
              <SettingsRow label="Rate App" icon="⭐" onPress={fn()} isLast />
            </Box>
          </VStack>

          <Box bg="surface" radius="lg" style={{ overflow: 'hidden' }}>
            <SettingsRow label="Sign Out" icon="🚪" destructive onPress={fn()} isLast />
          </Box>
        </VStack>
      );
    };
    return <FullScreen />;
  },
};

/**
 * Density comparison - `regular` vs `compact` typography density.
 * SettingsRow inherits density from the enclosing `NativeUIProvider`, so
 * the switch is a single-line token flip at the app root.
 */
export const Density: Story = {
  name: 'Density (regular vs compact)',
  parameters: {
    docs: {
      description: {
        story: [
          'Settings screens are the single biggest beneficiary of the `compact` typography density - a user with 40+ rows recovers nearly a full screen of content without any information loss.',
          '',
          'Below: identical `SettingsRow` markup rendered under both densities. Note the reduced row height and tighter subtitle leading on the compact side.',
        ].join('\n'),
      },
    },
  },
  render: () => {
    const Column = ({ label }: { label: string }) => {
      const [darkMode, setDarkMode] = useState(true);
      const [notifs, setNotifs] = useState(true);
      return (
        <VStack gap="md" style={{ flex: 1, minWidth: 300 }}>
          <Text variant="label" color="textTertiary" style={{ paddingLeft: 16 }}>
            {label}
          </Text>

          <VStack gap="xs">
            <Text variant="label" color="textTertiary" style={{ paddingLeft: 16 }}>
              ACCOUNT
            </Text>
            <Box bg="surface" radius="lg" style={{ overflow: 'hidden' }}>
              <SettingsRow label="Profile" icon="👤" value="Damian" onPress={fn()} />
              <SettingsRow label="Email" icon="✉️" value="damian@polprog.dev" onPress={fn()} />
              <SettingsRow label="Subscription" icon="💎" value="Pro" onPress={fn()} isLast />
            </Box>
          </VStack>

          <VStack gap="xs">
            <Text variant="label" color="textTertiary" style={{ paddingLeft: 16 }}>
              PREFERENCES
            </Text>
            <Box bg="surface" radius="lg" style={{ overflow: 'hidden' }}>
              <SettingsRow label="Language" icon="🌐" value="English" onPress={fn()} />
              <SettingsSwitchRow
                label="Dark Mode"
                icon="🌙"
                value={darkMode}
                onValueChange={setDarkMode}
              />
              <SettingsSwitchRow
                label="Notifications"
                icon="🔔"
                value={notifs}
                onValueChange={setNotifs}
                isLast
              />
            </Box>
          </VStack>
        </VStack>
      );
    };
    return (
      <HStack gap="lg" align="flex-start" style={{ flexWrap: 'wrap' }}>
        <NativeUIProvider config={{ typography: 'regular' }}>
          <Column label="REGULAR" />
        </NativeUIProvider>
        <NativeUIProvider config={{ typography: 'compact' }}>
          <Column label="COMPACT" />
        </NativeUIProvider>
      </HStack>
    );
  },
};
