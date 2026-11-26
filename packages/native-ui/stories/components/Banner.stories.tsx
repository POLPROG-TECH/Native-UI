import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Banner, type BannerProps } from '../../src/components/Banner';
import { Button } from '../../src/components/Button';
import { VStack } from '../../src/primitives/Stack';

const meta: Meta<BannerProps> = {
  title: 'Components/Banner',
  tags: ['new'],
  component: Banner,
  args: {
    variant: 'info',
    title: 'Scheduled maintenance',
    message: 'The service will be read-only on Sunday from 02:00 to 04:00.',
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['info', 'success', 'warning', 'error'] },
  },
  parameters: {
    docs: {
      description: {
        component: [
          'Inline message that stays in the layout until the app removes it: a status, a warning or an error that belongs to the screen. Use `Toast` for feedback that should leave on its own.',
          '',
          '### Accessibility',
          '- The title and the message are one element with the `alert` role, announced when the banner appears.',
          '- The action and the close button stay separately focusable; the close button is named by `labels.dismiss`.',
          '- The variant is never carried by color alone: each one has its own icon.',
          '',
          '### Theming',
          'Padding, radius, accent width, icon sizes and type variants come from `components.banner` and can be overridden in `NativeUIProvider`.',
          '',
          '### Import',
          '```tsx',
          "import { Banner } from '@polprog/native-ui';",
          '```',
        ].join('\n'),
      },
    },
    guidelines: {
      do: [
        'Keep the message to one or two sentences and put the next step in `action`.',
        'Place the banner next to what it describes (top of the form, top of the list).',
      ],
      dont: [
        'Do not stack several banners: merge them or show the most severe one.',
        'Do not use a banner for transient feedback such as "Saved"; that is a `Toast`.',
      ],
    },
  },
};

export default meta;
type Story = StoryObj<BannerProps>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <VStack gap="sm">
      <Banner variant="info" message="A new version is available." />
      <Banner variant="success" title="Backup complete" message="All files are stored safely." />
      <Banner variant="warning" title="Offline" message="Changes will sync when you reconnect." />
      <Banner variant="error" title="Payment failed" message="The card was declined." />
    </VStack>
  ),
};

export const WithAction: Story = {
  args: {
    variant: 'warning',
    title: 'Offline',
    message: 'Changes will sync when you reconnect.',
    action: { label: 'Retry now', onPress: fn() },
  },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Retry now' }));

    await expect(args.action?.onPress).toHaveBeenCalledTimes(1);
  },
};

function DismissibleBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return (
      <Button title="Show the banner again" variant="secondary" onPress={() => setVisible(true)} />
    );
  }

  return (
    <Banner
      variant="success"
      message="Your profile was updated."
      onDismiss={() => setVisible(false)}
      testID="profile-banner"
    />
  );
}

export const Dismissible: Story = {
  render: () => <DismissibleBanner />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByTestId('profile-banner-dismiss'));

    await expect(canvas.queryByRole('alert')).not.toBeInTheDocument();
  },
};
