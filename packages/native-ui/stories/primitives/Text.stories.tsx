import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Text } from '../../src/primitives/Text';
import { VStack } from '../../src/primitives/Stack';
import { useTheme } from '../../src/theme/ThemeProvider';
import type { TextProps } from '../../src/primitives/Text';

const meta: Meta<TextProps> = {
  title: 'Primitives/Text',
  component: Text,
  parameters: {
    docs: {
      description: {
        component: [
          'Typography primitive with theme-aware styling. Supports 14+ variants and semantic color tokens.',
          '',
          '### When to use',
          '- For all text content in your app',
          '- Replaces raw `<Text>` from react-native with token-based styling',
          '',
          '### When NOT to use',
          '- For headings that need `accessibilityRole="header"` → use `Heading`',
          '',
          '### Import',
          '```tsx',
          "import { Text } from '@polprog/native-ui';",
          '```',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['displayLarge', 'displayMedium', 'h1', 'h2', 'h3', 'bodyLarge', 'body', 'bodySmall', 'label', 'labelSmall', 'caption', 'mono', 'monoLarge', 'monoSmall'],
      description: 'Typography variant',
    },
    color: {
      control: 'select',
      options: ['textPrimary', 'textSecondary', 'textTertiary', 'primary', 'success', 'warning', 'error'],
      description: 'Semantic color token',
    },
    align: { control: 'select', options: ['auto', 'left', 'right', 'center', 'justify'] },
    numberOfLines: { control: 'number' },
    children: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<TextProps>;

export const Playground: Story = {
  args: {
    variant: 'body',
    color: 'textPrimary',
    align: 'left',
    children: 'The quick brown fox jumps over the lazy dog',
  },
  // Wrap in a full-width block so `align` is visibly applied and the
  // component reflects every control change. Without this wrapper the
  // Text element shrinks to its intrinsic content width on web and
  // `textAlign` has no visible effect.
  render: (args) => (
    <View style={{ width: '100%', maxWidth: 640 }}>
      <Text {...args} />
    </View>
  ),
};

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => (
    <VStack gap="md">
      <Text variant="displayLarge">displayLarge - Hero Text</Text>
      <Text variant="displayMedium">displayMedium - Splash</Text>
      <Text variant="h1">h1 - Page Title</Text>
      <Text variant="h2">h2 - Section Heading</Text>
      <Text variant="h3">h3 - Subsection</Text>
      <Text variant="bodyLarge">bodyLarge - Featured paragraph text</Text>
      <Text variant="body">body - Standard body text (default)</Text>
      <Text variant="bodySmall">bodySmall - Small content text</Text>
      <Text variant="label">label - Form labels, button text</Text>
      <Text variant="labelSmall">labelSmall - Small labels</Text>
      <Text variant="caption">caption - Helper text, timestamps</Text>
      <Text variant="mono">mono - €1,234,567.89</Text>
      <Text variant="monoLarge">monoLarge - €99,999</Text>
      <Text variant="monoSmall">monoSmall - €123.45</Text>
    </VStack>
  ),
};

export const SemanticColors: Story = {
  name: 'Semantic Colors',
  render: () => (
    <VStack gap="sm">
      <Text color="textPrimary">textPrimary - Main content</Text>
      <Text color="textSecondary">textSecondary - Helper text</Text>
      <Text color="textTertiary">textTertiary - Muted/placeholder</Text>
      <Text color="primary">primary - Accent/link</Text>
      <Text color="success">success - Positive state</Text>
      <Text color="warning">warning - Caution state</Text>
      <Text color="error">error - Error/destructive</Text>
    </VStack>
  ),
};

const AlignmentRow = ({ align, label }: { align: 'left' | 'center' | 'right'; label: string }) => {
  const theme = useTheme();
  return (
    <View
      style={{
        backgroundColor: theme.colors.surfaceSecondary,
        padding: 12,
        borderRadius: theme.borderRadius.sm,
      }}>
      <Text align={align}>{label}</Text>
    </View>
  );
};

export const Alignment: Story = {
  name: 'Text Alignment',
  render: () => (
    <VStack gap="md" style={{ maxWidth: 400 }}>
      <AlignmentRow align="left" label="Left aligned (default)" />
      <AlignmentRow align="center" label="Center aligned" />
      <AlignmentRow align="right" label="Right aligned" />
    </VStack>
  ),
};

export const TabularNumbers: Story = {
  name: 'Tabular Numbers (Mono)',
  render: () => (
    <VStack gap="xs" style={{ alignItems: 'flex-end', maxWidth: 200 }}>
      <Text variant="mono">€1,234.56</Text>
      <Text variant="mono">€987.00</Text>
      <Text variant="mono">€12,345.78</Text>
      <Text variant="mono" color="success">+€500.00</Text>
      <Text variant="mono" color="error">-€123.45</Text>
    </VStack>
  ),
};

export const LongContent: Story = {
  name: 'Long Content & Truncation',
  render: () => (
    <VStack gap="md" style={{ maxWidth: 300 }}>
      <View>
        <Text variant="label" color="textSecondary">Normal wrapping:</Text>
        <Text variant="body">
          This is a longer paragraph that demonstrates how text wraps within a constrained container. native-ui text
          respects container width and wraps naturally.
        </Text>
      </View>
      <View>
        <Text variant="label" color="textSecondary">Truncated (numberOfLines=1):</Text>
        <Text variant="body" numberOfLines={1}>
          This is a very long text that will be truncated with an ellipsis because it exceeds the container width.
        </Text>
      </View>
      <View>
        <Text variant="label" color="textSecondary">Two lines max:</Text>
        <Text variant="body" numberOfLines={2}>
          This text is limited to two lines maximum. Any overflow will be indicated by an ellipsis at the end of the
          second visible line. This is useful for list items and cards.
        </Text>
      </View>
    </VStack>
  ),
};
