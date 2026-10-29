import React, { useState } from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect, fn } from 'storybook/test';
import { BottomTabBar } from '../../src/components/BottomTabBar';
import type { BottomTabBarItem, BottomTabBarProps } from '../../src/components/BottomTabBar';
import { Box } from '../../src/primitives/Box';
import { SystemIcon, type SystemIconName } from '../../src/primitives/SystemIcon';
import { VStack } from '../../src/primitives/Stack';
import { Text } from '../../src/primitives/Text';

/**
 * Emoji icons keep this story standalone - consumers usually plug in
 * lucide / react-native-vector-icons.
 */
const EmojiIcon = (glyph: string) =>
  function Icon({ color, size }: { color: string; size: number }) {
    return (
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: size - 2, color }}>{glyph}</Text>
      </View>
    );
  };

/** Tintable vector glyphs: the renderer forwards `color` and `size` straight to `SystemIcon`. */
const GlyphIcon = (name: SystemIconName): BottomTabBarItem['icon'] =>
  function Icon({ color, size }) {
    return <SystemIcon name={name} color={color} size={size} />;
  };

const GLYPH_TABS: BottomTabBarItem[] = [
  { key: 'search', label: 'Search', icon: GlyphIcon('search') },
  { key: 'create', label: 'Create', icon: GlyphIcon('plus') },
  { key: 'alerts', label: 'Alerts', icon: GlyphIcon('alert'), badge: 2 },
  { key: 'more', label: 'More', icon: GlyphIcon('more') },
];

const HOME_TABS: BottomTabBarItem[] = [
  { key: 'home', label: 'Home', icon: EmojiIcon('🏠') },
  { key: 'stats', label: 'Stats', icon: EmojiIcon('📊') },
  { key: 'challenges', label: 'Challenges', icon: EmojiIcon('🏆') },
  { key: 'settings', label: 'Settings', icon: EmojiIcon('⚙️') },
];

const BADGED_TABS: BottomTabBarItem[] = [
  { key: 'home', label: 'Home', icon: EmojiIcon('🏠') },
  { key: 'inbox', label: 'Inbox', icon: EmojiIcon('✉️'), badge: 3 },
  { key: 'notifications', label: 'Alerts', icon: EmojiIcon('🔔'), badge: '99+' },
  { key: 'profile', label: 'Profile', icon: EmojiIcon('👤') },
];

const meta: Meta<BottomTabBarProps> = {
  title: 'Components/BottomTabBar',
  component: BottomTabBar,
  parameters: {
    canvasPadding: 0,
    docs: {
      description: {
        component: [
          'Opinionated bottom navigation bar designed to match the DailyForma / PuzzleGo tab rails 1:1.',
          '',
          '### Layout rules',
          '- Surface = `colors.surface` (not `background`) so it sits visually above canvas',
          '- Top hairline border (`colors.border`)',
          '- Active label = `colors.primaryText`, inactive label = `colors.textTertiary`',
          '- Icon renderers receive `color` = `colors.primaryText` (active) or `colors.textSecondary` (inactive), plus `size` and `focused`',
          '- The active icon sits on a Material 3 style pill (`colors.primaryLight`), because a tinted 10px label alone is a weak cue and emoji icons cannot be tinted. It grows and fades in over `indicatorDurationMs` unless `reduceAnimations` is on',
          '- 22px icon, 10px medium-weight label, 44px minimum tap target',
          '- Vertical paddings: 4 top, 4 (iOS) / 8 (Android) bottom **plus** safe-area inset',
          '',
          '### Tokens (`components.bottomTabBar`)',
          "- `indicator`: `'pill'` (default) or `'none'` for the label-only look",
          '- `indicatorWidth`, `indicatorHeight`, `indicatorRadius` (default `borderRadius.full`)',
          '- `indicatorColor`: `undefined` uses `colors.primaryLight`; a custom fill must keep `primaryText` readable on it',
          '- `indicatorDurationMs`: width and opacity transition',
          '',
          '### Accessibility',
          '- The bar is a `tablist`; each item is a `Pressable` with `accessibilityRole="tab"` and optional `accessibilityLabel` fallback to `label`',
          '- Selected tab exposes `accessibilityState={{ selected: true }}`',
          '- Keyboard focus (Tab key on web, D-pad, hardware keyboards) draws the themed focus ring; pointer focus does not',
          '',
          '### Import',
          '```tsx',
          "import { BottomTabBar } from '@polprog/native-ui';",
          '```',
        ].join('\n'),
      },
    },
    a11y: {
      options: {
        rules: {
          'button-name': { enabled: true },
        },
      },
    },
  },
  argTypes: {
    activeKey: { control: 'text', description: 'Key of the currently selected tab' },
    safeBottomInset: {
      control: { type: 'number', min: 0, max: 48, step: 2 },
      description: 'Bottom safe-area inset (e.g. from `useSafeAreaInsets().bottom`)',
    },
    onSelect: { description: 'Called with the key of the tapped tab' },
  },
};

