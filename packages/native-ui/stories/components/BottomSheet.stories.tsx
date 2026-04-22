import React, { useState } from 'react';
import { fn } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { BottomSheet } from '../../src/components/BottomSheet';
import { Button } from '../../src/components/Button';
import { VStack } from '../../src/primitives/Stack';
import { Text } from '../../src/primitives/Text';
import { Divider } from '../../src/primitives/Divider';
import { Chip, ChipGroup } from '../../src/components/Chip';
import { ListItem } from '../../src/components/ListItem';
import type { BottomSheetProps } from '../../src/components/BottomSheet';

const meta: Meta<BottomSheetProps> = {
  title: 'Components/BottomSheet',
  component: BottomSheet,
  tags: ['!autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Slide-up panel from the bottom of the screen. Ideal for menus, filters, and contextual actions.',
          '',
          '### Features',
          '- Slide-up animation from bottom',
          '- Backdrop press to dismiss (configurable)',
          '- Drag handle for visual affordance',
          '- Uses react-native-reanimated for smooth animation',
          '',
          '### When to use',
          '- Filter panels',
          '- Action menus',
          '- Quick forms',
          '- Contextual options',
          '',
          '### When NOT to use',
          '- Confirmation dialogs → use `Modal`',
          '- Full-screen forms → use navigation',
          '',
          '### Import',
          '```tsx',
          "import { BottomSheet } from '@polprog/native-ui';",
          '```',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    visible: { table: { disable: true } },
    dismissable: { control: 'boolean' },
    onClose: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<BottomSheetProps>;

const SheetDemo = ({ children, dismissable }: { children: React.ReactNode; dismissable?: boolean }) => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Button title="Open Bottom Sheet" onPress={() => setVisible(true)} />
      <BottomSheet
        visible={visible}
        onClose={() => setVisible(false)}
        dismissable={dismissable}>
        {children}
      </BottomSheet>
    </>
  );
};

export const Playground: Story = {
  args: { dismissable: true },
  render: ({ dismissable }) => (
    <SheetDemo dismissable={dismissable}>
      <VStack gap="md" style={{ padding: 16 }}>
        <Text variant="h2">Sheet Content</Text>
        <Text variant="body" color="textSecondary">This content slides up from the bottom. Tap the backdrop{dismissable === false ? ' (disabled here)' : ''} to dismiss.</Text>
        <Button title="Close" variant="secondary" onPress={fn()} />
      </VStack>
    </SheetDemo>
  ),
};

export const ActionMenu: Story = {
  name: 'Action Menu',
  render: () => (
    <SheetDemo>
      <VStack style={{ padding: 16 }}>
        <Text variant="h3" style={{ marginBottom: 8 }}>Actions</Text>
        <ListItem title="Edit" icon={<Text variant="body">✏️</Text>} onPress={fn()} />
        <ListItem title="Duplicate" icon={<Text variant="body">📋</Text>} onPress={fn()} />
        <ListItem title="Share" icon={<Text variant="body">📤</Text>} onPress={fn()} />
        <Divider />
        <ListItem title="Delete" icon={<Text variant="body">🗑️</Text>} destructive onPress={fn()} hideDivider />
      </VStack>
    </SheetDemo>
  ),
};

export const FilterSheet: Story = {
  name: 'Filter Sheet',
  render: () => (
    <SheetDemo>
      <VStack gap="lg" style={{ padding: 16 }}>
        <Text variant="h2">Filters</Text>
        <VStack gap="sm">
          <Text variant="label">Category</Text>
          <ChipGroup>
            <Chip label="🍕 Food" selected onPress={fn()} />
            <Chip label="🚗 Transport" onPress={fn()} />
            <Chip label="🛍️ Shopping" onPress={fn()} />
            <Chip label="🎬 Fun" onPress={fn()} />
          </ChipGroup>
        </VStack>
        <VStack gap="sm">
          <Text variant="label">Status</Text>
          <ChipGroup>
            <Chip label="Paid" selected onPress={fn()} />
            <Chip label="Pending" onPress={fn()} />
            <Chip label="Overdue" selected onPress={fn()} />
          </ChipGroup>
        </VStack>
        <Button title="Apply Filters" onPress={fn()} fullWidth />
      </VStack>
    </SheetDemo>
  ),
};
