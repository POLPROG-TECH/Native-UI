import type { Meta, StoryObj } from '@storybook/react';
import { renderIconSlot, type IconSlot } from '../../src/primitives/iconSlot';
import { SystemIcon } from '../../src/primitives/SystemIcon';
import { HStack, VStack } from '../../src/primitives/Stack';
import { Text } from '../../src/primitives/Text';
import { useTheme } from '../../src/theme';

const meta: Meta = {
  title: 'Primitives/Icon slot',
  parameters: {
    docs: {
      description: {
        component: [
          'Every component that shows an icon accepts the same `IconSlot`:',
          '',
          '- **Render function** (preferred): `({ color, size }) => <Icon color={color} size={size} />`. The component passes the color and size for its state, so the icon follows the theme, selection and RTL.',
          '- **React node**: rendered as-is.',
          '- **String**: rendered as text, e.g. an emoji. Kept for compatibility; emoji look different on every platform and ignore the theme.',
          '',
          'Custom components can use the same convention through `renderIconSlot(slot, { color, size })`.',
          '',
          '### Import',
          '```tsx',
          "import { renderIconSlot, type IconSlot } from '@polprog/native-ui';",
          '```',
        ].join('\n'),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

function SlotPreview({ label, slot }: { label: string; slot: IconSlot }) {
  const theme = useTheme();

  return (
    <VStack gap="xs" align="center">
      {renderIconSlot(slot, { color: theme.colors.primaryText, size: theme.iconSize.lg })}
      <Text variant="caption" color="textSecondary">
        {label}
      </Text>
    </VStack>
  );
}

export const Conventions: Story = {
  render: () => (
    <HStack gap="xl">
      <SlotPreview
        label="Render function"
        slot={({ color, size }) => <SystemIcon name="search" color={color} size={size} />}
      />
      <SlotPreview label="Node" slot={<SystemIcon name="check" />} />
      <SlotPreview label="Emoji string" slot="📁" />
    </HStack>
  ),
};
