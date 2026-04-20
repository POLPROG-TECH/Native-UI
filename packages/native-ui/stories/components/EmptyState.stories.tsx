import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { action as sbAction } from 'storybook/actions';
import { Button } from '../../src/components/Button';
import type { EmptyStateProps } from '../../src/components/EmptyState';
import { EmptyState } from '../../src/components/EmptyState';
import { VStack } from '../../src/primitives/Stack';

const meta: Meta<EmptyStateProps> = {
  title: 'Components/EmptyState',
  component: EmptyState,
  parameters: {
    docs: {
      description: {
        component: [
          'Full-screen zero-state placeholder for empty lists, error states, and onboarding.',
          '',
          '### Anatomy',
          '- Optional icon (emoji, 48px)',
          '- Required title',
          '- Optional message',
          '- Optional action (ReactNode, typically a Button)',
          '',
          '### When to use',
          '- Empty lists (no data yet)',
          '- No search results',
          '- Error/failed load states',
          '- Post-deletion states',
          '',
          '### Import',
          '```tsx',
          "import { EmptyState } from '@polprog/native-ui';",
          '```',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    icon: { control: 'text', description: 'Emoji or icon string (48px)' },
    title: { control: 'text' },
    message: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<EmptyStateProps>;

export const Playground: Story = {
  args: { icon: '📋', title: 'No entries yet', message: 'Add your first entry to get started.' },
};

export const NoData: Story = {
  name: 'No Data',
  render: () => (
    <EmptyState
      icon="📋"
      title="No entries yet"
      message="Start tracking your expenses by adding your first entry."
      action={<Button title="Add Entry" onPress={sbAction('add')} />}
    />
  ),
};

export const NoSearchResults: Story = {
  name: 'No Search Results',
  render: () => (
    <EmptyState
      icon="🔍"
      title="No results found"
      message="Try adjusting your search or filters."
    />
  ),
};

export const ErrorState: Story = {
  name: 'Error State',
  render: () => (
    <EmptyState
      icon="⚠️"
      title="Something went wrong"
      message="We couldn't load your data. Please check your connection and try again."
      action={<Button title="Try Again" variant="outline" onPress={sbAction('retry')} />}
    />
  ),
};

export const NoProject: Story = {
  name: 'No Active Project',
  render: () => (
    <EmptyState
      icon="📁"
      title="No active project"
      message="Select or create a project to start tracking expenses."
      action={<Button title="Create Project" onPress={sbAction('create')} />}
    />
  ),
};

export const AllVariations: Story = {
  name: 'Common Patterns',
  render: () => (
    <VStack gap="3xl">
      <EmptyState
        icon="📋"
        title="No entries"
        message="Your expense list is empty."
        action={<Button title="Add Entry" size="sm" onPress={sbAction('add')} />}
      />
      <EmptyState icon="🔍" title="No results" message="No items match your search." />
      <EmptyState icon="✅" title="All done!" message="You've completed all tasks." />
      <EmptyState title="Nothing here" message="Minimal empty state without icon." />
    </VStack>
  ),
};
