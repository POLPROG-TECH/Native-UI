import { Button } from '../../src/components/Button';
import { configureHaptics, _resetHapticsForTest } from '../../src/utils/haptics';
import { createHapticsMock, renderWithTheme, screen, userEvent } from './test-utils';

/** Mirrors the lock-out window Button passes to `useDebouncedPress`. */
const PRESS_DEBOUNCE_MS = 400;

describe('Button (real React Native renderer)', () => {
  beforeEach(() => {
    /*
     * Fake timers drive the 400 ms debounce deterministically; userEvent must
     * advance them itself or its internal press delays would never resolve.
     */
    jest.useFakeTimers();
  });

  afterEach(() => {
    _resetHapticsForTest();
    jest.useRealTimers();
  });

  describe('GIVEN an enabled Button titled "Save"', () => {
    describe('WHEN it is rendered by the real React Native renderer', () => {
      it('THEN assistive technology sees an enabled button named "Save"', () => {
        renderWithTheme(<Button title="Save" onPress={jest.fn()} />);

        const button = screen.getByRole('button', { name: 'Save' });
        expect(button).toBeEnabled();
        expect(button).toHaveProp('accessibilityState', { disabled: false, busy: false });
      });
    });
  });

  describe('GIVEN a disabled Button with an onPress spy', () => {
    describe('WHEN the user presses it through the real Pressable responder', () => {
      it('THEN it is announced as disabled and the handler never runs', async () => {
        const onPress = jest.fn();
        const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
        renderWithTheme(<Button title="Save" onPress={onPress} disabled />);
        const button = screen.getByRole('button', { name: 'Save' });

        await user.press(button);

        expect(button).toBeDisabled();
        expect(button).toHaveProp('accessibilityState', { disabled: true, busy: false });
        expect(onPress).not.toHaveBeenCalled();
      });
    });
  });

  describe('GIVEN a Button in its loading state', () => {
    describe('WHEN it is rendered', () => {
      it('THEN the button stays reachable by name, is announced as busy and disabled, and the label stays mounted (invisible) so the width is stable', () => {
        renderWithTheme(<Button title="Save" onPress={jest.fn()} loading />);

        const button = screen.getByRole('button', { name: 'Save' });
        expect(button).toBeDisabled();
        expect(button).toHaveProp('accessibilityState', { disabled: true, busy: true });
        expect(screen.getByText('Save', { includeHiddenElements: true })).toBeTruthy();
      });
    });
  });

  describe('GIVEN an enabled Button with onPress and haptics spies', () => {
    describe('WHEN the user double taps inside the debounce window the debounce window elapses and the user taps again', () => {
      it('THEN only the first tap is handled the second tap is handled as well', async () => {
        const onPress = jest.fn();
        const haptics = createHapticsMock();
        configureHaptics(haptics);
        const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
        renderWithTheme(<Button title="Save" onPress={onPress} />);
        const button = screen.getByRole('button', { name: 'Save' });

        await user.press(button);
        await user.press(button);

        expect(onPress).toHaveBeenCalledTimes(1);
        expect(haptics.medium).toHaveBeenCalledTimes(1);

        jest.advanceTimersByTime(PRESS_DEBOUNCE_MS);
        await user.press(button);

        expect(onPress).toHaveBeenCalledTimes(2);
      });
    });
  });
});
