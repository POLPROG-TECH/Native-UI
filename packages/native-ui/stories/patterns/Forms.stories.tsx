import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import { Box } from '../../src/primitives/Box';
import { Button } from '../../src/components/Button';
import { Checkbox } from '../../src/components/Checkbox';
import { HStack, VStack } from '../../src/primitives/Stack';
import { Heading } from '../../src/primitives/Heading';
import { Input } from '../../src/components/Input';
import { Radio } from '../../src/components/Radio';
import { Select } from '../../src/components/Select';
import { Text } from '../../src/primitives/Text';
import { TextArea } from '../../src/components/TextArea';

const meta: Meta = {
  title: 'Patterns/Forms',
  parameters: {
    docs: {
      description: {
        component: [
          'Common form layouts combining native-ui components.',
          'These patterns show how to compose inputs, selects, radios, checkboxes, and buttons into real forms.',
          '',
          '### Based on CostBoard patterns',
          '- Expense entry form',
          '- Settings forms',
          '- Filter/sort forms',
          '',
          '### Guidelines',
          '- Use `VStack gap="md"` between form fields',
          '- Use `VStack gap="xl"` between form sections',
          '- Place primary action button at the bottom',
          '- Show validation errors inline',
        ].join('\n'),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const ExpenseEntryForm = () => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');
  const [isRecurring, setRecurring] = useState(false);

  return (
    <VStack gap="lg" style={{ maxWidth: 420 }}>
      <Heading level={2}>New Entry</Heading>
      <VStack gap="md">
        <Input
          label="Amount"
          placeholder="0.00"
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          required
        />
        <Input
          label="Description"
          placeholder="What was this for?"
          value={description}
          onChangeText={setDescription}
          required
        />
        <Select
          label="Category"
          placeholder="Select category"
          value={category}
          onValueChange={(v) => {
            setCategory(v);
            action('categoryChange')(v);
          }}
          options={[
            { label: 'Food & Drinks', value: 'food' },
            { label: 'Transport', value: 'transport' },
            { label: 'Housing', value: 'housing' },
            { label: 'Entertainment', value: 'entertainment' },
            { label: 'Healthcare', value: 'health' },
            { label: 'Other', value: 'other' },
          ]}
        />
        <TextArea
          label="Notes"
          placeholder="Additional notes (optional)"
          value={notes}
          onChangeText={setNotes}
          numberOfLines={3}
        />
        <Checkbox label="Recurring expense" checked={isRecurring} onChange={setRecurring} />
      </VStack>
      <Button title="Save Entry" onPress={action('submit')} />
    </VStack>
  );
};

export const ExpenseEntry: Story = {
  name: 'Expense Entry Form',
  render: () => <ExpenseEntryForm />,
};

const FormWithValidation = () => {
  const [email, setEmail] = useState('invalid@');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);

  return (
    <VStack gap="lg" style={{ maxWidth: 420 }}>
      <Heading level={2}>Create Account</Heading>
      <VStack gap="md">
        <Input label="Full Name" placeholder="John Doe" required />
        <Input
          label="Email"
          placeholder="name@company.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          error="Please enter a valid email address"
          required
        />
        <Input
          label="Password"
          placeholder="Minimum 8 characters"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          required
          error={
            password.length > 0 && password.length < 8
              ? 'Password must be at least 8 characters'
              : undefined
          }
        />
        <Checkbox label="I agree to the Terms of Service" checked={agreed} onChange={setAgreed} />
      </VStack>
      <Button title="Create Account" onPress={action('signup')} disabled={!agreed} />
    </VStack>
  );
};

export const WithValidation: Story = {
  name: 'Form with Validation',
  render: () => <FormWithValidation />,
};

const FilterForm = () => {
  const [period, setPeriod] = useState('month');

  return (
    <VStack gap="lg" style={{ maxWidth: 420 }}>
      <Heading level={3}>Filter Entries</Heading>
      <VStack gap="md">
        <Select
          label="Category"
          placeholder="All categories"
          value=""
          onValueChange={action('category')}
          options={[
            { label: 'Food & Drinks', value: 'food' },
            { label: 'Transport', value: 'transport' },
            { label: 'Housing', value: 'housing' },
          ]}
        />
        <Text variant="label" color="textSecondary">
          Time Period
        </Text>
        <VStack gap="sm">
          <Radio label="This Week" selected={period === 'week'} onPress={() => setPeriod('week')} />
          <Radio
            label="This Month"
            selected={period === 'month'}
            onPress={() => setPeriod('month')}
          />
          <Radio label="This Year" selected={period === 'year'} onPress={() => setPeriod('year')} />
          <Radio label="All Time" selected={period === 'all'} onPress={() => setPeriod('all')} />
        </VStack>
      </VStack>
      <HStack gap="md">
        <Box style={{ flex: 1 }}>
          <Button title="Reset" variant="outline" onPress={action('reset')} />
        </Box>
        <Box style={{ flex: 1 }}>
          <Button title="Apply" onPress={action('apply')} />
        </Box>
      </HStack>
    </VStack>
  );
};

export const FilterPanel: Story = {
  name: 'Filter / Sort Panel',
  render: () => <FilterForm />,
};
