import React from 'react';
import { Text as RNText, View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { HStack, VStack } from '../../src/primitives/Stack';
import { PressableScale } from '../../src/primitives/PressableScale';
import { useTheme } from '../../src/theme/ThemeProvider';
import type { PressableScaleProps } from '../../src/primitives/PressableScale';

const meta: Meta<PressableScaleProps> = {
  title: 'Primitives/PressableScale',
  component: PressableScale,
  parameters: {
    docs: {
      description: {
        component: [
          'Pressable wrapper with spring scale animation on press. Used internally by Button, Card, IconButton, and other interactive components.',
          '',
          '### Behavior',
          '- Scales down on press (default: 0.97)',
          '- Spring animation for natural feel',
          '- Respects `reduceAnimations` theme setting',
          '- Includes haptic feedback (when configured)',
          '',
          '### When to use',
          '- For custom interactive elements that need press feedback',
          '- As the base for building new pressable components',
          '',
          '### When NOT to use',
          '- For standard buttons → use `Button`',
          '- For icon-only buttons → use `IconButton`',
          '- For pressable cards → use `Card` with `onPress`',
          '',
          '### Import',
          '```tsx',
          "import { PressableScale } from '@polprog/native-ui';",
          '```',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    scaleTo: { control: { type: 'number', min: 0.8, max: 1, step: 0.01 }, description: 'Scale factor when pressed (0.8-1.0)' },
    disabled: { control: 'boolean' },
    onPress: { action: 'pressed' },
  },
};

export default meta;
type Story = StoryObj<PressableScaleProps>;

export const Playground: Story = {
  args: {
    scaleTo: 0.97,
    disabled: false,
  },
  render: (args) => {
    const theme = useTheme();
    return (
      <PressableScale {...args}>
        <View style={{ backgroundColor: theme.colors.primary, paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12 }}>
          <RNText style={{ color: theme.colors.textInverse, fontSize: 15, fontWeight: '600', textAlign: 'center' }}>
            Press me (scale to {args.scaleTo})
          </RNText>
        </View>
      </PressableScale>
    );
  },
};

export const ScaleValues: Story = {
  name: 'Different Scale Values',
  render: () => {
    const theme = useTheme();
    return (
      <HStack gap="md" wrap>
        {[0.9, 0.93, 0.95, 0.97, 0.99].map((scale) => (
          <PressableScale key={scale} scaleTo={scale} onPress={() => {}}>
            <View style={{ backgroundColor: theme.colors.primary, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10 }}>
              <RNText style={{ color: theme.colors.textInverse, fontSize: 13, fontWeight: '600' }}>{scale}</RNText>
            </View>
          </PressableScale>
        ))}
      </HStack>
    );
  },
};

export const CustomContent: Story = {
  name: 'Custom Pressable Content',
  render: () => {
    const theme = useTheme();
    return (
      <VStack gap="md" style={{ maxWidth: 320 }}>
        <PressableScale onPress={() => {}}>
          <View style={{ backgroundColor: theme.colors.textInverse, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: theme.colors.border }}>
            <RNText style={{ fontSize: 16, fontWeight: '600', color: theme.colors.textPrimary }}>Pressable Card</RNText>
            <RNText style={{ fontSize: 13, color: theme.colors.textSecondary, marginTop: 4 }}>
              Tap this card to see the scale animation. Works with any content.
            </RNText>
          </View>
        </PressableScale>
        <PressableScale onPress={() => {}} disabled>
          <View style={{ backgroundColor: theme.colors.surfaceSecondary, borderRadius: 14, padding: 16, opacity: 0.5 }}>
            <RNText style={{ fontSize: 16, fontWeight: '600', color: theme.colors.textPrimary }}>Disabled</RNText>
            <RNText style={{ fontSize: 13, color: theme.colors.textSecondary, marginTop: 4 }}>This item is not pressable.</RNText>
          </View>
        </PressableScale>
      </VStack>
    );
  },
};

export const RespectReduceAnimations: Story = {
  name: 'respectReduceAnimations (opt-out)',
  parameters: {
    docs: {
      description: {
        story: [
          '`respectReduceAnimations` is `true` by default - when `theme.reduceAnimations` is enabled the spring collapses to an instant no-op so users with reduce-motion preferences don\'t get visible scaling.',
          '',
          'Set `respectReduceAnimations={false}` for cases where the scale is critical affordance (e.g. the only visual press feedback on an icon-only control). Prefer the default for everything else.',
        ].join('\n'),
      },
    },
  },
  render: () => {
    const theme = useTheme();
    return (
      <VStack gap="md" style={{ maxWidth: 360 }}>
        <PressableScale onPress={() => {}}>
          <View style={{ backgroundColor: theme.colors.primary, padding: 14, borderRadius: 10 }}>
            <RNText style={{ color: theme.colors.textInverse, fontWeight: '600' }}>Default (respects reduce-motion)</RNText>
          </View>
        </PressableScale>
        <PressableScale onPress={() => {}} respectReduceAnimations={false}>
          <View style={{ backgroundColor: theme.colors.textPrimary, padding: 14, borderRadius: 10 }}>
            <RNText style={{ color: theme.colors.textInverse, fontWeight: '600' }}>Forced animation (ignores the setting)</RNText>
          </View>
        </PressableScale>
      </VStack>
    );
  },
};
