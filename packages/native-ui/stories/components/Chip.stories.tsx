import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import { Chip, ChipGroup } from '../../src/components/Chip';
import { Text } from '../../src/primitives/Text';
import { VStack } from '../../src/primitives/Stack';
import type { ChipProps } from '../../src/components/Chip';

const meta: Meta<ChipProps> = {
  title: 'Components/Chip',
  component: Chip,
  parameters: {
    docs: {
      description: {
        component: [
          'Selectable filter tag for multi-select or category picking. Pairs with `ChipGroup` for flex-row layout.',
          '',
          '### Sizes',
          '- `sm`: Compact (6px/10px padding)',
          '- `md`: Default (10px/14px padding)',
          '',
          '### States',
          '- Default: muted background',
          '- Selected: primary background + border',
          '- Disabled: reduced opacity',
          '',
          '### Common patterns',
          '- Category selection in forms',
          '- Tag filtering in lists',
          '- Quick toggles in settings',
          '',
          '### Import',
          '```tsx',
          "import { Chip, ChipGroup } from '@polprog/native-ui';",
          '```',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    label: { control: 'text' },
    selected: { control: 'boolean' },
    icon: { control: 'text', description: 'Leading emoji/icon string' },
    disabled: { control: 'boolean' },
    size: { control: 'select', options: ['sm', 'md'] },
    onPress: { action: 'onPress' },
  },
};

export default meta;
type Story = StoryObj<ChipProps>;

export const Playground: Story = {
  args: { label: 'Category', selected: false, icon: '', disabled: false, size: 'md', onPress: action('onPress') },
};

export const States: Story = {
  render: () => (
    <VStack gap="md">
      <ChipGroup>
        <Chip label="Default" onPress={action('press')} />
        <Chip label="Selected" selected onPress={action('press')} />
        <Chip label="Disabled" disabled onPress={action('press')} />
        <Chip label="Selected + Disabled" selected disabled onPress={action('press')} />
      </ChipGroup>
    </VStack>
  ),
};

export const WithIcons: Story = {
  name: 'With Icons',
  render: () => (
    <ChipGroup>
      <Chip label="Food" icon="🍕" onPress={action('press')} />
      <Chip label="Transport" icon="🚗" selected onPress={action('press')} />
      <Chip label="Shopping" icon="🛍️" onPress={action('press')} />
      <Chip label="Health" icon="💊" onPress={action('press')} />
    </ChipGroup>
  ),
};

export const Sizes: Story = {
  render: () => (
    <VStack gap="md">
      <VStack gap="xs">
        <Text variant="caption" color="textTertiary">Small</Text>
        <ChipGroup>
          <Chip label="Tag A" size="sm" selected onPress={action('press')} />
          <Chip label="Tag B" size="sm" onPress={action('press')} />
        </ChipGroup>
      </VStack>
      <VStack gap="xs">
        <Text variant="caption" color="textTertiary">Medium (default)</Text>
        <ChipGroup>
          <Chip label="Tag A" size="md" selected onPress={action('press')} />
          <Chip label="Tag B" size="md" onPress={action('press')} />
        </ChipGroup>
      </VStack>
    </VStack>
  ),
};

const MultiSelectExample = () => {
  const categories = ['🍕 Food', '🚗 Transport', '🛍️ Shopping', '🎬 Entertainment', '💊 Health', '📚 Education', '🏠 Housing', '💼 Business'];
  const [selected, setSelected] = useState<Set<string>>(new Set(['🍕 Food']));
  const toggle = (cat: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat); else next.add(cat);
      action('selection')(Array.from(next));
      return next;
    });
  };
  return (
    <VStack gap="sm" style={{ maxWidth: 400 }}>
      <Text variant="label">Categories</Text>
      <ChipGroup>
        {categories.map((cat) => (
          <Chip key={cat} label={cat} selected={selected.has(cat)} onPress={() => toggle(cat)} />
        ))}
      </ChipGroup>
      <Text variant="caption" color="textTertiary">Selected: {selected.size} of {categories.length}</Text>
    </VStack>
  );
};

export const MultiSelect: Story = {
  name: 'Multi-Select (Interactive)',
  render: () => <MultiSelectExample />,
};

export const Shapes: Story = {
  name: 'Shapes (pill / rounded / square)',
  parameters: {
    docs: {
      description: {
        story:
          'The `shape` prop controls border-radius. `pill` is the default (fully rounded). `rounded` matches card radii (`lg`) for flush alignment inside cards. `square` is a subtle radius (`sm`) for tag-grid layouts.',
      },
    },
  },
  render: () => (
    <VStack gap="md">
      <VStack gap="xs">
        <Text variant="caption" color="textTertiary">shape="pill" (default)</Text>
        <ChipGroup>
          <Chip label="Food" shape="pill" onPress={action('press')} />
          <Chip label="Travel" shape="pill" selected onPress={action('press')} />
          <Chip label="Work" shape="pill" onPress={action('press')} />
        </ChipGroup>
      </VStack>
      <VStack gap="xs">
        <Text variant="caption" color="textTertiary">shape="rounded"</Text>
        <ChipGroup>
          <Chip label="Food" shape="rounded" onPress={action('press')} />
          <Chip label="Travel" shape="rounded" selected onPress={action('press')} />
          <Chip label="Work" shape="rounded" onPress={action('press')} />
        </ChipGroup>
      </VStack>
      <VStack gap="xs">
        <Text variant="caption" color="textTertiary">shape="square"</Text>
        <ChipGroup>
          <Chip label="Food" shape="square" onPress={action('press')} />
          <Chip label="Travel" shape="square" selected onPress={action('press')} />
          <Chip label="Work" shape="square" onPress={action('press')} />
        </ChipGroup>
      </VStack>
    </VStack>
  ),
};
