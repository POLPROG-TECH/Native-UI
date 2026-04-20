import React, { useState } from 'react';
import { View, Pressable, Text as RNText } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { HStack, VStack } from '../../src/primitives/Stack';
import { PaginationDots } from '../../src/primitives/PaginationDots';
import { Text } from '../../src/primitives/Text';
import { useTheme } from '../../src/theme/ThemeProvider';
import type { PaginationDotsProps } from '../../src/primitives/PaginationDots';

const meta: Meta<PaginationDotsProps> = {
  title: 'Primitives/PaginationDots',
  component: PaginationDots,
  parameters: {
    docs: {
      description: {
        component: [
          'Row of dots representing discrete steps or pages. The active dot expands and uses the accent color; inactive dots stay compact. Common carousel / onboarding pattern.',
          '',
          '### Behavior',
          '- Animates the active-dot width + color when `animated` is true (default).',
          '- Honors `theme.reduceAnimations` automatically.',
          '- Purely presentational - pair with a stepper/swiper for interaction.',
          '',
          '### Import',
          '```tsx',
          "import { PaginationDots } from '@polprog/native-ui';",
          '```',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    count: { control: { type: 'number', min: 2, max: 12, step: 1 } },
    current: { control: { type: 'number', min: 0, max: 11, step: 1 } },
    dotWidth: { control: { type: 'number', min: 4, max: 16, step: 1 } },
    activeWidth: { control: { type: 'number', min: 8, max: 40, step: 1 } },
    height: { control: { type: 'number', min: 4, max: 16, step: 1 } },
    gap: { control: { type: 'number', min: 0, max: 20, step: 1 } },
    animated: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<PaginationDotsProps>;

export const Playground: Story = {
  args: {
    count: 5,
    current: 1,
    dotWidth: 5,
    activeWidth: 16,
    height: 5,
    gap: 6,
    animated: true,
  },
};

export const ProgressStates: Story = {
  name: 'All Progress States',
  render: () => (
    <VStack gap="md">
      {[0, 1, 2, 3, 4].map((current) => (
        <HStack key={current} gap="md" align="center">
          <View style={{ width: 80 }}>
            <Text variant="caption" color="textTertiary">current: {current}</Text>
          </View>
          <PaginationDots count={5} current={current} />
        </HStack>
      ))}
    </VStack>
  ),
};

export const CustomSizes: Story = {
  name: 'Size Variants',
  render: () => (
    <VStack gap="lg">
      <VStack gap="xs">
        <Text variant="caption" color="textTertiary">Compact (dot 4 / active 12)</Text>
        <PaginationDots count={6} current={2} dotWidth={4} activeWidth={12} height={4} gap={4} />
      </VStack>
      <VStack gap="xs">
        <Text variant="caption" color="textTertiary">Default</Text>
        <PaginationDots count={6} current={2} />
      </VStack>
      <VStack gap="xs">
        <Text variant="caption" color="textTertiary">Oversized (dot 8 / active 28)</Text>
        <PaginationDots count={6} current={2} dotWidth={8} activeWidth={28} height={8} gap={10} />
      </VStack>
    </VStack>
  ),
};

export const CustomColors: Story = {
  name: 'Custom Colors',
  render: () => (
    <VStack gap="md">
      <PaginationDots count={4} current={1} activeColor="#EF4444" color="#FCA5A5" />
      <PaginationDots count={4} current={2} activeColor="#10B981" color="#A7F3D0" />
      <PaginationDots count={4} current={3} activeColor="#F59E0B" color="#FDE68A" />
    </VStack>
  ),
};

const Interactive = () => {
  const theme = useTheme();
  const [current, setCurrent] = useState(0);
  const count = 5;
  return (
    <VStack gap="md" style={{ alignItems: 'center' }}>
      <PaginationDots count={count} current={current} />
      <HStack gap="sm">
        <Pressable
          onPress={() => setCurrent((c) => Math.max(0, c - 1))}
          style={{ paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8, backgroundColor: theme.colors.surfaceSecondary }}
        >
          <RNText style={{ fontSize: 14 }}>◀ Prev</RNText>
        </Pressable>
        <Pressable
          onPress={() => setCurrent((c) => Math.min(count - 1, c + 1))}
          style={{ paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8, backgroundColor: theme.colors.surfaceSecondary }}
        >
          <RNText style={{ fontSize: 14 }}>Next ▶</RNText>
        </Pressable>
      </HStack>
    </VStack>
  );
};

export const InteractiveStepper: Story = {
  name: 'Interactive Stepper',
  render: () => <Interactive />,
};
