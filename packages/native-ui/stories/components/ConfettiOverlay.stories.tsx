import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Box } from '../../src/primitives/Box';
import { Button } from '../../src/components/Button';
import { ConfettiOverlay } from '../../src/components/ConfettiOverlay';
import { Text } from '../../src/primitives/Text';
import { VStack } from '../../src/primitives/Stack';
import type { ConfettiOverlayProps } from '../../src/components/ConfettiOverlay';

const meta: Meta<ConfettiOverlayProps> = {
  title: 'Components/ConfettiOverlay',
  component: ConfettiOverlay,
  parameters: {
    docs: {
      description: {
        component: [
          'Celebratory confetti burst rendered as an absolute-positioned, non-interactive overlay. Triggered by a `false → true` transition of the `visible` prop; auto-hides after `duration` ms and invokes `onComplete`.',
          '',
          '### Behavior',
          '- Honors `theme.reduceAnimations` by default - no burst renders when reduce-motion is on. Pass `forceAnimation` to override (use sparingly).',
          '- `pointerEvents: none` on the root, so it never intercepts touches.',
          '- Palette is swappable via `colors`; pieces are round-robined.',
          '',
          '### When to use',
          '- Goal completed, streak reached, survey submitted, subscription activated.',
          '- Keep usage rare - confetti is a reward signal, not decoration.',
          '',
          '### Import',
          '```tsx',
          "import { ConfettiOverlay } from '@polprog/native-ui';",
          '```',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    visible: { control: 'boolean' },
    particleCount: { control: { type: 'number', min: 10, max: 120, step: 5 } },
    duration: { control: { type: 'number', min: 500, max: 8000, step: 250 } },
    forceAnimation: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<ConfettiOverlayProps>;

const Demo = ({ particleCount, duration, forceAnimation, colors }: Partial<ConfettiOverlayProps>) => {
  // The container is intentionally taller so the burst has room to spread
  // and the clipping border doesn't cut off the first few cycles. Kept
  // `overflow: 'hidden'` so the demo visually contains the effect to its card.
  return (
    <Box
      p="lg"
      bg="background"
      style={{ minHeight: 480, position: 'relative', overflow: 'hidden', borderRadius: 14 }}>
      <DemoContent
        particleCount={particleCount}
        duration={duration}
        forceAnimation={forceAnimation}
        colors={colors}
      />
    </Box>
  );
};

const DemoContent = ({ particleCount, duration, forceAnimation, colors }: Partial<ConfettiOverlayProps>) => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <VStack gap="md" style={{ alignItems: 'center' }}>
        <Text variant="h2">🎉 You did it!</Text>
        <Text variant="body" color="textSecondary">Press the button to celebrate.</Text>
        <Button title="Trigger confetti" onPress={() => setVisible(true)} />
      </VStack>
      <ConfettiOverlay
        visible={visible}
        particleCount={particleCount}
        duration={duration}
        forceAnimation={forceAnimation}
        colors={colors}
        onComplete={() => setVisible(false)}
      />
    </>
  );
};

export const Playground: Story = {
  args: {
    visible: false,
    particleCount: 40,
    duration: 3000,
    forceAnimation: false,
  },
  render: (args) => (
    <Demo
      particleCount={args.particleCount}
      duration={args.duration}
      forceAnimation={args.forceAnimation}
    />
  ),
};

export const CustomPalette: Story = {
  name: 'Custom Palette',
  render: () => (
    <Demo
      particleCount={60}
      duration={3500}
      colors={['#FF3366', '#FF9933', '#FFCC00', '#33CC66', '#3399FF', '#9933FF']}
    />
  ),
};

export const Dense: Story = {
  name: 'Dense Burst',
  render: () => <Demo particleCount={100} duration={4000} />,
};
