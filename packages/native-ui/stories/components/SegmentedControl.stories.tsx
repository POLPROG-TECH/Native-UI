import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SegmentedControl } from '../../src/components/SegmentedControl';
import type { SegmentedControlProps } from '../../src/components/SegmentedControl';
import { VStack } from '../../src/primitives/Stack';
import { Text } from '../../src/primitives/Text';

type ThemeMode = 'light' | 'dark' | 'system';

const MODES: SegmentedControlProps<ThemeMode>['options'] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

const meta: Meta<SegmentedControlProps<ThemeMode>> = {
  title: 'Components/SegmentedControl',
  tags: ['new'],
  component: SegmentedControl,
  parameters: {
    docs: {
      description: {
        component: [
          'Single-choice segmented control: a track with equally sized segments, the selected one raised on a thumb.',
          '',
          '### Accessibility',
          '- Exposed as a `radiogroup`; each segment is a `radio` with `checked` / `selected` state.',
          '- Name the group with `accessibilityLabel`.',
          '',
          '### Theming',
          'Paddings, radii, thumb elevation and colors come from `components.segmentedControl` and can be overridden in `NativeUIProvider`.',
          '',
          '### Import',
          '```tsx',
          "import { SegmentedControl } from '@polprog/native-ui';",
          '```',
        ].join('\n'),
      },
    },
  },
};

export default meta;
type Story = StoryObj<SegmentedControlProps<ThemeMode>>;

function Controlled({ disabled }: { disabled?: boolean }) {
  const [mode, setMode] = useState<ThemeMode>('system');

  return (
    <VStack gap="sm">
      <SegmentedControl
        accessibilityLabel="Theme"
        options={MODES}
        value={mode}
        onChange={setMode}
        disabled={disabled}
      />
      <Text variant="caption" color="textTertiary">
        Selected: {mode}
      </Text>
    </VStack>
  );
}

export const Playground: Story = {
  render: () => <Controlled />,
};

export const Disabled: Story = {
  render: () => <Controlled disabled />,
};
