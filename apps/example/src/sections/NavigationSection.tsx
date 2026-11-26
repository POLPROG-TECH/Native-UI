import { Accordion, Section, Tabs, Text, VStack, type TabItem } from '@polprog/native-ui';
import { useState } from 'react';

type OrderTab = 'open' | 'done' | 'archived';

const ORDER_TABS: ReadonlyArray<TabItem<OrderTab>> = [
  { value: 'open', label: 'Open', testID: 'tab-open' },
  { value: 'done', label: 'Completed', testID: 'tab-done' },
  { value: 'archived', label: 'Archived', testID: 'tab-archived' },
];

export function NavigationSection() {
  const [tab, setTab] = useState<OrderTab>('open');

  return (
    <Section title="Navigation">
      <VStack gap="md">
        <Tabs accessibilityLabel="Orders" tabs={ORDER_TABS} value={tab} onChange={setTab} />
        <Text testID="tab-status">Showing: {tab}</Text>
        <Accordion title="Shipping" subtitle="2 to 4 business days" testID="shipping">
          <Text color="textSecondary">Orders placed before noon ship the same day.</Text>
        </Accordion>
      </VStack>
    </Section>
  );
}
