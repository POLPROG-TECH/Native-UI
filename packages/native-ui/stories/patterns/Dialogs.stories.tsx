import React, { useState } from 'react';
import { fn } from 'storybook/test';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from '../../src/components/Modal';
import { Button } from '../../src/components/Button';
import { Input } from '../../src/components/Input';
import { Select } from '../../src/components/Select';
import { VStack, HStack } from '../../src/primitives/Stack';
import { Box } from '../../src/primitives/Box';
import { Text } from '../../src/primitives/Text';
import type { SelectOption } from '../../src/components/Select';

const meta: Meta = {
  title: 'Patterns/Dialogs & Sheets',
  // Imperative demos: each variant mounts its own Modal root, so the Docs
  // page would stack them on top of each other.
  tags: ['!autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Common modal dialog patterns using Modal and BottomSheet components.',
          '',
          '### Patterns covered',
          '- Delete confirmation (destructive)',
          '- Quick add form in modal',
          '- Information alert',
        ].join('\n'),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const DeleteConfirmation = () => {
  const [visible, setVisible] = useState(false);
  return (
    <View>
      <Button title="Delete Entry" variant="destructive" onPress={() => setVisible(true)} />
      <Modal visible={visible} onClose={() => setVisible(false)} title="Delete Entry?">
        <VStack gap="md">
          <Text variant="body" color="textSecondary">
            This action cannot be undone. The entry and all associated data will be permanently deleted.
          </Text>
          <HStack gap="md">
            <Box style={{ flex: 1 }}>
              <Button title="Cancel" variant="outline" onPress={() => { setVisible(false); fn()(); }} />
            </Box>
            <Box style={{ flex: 1 }}>
              <Button title="Delete" variant="destructive" onPress={() => { setVisible(false); fn()(); }} />
            </Box>
          </HStack>
        </VStack>
      </Modal>
    </View>
  );
};

export const DeleteConfirmationDialog: Story = {
  name: 'Delete Confirmation',
  render: () => <DeleteConfirmation />,
};

const categoryOptions: SelectOption<string>[] = [
  { label: 'Food', value: 'food' },
  { label: 'Transport', value: 'transport' },
  { label: 'Other', value: 'other' },
];

const QuickAddEntry = () => {
  const [visible, setVisible] = useState(false);
  const [category, setCategory] = useState<string | null>(null);
  return (
    <View>
      <Button title="Quick Add" onPress={() => setVisible(true)} />
      <Modal visible={visible} onClose={() => setVisible(false)} title="Add Entry">
        <VStack gap="md">
          <Input label="Amount" placeholder="0.00" keyboardType="decimal-pad" required />
          <Input label="Description" placeholder="What was this for?" required />
          <Select
            label="Category"
            placeholder="Select"
            value={category}
            options={categoryOptions}
            onChange={(v) => {
              setCategory(v);
              fn()(v);
            }}
          />
          <Button title="Save" onPress={() => { setVisible(false); fn()(); }} />
        </VStack>
      </Modal>
    </View>
  );
};

export const QuickAddForm: Story = {
  name: 'Quick Add Form Modal',
  render: () => <QuickAddEntry />,
};

const InfoAlert = () => {
  const [visible, setVisible] = useState(false);
  return (
    <View>
      <Button title="Show Info" variant="outline" onPress={() => setVisible(true)} />
      <Modal visible={visible} onClose={() => setVisible(false)} title="About Budgets">
        <VStack gap="md">
          <Text variant="body" color="textSecondary">
            Budgets help you track spending against planned limits. Set monthly budgets per category to get alerts when you're close to your limit.
          </Text>
          <Button title="Got It" onPress={() => setVisible(false)} />
        </VStack>
      </Modal>
    </View>
  );
};

export const InformationAlert: Story = {
  name: 'Information Alert',
  render: () => <InfoAlert />,
};
