import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { StatTile } from '../../src/components/StatTile';
import type { StatTileProps } from '../../src/components/StatTile';
import { Box } from '../../src/primitives/Box';
import { HStack, VStack } from '../../src/primitives/Stack';
import { Text } from '../../src/primitives/Text';

const meta: Meta<StatTileProps> = {
  title: 'Components/StatTile',
  component: StatTile,
  parameters: {
    docs: {
      description: {
        component: [
          'Compact statistic tile - uppercase LABEL on top, bold value below, optional caption.',
          '',
          'Designed for score/result grids (Time · Moves · Score), dashboards, and social-share cards. Visually consistent with `Card` content density.',
          '',
          '### Tones',
          '| Tone | Color key |',
          '|---|---|',
          '| `neutral` | `textPrimary` |',
          '| `primary` | `primary` |',
          '| `success` | `success` |',
          '| `warning` | `warning` |',
          '| `error`   | `error` |',
          '',
          '### Sizes',
          '- `sm`: dashboard chips (12 label / 18 value)',
          '- `md`: result screens (11 label / 24 value) - **default**',
          '- `lg`: share cards (12 label / 32 value)',
          '',
          '### Import',
          '```tsx',
          "import { StatTile } from '@polprog/native-ui';",
          '```',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    label: { control: 'text' },
    value: { control: 'text' },
    caption: { control: 'text' },
    tone: { control: 'select', options: ['neutral', 'primary', 'success', 'warning', 'error'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    align: { control: 'inline-radio', options: ['left', 'center'] },
    mono: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<StatTileProps>;

export const Playground: Story = {
  args: {
    label: 'TIME',
    value: '01:24',
    caption: 'best: 02:13',
    tone: 'neutral',
    size: 'md',
    align: 'center',
    mono: true,
  },
};

export const AllTones: Story = {
  name: 'All tones',
  render: () => (
    <HStack gap="md" wrap>
      {(['neutral', 'primary', 'success', 'warning', 'error'] as const).map((tone) => (
        <Box key={tone} p="md" bg="surface" radius="md" style={{ minWidth: 120 }}>
          <StatTile label={tone.toUpperCase()} value="358" caption={tone} tone={tone} />
        </Box>
      ))}
    </HStack>
  ),
};

export const AllSizes: Story = {
  name: 'All sizes',
  render: () => (
    <VStack gap="lg">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <VStack key={size} gap="sm">
          <Text variant="label" color="textSecondary">size="{size}"</Text>
          <HStack gap="md">
            <Box p="md" bg="surface" radius="md">
              <StatTile label="TIME" value="01:24" size={size} />
            </Box>
            <Box p="md" bg="surface" radius="md">
              <StatTile label="MOVES" value="82" size={size} />
            </Box>
            <Box p="md" bg="surface" radius="md">
              <StatTile label="SCORE" value="358" size={size} />
            </Box>
          </HStack>
        </VStack>
      ))}
    </VStack>
  ),
};

export const ResultGrid: Story = {
  name: 'Result-screen grid',
  parameters: {
    docs: {
      description: {
        story:
          'Typical composition at the end of a puzzle / workout: three tiles side-by-side with matching tones. Highlight the "new record" with `tone="success"` and a caption.',
      },
    },
  },
  render: () => (
    <Box p="xl" bg="surface" radius="xl" elevation="md" style={{ maxWidth: 420 }}>
      <VStack gap="lg">
        <Text variant="h2">Puzzle solved!</Text>
        <HStack gap="md">
          <Box p="md" bg="surfaceSecondary" radius="md" style={{ flex: 1 }}>
            <StatTile label="TIME" value="01:24" caption="best: 02:13" tone="success" />
          </Box>
          <Box p="md" bg="surfaceSecondary" radius="md" style={{ flex: 1 }}>
            <StatTile label="MOVES" value="82" tone="neutral" />
          </Box>
          <Box p="md" bg="surfaceSecondary" radius="md" style={{ flex: 1 }}>
            <StatTile label="SCORE" value="358" caption="+25 today" tone="primary" />
          </Box>
        </HStack>
      </VStack>
    </Box>
  ),
};

export const Alignment: Story = {
  name: 'Left vs centre alignment',
  render: () => (
    <HStack gap="md">
      <Box p="md" bg="surface" radius="md" style={{ width: 160 }}>
        <StatTile label="TOTAL SOLVES" value="127" caption="this month" align="left" />
      </Box>
      <Box p="md" bg="surface" radius="md" style={{ width: 160 }}>
        <StatTile label="TOTAL SOLVES" value="127" caption="this month" align="center" />
      </Box>
    </HStack>
  ),
};

export const LongValueNoMono: Story = {
  name: 'Long value, proportional figures',
  parameters: {
    docs: {
      description: {
        story:
          'Turn `mono` off for non-numeric values where tabular figures hurt readability (e.g. ISO timestamps, locale strings).',
      },
    },
  },
  render: () => (
    <HStack gap="md">
      <Box p="md" bg="surface" radius="md">
        <StatTile label="LAST SOLVE" value="2 h ago" mono={false} />
      </Box>
      <Box p="md" bg="surface" radius="md">
        <StatTile label="STREAK" value="14 days" mono={false} tone="primary" />
      </Box>
    </HStack>
  ),
};
