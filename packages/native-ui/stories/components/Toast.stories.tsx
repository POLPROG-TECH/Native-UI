import React from 'react';
import { fn } from 'storybook/test';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Toast, useToast } from '../../src/components/Toast';
import { Button } from '../../src/components/Button';
import { VStack } from '../../src/primitives/Stack';
import { Text } from '../../src/primitives/Text';

/**
 * The Toast overlay is positioned absolutely - in a native app that's the
 * screen viewport, but inside Storybook's iframe we need an explicit
 * positioning context so it doesn't render relative to the viewport (and get
 * clipped or pushed off-screen by large offsets). Each story renders inside
 * this bounded frame so the toast always appears where you'd expect.
 */
const ToastStage = ({ children }: { children: React.ReactNode }) => (
  <View
    style={{
      position: 'relative',
      minHeight: 320,
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: 'rgba(127,127,127,0.2)',
      overflow: 'hidden',
    }}>
    {children}
    {/* Small offset so the toast is fully visible inside the bounded stage. */}
    <Toast offset={16} />
  </View>
);

const meta: Meta = {
  title: 'Components/Toast',
  // Imperative demo - the default autodocs page would mount several Toast
  // roots on a single page and cross-contaminate state. Opt out explicitly.
  tags: ['!autodocs'],
  decorators: [(Story) => <ToastStage><Story /></ToastStage>],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Non-blocking notification anchored to the nearest positioned ancestor. Uses an imperative API via `useToast()`.',
          '',
          '### Setup',
          '```tsx',
          '// Place once at the app root (inside your theme provider)',
          '<Toast />',
          '```',
          '',
          '### Usage',
          '```tsx',
          'const { show, hide } = useToast();',
          "show({ message: 'Entry saved!' });",
          "show({ message: 'Undo?', actionLabel: 'Undo', onAction: handleUndo });",
          '```',
          '',
          '### Config',
          '| Prop | Type | Default | Description |',
          '|---|---|---|---|',
          '| `message` | `string` | required | Toast text |',
          '| `actionLabel` | `string` | - | Action button text |',
          '| `onAction` | `() => void` | - | Action callback |',
          '| `duration` | `number` | `3000` | Auto-dismiss ms |',
          '| `variant` | `"success" \\| "warning" \\| "error" \\| "info"` | `"default"` | Semantic accent |',
          '| `position` | `"top" \\| "bottom"` | `"bottom"` | Per-call placement |',
          '',
          '### Storybook note',
          "Each story wraps the toast in a bounded, `position: relative` stage because Storybook's iframe doesn't provide the full-screen positioning context that a real app does.",
          '',
          '### Import',
          '```tsx',
          "import { Toast, useToast } from '@polprog/native-ui';",
          '```',
        ].join('\n'),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: () => {
    const PlaygroundToast = () => {
      const { show } = useToast();

      return (
        <Button
          title="Show Toast"
          onPress={() => show({ message: 'Hello from Playground!' })}
        />
      );
    };

    return <PlaygroundToast />;
  },
};

type ToastArgs = {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
};

const ToastTrigger = ({ message, actionLabel, onAction, duration }: ToastArgs) => {
  const { show } = useToast();

  return (
    <Button
      title={`Show: "${message}"`}
      variant="outline"
      onPress={() => show({ message, actionLabel, onAction, duration })}
    />
  );
};

export const BasicToast: StoryObj = {
  name: 'Basic Toast',
  render: () => <ToastTrigger message="Entry saved successfully" />,
};

export const WithAction: StoryObj = {
  name: 'With Action',
  render: () => (
    <ToastTrigger message="Entry deleted" actionLabel="Undo" onAction={fn()} />
  ),
};

export const CustomDuration: StoryObj = {
  name: 'Custom Duration',
  render: () => (
    <VStack gap="sm">
      <ToastTrigger message="Quick toast (1s)" duration={1000} />
      <ToastTrigger message="Normal toast (3s)" duration={3000} />
      <ToastTrigger message="Long toast (6s)" duration={6000} />
    </VStack>
  ),
};

export const MultipleExamples: StoryObj = {
  name: 'All Patterns',
  render: () => (
    <VStack gap="sm">
      <Text variant="label" color="textSecondary">Common toast patterns</Text>
      <ToastTrigger message="Changes saved" />
      <ToastTrigger message="Item deleted" actionLabel="Undo" onAction={fn()} />
      <ToastTrigger message="Network error. Please try again." />
      <ToastTrigger message="Export complete" actionLabel="View" onAction={fn()} />
    </VStack>
  ),
};

type VariantTriggerProps = {
  label: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  message: string;
  icon?: React.ReactNode;
  position?: 'top' | 'bottom';
};

const VariantTrigger = ({ label, variant, message, icon, position }: VariantTriggerProps) => {
  const { show } = useToast();

  return (
    <Button
      title={label}
      variant="outline"
      onPress={() => show({ message, variant, icon, position })}
    />
  );
};

export const Variants: StoryObj = {
  name: 'Variants (success / warning / error / info)',
  parameters: {
    docs: {
      description: {
        story:
          'Pass `variant` on `show()` to pick a semantic accent color and a default glyph (✓ / ! / ✕ / i). The default variant renders without an icon.',
      },
    },
  },
  render: () => (
    <VStack gap="sm">
      <VariantTrigger label="Default" message="Entry saved" />
      <VariantTrigger label="Success" variant="success" message="Entry saved successfully" />
      <VariantTrigger label="Warning" variant="warning" message="Offline - changes queued" />
      <VariantTrigger label="Error" variant="error" message="Couldn't sync. Check your connection." />
      <VariantTrigger label="Info" variant="info" message="New version available" />
    </VStack>
  ),
};

export const CustomIcon: StoryObj = {
  name: 'Custom icon (brand / emoji)',
  render: () => (
    <VStack gap="sm">
      <VariantTrigger
        label="Emoji icon"
        message="Goal unlocked!"
        variant="success"
        icon={<Text style={{ fontSize: 18 }}>🏆</Text>}
      />
      <VariantTrigger
        label="Explicit null - suppress default glyph"
        message="Quiet info toast"
        variant="info"
        icon={null}
      />
    </VStack>
  ),
};

export const Positions: StoryObj = {
  name: 'Positions (top / bottom)',
  parameters: {
    docs: {
      description: {
        story:
          'Per-call `position` on `show()` overrides the root `<Toast defaultPosition="…" />`. Defaults to `bottom` to match the platform snackbar pattern.',
      },
    },
  },
  render: () => (
    <VStack gap="sm">
      <VariantTrigger label="Top toast" message="Saved to the cloud" variant="success" position="top" />
      <VariantTrigger label="Bottom toast" message="Saved to the cloud" variant="success" position="bottom" />
    </VStack>
  ),
};
