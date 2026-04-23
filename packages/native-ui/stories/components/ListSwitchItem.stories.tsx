import React, { useState } from 'react';
import { fn } from 'storybook/test';
import { Text as RNText } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Box } from '../../src/primitives/Box';
import { ListSwitchItem } from '../../src/components/ListSwitchItem';
import { VStack } from '../../src/primitives/Stack';
import { useTheme } from '../../src/theme/ThemeProvider';
import type { ListSwitchItemProps } from '../../src/components/ListSwitchItem';

const EmojiIcon = ({ children }: { children: string }) => {
  const theme = useTheme();

  return (
    <RNText style={{ fontSize: 20, width: 36, height: 36, lineHeight: 36, textAlign: 'center', backgroundColor: theme.colors.surfaceSecondary, borderRadius: 10, overflow: 'hidden' }}>{children}</RNText>
  );
};

const meta: Meta<ListSwitchItemProps> = {
  title: 'Components/ListSwitchItem',
  component: ListSwitchItem,
  parameters: {
    docs: {
      description: {
        component: [
          'Convenience component composing `ListItem` with a `Switch` as the trailing element.',
          '',
          '### When to use',
          '- Settings toggle rows',
          '- Feature enable/disable',
          '',
          '### Import',
          '```tsx',
          "import { ListSwitchItem } from '@polprog/native-ui';",
          '```',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    label: { control: 'text' },
    subtitle: { control: 'text' },
    value: { control: 'boolean' },
    hideDivider: { control: 'boolean' },
    onValueChange: { action: 'onValueChange' },
  },
};

export default meta;
type Story = StoryObj<ListSwitchItemProps>;

const Interactive = (props: Partial<ListSwitchItemProps> & { label: string }) => {
  const [val, setVal] = useState(false);

  return <ListSwitchItem value={val} onValueChange={(v) => { setVal(v); fn()(v); }} {...props} />;
};

export const Playground: Story = {
  args: { label: 'Dark Mode', value: false, hideDivider: false, onValueChange: fn() },
};

export const Default: Story = {
  render: () => (
    <Box bg="surface" radius="lg" style={{ maxWidth: 400, overflow: 'hidden' }}>
      <Interactive label="Push Notifications" />
      <Interactive label="Sound Effects" />
      <Interactive label="Haptic Feedback" />
      <Interactive label="Auto-Sync" hideDivider />
    </Box>
  ),
};

export const WithSubtitleAndIcon: Story = {
  name: 'With Subtitle and Icon',
  render: () => (
    <Box bg="surface" radius="lg" style={{ maxWidth: 400, overflow: 'hidden' }}>
      <Interactive label="Dark Mode" subtitle="Use dark colors for the interface" icon={<EmojiIcon>🌙</EmojiIcon>} />
      <Interactive label="Notifications" subtitle="Receive push alerts" icon={<EmojiIcon>🔔</EmojiIcon>} />
      <Interactive label="Biometrics" subtitle="Use Face ID / fingerprint to unlock" icon={<EmojiIcon>🔐</EmojiIcon>} hideDivider />
    </Box>
  ),
};
