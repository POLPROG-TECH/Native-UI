import React, { useState } from 'react';
import { fn } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { Box } from '../../src/primitives/Box';
import { Button } from '../../src/components/Button';
import { ErrorBoundary, withErrorBoundary } from '../../src/components/ErrorBoundary';
import { Text } from '../../src/primitives/Text';
import { VStack } from '../../src/primitives/Stack';
import type { ErrorBoundaryProps } from '../../src/components/ErrorBoundary';

const meta: Meta<ErrorBoundaryProps> = {
  title: 'Components/ErrorBoundary',
  component: ErrorBoundary,
  parameters: {
    docs: {
      description: {
        component: [
          'Generic render-time error boundary. Catches exceptions thrown by descendants and shows a fallback UI with a reset button. Pair with the `withErrorBoundary` HOC for per-feature isolation.',
          '',
          '### Props',
          '- `onError(error, info)` - forward into Sentry / Crashlytics / custom reporter. The library stays reporter-agnostic.',
          '- `fallback` - static fallback node. Takes precedence when provided.',
          '- `renderFallback(error, reset, info)` - render-prop fallback for full control.',
          '- `resetKeys` - re-run the subtree when any value in the array changes (same contract as `react-error-boundary`).',
          '',
          '### Import',
          '```tsx',
          "import { ErrorBoundary, withErrorBoundary } from '@polprog/native-ui';",
          '```',
        ].join('\n'),
      },
    },
  },
};

export default meta;
type Story = StoryObj<ErrorBoundaryProps>;

export const Playground: Story = {
  args: {
    fallback: <Text>Something went wrong. Please try again.</Text>,
  },
  render: (args) => (
    <ErrorBoundary {...args}>
      <Text>This content is protected by ErrorBoundary.</Text>
    </ErrorBoundary>
  ),
};

function Crasher({ label = 'Crash the subtree' }: { label?: string }) {
  const [boom, setBoom] = useState(false);
  if (boom) {
    throw new Error('Boom - this subtree crashed on purpose.');
  }

  return <Button title={label} variant="danger" onPress={() => setBoom(true)} />;
}

export const DefaultFallback: Story = {
  name: 'Default Fallback',
  render: () => (
    <ErrorBoundary onError={(e, info) => fn()(e.message, info.componentStack)}>
      <Box p="lg" bg="surface" radius="lg">
        <VStack gap="md">
          <Text variant="h3">Dashboard widget</Text>
          <Text variant="body" color="textSecondary">
            Click the button to simulate a render-time exception.
          </Text>
          <Crasher />
        </VStack>
      </Box>
    </ErrorBoundary>
  ),
};

export const CustomFallbackNode: Story = {
  name: 'Static `fallback` prop',
  render: () => (
    <ErrorBoundary
      fallback={
        <Box p="md" bg="surface" radius="md">
          <Text variant="body" color="error">Widget unavailable right now.</Text>
        </Box>
      }
    >
      <Crasher label="Crash → show static fallback" />
    </ErrorBoundary>
  ),
};

export const RenderFallback: Story = {
  name: 'Render-prop fallback (with retry)',
  render: () => (
    <ErrorBoundary
      renderFallback={(error, reset) => (
        <Box p="md" bg="surface" radius="md">
          <VStack gap="sm">
            <Text variant="label" color="error">Oops: {error.message}</Text>
            <Button title="Reset and try again" variant="outline" onPress={reset} />
          </VStack>
        </Box>
      )}
    >
      <Crasher label="Crash → use render-prop" />
    </ErrorBoundary>
  ),
};

export const ResetKeys: Story = {
  name: 'Automatic reset via `resetKeys`',
  render: () => {
    const ResetKeysDemo = () => {
      const [userId, setUserId] = useState(1);

      return (
        <VStack gap="md">
          <Text variant="caption" color="textTertiary">
            Changing the user id resets the boundary even after a crash.
          </Text>
          <ErrorBoundary resetKeys={[userId]}>
            <VStack gap="sm">
              <Text variant="body">Current userId: {userId}</Text>
              <Crasher />
            </VStack>
          </ErrorBoundary>
          <Button title={`Change userId (now ${userId})`} onPress={() => setUserId((n) => n + 1)} />
        </VStack>
      );
    };

    return <ResetKeysDemo />;
  },
};

const WrappedWidget = withErrorBoundary(
  () => <Crasher label="HOC-wrapped widget - crash me" />,
  { fallbackMessage: 'Widget crashed - pulling in the fallback.' },
);

export const HOCPattern: Story = {
  name: 'withErrorBoundary HOC',
  render: () => <WrappedWidget />,
};
