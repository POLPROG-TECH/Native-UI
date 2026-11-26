import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { ActionSheet, type ActionSheetProps } from '../../src/components/ActionSheet';
import { Button } from '../../src/components/Button';
import { VStack } from '../../src/primitives/Stack';
import { Text } from '../../src/primitives/Text';

const meta: Meta<ActionSheetProps> = {
  title: 'Components/ActionSheet',
  tags: ['new'],
  component: ActionSheet,
  parameters: {
    docs: {
      description: {
        component: [
          'Menu of actions for one item, presented as a bottom sheet (share, edit, delete). Choosing an action closes the sheet first and then runs it.',
          '',
          '### Accessibility',
          '- The actions form a `menu` of `menuitem`s; a disabled action is announced as disabled.',
          '- The backdrop, the handle swipe, the hardware back button and the cancel button all dismiss it.',
          '- A destructive action is drawn in the error color and should also say what it does ("Delete invoice").',
          '',
          '### Theming',
          'Row height, paddings, icon size and type variants come from `components.actionSheet`; the sheet itself follows `components.bottomSheet`.',
          '',
          '### Import',
          '```tsx',
          "import { ActionSheet } from '@polprog/native-ui';",
          '```',
        ].join('\n'),
      },
    },
  },
};

export default meta;
type Story = StoryObj<ActionSheetProps>;

function InvoiceActions(props: Partial<ActionSheetProps>) {
  const [open, setOpen] = useState(false);
  const [last, setLast] = useState('none');

  return (
    <VStack gap="sm">
      <Button title="Invoice actions" onPress={() => setOpen(true)} />
      <Text variant="caption" color="textTertiary">
        Last action: {last}
      </Text>
      <ActionSheet
        visible={open}
        onClose={() => setOpen(false)}
        title="Invoice 2026/11"
        actions={[
          { label: 'Share', onPress: () => setLast('share') },
          { label: 'Duplicate', onPress: () => setLast('duplicate') },
          { label: 'Archive', onPress: () => setLast('archive'), disabled: true },
          { label: 'Delete invoice', onPress: () => setLast('delete'), destructive: true },
        ]}
        {...props}
      />
    </VStack>
  );
}

export const Playground: Story = {
  render: () => <InvoiceActions />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);

    await userEvent.click(canvas.getByRole('button', { name: 'Invoice actions' }));
    await userEvent.click(await page.findByRole('menuitem', { name: 'Duplicate' }));

    await expect(canvas.getByText('Last action: duplicate')).toBeVisible();
  },
};

export const WithoutCancel: Story = {
  render: () => <InvoiceActions showCancel={false} title={undefined} />,
};