export default meta;
type Story = StoryObj<BottomTabBarProps>;

/** Wrap the bar in a phone-sized frame so it reads as a tab rail, not a banner. */
const Frame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box bg="background" style={{ width: 390, height: 120, justifyContent: 'flex-end' }}>
    {children}
  </Box>
);

export const Playground: Story = {
  args: {
    items: HOME_TABS,
    activeKey: 'home',
    safeBottomInset: 24,
    onSelect: fn(),
  },
  render: (args) => (
    <Frame>
      <BottomTabBar {...args} />
    </Frame>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const stats = canvas.getByRole('tab', { name: /stats/i });
    await userEvent.click(stats);
    await expect(args.onSelect).toHaveBeenCalledWith('stats');
  },
};

export const AllStates: Story = {
  name: 'All States',
  render: () => {
    const [active, setActive] = useState('home');

    return (
      <VStack gap="lg">
        <VStack gap="sm">
          <Text variant="label" color="textSecondary">
            Default - 4 tabs, active = Home
          </Text>
          <Frame>
            <BottomTabBar items={HOME_TABS} activeKey="home" onSelect={fn()} />
          </Frame>
        </VStack>
        <VStack gap="sm">
          <Text variant="label" color="textSecondary">
            With badges
          </Text>
          <Frame>
            <BottomTabBar items={BADGED_TABS} activeKey="inbox" onSelect={fn()} />
          </Frame>
        </VStack>
        <VStack gap="sm">
          <Text variant="label" color="textSecondary">
            Interactive (click to switch)
          </Text>
          <Frame>
            <BottomTabBar items={HOME_TABS} activeKey={active} onSelect={setActive} />
          </Frame>
        </VStack>
      </VStack>
    );
  },
};

export const SafeAreaComparison: Story = {
  name: 'iOS vs Android safe area',
  parameters: {
    docs: {
      description: {
        story:
          'iPhones with the home-indicator need a ~34px bottom inset; Android devices with gesture nav need a ~24px inset; legacy 3-button Android gets 0. Pass the actual value from `useSafeAreaInsets().bottom`.',
      },
    },
  },
  render: () => (
    <VStack gap="lg">
      {[
        { label: 'iPhone 15 Pro (home indicator)', inset: 34 },
        { label: 'Pixel 8 (gesture nav)', inset: 24 },
        { label: 'Android 3-button nav', inset: 0 },
      ].map(({ label, inset }) => (
        <VStack key={label} gap="sm">
          <Text variant="label" color="textSecondary">
            {label} - safeBottomInset = {inset}
          </Text>
          <Frame>
            <BottomTabBar
              items={HOME_TABS}
              activeKey="home"
              safeBottomInset={inset}
              onSelect={fn()}
            />
          </Frame>
        </VStack>
      ))}
    </VStack>
  ),
};

export const ThreeTabsMinimal: Story = {
  name: 'Minimum 3 tabs',
  render: () => (
    <Frame>
      <BottomTabBar items={HOME_TABS.slice(0, 3)} activeKey="stats" onSelect={fn()} />
    </Frame>
  ),
};

export const VectorIcons: Story = {
  name: 'Vector icons (SystemIcon)',
  parameters: {
    docs: {
      description: {
        story:
          'Icon renderers that honour `color` show the active state twice: tinted `primaryText` on the pill, and `textSecondary` elsewhere.',
      },
    },
  },
  render: () => (
    <Frame>
      <BottomTabBar items={GLYPH_TABS} activeKey="search" onSelect={fn()} />
    </Frame>
  ),
};

export const KeyboardFocus: Story = {
  name: 'Keyboard focus',
  parameters: {
    docs: {
      description: {
        story:
          'Press Tab to move between tabs: the focused tab gets the themed ring from `components.focusRing`. Clicking a tab moves focus without drawing it.',
      },
    },
  },
  render: () => (
    <Frame>
      <BottomTabBar items={GLYPH_TABS} activeKey="search" onSelect={fn()} />
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const search = canvas.getByRole('tab', { name: 'Search' });
    const create = canvas.getByRole('tab', { name: 'Create' });

    await userEvent.tab();
    await expect(search).toHaveFocus();
    await expect(getComputedStyle(search).outlineStyle).toBe('solid');

    await userEvent.click(create);
    await expect(getComputedStyle(create).outlineStyle).not.toBe('solid');
  },
};
