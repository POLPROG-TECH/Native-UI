import { ActionSheet, Button, Section, Text, VStack } from '@polprog/native-ui';
import { useState } from 'react';

const NO_ACTION = 'none';

export function ActionsSection() {
  const [open, setOpen] = useState(false);
  const [last, setLast] = useState(NO_ACTION);

  return (
    <Section title="Actions">
      <VStack gap="md">
        <Button title="Invoice actions" onPress={() => setOpen(true)} testID="open-actions" />
        <Text testID="last-action">Last action: {last}</Text>
      </VStack>
      <ActionSheet
        visible={open}
        onClose={() => setOpen(false)}
        title="Invoice 2026/11"
        testID="invoice-actions"
        actions={[
          { label: 'Share', onPress: () => setLast('share'), testID: 'action-share' },
          { label: 'Duplicate', onPress: () => setLast('duplicate'), testID: 'action-duplicate' },
          {
            label: 'Delete invoice',
            onPress: () => setLast('delete'),
            destructive: true,
            testID: 'action-delete',
          },
        ]}
      />
    </Section>
  );
}
