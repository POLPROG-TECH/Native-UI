import React from 'react';
import { View, Text as RNText } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect, fn } from 'storybook/test';
import { Box } from '../../src/primitives/Box';
import { Button } from '../../src/components/Button';
import { HStack, VStack } from '../../src/primitives/Stack';
import { Text } from '../../src/primitives/Text';
import type { ButtonProps } from '../../src/components/Button';

const meta: Meta<ButtonProps> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: [
          'Primary interactive element for triggering actions. Supports 5 visual variants, 3 sizes, loading state, and optional leading icon.',
          '',
          '### Variants',
          '| Variant | Use case |',
          '|---|---|',
          '| `primary` | Main actions (Submit, Save, Continue) |',
          '| `secondary` | Supporting actions with less emphasis |',
          '| `outline` | Bordered button for secondary actions |',
          '| `ghost` | Minimal emphasis (Cancel, Close) |',
          '| `danger` | Destructive actions (Delete, Remove) |',
          '',
          '### Accessibility',
          '- `accessibilityRole="button"` is set automatically',
          '- `accessibilityState.disabled` is set when disabled or loading',
          '- Uses `accessibilityLabel` from `title` by default',
          '- Haptic feedback on press (when configured)',
          '',
          '### Do',
          '- ✅ Use **one** `primary` button per view - the most important action',
          '- ✅ Pair `primary` + `ghost` in form footers (Save / Cancel)',
          '- ✅ Use `danger` for destructive actions that cannot be undone',
          '- ✅ Wrap long labels with `fullWidth` to keep layout predictable',
          '',
          '### Don\'t',
          '- ❌ Stack two `primary` buttons - decision paralysis + visual noise',
          '- ❌ Use `danger` for mere "discard changes" - reserve it for real deletion',
          '- ❌ Disable a `primary` button as validation feedback; show an inline error instead',
          '- ❌ Hardcode colours via style overrides - go through `preset` or `customAccent`',
          '',
          '### Import',
          '```tsx',
          "import { Button } from '@polprog/native-ui';",
          '```',
        ].join('\n'),
      },
    },
    a11y: {
      config: {
        rules: [
          { id: 'button-name', enabled: true },
          { id: 'color-contrast', enabled: true },
          { id: 'focus-order-semantics', enabled: true },
        ],
      },
    },
  },
  argTypes: {
    title: { control: 'text', description: 'Button label text' },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
      description: 'Visual variant',
    },
    size: { control: 'select', options: ['sm', 'md', 'lg'], description: 'Button size' },
    disabled: { control: 'boolean', description: 'Disabled state' },
    loading: { control: 'boolean', description: 'Shows spinner, hides label' },
    fullWidth: { control: 'boolean', description: 'Expand to 100% width' },
    onPress: { action: 'pressed', description: 'Press handler' },
  },
};

export default meta;
type Story = StoryObj<ButtonProps>;

export const Playground: Story = {
  args: {
    title: 'Click Me',
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
    fullWidth: false,
    onPress: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Click Me' });
    await expect(button).toBeInTheDocument();
    await userEvent.click(button);
    await expect(args.onPress).toHaveBeenCalled();
  },
};

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => (
    <VStack gap="md" style={{ maxWidth: 300 }}>
      {(['primary', 'secondary', 'outline', 'ghost', 'danger'] as const).map((variant) => (
        <Button key={variant} title={variant} variant={variant} onPress={fn()} />
      ))}
    </VStack>
  ),
};

export const Sizes: Story = {
  name: 'All Sizes',
  render: () => (
    <VStack gap="md" style={{ alignItems: 'flex-start' }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <HStack key={size} gap="md" align="center">
          <Box style={{ width: 40 }}>
            <Text variant="caption" color="textTertiary">{size}</Text>
          </Box>
          <Button title={`Size ${size}`} size={size} onPress={fn()} />
        </HStack>
      ))}
    </VStack>
  ),
};

export const FullWidth: Story = {
  name: 'Full Width',
  render: () => (
    <VStack gap="md" style={{ maxWidth: 360 }}>
      <Button title="Full Width Primary" fullWidth onPress={fn()} />
      <Button title="Full Width Outline" variant="outline" fullWidth onPress={fn()} />
      <Button title="Full Width Danger" variant="danger" fullWidth onPress={fn()} />
    </VStack>
  ),
};

