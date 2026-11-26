import { fireEvent, screen, within } from '@testing-library/react';
import { Platform } from 'react-native';
import { PinInput } from '../../src/components/PinInput';
import { PIN_CELL_STATE, pinCellState } from '../../src/components/pinInput/pinValue';
import { captureTheme, renderWithTheme } from '../test-utils';

const LABEL = 'Verification code';

function type(text: string) {
  fireEvent.change(screen.getByLabelText(LABEL), { target: { value: text } });
}

/*
 * Sanitising, completion and cell drawing. Typing through the real text field
 * and its spoken value are proven in `__tests__/native/PinInput.test.tsx`.
 */
describe('PinInput', () => {
  describe('GIVEN an empty four-digit field', () => {
    describe('WHEN text with letters is entered', () => {
      it('THEN only the digits are reported', () => {
        const onChangeText = jest.fn();
        renderWithTheme(
          <PinInput accessibilityLabel={LABEL} value="" onChangeText={onChangeText} length={4} />,
        );

        type('1a2-3');

        expect(onChangeText).toHaveBeenCalledWith('123');
      });
    });

    describe('WHEN a longer code is pasted', () => {
      it('THEN it is cut to the field length and reported as complete', () => {
        const onChangeText = jest.fn();
        const onComplete = jest.fn();
        renderWithTheme(
          <PinInput
            accessibilityLabel={LABEL}
            value=""
            onChangeText={onChangeText}
            onComplete={onComplete}
            length={4}
          />,
        );

        type('987654');

        expect(onChangeText).toHaveBeenCalledWith('9876');
        expect(onComplete).toHaveBeenCalledWith('9876');
      });
    });

    describe('WHEN fewer digits than the length are entered', () => {
      it('THEN onComplete is not called', () => {
        const onComplete = jest.fn();
        renderWithTheme(
          <PinInput
            accessibilityLabel={LABEL}
            value=""
            onChangeText={() => {}}
            onComplete={onComplete}
            length={4}
          />,
        );

        type('12');

        expect(onComplete).not.toHaveBeenCalled();
      });
    });
  });

  describe('GIVEN a field that already holds a complete code', () => {
    describe('WHEN the same code is reported again', () => {
      it('THEN onComplete does not fire a second time', () => {
        const onComplete = jest.fn();
        renderWithTheme(
          <PinInput
            accessibilityLabel={LABEL}
            value="1234"
            onChangeText={() => {}}
            onComplete={onComplete}
            length={4}
          />,
        );

        type('12345');

        expect(onComplete).not.toHaveBeenCalled();
      });
    });
  });

  describe('GIVEN a field with two digits entered', () => {
    describe('WHEN the cells are drawn', () => {
      it('THEN each digit sits in its own cell and progress is exposed as the value', () => {
        renderWithTheme(
          <PinInput
            accessibilityLabel={LABEL}
            value="48"
            onChangeText={() => {}}
            length={4}
            testID="pin"
          />,
        );
        const cells = within(screen.getByTestId('pin-cells'));

        expect(cells.getByText('4')).toBeInTheDocument();
        expect(cells.getByText('8')).toBeInTheDocument();
        expect(screen.getByLabelText(LABEL)).toHaveAttribute(
          'aria-valuetext',
          captureTheme().labels.pinProgress(2, 4),
        );
      });
    });

    describe('WHEN the field is in secure mode', () => {
      it('THEN no digit is rendered as text', () => {
        renderWithTheme(
          <PinInput
            accessibilityLabel={LABEL}
            value="48"
            onChangeText={() => {}}
            length={4}
            secure
            testID="pin"
          />,
        );

        expect(screen.getByTestId('pin-cells')).toHaveTextContent('');
      });
    });
  });

  describe('GIVEN a field without an explicit length', () => {
    describe('WHEN it is rendered', () => {
      it('THEN it draws the number of cells set in the tokens', () => {
        renderWithTheme(
          <PinInput accessibilityLabel={LABEL} value="" onChangeText={() => {}} testID="pin" />,
          { config: { colorMode: 'light', components: { pinInput: { defaultLength: 5 } } } },
        );

        expect(screen.getByTestId('pin-cells').children).toHaveLength(5);
      });
    });
  });

  describe('GIVEN the field on iOS', () => {
    describe('WHEN its style is inspected', () => {
      it('THEN it hides its text without zero opacity, which would block touches on iOS', () => {
        renderWithTheme(<PinInput accessibilityLabel={LABEL} value="12" onChangeText={() => {}} />);

        const field = screen.getByLabelText(LABEL);

        expect(field).toHaveStyle({ color: 'rgba(0, 0, 0, 0)' });
        expect(field.style.opacity).toBe('');
      });
    });
  });

  describe('GIVEN the field on Android', () => {
    describe('WHEN its style is inspected', () => {
      it('THEN it is faded out, because Android draws a transparent text color as the default one', () => {
        jest.replaceProperty(Platform, 'OS', 'android');
        renderWithTheme(<PinInput accessibilityLabel={LABEL} value="12" onChangeText={() => {}} />);

        const field = screen.getByLabelText(LABEL);
        jest.restoreAllMocks();

        expect(field.style.opacity).toBe('0');
        expect(field.style.color).toBe('');
      });
    });
  });

  describe('GIVEN a disabled field', () => {
    describe('WHEN it is rendered', () => {
      it('THEN the text field cannot be edited', () => {
        renderWithTheme(
          <PinInput accessibilityLabel={LABEL} value="" onChangeText={() => {}} disabled />,
        );

        expect(screen.getByLabelText(LABEL)).toBeDisabled();
      });
    });
  });

  describe('GIVEN an invalid field that has focus', () => {
    describe('WHEN the cells are drawn', () => {
      it('THEN every cell uses the error color, including the active one', () => {
        const { error } = captureTheme().colors;
        renderWithTheme(
          <PinInput
            accessibilityLabel={LABEL}
            value="4"
            onChangeText={() => {}}
            length={2}
            invalid
            testID="pin"
          />,
        );

        fireEvent.focus(screen.getByLabelText(LABEL));
        const [filled, active] = Array.from(screen.getByTestId('pin-cells').children);

        expect(filled).toHaveStyle({ borderColor: error });
        expect(active).toHaveStyle({ borderColor: error });
      });
    });
  });
});

describe('pinCellState', () => {
  describe('GIVEN a focused field with one of four digits entered', () => {
    describe('WHEN the cell states are computed', () => {
      it('THEN the first is filled, the second active and the rest empty', () => {
        const states = [0, 1, 2, 3].map((index) => pinCellState(index, '7', 4, true));

        expect(states).toEqual([
          PIN_CELL_STATE.filled,
          PIN_CELL_STATE.active,
          PIN_CELL_STATE.empty,
          PIN_CELL_STATE.empty,
        ]);
      });
    });
  });

  describe('GIVEN a focused field with every digit entered', () => {
    describe('WHEN the last cell state is computed', () => {
      it('THEN the last cell stays active', () => {
        expect(pinCellState(3, '1234', 4, true)).toBe(PIN_CELL_STATE.active);
      });
    });
  });

  describe('GIVEN a field without focus', () => {
    describe('WHEN the cell states are computed', () => {
      it('THEN no cell is active', () => {
        const states = [0, 1].map((index) => pinCellState(index, '7', 2, false));

        expect(states).toEqual([PIN_CELL_STATE.filled, PIN_CELL_STATE.empty]);
      });
    });
  });
});
