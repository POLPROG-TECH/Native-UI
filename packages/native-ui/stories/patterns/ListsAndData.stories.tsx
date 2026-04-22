import React from 'react';
import { fn } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from '../../src/components/Avatar';
import { Badge } from '../../src/components/Badge';
import { Box } from '../../src/primitives/Box';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Chip } from '../../src/components/Chip';
import { HStack, VStack } from '../../src/primitives/Stack';
import { ListHeader } from '../../src/components/ListHeader';
import { ListItem } from '../../src/components/ListItem';
import { ListSection } from '../../src/components/ListSection';
import { ListSwitchItem } from '../../src/components/ListSwitchItem';
import { ProgressBar } from '../../src/components/ProgressBar';
import { Section } from '../../src/components/Section';
import { Text } from '../../src/primitives/Text';

const meta: Meta = {
  title: 'Patterns/Lists & Data',
  parameters: {
    docs: {
      description: {
        component: [
          'Patterns for displaying lists, grouped settings, and data summaries.',
          '',
          '### Based on CostBoard patterns',
          '- Expense list with amounts',
          '- Settings screens with grouped sections',
          '- Category summaries with progress bars',
          '- Dashboard cards',
        ].join('\n'),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const ExpenseList: Story = {
  name: 'Expense List',
  render: () => (
    <VStack gap="sm" style={{ maxWidth: 420 }}>
      {[
        { title: 'Coffee', cat: '☕', amount: '€4.50', time: '2h ago' },
        { title: 'Groceries', cat: '🛒', amount: '€67.30', time: '5h ago' },
        { title: 'Train Ticket', cat: '🚆', amount: '€12.00', time: 'Yesterday' },
        { title: 'Rent', cat: '🏠', amount: '€1,200.00', time: '2 days ago' },
        { title: 'Netflix', cat: '🎬', amount: '€15.99', time: '3 days ago' },
      ].map((e, i, arr) => (
        <ListItem
          key={e.title}
          title={e.title}
          subtitle={e.time}
          value={e.amount}
          icon={
            <Text variant="body" style={{ fontSize: 24, width: 36, textAlign: 'center' }}>
              {e.cat}
            </Text>
          }
          onPress={fn()}
          hideDivider={i === arr.length - 1}
        />
      ))}
    </VStack>
  ),
};

export const CategorySummary: Story = {
  name: 'Category Summary',
  render: () => (
    <Section
      title="Budget Overview"
      action={<Button title="Details" variant="ghost" size="sm" onPress={fn()} />}
      style={{ maxWidth: 420 }}
    >
      <Card>
        <VStack gap="lg">
          {[
            { name: 'Food & Drinks', spent: 340, budget: 500, color: '#F59E0B' },
            { name: 'Transport', spent: 120, budget: 200, color: '#3B82F6' },
            { name: 'Housing', spent: 1200, budget: 1200, color: '#EF4444' },
            { name: 'Entertainment', spent: 45, budget: 150, color: '#8B5CF6' },
          ].map((c) => (
            <VStack key={c.name} gap="xs">
              <HStack justify="space-between">
                <Text variant="bodySmall">{c.name}</Text>
                <Text variant="bodySmall" color="textSecondary">
                  €{c.spent} / €{c.budget}
                </Text>
              </HStack>
              <ProgressBar value={c.spent / c.budget} />
            </VStack>
          ))}
        </VStack>
      </Card>
    </Section>
  ),
};

export const SettingsPage: Story = {
  name: 'Settings Page',
  render: () => (
    <VStack gap="lg" style={{ maxWidth: 420 }}>
      <ListHeader title="Settings" />
      <ListSection title="Account">
        <ListItem
          title="Profile"
          subtitle="John Doe"
          icon={<Avatar name="John Doe" size="sm" />}
          onPress={fn()}
        />
        <ListItem title="Subscription" value="Premium" onPress={fn()} />
        <ListItem
          title="Notifications"
          trailing={<Badge count={3} />}
          onPress={fn()}
          hideDivider
        />
      </ListSection>
      <ListSection title="Preferences">
        <ListSwitchItem label="Dark Mode" value={false} onValueChange={fn()} />
        <ListItem title="Currency" value="EUR (€)" onPress={fn()} />
        <ListItem title="Language" value="English" onPress={fn()} hideDivider />
      </ListSection>
      <ListSection title="Danger Zone" footer="This cannot be undone.">
        <ListItem title="Sign Out" destructive onPress={fn()} />
        <ListItem title="Delete Account" destructive onPress={fn()} hideDivider />
      </ListSection>
    </VStack>
  ),
};

export const DashboardCards: Story = {
  name: 'Dashboard Cards',
  render: () => (
    <VStack gap="lg" style={{ maxWidth: 420 }}>
      <Section title="This Month">
        <Card>
          <VStack gap="sm">
            <Text variant="bodySmall" color="textSecondary">
              Total Spending
            </Text>
            <Text variant="mono" style={{ fontSize: 32 }}>
              €2,847.30
            </Text>
            <HStack gap="sm">
              <Chip label="On Track" selected />
              <Text variant="bodySmall" color="textSecondary">
                Budget: €3,500
              </Text>
            </HStack>
            <ProgressBar value={0.81} />
          </VStack>
        </Card>
      </Section>
      <Section title="Quick Actions">
        <HStack gap="md">
          <Box style={{ flex: 1 }}>
            <Button title="Add Entry" onPress={fn()} />
          </Box>
          <Box style={{ flex: 1 }}>
            <Button title="Reports" variant="outline" onPress={fn()} />
          </Box>
        </HStack>
      </Section>
    </VStack>
  ),
};
