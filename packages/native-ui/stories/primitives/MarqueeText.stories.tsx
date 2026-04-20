import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { MarqueeText } from '../../src/primitives/MarqueeText';
import { VStack } from '../../src/primitives/Stack';
import { Text } from '../../src/primitives/Text';
import { useTheme } from '../../src/theme/ThemeProvider';
import type { MarqueeTextProps } from '../../src/primitives/MarqueeText';

const meta: Meta<MarqueeTextProps> = {
  title: 'Primitives/MarqueeText',
  component: MarqueeText,
  parameters: {
    docs: {
      description: {
        component: [
          'Single-line text that auto-scrolls horizontally when its content overflows the container. Renders as a static, truncated `Text` when the content fits or when `theme.reduceAnimations` is enabled - falling back gracefully is part of the design.',
          '',
          '### When to use',
          '- Long titles inside fixed-width cards (activity feeds, chips, list headers).',
          '- Places where truncation (`…`) hides information the user needs.',
          '',
          '### Behavior',
          '- Measures the intrinsic text width in a hidden off-screen layer.',
          '- Scrolls only when `intrinsicWidth > containerWidth` (with `overflowTolerance`).',
          '- Pauses `pauseDuration` ms between cycles; scroll speed is `speed` px/s.',
          '',
          '### Import',
          '```tsx',
          "import { MarqueeText } from '@polprog/native-ui';",
          '```',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    text: { control: 'text' },
    speed: { control: { type: 'number', min: 10, max: 120, step: 5 } },
    pauseDuration: { control: { type: 'number', min: 0, max: 6000, step: 250 } },
    gap: { control: { type: 'number', min: 0, max: 200, step: 4 } },
  },
};

export default meta;
type Story = StoryObj<MarqueeTextProps>;

const Frame = ({ children, width = 200 }: { children: React.ReactNode; width?: number }) => {
  const theme = useTheme();
  return (
    <View
      style={{
        width,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.surface,
      }}
    >
      {children}
    </View>
  );
};

const MarqueeInFrame = ({ args }: { args: MarqueeTextProps }) => {
  const theme = useTheme();
  return (
    <Frame>
      <MarqueeText {...args} style={{ fontSize: 15, color: theme.colors.textPrimary }} />
    </Frame>
  );
};

export const Playground: Story = {
  args: {
    text: 'This is a fairly long title that will scroll horizontally inside the fixed-width frame',
    speed: 30,
    pauseDuration: 2000,
    gap: 40,
  },
  render: (args) => <MarqueeInFrame args={args} />,
};

export const FitsVsOverflows: Story = {
  name: 'Fits vs Overflows',
  render: () => (
    <VStack gap="md">
      <VStack gap="xs">
        <Text variant="caption" color="textTertiary">Fits - stays static</Text>
        <Frame>
          <MarqueeText text="Short title" style={{ fontSize: 15 }} />
        </Frame>
      </VStack>
      <VStack gap="xs">
        <Text variant="caption" color="textTertiary">Overflows - scrolls automatically</Text>
        <Frame>
          <MarqueeText
            text="This title definitely does not fit inside the container and will start scrolling"
            style={{ fontSize: 15 }}
          />
        </Frame>
      </VStack>
    </VStack>
  ),
};

export const SpeedVariants: Story = {
  name: 'Speed Variants',
  render: () => (
    <VStack gap="md">
      {[20, 40, 80].map((speed) => (
        <VStack key={speed} gap="xs">
          <Text variant="caption" color="textTertiary">speed: {speed} px/s</Text>
          <Frame width={240}>
            <MarqueeText
              text="The quick brown fox jumps over the lazy dog many, many times"
              speed={speed}
              style={{ fontSize: 15 }}
            />
          </Frame>
        </VStack>
      ))}
    </VStack>
  ),
};