export const States: Story = {
  name: 'States',
  render: () => (
    <VStack gap="lg">
      <VStack gap="sm">
        <Text variant="label" color="textSecondary">Normal</Text>
        <Button title="Enabled Button" onPress={fn()} />
      </VStack>
      <VStack gap="sm">
        <Text variant="label" color="textSecondary">Disabled</Text>
        <HStack gap="sm" wrap>
          {(['primary', 'secondary', 'outline', 'ghost', 'danger'] as const).map((v) => (
            <Button key={v} title={v} variant={v} disabled onPress={fn()} />
          ))}
        </HStack>
      </VStack>
      <VStack gap="sm">
        <Text variant="label" color="textSecondary">Loading</Text>
        <HStack gap="sm" wrap>
          {(['primary', 'secondary', 'outline', 'danger'] as const).map((v) => (
            <Button key={v} title={v} variant={v} loading onPress={fn()} />
          ))}
        </HStack>
      </VStack>
    </VStack>
  ),
};

export const WithIcon: Story = {
  name: 'With Icon',
  render: () => (
    <VStack gap="md" style={{ alignItems: 'flex-start' }}>
      <Button
        title="Add Item"
        icon={<RNText style={{ fontSize: 16 }}>＋</RNText>}
        onPress={fn()}
      />
      <Button
        title="Delete"
        variant="danger"
        icon={<RNText style={{ fontSize: 16 }}>🗑</RNText>}
        onPress={fn()}
      />
      <Button
        title="Settings"
        variant="outline"
        icon={<RNText style={{ fontSize: 16 }}>⚙</RNText>}
        onPress={fn()}
      />
    </VStack>
  ),
};

export const SizeComparison: Story = {
  name: 'All Sizes × All Variants',
  render: () => (
    <VStack gap="xl">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <VStack key={size} gap="sm">
          <Text variant="labelSmall" color="textTertiary">size="{size}"</Text>
          <HStack gap="sm" wrap>
            {(['primary', 'secondary', 'outline', 'ghost', 'danger'] as const).map((variant) => (
              <Button key={`${size}-${variant}`} title={variant} size={size} variant={variant} onPress={fn()} />
            ))}
          </HStack>
        </VStack>
      ))}
    </VStack>
  ),
};

export const InFormContext: Story = {
  name: 'Form Footer Pattern',
  render: () => (
    <Box p="lg" bg="surface" radius="lg" elevation="sm" style={{ maxWidth: 400 }}>
      <VStack gap="md">
        <Text variant="h2">Edit Profile</Text>
        <Box p="md" bg="surfaceSecondary" radius="sm">
          <Text variant="bodySmall" color="textTertiary">Form fields here...</Text>
        </Box>
        <HStack gap="sm" justify="flex-end">
          <Button title="Cancel" variant="ghost" onPress={fn()} />
          <Button title="Save Changes" onPress={fn()} />
        </HStack>
      </VStack>
    </Box>
  ),
};

export const WithGlow: Story = {
  name: 'Glow (accent shadow)',
  parameters: {
    docs: {
      description: {
        story:
          'The `glow` prop adds a themed colored shadow useful for primary CTAs. Pass `true` to glow with the variant accent (primary / error) or any CSS color string.',
      },
    },
  },
  render: () => (
    <VStack gap="lg" style={{ maxWidth: 360 }}>
      <VStack gap="sm">
        <Text variant="label" color="textSecondary">glow = true (variant-based)</Text>
        <Button title="Save Entry" glow onPress={fn()} />
        <Button title="Delete Account" variant="danger" glow onPress={fn()} />
      </VStack>
      <VStack gap="sm">
        <Text variant="label" color="textSecondary">glow = custom color</Text>
        <Button title="Promo Action" glow="#F59E0B" onPress={fn()} />
        <Button title="Alt Accent" variant="outline" glow="#10B981" onPress={fn()} />
      </VStack>
      <VStack gap="sm">
        <Text variant="label" color="textSecondary">glow suppressed while disabled</Text>
        <Button title="Disabled + glow" glow disabled onPress={fn()} />
      </VStack>
    </VStack>
  ),
};

