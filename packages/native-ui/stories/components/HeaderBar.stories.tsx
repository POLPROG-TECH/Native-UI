import React from 'react';
import { fn } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';
import { HeaderBar } from '../../src/components/HeaderBar';
import { Text } from '../../src/primitives/Text';
import { useTheme } from '../../src/theme/ThemeProvider';
import type { HeaderBarProps } from '../../src/components/HeaderBar';

const PhoneFrame = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme();

  return (
    <View
      style={{
        maxWidth: 420,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: theme.colors.border,
        overflow: 'hidden',
        backgroundColor: theme.colors.surface,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
      }}>
      {children}
    </View>
  );
};

const withPhoneFrame = (Story: React.ComponentType) => (
  <PhoneFrame>
    <Story />
  </PhoneFrame>
);

const meta: Meta<HeaderBarProps> = {
  title: 'Components/HeaderBar',
  component: HeaderBar,
  parameters: {
    canvasPadding: 0,
    docs: {
      description: {
        component:
          'Navigation bar matching the iOS `NavigationStack` title metrics (headline 17/22, semibold). Includes optional back button and a right-side slot.',
      },
    },
  },
  argTypes: {
    title: { control: 'text' },
    onBack: { action: 'onBack' },
    backAccessibilityLabel: { control: 'text' },
  },
  decorators: [withPhoneFrame],
};

export default meta;
type Story = StoryObj<HeaderBarProps>;

export const Playground: Story = {
  args: {
    title: 'Settings',
    onBack: fn(),
  },
};

/**
 * Small helper that consumes the current theme so our right-slot buttons and
 * custom title nodes pick up light/dark colors instead of being stuck on a
 * hardcoded iOS-blue hex.
 */
const ThemedButtonText = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme();

  return (
    <Text style={{ color: theme.colors.primary, fontSize: 17 }}>
      {children}
    </Text>
  );
};

const BrandWordmark = () => {
  const theme = useTheme();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
      <Text style={{ fontSize: 22, fontWeight: '700', color: theme.colors.textPrimary }}>Daily</Text>
      <Text style={{ fontSize: 22, fontWeight: '700', color: theme.colors.primary }}>Forma</Text>
    </View>
  );
};

const StackedTitle = () => {
  const theme = useTheme();

  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontSize: 17, fontWeight: '600', color: theme.colors.textPrimary }}>Workout</Text>
      <Text style={{ fontSize: 11, color: theme.colors.textSecondary, marginTop: 1 }}>Tue · 32 min</Text>
    </View>
  );
};

export const Default: Story = {
  args: {
    title: 'Settings',
  },
};

export const WithBackButton: Story = {
  args: {
    title: 'Profile',
    onBack: fn(),
  },
};

export const WithRightSlot: Story = {
  args: {
    title: 'Inbox',
    onBack: fn(),
    right: (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <ThemedButtonText>Edit</ThemedButtonText>
      </View>
    ),
  },
};

export const Untitled: Story = {
  args: {
    onBack: fn(),
  },
};

export const CustomRenderTitle: Story = {
  name: 'Custom `renderTitle` (brand wordmark)',
  parameters: {
    docs: {
      description: {
        story:
          'Use `renderTitle` to drop a custom node in place of the default `Text` title - e.g. a brand wordmark, logo mark, or a two-line stacked title. Wins over the `title` prop when provided.',
      },
    },
  },
  args: {
    onBack: fn(),
    renderTitle: () => <BrandWordmark />,
  },
};

export const StackedTitleAndSubtitle: Story = {
  name: 'Two-line title via `renderTitle`',
  args: {
    onBack: fn(),
    right: <ThemedButtonText>Edit</ThemedButtonText>,
    renderTitle: () => <StackedTitle />,
  },
};
