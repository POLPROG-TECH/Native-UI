import React from 'react';
import { fn } from 'storybook/test';
import { Text as RNText } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import type { ListItemProps } from '../../src/components/ListItem';
import { ListItem } from '../../src/components/ListItem';
import { Badge } from '../../src/components/Badge';
import { Switch } from '../../src/components/Switch';
import { Radio } from '../../src/components/Radio';
import { Box } from '../../src/primitives/Box';
import { VStack, HStack } from '../../src/primitives/Stack';
import { Text } from '../../src/primitives/Text';
import { NativeUIProvider } from '../../src/theme/ThemeProvider';
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
    onPress: fn(),
  },
};

export const NavigationRows: Story = {
  name: 'Navigation Rows',
  render: () => (
    <Box bg="surface" radius="lg" style={{ maxWidth: 400, overflow: 'hidden' }}>
      <ListItem title="Profile" icon={<EmojiIcon>👤</EmojiIcon>} onPress={fn()} />
      <ListItem title="Notifications" icon={<EmojiIcon>🔔</EmojiIcon>} onPress={fn()} />
      <ListItem
        title="Appearance"
        icon={<EmojiIcon>🎨</EmojiIcon>}
        onPress={fn()}
      />
      <ListItem
        title="Privacy"
        icon={<EmojiIcon>🔒</EmojiIcon>}
        onPress={fn()}
        hideDivider
      />
    </Box>
  ),
};

export const WithValues: Story = {
  name: 'With Values',
  render: () => (
    <Box bg="surface" radius="lg" style={{ maxWidth: 400, overflow: 'hidden' }}>
      <ListItem title="Language" value="English" onPress={fn()} />
      <ListItem title="Currency" value="EUR (€)" onPress={fn()} />
      <ListItem title="Theme" value="System" onPress={fn()} hideDivider />
    </Box>
  ),
};

export const WithTrailing: Story = {
  name: 'With Trailing Elements',
  render: () => (
    <Box bg="surface" radius="lg" style={{ maxWidth: 400, overflow: 'hidden' }}>
      <ListItem title="Notifications" trailing={<Badge count={5} />} onPress={fn()} />
      <ListItem
        title="Dark Mode"
        trailing={<Switch value={true} onValueChange={fn()} />}
      />
      <ListItem
        title="Monthly billing"
        trailing={<Radio selected={true} onPress={fn()} />}
      />
      <ListItem
        title="Annual billing"
        trailing={<Radio selected={false} onPress={fn()} />}
        hideDivider
      />
    </Box>
  ),
};

export const Destructive: Story = {
  name: 'Destructive Row',
  render: () => (
    <Box bg="surface" radius="lg" style={{ maxWidth: 400, overflow: 'hidden' }}>
      <ListItem title="Sign Out" destructive onPress={fn()} />
      <ListItem
        title="Delete Account"
        icon={<DestructiveEmojiIcon>🗑️</DestructiveEmojiIcon>}
        destructive
        onPress={fn()}
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
        onPress={fn()}
      />
      <ListItem
        title="Backup"
        subtitle="Last backup: 2 hours ago"
        icon={<EmojiIcon>☁️</EmojiIcon>}
        onPress={fn()}
      />
      <ListItem
        title="Storage"
        subtitle="2.3 GB of 5 GB used"
        icon={<EmojiIcon>💾</EmojiIcon>}
        value="46%"
        onPress={fn()}
        hideDivider
      />
    </Box>
  ),
};

export const DisabledRows: Story = {
  name: 'Disabled',
  render: () => (
    <Box bg="surface" radius="lg" style={{ maxWidth: 400, overflow: 'hidden' }}>
      <ListItem title="Available Feature" onPress={fn()} />
      <ListItem
        title="Premium Feature"
        subtitle="Upgrade to unlock"
        disabled
        onPress={fn()}
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

/**
 * Density comparison - side-by-side `regular` vs `compact` typography
 * density. Useful for data-dense screens (settings bundles, transaction
 * lists) where the compact scale recovers ~12 % vertical real estate.
 *
 * Density is set globally via `NativeUIProvider config={{ typography }}`.
 */
export const Density: Story = {
  name: 'Density (regular vs compact)',
  parameters: {
    docs: {
      description: {
        story: [
          'Typography density is a **global** token, applied at the `NativeUIProvider`. Changing it from `regular` to `compact` reduces body / subtitle line-heights and trims vertical padding proportionally - without touching any component prop.',
          '',
          'Use `compact` for:',
          '- Long settings bundles',
          '- Transaction / activity feeds',
          '- Power-user admin screens',
          '',
          'Stay on `regular` for:',
          '- Primary navigation',
          '- Onboarding and marketing surfaces',
          '- Anything read once (not scanned).',
        ].join('\n'),
      },
    },
  },
  render: () => {
    const sample = [
      { title: 'Profile', subtitle: 'Name, email, phone', icon: <EmojiIcon>👤</EmojiIcon> },
      { title: 'Notifications', subtitle: 'Push, email', value: 'On', icon: <EmojiIcon>🔔</EmojiIcon> },
      { title: 'Privacy', subtitle: 'Permissions & data', icon: <EmojiIcon>🔒</EmojiIcon> },
      { title: 'Storage', subtitle: '2.3 GB of 5 GB used', value: '46%', icon: <EmojiIcon>💾</EmojiIcon> },
    ];
    const Column = ({ label }: { label: string }) => (
      <VStack gap="sm" style={{ flex: 1, minWidth: 280 }}>
        <Text variant="label" color="textTertiary" style={{ paddingLeft: 16 }}>
          {label}
        </Text>
        <Box bg="surface" radius="lg" style={{ overflow: 'hidden' }}>
          {sample.map((item, idx) => (
            <ListItem
              key={item.title}
              title={item.title}
              subtitle={item.subtitle}
              value={item.value}
              icon={item.icon}
              onPress={fn()}
              hideDivider={idx === sample.length - 1}
            />
          ))}
        </Box>
      </VStack>
    );

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
