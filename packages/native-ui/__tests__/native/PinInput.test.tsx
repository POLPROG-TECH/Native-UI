import { useState } from 'react';
import { PinInput } from '../../src/components/PinInput';
import { captureTheme, renderWithTheme, screen, userEvent } from './test-utils';

const LABEL = 'Verification code';

function ControlledPin({ onComplete }: { onComplete: (value: string) => void }) {
  const [code, setCode] = useState('');

  return (
    <PinInput
      accessibilityLabel={LABEL}
      value={code}
      onChangeText={setCode}
      onComplete={onComplete}
      length={4}
      testID="pin"
    />
  );
}

describe('PinInput (real React Native renderer)', () => {
  describe('GIVEN an empty four-digit field', () => {
    describe('WHEN the user types the full code', () => {
      it('THEN the field holds it, completion fires once and progress is spoken', async () => {
        const onComplete = jest.fn();
        const complete = (await captureTheme()).labels.pinProgress(4, 4);
        const user = userEvent.setup();
        await renderWithTheme(<ControlledPin onComplete={onComplete} />);
        const field = screen.getByLabelText(LABEL);

        await user.type(field, '4821');

        expect(field).toHaveDisplayValue('4821');
        expect(onComplete).toHaveBeenCalledTimes(1);
        expect(onComplete).toHaveBeenCalledWith('4821');
        expect(field).toHaveAccessibilityValue({ text: complete });
      });
    });

    describe('WHEN the accessibility tree is queried', () => {
      it('THEN the drawn cells are hidden so only the text field is announced', async () => {
        await renderWithTheme(<ControlledPin onComplete={() => {}} />);

        expect(screen.getByTestId('pin-cells', { includeHiddenElements: true })).toHaveProp(
          'importantForAccessibility',
          'no-hide-descendants',
        );
        expect(screen.queryByTestId('pin-cells')).toBeNull();
      });
    });
  });

  describe('GIVEN a disabled field', () => {
    describe('WHEN the accessibility tree is queried', () => {
      it('THEN it is announced as disabled', async () => {
        await renderWithTheme(
          <PinInput accessibilityLabel={LABEL} value="" onChangeText={() => {}} disabled />,
        );

        expect(screen.getByLabelText(LABEL)).toBeDisabled();
      });
    });
  });
});
