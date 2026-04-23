import React, { useState, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { HStack, VStack } from '../../src/primitives/Stack';
import { ProgressBar } from '../../src/components/ProgressBar';
import { Text } from '../../src/primitives/Text';
import type { ProgressBarProps } from '../../src/components/ProgressBar';

const meta: Meta<ProgressBarProps> = {
  title: 'Components/ProgressBar',
  component: ProgressBar,
  parameters: {
    docs: {
      description: {
        component: [
          'Horizontal progress indicator showing completion percentage.',
          '',
          '### Accessibility',
          '- `accessibilityRole="progressbar"`',
          '- `accessibilityValue` with min/max/now',
          '',
          '### Colors',
          '- Semantic: `primary`, `success`, `warning`, `error`',
          '- Custom: any hex color string',
          '',
          '### Common patterns',
          '- Budget usage (green → yellow → red)',
          '- Upload/download progress',
          '- Form completion',
          '',
          '### Import',
          '```tsx',
          "import { ProgressBar } from '@polprog/native-ui';",
          '```',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
    color: { control: 'select', options: ['primary', 'success', 'warning', 'error'] },
    height: { control: { type: 'number', min: 2, max: 20 } },
    accessibilityLabel: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<ProgressBarProps>;

export const Playground: Story = {
  args: { value: 0.6, color: 'primary', height: 8 },
};

export const Values: Story = {
  name: 'Value Range',
  render: () => (
    <VStack gap="md" style={{ maxWidth: 400 }}>
      {[0, 0.25, 0.5, 0.75, 1].map((value) => (
        <HStack key={value} gap="sm" align="center">
          <Text variant="caption" color="textTertiary" style={{ width: 40, textAlign: 'right' }}>{Math.round(value * 100)}%</Text>
          <VStack flex={1}>
            <ProgressBar value={value} />
          </VStack>
        </HStack>
      ))}
    </VStack>
  ),
};

export const SemanticColors: Story = {
  name: 'Semantic Colors',
  render: () => (
    <VStack gap="md" style={{ maxWidth: 400 }}>
      {([
        { color: 'primary' as const, label: 'Primary', value: 0.6 },
        { color: 'success' as const, label: 'Success', value: 0.3 },
        { color: 'warning' as const, label: 'Warning', value: 0.7 },
        { color: 'error' as const, label: 'Error', value: 0.9 },
      ]).map(({ color, label, value }) => (
        <VStack key={color} gap="xs">
          <HStack justify="space-between">
            <Text variant="labelSmall">{label}</Text>
            <Text variant="caption" color="textTertiary">{Math.round(value * 100)}%</Text>
          </HStack>
          <ProgressBar value={value} color={color} />
        </VStack>
      ))}
    </VStack>
  ),
};

export const Heights: Story = {
  name: 'Different Heights',
  render: () => (
    <VStack gap="lg" style={{ maxWidth: 400 }}>
      {[2, 4, 8, 12, 16].map((height) => (
        <VStack key={height} gap="xs">
          <Text variant="caption" color="textTertiary">height={height}</Text>
          <ProgressBar value={0.6} height={height} />
        </VStack>
      ))}
    </VStack>
  ),
};

export const BudgetExample: Story = {
  name: 'Budget Usage Pattern',
  render: () => {
    const budgets = [
      { category: '🍕 Food', spent: 450, budget: 600 },
      { category: '🚗 Transport', spent: 280, budget: 300 },
      { category: '🛍️ Shopping', spent: 520, budget: 400 },
      { category: '🎬 Entertainment', spent: 80, budget: 200 },
    ];

    return (
      <VStack gap="lg" style={{ maxWidth: 400 }}>
        {budgets.map((b) => {
          const ratio = b.spent / b.budget;
          const color = ratio > 1 ? 'error' : ratio > 0.8 ? 'warning' : 'success';

          return (
            <VStack key={b.category} gap="xs">
              <HStack justify="space-between">
                <Text variant="label">{b.category}</Text>
                <Text variant="monoSmall" color={ratio > 1 ? 'error' : 'textPrimary'}>
                  €{b.spent} / €{b.budget}
                </Text>
              </HStack>
              <ProgressBar value={Math.min(ratio, 1)} color={color} />
            </VStack>
          );
        })}
      </VStack>
    );
  },
};
