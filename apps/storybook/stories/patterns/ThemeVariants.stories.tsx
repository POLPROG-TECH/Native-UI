import React, { useState } from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import {
  NativeUIProvider,
  Heading,
  Text,
  Button,
  Card,
  Chip,
  Switch,
  VStack,
  HStack,
  useTheme,
} from '@polprog/native-ui';

const noop = () => {};

/**
 * One panel of the components with the largest Aurora vs Bloom delta:
 * accent fills (Button, Chip, Switch) and the elevated surface (Card) where
 * the colour, corner radius, and shadow all change at once.
 */
function VariantPanel({ caption }: { caption: string }) {
  const theme = useTheme();
  const [on, setOn] = useState(true);

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        borderColor: theme.colors.border,
        borderWidth: 1,
        borderRadius: 20,
        padding: 16,
        width: 320,
      }}
    >
      <VStack gap="md">
        <Text variant="overline" color="textSecondary">
          {caption}
        </Text>
        <HStack gap="sm">
          <Button title="Primary" onPress={noop} />
          <Button title="Secondary" variant="secondary" onPress={noop} />
        </HStack>
        <Card>
          <VStack gap="xs">
            <Heading level={3}>Monthly budget</Heading>
            <Text color="textSecondary">2,450 of 3,000</Text>
            <Button title="Add entry" onPress={noop} />
          </VStack>
        </Card>
        <HStack gap="sm">
          <Chip label="Selected" selected onPress={noop} />
          <Chip label="Default" onPress={noop} />
        </HStack>
        <Switch value={on} onValueChange={setOn} label="Notifications" />
      </VStack>
    </View>
  );
}

function Comparison({ colorMode }: { colorMode: 'light' | 'dark' }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 24,
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        padding: 16,
      }}
    >
      <NativeUIProvider config={{ theme: 'default', colorMode }}>
        <VariantPanel caption="Aurora · default" />
      </NativeUIProvider>
      <NativeUIProvider config={{ theme: 'bloom', colorMode }}>
        <VariantPanel caption="Bloom · violet" />
      </NativeUIProvider>
    </View>
  );
}

const meta: Meta = {
  title: 'Patterns/Theme variants',
  parameters: {
    canvasPadding: 0,
    docs: {
      description: {
        component:
          'Aurora and Bloom rendered side by side on the components with the largest visual difference - accent fills and the elevated Card surface (colour, corner radius, and shadow all shift between variants).',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Light: Story = {
  name: 'Aurora vs Bloom · light',
  render: () => <Comparison colorMode="light" />,
};

export const Dark: Story = {
  name: 'Aurora vs Bloom · dark',
  render: () => <Comparison colorMode="dark" />,
};
