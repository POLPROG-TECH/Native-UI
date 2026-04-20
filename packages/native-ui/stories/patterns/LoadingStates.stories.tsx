import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import { Box } from '../../src/primitives/Box';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { EmptyState } from '../../src/components/EmptyState';
import { HStack, VStack } from '../../src/primitives/Stack';
import { Heading } from '../../src/primitives/Heading';
import { ProgressBar } from '../../src/components/ProgressBar';
import { Skeleton } from '../../src/components/Skeleton';
import { Spinner } from '../../src/components/Spinner';
import { Text } from '../../src/primitives/Text';

const meta: Meta = {
  title: 'Patterns/Loading States',
  parameters: {
    docs: {
      description: {
        component: [
          'Patterns for representing loading, empty, and error states consistently.',
          '',
          '### Guidelines',
          '- Use **Spinner** for initial full-screen loads',
          '- Use **Skeleton** for content placeholders (partial loads)',
          '- Use **ProgressBar** for determinate progress',
          '- Use **EmptyState** for zero-data states',
          '- Use **Button loading** for form submissions',
          '',
          '### CostBoard patterns',
          '- Dashboard loading → skeleton cards',
          '- Expense list → skeleton rows → empty state (if no data)',
          '- Save entry → button loading state',
        ].join('\n'),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const SkeletonListLoading: Story = {
  name: 'Skeleton: List Loading',
  render: () => (
    <VStack gap="md" style={{ maxWidth: 420 }}>
      <Heading level={3}>Recent Entries</Heading>
      {[1, 2, 3, 4, 5].map((i) => (
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
  ),
};

export const SkeletonDashboard: Story = {
  name: 'Skeleton: Dashboard',
  render: () => (
    <VStack gap="lg" style={{ maxWidth: 420 }}>
      <Skeleton width="40%" height={28} borderRadius={6} />
      <Card>
        <VStack gap="sm">
          <Skeleton width="50%" height={14} borderRadius={4} />
          <Skeleton width="70%" height={32} borderRadius={6} />
          <Skeleton width="100%" height={8} borderRadius={4} />
        </VStack>
      </Card>
      <Card>
        <VStack gap="md">
          {[1, 2, 3].map((i) => (
            <VStack key={i} gap="xs">
              <HStack justify="space-between">
                <Skeleton width="35%" height={14} borderRadius={4} />
                <Skeleton width="20%" height={14} borderRadius={4} />
              </HStack>
              <Skeleton width="100%" height={8} borderRadius={4} />
            </VStack>
          ))}
        </VStack>
      </Card>
    </VStack>
  ),
};

export const FullScreenSpinner: Story = {
  name: 'Full Screen Spinner',
  render: () => (
    <View style={{ height: 300, borderWidth: 1, borderColor: 'rgba(127,127,127,0.2)', borderRadius: 14, overflow: 'hidden' }}>
      <Spinner label="Loading your data..." />
    </View>
  ),
};

export const EmptyStatePatterns: Story = {
  name: 'Empty State Patterns',
  render: () => (
    <VStack gap="3xl" style={{ maxWidth: 420 }}>
      <Card>
        <EmptyState
          icon="📋"
          title="No entries yet"
          message="Start tracking your expenses by adding your first entry."
          action={<Button title="Add Entry" size="sm" onPress={action('add')} />}
        />
      </Card>
      <Card>
        <EmptyState
          icon="🔍"
          title="No results"
          message="Try adjusting your filters or search terms."
        />
      </Card>
      <Card>
        <EmptyState
          icon="⚠️"
          title="Connection error"
          message="Please check your internet connection and try again."
          action={<Button title="Retry" variant="outline" size="sm" onPress={action('retry')} />}
        />
      </Card>
    </VStack>
  ),
};

const ButtonLoadingDemo = () => {
  const [loading, setLoading] = useState(false);
  const handlePress = () => {
    setLoading(true);
    action('submit')();
    setTimeout(() => setLoading(false), 2000);
  };
  return (
    <VStack gap="lg" style={{ maxWidth: 420 }}>
      <Heading level={3}>Button Loading States</Heading>
      <Text variant="body" color="textSecondary">Click "Save" to see loading state (2s timer).</Text>
      <VStack gap="md">
        <Button title="Save Entry" onPress={handlePress} loading={loading} />
        <Button title="Already Loading" onPress={() => {}} loading />
        <Button title="Disabled" onPress={() => {}} disabled />
      </VStack>
    </VStack>
  );
};

export const ButtonLoading: Story = {
  name: 'Button Loading States',
  render: () => <ButtonLoadingDemo />,
};

export const ProgressSteps: Story = {
  name: 'Progress Indicators',
  render: () => (
    <VStack gap="xl" style={{ maxWidth: 420 }}>
      <Heading level={3}>Progress Indicators</Heading>
      <VStack gap="lg">
        <VStack gap="xs">
          <HStack justify="space-between">
            <Text variant="bodySmall">Importing data...</Text>
            <Text variant="bodySmall" color="textSecondary">25%</Text>
          </HStack>
          <ProgressBar value={0.25} />
        </VStack>
        <VStack gap="xs">
          <HStack justify="space-between">
            <Text variant="bodySmall">Monthly budget</Text>
            <Text variant="bodySmall" color="textSecondary">€2,100 / €3,000</Text>
          </HStack>
          <ProgressBar value={0.7} />
        </VStack>
        <VStack gap="xs">
          <HStack justify="space-between">
            <Text variant="bodySmall">Storage used</Text>
            <Text variant="bodySmall" color="error">92% - Almost full</Text>
          </HStack>
          <ProgressBar value={0.92} color="error" />
        </VStack>
      </VStack>
    </VStack>
  ),
};
