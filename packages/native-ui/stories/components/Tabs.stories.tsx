import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { Tabs, type TabsProps } from '../../src/components/Tabs';
import { VStack } from '../../src/primitives/Stack';
import { Text } from '../../src/primitives/Text';

type OrderTab = 'open' | 'done' | 'archived';

const ORDER_TABS: TabsProps<OrderTab>['tabs'] = [
  { value: 'open', label: 'Open' },
  { value: 'done', label: 'Completed' },
  { value: 'archived', label: 'Archived' },
];

const meta: Meta<TabsProps<OrderTab>> = {
  title: 'Components/Tabs',
  tags: ['new'],
  component: Tabs,
  parameters: {
    docs: {
      description: {
        component: [
          'Row of tabs with a line under the selected one, for switching between views of the same screen. It renders the tab row only: the app shows the content that matches `value`.',
          '',
          '### Accessibility',
          '- Exposed as a `tablist`; each tab is a `tab` with `selected` state.',
          '- Name the list with `accessibilityLabel`.',
          '',
          '### Theming',
          'Height, paddings, indicator and colors come from `components.tabs` and can be overridden in `NativeUIProvider`.',
          '',
          '### Import',
          '```tsx',
          "import { Tabs } from '@polprog/native-ui';",
          '```',
        ].join('\n'),
      },
    },
    guidelines: {
      do: [
        'Use tabs to switch between sibling views of one screen.',
        'Turn on `scrollable` when the labels do not fit side by side.',
      ],
      dont: [
        'Do not use tabs for a setting with two or three values: that is a `SegmentedControl`.',
        'Do not use tabs as the main app navigation: that is a `BottomTabBar`.',
      ],
    },
  },
};

export default meta;
type Story = StoryObj<TabsProps<OrderTab>>;

function Controlled(props: Partial<TabsProps<OrderTab>>) {
  const [tab, setTab] = useState<OrderTab>('open');

  return (
    <VStack gap="md">
      <Tabs
        accessibilityLabel="Orders"
        tabs={ORDER_TABS}
        value={tab}
        onChange={setTab}
        {...props}
      />
      <Text variant="caption" color="textTertiary">
        Showing: {tab}
      </Text>
    </VStack>
  );
}

export const Playground: Story = {
  render: () => <Controlled />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('tab', { name: 'Completed' }));

    await expect(canvas.getByRole('tab', { name: 'Completed' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(canvas.getByRole('tab', { name: 'Open' })).toHaveAttribute(
      'aria-selected',
      'false',
    );
    await expect(canvas.getByText('Showing: done')).toBeVisible();
  },
};

const MANY_TABS: TabsProps<OrderTab>['tabs'] = [
  { value: 'open', label: 'Open orders' },
  { value: 'done', label: 'Completed orders' },
  { value: 'archived', label: 'Archived orders' },
];

export const Scrollable: Story = {
  render: () => <Controlled tabs={MANY_TABS} scrollable />,
};

export const WithDisabledTab: Story = {
  render: () => (
    <Controlled
      tabs={[
        { value: 'open', label: 'Open' },
        { value: 'done', label: 'Completed' },
        { value: 'archived', label: 'Archived', disabled: true },
      ]}
    />
  ),
};
