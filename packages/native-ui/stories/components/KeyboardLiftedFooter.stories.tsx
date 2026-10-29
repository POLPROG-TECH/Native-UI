import { ScrollView, View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { KeyboardLiftedFooter } from '../../src/components/KeyboardLiftedFooter';
import type { KeyboardLiftedFooterProps } from '../../src/components/KeyboardLiftedFooter';
import { Button } from '../../src/components/Button';
import { Input } from '../../src/components/Input';

const meta: Meta<KeyboardLiftedFooterProps> = {
  title: 'Components/KeyboardLiftedFooter',
  tags: ['new', 'native-only'],
  component: KeyboardLiftedFooter,
  parameters: {
    docs: {
      description: {
        component: [
          'Bottom action bar for form screens that lifts itself above the software keyboard where the window does not resize for it (Android edge-to-edge).',
          '',
          'On iOS a surrounding `KeyboardAvoidingView` already moves the screen, so the footer is inert there by default (`enabled` defaults to Android only). On web the keyboard events never fire and the footer renders in normal flow.',
          '',
          '### Import',
          '```tsx',
          "import { KeyboardLiftedFooter } from '@polprog/native-ui';",
          '```',
        ].join('\n'),
      },
    },
  },
};

export default meta;
type Story = StoryObj<KeyboardLiftedFooterProps>;

export const FormScreen: Story = {
  render: () => (
    <View style={{ height: 360 }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Input label="Title" value="" onChangeText={() => {}} />
        <Input label="Amount" value="" onChangeText={() => {}} keyboardType="decimal-pad" />
      </ScrollView>
      <KeyboardLiftedFooter style={{ padding: 16 }}>
        <Button title="Save" fullWidth onPress={() => {}} />
      </KeyboardLiftedFooter>
    </View>
  ),
};
