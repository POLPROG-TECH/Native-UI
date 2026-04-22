import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Countdown } from '../../src/components/Countdown';
import type { CountdownProps } from '../../src/components/Countdown';
import { Box } from '../../src/primitives/Box';
import { HStack, VStack } from '../../src/primitives/Stack';
import { Text } from '../../src/primitives/Text';

/** Helper: "now + Nms" - used so the story is always "live". */
const inFuture = (ms: number) => new Date(Date.now() + ms);

const meta: Meta<CountdownProps> = {
  title: 'Components/Countdown',
  component: Countdown,
  parameters: {
    docs: {
      description: {
        component: [
          'Self-ticking countdown text to a fixed deadline. Safely clears its interval on unmount and when the target changes.',
          '',
          '### Formats',
          '| Format | Example | Use case |',
          '|---|---|---|',
          '| `auto` | `2h 15m` or `15m 00s` | Default - show hours when ≥ 1h |',
          '| `hm`   | `2h 15m`            | Daily challenges (≥1h always) |',
          '| `hms`  | `2h 15m 04s`        | High-precision countdowns |',
          '| `ms`   | `15m 04s`           | Short timers (< 1h) |',
          '',
          '### Tick cost',
          'Default `tickMs = 1000`. For low-priority UI (a sidebar badge, a stat card) pass `30_000` (half-minute) to cut re-renders.',
          '',
          '### Import',
          '```tsx',
          "import { Countdown } from '@polprog/native-ui';",
          '```',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    to: { control: 'date', description: 'Target timestamp (Date / ms / ISO)' },
    format: {
      control: 'select',
      options: ['auto', 'hm', 'hms', 'ms'],
      description: 'Output format',
    },
    tickMs: {
      control: { type: 'number', min: 100, max: 60_000, step: 500 },
      description: 'Re-render interval in ms',
    },
    expiredLabel: { control: 'text' },
    variant: { control: 'text', description: 'Inherited from Text (body, caption, h3, …)' },
    color: { control: 'text', description: 'Theme color key (textSecondary, primary, error, …)' },
  },
};

export default meta;
type Story = StoryObj<CountdownProps>;

export const Playground: Story = {
  args: {
    to: inFuture(2 * 60 * 60 * 1000 + 15 * 60 * 1000),
    format: 'auto',
    tickMs: 1000,
    variant: 'body',
    color: 'textPrimary',
  },
};

export const AllFormats: Story = {
  name: 'All formats',
  render: () => {
    const target = inFuture(2 * 60 * 60 * 1000 + 15 * 60 * 1000 + 4000);
    return (
      <VStack gap="md">
        {(['auto', 'hm', 'hms', 'ms'] as const).map((format) => (
          <HStack key={format} gap="md" align="center">
            <Box style={{ width: 70 }}>
              <Text variant="label" color="textSecondary">{format}</Text>
            </Box>
            <Countdown to={target} format={format} variant="body" color="textPrimary" />
          </HStack>
        ))}
      </VStack>
    );
  },
};

export const DailyChallenge: Story = {
  name: 'Daily-challenge pattern',
  parameters: {
    docs: {
      description: {
        story:
          'Common PuzzleGo / DailyForma usage: caption-tier "Ends in …" line under a challenge card. Uses `renderLabel` to prepend a localised prefix.',
      },
    },
  },
  render: () => {
    const nextMidnight = new Date();
    nextMidnight.setHours(24, 0, 0, 0);
    return (
      <Box p="lg" bg="surface" radius="lg" elevation="sm" style={{ maxWidth: 360 }}>
        <VStack gap="sm">
          <Text variant="h3">Today's challenge</Text>
          <Text variant="body" color="textSecondary">
            Solve the same shuffle as everyone else. One photo. One day.
          </Text>
          <Countdown
            to={nextMidnight}
            format="auto"
            variant="caption"
            color="textTertiary"
            renderLabel={(s) => `Ends in ${s}`}
          />
        </VStack>
      </Box>
    );
  },
};

export const NearExpiry: Story = {
  name: 'Near expiry + onExpire',
  parameters: {
    docs: {
      description: {
        story:
          'Set the deadline 5 seconds in the future. When the countdown hits zero, `onExpire` fires once and the component swaps to `expiredLabel`.',
      },
    },
  },
  render: () => (
    <VStack gap="md">
      <Countdown
        to={inFuture(5_000)}
        format="ms"
        expiredLabel="Time up!"
        variant="h3"
        color="error"
      />
      <Text variant="caption" color="textTertiary">
        Refresh the story to reset.
      </Text>
    </VStack>
  ),
};

export const LowPriorityTick: Story = {
  name: 'Low-priority tick (30s)',
  parameters: {
    docs: {
      description: {
        story:
          'For UI that does not need second-level precision, use a longer `tickMs` to reduce re-renders.',
      },
    },
  },
  render: () => (
    <VStack gap="sm">
      <Text variant="label" color="textSecondary">Re-renders every 30 s</Text>
      <Countdown
        to={inFuture(48 * 60 * 60 * 1000)}
        format="hm"
        tickMs={30_000}
        variant="body"
      />
    </VStack>
  ),
};