/**
 * Renders in RTL by forcing the story root's `direction: rtl`. Confirms
 * icon + label swap sides correctly and tap-targets stay symmetric.
 */
export const RTL: Story = {
  name: 'RTL (Arabic)',
  parameters: {
    docs: {
      description: {
        story:
          'Right-to-left composition. In production, `I18nManager.forceRTL(true)` flips the whole app; Storybook previews by setting CSS `direction: rtl` on the story root so layout-only assertions still hold.',
      },
    },
  },
  render: () => (
    <Box style={{ direction: 'rtl' as never, maxWidth: 360 }}>
      <VStack gap="md">
        <Button
          title="حفظ التغييرات"
          icon={<RNText style={{ fontSize: 16 }}>💾</RNText>}
          onPress={fn()}
        />
        <Button title="إلغاء" variant="ghost" onPress={fn()} />
        <Button title="حذف الحساب" variant="danger" onPress={fn()} />
      </VStack>
    </Box>
  ),
};

/**
 * Polish strings are the stress-test for every layout: "Anuluj" vs
 * "Kontynuuj", "Ustawienia prywatności" - longer than their English
 * counterparts. Use this story to spot truncation bugs.
 */
export const Localized: Story = {
  name: 'Localized copy (EN · PL · DE)',
  parameters: {
    docs: {
      description: {
        story:
          'Same layout, three locales. German typically overflows first; keep `fullWidth` or min-width tokens in mind when designing buttons for i18n-heavy UIs.',
      },
    },
  },
  render: () => (
    <HStack gap="lg" wrap>
      {[
        { locale: 'English', save: 'Save changes', cancel: 'Cancel', danger: 'Delete account' },
        { locale: 'Polski', save: 'Zapisz zmiany', cancel: 'Anuluj', danger: 'Usuń konto' },
        { locale: 'Deutsch', save: 'Änderungen speichern', cancel: 'Abbrechen', danger: 'Konto löschen' },
      ].map((l) => (
        <VStack key={l.locale} gap="sm" style={{ minWidth: 220 }}>
          <Text variant="label" color="textSecondary">{l.locale}</Text>
          <Button title={l.save} onPress={fn()} />
          <Button title={l.cancel} variant="ghost" onPress={fn()} />
          <Button title={l.danger} variant="danger" onPress={fn()} />
        </VStack>
      ))}
    </HStack>
  ),
};

/**
 * Edge-case content. A professional design system has to survive users
 * typing paragraphs into a "title" prop. Confirm visually that:
 *  - `md` size still renders a single-line button when within container
 *  - Long content does not push surrounding layout
 *  - `numberOfLines={1}` is applied internally when appropriate
 */
export const LongContent: Story = {
  name: 'Long content (truncation)',
  render: () => (
    <VStack gap="md" style={{ maxWidth: 280 }}>
      <Button title="Short" onPress={fn()} />
      <Button title="A bit longer label" onPress={fn()} />
      <Button
        title="This is an extremely long button label that should either wrap cleanly or truncate"
        onPress={fn()}
      />
      <Button
        title="Full width + long title avoids horizontal overflow"
        fullWidth
        onPress={fn()}
      />
    </VStack>
  ),
};

/**
 * High-contrast preview. Exercise the story with the "Contrast" toolbar
 * toggle set to **High contrast** to verify borders thicken and text
 * meets WCAG AAA on primary surfaces.
 */
export const HighContrastPreview: Story = {
  name: 'High contrast (use toolbar)',
  parameters: {
    docs: {
      description: {
        story:
          'Flip the **Contrast** toolbar global to "High contrast" to see how buttons adapt. All five variants remain keyboard-focusable with visible focus rings.',
      },
    },
  },
  render: () => (
    <VStack gap="md" style={{ maxWidth: 320 }}>
      {(['primary', 'secondary', 'outline', 'ghost', 'danger'] as const).map((v) => (
        <Button key={v} title={`${v} button`} variant={v} onPress={fn()} />
      ))}
    </VStack>
  ),
};
