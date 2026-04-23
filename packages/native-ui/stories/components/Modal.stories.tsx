import React, { useState } from 'react';
import { fn } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from '../../src/components/Modal';
import { Button } from '../../src/components/Button';
import { Input } from '../../src/components/Input';
import { VStack, HStack } from '../../src/primitives/Stack';
import { Text } from '../../src/primitives/Text';
import type { ModalProps } from '../../src/components/Modal';

const meta: Meta<ModalProps> = {
  title: 'Components/Modal',
  component: Modal,
  // These stories own `visible` in local useState so each demo is
  // self-contained. The autodocs page would mount all of them at once
  // and stack portals - opt out and keep a single Docs block in the
  // component description.
  tags: ['!autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Centered dialog overlay for confirmations, forms, and important actions.',
          '',
          '### Features',
          '- Fade animation for smooth transitions',
          '- Backdrop press to dismiss (configurable)',
          '- Optional title, content, and footer areas',
          '- KeyboardAvoidingView on iOS for forms',
          '- Max width: 400px, 85% of screen width',
          '',
          '### When to use',
          '- Confirmation dialogs (delete, discard)',
          '- Small forms (rename, add note)',
          '- Important decisions requiring attention',
          '',
          '### When NOT to use',
          '- Long forms → use full screen or BottomSheet',
          '- Non-blocking information → use Toast',
          '- Options/menus → use BottomSheet',
          '',
          '### Import',
          '```tsx',
          "import { Modal } from '@polprog/native-ui';",
          '```',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    visible: { table: { disable: true } },
    title: { control: 'text' },
    dismissable: { control: 'boolean' },
    onClose: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<ModalProps>;

const ModalDemo = ({ title, children, footer, dismissable }: Partial<ModalProps> & { children: React.ReactNode }) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button title="Open Modal" onPress={() => setVisible(true)} />
      <Modal
        visible={visible}
        onClose={() => { setVisible(false); fn()(); }}
        title={title}
        footer={footer}
        dismissable={dismissable}
      >
        {children}
      </Modal>
    </>
  );
};

export const Playground: Story = {
  render: () => (
    <ModalDemo title="Dialog Title">
      <Text variant="body" color="textSecondary">This is the modal content. Tap the backdrop or press a button to close.</Text>
    </ModalDemo>
  ),
};

export const ConfirmationDialog: Story = {
  name: 'Confirmation Dialog',
  render: () => {
    const ConfirmDemo = () => {
      const [visible, setVisible] = useState(false);

      return (
        <>
          <Button title="Delete Item" variant="danger" onPress={() => setVisible(true)} />
          <Modal
            visible={visible}
            onClose={() => setVisible(false)}
            title="Delete Entry?"
            footer={
              <HStack gap="sm" justify="flex-end">
                <Button title="Cancel" variant="ghost" onPress={() => { setVisible(false); fn()(); }} />
                <Button title="Delete" variant="danger" onPress={() => { setVisible(false); fn()(); }} />
              </HStack>
            }
          >
            <Text variant="body" color="textSecondary">
              This action cannot be undone. The entry and all associated data will be permanently removed.
            </Text>
          </Modal>
        </>
      );
    };

    return <ConfirmDemo />;
  },
};

export const FormDialog: Story = {
  name: 'Form Dialog',
  render: () => {
    const FormDemo = () => {
      const [visible, setVisible] = useState(false);

      return (
        <>
          <Button title="Rename Project" variant="outline" onPress={() => setVisible(true)} />
          <Modal
            visible={visible}
            onClose={() => setVisible(false)}
            title="Rename Project"
            footer={
              <HStack gap="sm" justify="flex-end">
                <Button title="Cancel" variant="ghost" onPress={() => setVisible(false)} />
                <Button title="Save" onPress={() => { setVisible(false); fn()(); }} />
              </HStack>
            }
          >
            <VStack gap="md">
              <Input label="Project Name" placeholder="Enter new name" value="My Project" onChangeText={fn()} />
            </VStack>
          </Modal>
        </>
      );
    };

    return <FormDemo />;
  },
};

export const NonDismissable: Story = {
  name: 'Non-Dismissable',
  render: () => (
    <ModalDemo title="Required Action" dismissable={false}>
      <Text variant="body" color="textSecondary">
        This modal cannot be dismissed by tapping the backdrop. You must use the action buttons.
      </Text>
    </ModalDemo>
  ),
};
