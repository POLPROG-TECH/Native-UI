import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { Accordion, type AccordionProps } from '../../src/components/Accordion';
import { VStack } from '../../src/primitives/Stack';
import { Text } from '../../src/primitives/Text';

const meta: Meta<AccordionProps> = {
  title: 'Components/Accordion',
  tags: ['new'],
  component: Accordion,
  args: {
    title: 'Shipping',
    subtitle: '2 to 4 business days',
  },
  parameters: {
    docs: {
      description: {
        component: [
          'One collapsible section: a header button that shows or hides its content. Stack several to build an accordion.',
          '',
          '### Accessibility',
          '- The header is a `button` that reports `expanded` / `collapsed`; the subtitle is read as its hint.',
          '- Collapsed content is not mounted, so screen readers never land on hidden text.',
          '',
          '### Theming',
          'Header height, paddings, chevron size and type variants come from `components.accordion` and can be overridden in `NativeUIProvider`.',
          '',
          '### Import',
          '```tsx',
          "import { Accordion } from '@polprog/native-ui';",
          '```',
        ].join('\n'),
      },
    },
  },
};

export default meta;
type Story = StoryObj<AccordionProps>;

const SHIPPING = 'Orders placed before noon ship the same day.';

export const Playground: Story = {
  render: (args) => (
    <Accordion {...args}>
      <Text color="textSecondary">{SHIPPING}</Text>
    </Accordion>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const header = canvas.getByRole('button', { name: 'Shipping' });

    await expect(canvas.queryByText(SHIPPING)).not.toBeInTheDocument();

    await expect(header).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(header);

    await expect(header).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByText(SHIPPING)).toBeVisible();
  },
};

type Topic = 'shipping' | 'returns' | 'warranty';

const TOPICS: ReadonlyArray<{ id: Topic; title: string; body: string }> = [
  { id: 'shipping', title: 'Shipping', body: SHIPPING },
  { id: 'returns', title: 'Returns', body: 'Send any item back within 30 days.' },
  { id: 'warranty', title: 'Warranty', body: 'Every product is covered for two years.' },
];

function SingleOpenGroup() {
  const [open, setOpen] = useState<Topic | null>('shipping');

  return (
    <VStack>
      {TOPICS.map((topic) => (
        <Accordion
          key={topic.id}
          title={topic.title}
          expanded={open === topic.id}
          onExpandedChange={(expanded) => setOpen(expanded ? topic.id : null)}
        >
          <Text color="textSecondary">{topic.body}</Text>
        </Accordion>
      ))}
    </VStack>
  );
}

export const SingleOpen: Story = {
  render: () => <SingleOpenGroup />,
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <Accordion {...args}>
      <Text color="textSecondary">{SHIPPING}</Text>
    </Accordion>
  ),
};
