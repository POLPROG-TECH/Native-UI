import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { within, expect, waitFor } from 'storybook/test';

import { Box } from '@polprog/native-ui';
import {
  Button,
  Card,
  EmptyState,
  Skeleton,
  Spinner,
  HStack,
  VStack,
  Heading,
  Text,
} from '@polprog/native-ui';

import { useFetch } from '../../.storybook/msw/hooks';
import { mockEndpoints } from '../../.storybook/msw/handlers';

/**
 * Network-backed Loading / Empty / Error pattern.
 *
 * Unlike the static stories in `Patterns/Loading States`, these stories
 * exercise a real `fetch()` call against an MSW-mocked endpoint so you
 * can verify the component actually reacts to network state transitions.
 *
 * Override a story's response via `parameters.msw.handlers = [...]`.
 */
type Entry = {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: string;
};

const EntryList: React.FC<{ refreshKey?: number; onRetry?: () => void }> = ({
  refreshKey = 0,
  onRetry,
}) => {
  const state = useFetch<Entry[]>('/entries', refreshKey);

  if (state.status === 'loading' || state.status === 'idle') {
    return (
      <VStack gap="md" style={{ maxWidth: 420 }}>
        <Heading level={3}>Recent entries</Heading>
        {[1, 2, 3, 4].map((i) => (
          <HStack key={i} gap="md" align="center">
            <Skeleton width={40} height={40} borderRadius={10} />
            <VStack gap="xs" style={{ flex: 1 }}>
              <Skeleton width="60%" height={16} borderRadius={4} />
              <Skeleton width="30%" height={12} borderRadius={4} />
            </VStack>
            <Skeleton width={60} height={16} borderRadius={4} />
          </HStack>
        ))}
      </VStack>
    );
  }

  if (state.status === 'error') {
    return (
      <Box style={{ maxWidth: 420 }}>
        <EmptyState
          icon="⚠️"
          title="Could not load entries"
          message={state.error}
          action={<Button title="Try again" onPress={onRetry ?? (() => {})} />}
        />
      </Box>
    );
  }

  if (state.data.length === 0) {
    return (
      <Box style={{ maxWidth: 420 }}>
        <EmptyState
          icon="📭"
          title="No entries yet"
          message="Tap the plus button to add your first one."
          action={<Button title="Add entry" onPress={() => {}} />}
        />
      </Box>
    );
  }

  return (
    <VStack gap="sm" style={{ maxWidth: 420 }}>
      <Heading level={3}>Recent entries</Heading>
      {state.data.map((e) => (
        <Card key={e.id}>
          <HStack gap="md" align="center">
            <VStack gap="xs" style={{ flex: 1 }}>
              <Text variant="body">{e.title}</Text>
              <Text variant="caption" color="textSecondary">{e.date}</Text>
            </VStack>
            <Text variant="body" style={{ fontVariant: ['tabular-nums'] }}>
              {e.amount.toFixed(2)} zł
            </Text>
          </HStack>
        </Card>
      ))}
    </VStack>
  );
};

const RefreshableList: React.FC = () => {
  const [key, setKey] = useState(0);
  return (
    <VStack gap="md">
      <HStack gap="sm" justify="flex-end">
        <Button
          title="Refresh"
          variant="ghost"
          size="sm"
          onPress={() => setKey((k) => k + 1)}
        />
      </HStack>
      <EntryList refreshKey={key} onRetry={() => setKey((k) => k + 1)} />
    </VStack>
  );
};

const meta: Meta = {
  title: 'Patterns/Network · Loading States',
  parameters: {
    docs: {
      description: {
        component: [
          'Real network-backed loading flow. A single `<EntryList />` component responds to `fetch()` states: skeleton → success | empty | error.',
          '',
          'Each story installs a different MSW handler via `parameters.msw.handlers`, so reviewers can flip between flows without touching component code - exactly how a reviewer would exercise the real backend during QA.',
          '',
          '### Stories',
          '- **Success** - default handler returns 5 entries after ~600ms.',
          '- **Empty** - handler returns `[]` after ~500ms.',
          '- **Error 500** - handler returns 500 JSON after ~500ms.',
          '- **Slow (3s)** - exercise skeleton animation under realistic latency.',
          '- **Pending (forever)** - useful for infinite-spinner screenshots.',
        ].join('\n'),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Success: Story = {
  render: () => <RefreshableList />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(
      async () => {
        await expect(canvas.getByText('Groceries')).toBeInTheDocument();
      },
      { timeout: 5000 },
    );
  },
};

export const Empty: Story = {
  parameters: {
    msw: { handlers: [mockEndpoints.entriesEmpty()] },
  },
  render: () => <RefreshableList />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(
      async () => {
        await expect(canvas.getByText(/no entries yet/i)).toBeInTheDocument();
      },
      { timeout: 5000 },
    );
  },
};

export const Error500: Story = {
  name: 'Error (500)',
  parameters: {
    msw: { handlers: [mockEndpoints.entriesError()] },
  },
  render: () => <RefreshableList />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(
      async () => {
        await expect(canvas.getByText(/could not load/i)).toBeInTheDocument();
      },
      { timeout: 5000 },
    );
  },
};

export const Slow: Story = {
  name: 'Slow response (3 s)',
  parameters: {
    msw: { handlers: [mockEndpoints.entriesSlow(3000)] },
  },
  render: () => <RefreshableList />,
};

export const PendingForever: Story = {
  name: 'Pending (forever)',
  parameters: {
    msw: { handlers: [mockEndpoints.entriesPending()] },
    docs: {
      description: {
        story:
          'Use this story only for visual regression of the skeleton / spinner frame. The request never resolves so `play`-tests would time out - keep them off.',
      },
    },
  },
  render: () => (
    <VStack gap="md" style={{ maxWidth: 420 }}>
      <Spinner />
      <EntryList />
    </VStack>
  ),
};
