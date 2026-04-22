import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { VStack } from '../../src/primitives/Stack';
import { Text } from '../../src/primitives/Text';
import { Heading } from '../../src/primitives/Heading';
import { Card } from '../../src/components/Card';
import { useTheme } from '../../src/theme/ThemeProvider';
import type { ScreenContainerProps } from '../../src/components/ScreenContainer';

const meta: Meta<ScreenContainerProps> = {
  title: 'Components/ScreenContainer',
  component: ScreenContainer,
  parameters: {
    canvasPadding: 0,
    docs: {
      description: {
        component: [
          'Full-screen wrapper with safe area insets and max-width constraint (768px for tablet support).',
          '',
          '### Features',
          '- Respects safe area insets via `react-native-safe-area-context`',
          '- Max-width 768px (centered on tablets)',
          '- Optional padding (16px horizontal)',
          '- Configurable safe area edges',
          '',
          '### When to use',
          '- As the outermost wrapper for every screen',
          '- Provides consistent padding and safe area handling',
          '',
          '### Import',
          '```tsx',
          "import { ScreenContainer } from '@polprog/native-ui';",
          '```',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    padded: { control: 'boolean' },
    edges: { control: 'check', options: ['top', 'bottom'] },
  },
};

export default meta;
type Story = StoryObj<ScreenContainerProps>;

export const Playground: Story = {
  args: {
    padded: true,
  },
  render: (args) => (
    <ScreenContainer {...args}>
      <Text>Screen content goes here.</Text>
    </ScreenContainer>
  ),
};

export const Default: Story = {
  render: () => {
    const DefaultFrame = () => {
      const theme = useTheme();
      return (
        <View
          style={{
            height: 500,
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: 14,
            overflow: 'hidden',
          }}>
          <ScreenContainer>
            <VStack gap="lg">
              <Heading level={1}>Dashboard</Heading>
              <Card>
                <VStack gap="sm">
                  <Text variant="h2">Welcome Back</Text>
                  <Text variant="body" color="textSecondary">Your screen content goes here.</Text>
                </VStack>
              </Card>
              <Card>
                <Text variant="body">Another card section</Text>
              </Card>
            </VStack>
          </ScreenContainer>
        </View>
      );
    };
    return <DefaultFrame />;
  },
};

export const NoPadding: Story = {
  name: 'Without Padding',
  render: () => {
    const NoPaddingFrame = () => {
      const theme = useTheme();
      return (
        <View
          style={{
            height: 300,
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: 14,
            overflow: 'hidden',
          }}>
          <ScreenContainer padded={false}>
            <View
              style={{
                backgroundColor: theme.colors.surfaceSecondary,
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text variant="body" color="primary">Edge-to-edge content (padded=false)</Text>
            </View>
          </ScreenContainer>
        </View>
      );
    };
    return <NoPaddingFrame />;
  },
};
