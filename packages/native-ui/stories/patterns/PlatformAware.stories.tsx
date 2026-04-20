import React, { useState } from 'react';
import { Platform } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '../../src/components/Badge';
import { Box } from '../../src/primitives/Box';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Divider } from '../../src/primitives/Divider';
import { HStack, VStack } from '../../src/primitives/Stack';
import { Heading } from '../../src/primitives/Heading';
import { InputPrompt } from '../../src/components/InputPrompt';
import { Text } from '../../src/primitives/Text';


const meta: Meta = {
  title: 'Patterns/Platform Aware',
  parameters: {
    docs: {
      description: {
        component: [
          'native-ui provides components that automatically adapt their implementation',
          'based on the target platform (iOS, Android, Web).',
          '',
          '### Platform Patterns',
          '',
          '| Component | iOS | Android | Web |',
          '|---|---|---|---|',
          '| **InputPrompt** | Native `Alert.prompt` | Custom modal | Custom modal |',
          '| **BottomSheet** | Native sheet | Modal overlay | Modal overlay |',
          '| **Select** | Native picker | Native picker | `<select>` |',
          '| **Toast** | Top inset | Top inset | Fixed top |',
          '| **PressableScale** | Spring animation | Timing animation | CSS transition |',
          '',
          '### How it works',
          '',
          'Components use `Platform.OS` and `.select()` to choose the best implementation.',
          'The Storybook preview runs on **web** via `react-native-web`.',
        ].join('\n'),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const CurrentPlatform: Story = {
  name: 'Current Platform',
  render: () => (
    <VStack spacing="md">
      <Heading level={2}>Platform Detection</Heading>
      <Card>
        <VStack spacing="sm">
          <HStack spacing="sm" style={{ alignItems: 'center' }}>
            <Text variant="body" style={{ fontWeight: '600' }}>
              Platform.OS:
            </Text>
            <Badge label={Platform.OS} />
          </HStack>
          <Text variant="caption">
            Storybook runs via react-native-web, so Platform.OS reports "web".
            On a real device this would be "ios" or "android".
          </Text>
        </VStack>
      </Card>
    </VStack>
  ),
};

export const InputPromptDemo: Story = {
  name: 'InputPrompt',
  render: () => {
    const [visible, setVisible] = useState(false);
    const [lastValue, setLastValue] = useState<string | null>(null);

    return (
      <VStack spacing="md">
        <Heading level={2}>InputPrompt</Heading>
        <Text variant="caption">
          On iOS this delegates to the native Alert.prompt API. On Android and
          web it renders a custom modal dialog.
        </Text>

        <Divider />

        <HStack spacing="sm">
          <Badge
            label={`Current: ${Platform.OS}`}
            variant={Platform.OS === 'web' ? 'info' : 'success'}
          />
          <Badge
            label={Platform.OS === 'ios' ? 'Native Alert' : 'Modal Dialog'}
          />
        </HStack>

        <Button title="Open InputPrompt" onPress={() => setVisible(true)} />

        {lastValue !== null && (
          <Card>
            <Text>
              Last submitted value: <Text style={{ fontWeight: '600' }}>{lastValue}</Text>
            </Text>
          </Card>
        )}

        <InputPrompt
          visible={visible}
          title="Rename Item"
          message="Enter a new name for this item."
          placeholder="New name..."
          onSubmit={(value) => {
            setLastValue(value);
            setVisible(false);
          }}
          onCancel={() => setVisible(false)}
        />
      </VStack>
    );
  },
};

export const PlatformPatterns: Story = {
  name: 'Platform Patterns',
  render: () => (
    <VStack spacing="md">
      <Heading level={2}>Platform Behavior Reference</Heading>
      <Text variant="caption">
        How each platform-aware component adapts its behavior.
      </Text>

      <Divider />

      {[
        {
          name: 'InputPrompt',
          ios: 'Uses native Alert.prompt for OS-level dialog',
          android: 'Renders a custom modal with TextInput',
          web: 'Renders a custom modal with TextInput',
        },
        {
          name: 'BottomSheet',
          ios: 'Native sheet presentation',
          android: 'Modal overlay with slide animation',
          web: 'Modal overlay with slide animation',
        },
        {
          name: 'Select',
          ios: 'Native iOS picker',
          android: 'Native Android picker',
          web: 'HTML <select> element via react-native-web',
        },
        {
          name: 'Toast',
          ios: 'Animated from top with safe area inset',
          android: 'Animated from top with safe area inset',
          web: 'Fixed position at top of viewport',
        },
        {
          name: 'PressableScale',
          ios: 'Spring animation via Reanimated',
          android: 'Timing animation via Reanimated',
          web: 'CSS transition fallback',
        },
      ].map((item) => (
        <Card key={item.name}>
          <VStack spacing="xs">
            <Text variant="body" style={{ fontWeight: '700' }}>
              {item.name}
            </Text>
            <HStack spacing="xs" style={{ flexWrap: 'wrap' }}>
              <Badge label="iOS" variant="info" />
              <Text variant="caption">{item.ios}</Text>
            </HStack>
            <HStack spacing="xs" style={{ flexWrap: 'wrap' }}>
              <Badge label="Android" variant="success" />
              <Text variant="caption">{item.android}</Text>
            </HStack>
            <HStack spacing="xs" style={{ flexWrap: 'wrap' }}>
              <Badge label="Web" />
              <Text variant="caption">{item.web}</Text>
            </HStack>
          </VStack>
        </Card>
      ))}
    </VStack>
  ),
};
