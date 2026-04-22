import React, { useState } from 'react';
import { fn } from 'storybook/test';
import { View, Text as RNText } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from '../../src/components/Avatar';
import { Badge } from '../../src/components/Badge';
import { Box } from '../../src/primitives/Box';
import { Button } from '../../src/components/Button';
import { Chip } from '../../src/components/Chip';
import { ListHeader } from '../../src/components/ListHeader';
import { ListItem } from '../../src/components/ListItem';
import { ListSection } from '../../src/components/ListSection';
import { ListSwitchItem } from '../../src/components/ListSwitchItem';
import { Radio } from '../../src/components/Radio';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { Select } from '../../src/components/Select';
import { Text } from '../../src/primitives/Text';
import { VStack } from '../../src/primitives/Stack';
import { useTheme } from '../../src/theme/ThemeProvider';

const EmojiIcon = ({ children, bg }: { children: string; bg?: string }) => {
  const theme = useTheme();
  return (
    <RNText style={{ fontSize: 20, width: 36, height: 36, lineHeight: 36, textAlign: 'center', backgroundColor: bg ?? theme.colors.surfaceSecondary, borderRadius: 10, overflow: 'hidden' }}>{children}</RNText>
  );
};

const meta: Meta = {
  title: 'Patterns/Settings',
  parameters: {
    docs: {
      description: {
        component: [
          'Complete settings screen layouts composed from ListSection, ListItem, ListSwitchItem, and ListHeader.',
          '',
          '### CostBoard equivalents',
          '- Main settings screen with account info, appearance, data, danger zone',
          '- Theme/appearance picker using Chips or Radios',
          '- In-app feedback/about screens',
        ].join('\n'),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const FullSettingsScreen = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [haptics, setHaptics] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [biometrics, setBiometrics] = useState(false);

  return (
    <VStack gap="lg" style={{ maxWidth: 420 }}>
      <ListHeader title="Settings" subtitle="Manage your application preferences" />

      <ListSection title="Account">
        <ListItem
          title="John Doe"
          subtitle="john.doe@company.com"
          icon={<Avatar name="John Doe" size="md" />}
          onPress={fn()}
        />
        <ListItem title="Subscription" value="Premium" icon={<EmojiIcon>⭐</EmojiIcon>} onPress={fn()} hideDivider />
      </ListSection>

      <ListSection title="Appearance">
        <ListSwitchItem label="Dark Mode" icon={<EmojiIcon>🌙</EmojiIcon>} value={darkMode} onValueChange={setDarkMode} />
        <ListItem title="Color Theme" value="Indigo" icon={<EmojiIcon>🎨</EmojiIcon>} onPress={fn()} />
        <ListSwitchItem label="Haptic Feedback" icon={<EmojiIcon>📳</EmojiIcon>} value={haptics} onValueChange={setHaptics} hideDivider />
      </ListSection>

      <ListSection title="Notifications">
        <ListSwitchItem label="Push Notifications" icon={<EmojiIcon>🔔</EmojiIcon>} value={notifications} onValueChange={setNotifications} />
        <ListItem title="Notification Sound" value="Default" icon={<EmojiIcon>🔊</EmojiIcon>} onPress={fn()} hideDivider />
      </ListSection>

      <ListSection title="Security">
        <ListSwitchItem label="Biometric Lock" icon={<EmojiIcon>🔐</EmojiIcon>} value={biometrics} onValueChange={setBiometrics} subtitle="Use Face ID or fingerprint" />
        <ListItem title="Change PIN" icon={<EmojiIcon>🔢</EmojiIcon>} onPress={fn()} hideDivider />
      </ListSection>

      <ListSection title="Data" footer="Exported data will be saved as CSV.">
        <ListItem title="Export Data" icon={<EmojiIcon>📤</EmojiIcon>} onPress={fn()} />
        <ListItem title="Import Data" icon={<EmojiIcon>📥</EmojiIcon>} onPress={fn()} hideDivider />
      </ListSection>

      <ListSection title="About">
        <ListItem title="Version" value="1.2.0 (42)" />
        <ListItem title="Rate the App" icon={<EmojiIcon>⭐</EmojiIcon>} onPress={fn()} />
        <ListItem title="Send Feedback" icon={<EmojiIcon>💬</EmojiIcon>} onPress={fn()} hideDivider />
      </ListSection>

      <ListSection>
        <ListItem title="Sign Out" destructive onPress={fn()} />
        <ListItem title="Delete Account" destructive onPress={fn()} hideDivider />
      </ListSection>
    </VStack>
  );
};

export const CompleteSettings: Story = {
  name: 'Complete Settings Screen',
  render: () => <FullSettingsScreen />,
};

const ThemePicker = () => {
  const [selectedPreset, setSelectedPreset] = useState('indigo');
  const presets = [
    { id: 'indigo', label: 'Indigo', color: '#6366F1' },
    { id: 'ocean', label: 'Ocean', color: '#0EA5E9' },
    { id: 'emerald', label: 'Emerald', color: '#10B981' },
    { id: 'rose', label: 'Rose', color: '#F43F5E' },
    { id: 'amber', label: 'Amber', color: '#F59E0B' },
    { id: 'violet', label: 'Violet', color: '#8B5CF6' },
    { id: 'slate', label: 'Slate', color: '#64748B' },
  ];

  return (
    <VStack gap="lg" style={{ maxWidth: 420 }}>
      <ListHeader title="Appearance" />
      <ListSection title="Color Theme">
        {presets.map((p, i) => (
          <ListItem
            key={p.id}
            title={p.label}
            icon={<View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: p.color }} />}
            trailing={<Radio selected={selectedPreset === p.id} onPress={() => setSelectedPreset(p.id)} />}
            onPress={() => setSelectedPreset(p.id)}
            hideDivider={i === presets.length - 1}
          />
        ))}
      </ListSection>
    </VStack>
  );
};

export const ThemePickerScreen: Story = {
  name: 'Theme Picker',
  render: () => <ThemePicker />,
};
