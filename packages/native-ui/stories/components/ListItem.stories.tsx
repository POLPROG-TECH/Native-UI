import React from 'react';
import { Text as RNText } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import type { ListItemProps } from '../../src/components/ListItem';
import { ListItem } from '../../src/components/ListItem';
import { Badge } from '../../src/components/Badge';
import { Switch } from '../../src/components/Switch';
import { Radio } from '../../src/components/Radio';
import { Box } from '../../src/primitives/Box';
import { useTheme } from '../../src/theme/ThemeProvider';

const EmojiIcon = ({ children, bg }: { children: string; bg?: string }) => {
  const theme = useTheme();
  return (
    <RNText
      style={{
        fontSize: 20,
        width: 36,
        height: 36,
        lineHeight: 36,
        textAlign: 'center',
        backgroundColor: bg ?? theme.colors.surfaceSecondary,
        borderRadius: 10,
        overflow: 'hidden',
      }}
    >
      {children}
    </RNText>
  );
};

const DestructiveEmojiIcon = ({ children }: { children: string }) => {
  const theme = useTheme();
  // Lightly tint the icon pill with the error color - works for light & dark.
  return <EmojiIcon bg={`${theme.colors.error}22`}>{children}</EmojiIcon>;
};

const meta: Meta<ListItemProps> = {
  title: 'Components/ListItem',
  component: ListItem,
  parameters: {
    docs: {
      description: {
        component: [
          'Configurable list row for settings screens, menus, and data lists. 52px minimum height.',
          '',
          '### Anatomy',
          '- Optional leading icon',
          '- Title + optional subtitle',
          '- Optional value (right-aligned)',
          '- Optional trailing element (Badge, Switch, Radio, etc.)',
          '- Auto chevron when `onPress` provided and no trailing',
          '- Optional bottom divider',
          '',
          '### Variants',
          '- Navigation row (onPress + chevron)',
          '- Value display (title + value)',
          '- Destructive row (red text)',
          '- With trailing element (Switch, Badge, Radio)',
          '',
          '### Import',
          '```tsx',
          "import { ListItem } from '@polprog/native-ui';",
          '```',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    title: { control: 'text' },
    subtitle: { control: 'text' },
    value: { control: 'text' },
    showChevron: { control: 'boolean' },
    destructive: { control: 'boolean' },
    disabled: { control: 'boolean' },
    hideDivider: { control: 'boolean' },
    onPress: { action: 'onPress' },
  },
};

export default meta;
type Story = StoryObj<ListItemProps>;

export const Playground: Story = {
  args: {
    title: 'Settings Item',
    subtitle: 'Description text',
    value: '',
    destructive: false,
    disabled: false,
    hideDivider: false,
    onPress: action('onPress'),
  },
};

export const NavigationRows: Story = {
  name: 'Navigation Rows',
  render: () => (
    <Box bg="surface" radius="lg" style={{ maxWidth: 400, overflow: 'hidden' }}>
      <ListItem title="Profile" icon={<EmojiIcon>👤</EmojiIcon>} onPress={action('profile')} />
      <ListItem title="Notifications" icon={<EmojiIcon>🔔</EmojiIcon>} onPress={action('notifs')} />
      <ListItem
        title="Appearance"
        icon={<EmojiIcon>🎨</EmojiIcon>}
        onPress={action('appearance')}
      />
      <ListItem
        title="Privacy"
        icon={<EmojiIcon>🔒</EmojiIcon>}
        onPress={action('privacy')}
        hideDivider
      />
    </Box>
  ),
};

export const WithValues: Story = {
  name: 'With Values',
  render: () => (
    <Box bg="surface" radius="lg" style={{ maxWidth: 400, overflow: 'hidden' }}>
      <ListItem title="Language" value="English" onPress={action('language')} />
      <ListItem title="Currency" value="EUR (€)" onPress={action('currency')} />
      <ListItem title="Theme" value="System" onPress={action('theme')} hideDivider />
    </Box>
  ),
};

export const WithTrailing: Story = {
  name: 'With Trailing Elements',
  render: () => (
    <Box bg="surface" radius="lg" style={{ maxWidth: 400, overflow: 'hidden' }}>
      <ListItem title="Notifications" trailing={<Badge count={5} />} onPress={action('notifs')} />
      <ListItem
        title="Dark Mode"
        trailing={<Switch value={true} onValueChange={action('toggle')} />}
      />
      <ListItem
        title="Monthly billing"
        trailing={<Radio selected={true} onPress={action('select')} />}
      />
      <ListItem
        title="Annual billing"
        trailing={<Radio selected={false} onPress={action('select')} />}
        hideDivider
      />
    </Box>
  ),
};

export const Destructive: Story = {
  name: 'Destructive Row',
  render: () => (
    <Box bg="surface" radius="lg" style={{ maxWidth: 400, overflow: 'hidden' }}>
      <ListItem title="Sign Out" destructive onPress={action('signout')} />
      <ListItem
        title="Delete Account"
        icon={<DestructiveEmojiIcon>🗑️</DestructiveEmojiIcon>}
        destructive
        onPress={action('delete')}
        hideDivider
      />
    </Box>
  ),
};

export const WithSubtitles: Story = {
  name: 'With Subtitles',
  render: () => (
    <Box bg="surface" radius="lg" style={{ maxWidth: 400, overflow: 'hidden' }}>
      <ListItem
        title="John Doe"
        subtitle="john@example.com"
        icon={<EmojiIcon>👤</EmojiIcon>}
        onPress={action('user')}
      />
      <ListItem
        title="Backup"
        subtitle="Last backup: 2 hours ago"
        icon={<EmojiIcon>☁️</EmojiIcon>}
        onPress={action('backup')}
      />
      <ListItem
        title="Storage"
        subtitle="2.3 GB of 5 GB used"
        icon={<EmojiIcon>💾</EmojiIcon>}
        value="46%"
        onPress={action('storage')}
        hideDivider
      />
    </Box>
  ),
};

export const DisabledRows: Story = {
  name: 'Disabled',
  render: () => (
    <Box bg="surface" radius="lg" style={{ maxWidth: 400, overflow: 'hidden' }}>
      <ListItem title="Available Feature" onPress={action('press')} />
      <ListItem
        title="Premium Feature"
        subtitle="Upgrade to unlock"
        disabled
        onPress={action('press')}
      />
      <ListItem
        title="Coming Soon"
        subtitle="This feature is not yet available"
        disabled
        hideDivider
      />
    </Box>
  ),
};
