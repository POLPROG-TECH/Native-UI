import { Text } from 'react-native';
import { Modal } from '../../src/components/Modal';
import { fireEvent, renderWithTheme, screen, userEvent } from './test-utils';

const CLOSE_LABEL = 'Dismiss dialog';

/**
 * The backdrop is a sibling of the dialog view, which sets
 * `accessibilityViewIsModal`. RNTL mirrors iOS VoiceOver, which ignores the
 * siblings of a modal view, so default queries treat the backdrop as hidden.
 * Backdrop queries opt in to hidden elements to test the props themselves;
 * they go by label because RNTL 13 `getByRole({ name })` ignores that option.
 */
const INCLUDE_HIDDEN = { includeHiddenElements: true } as const;

describe('Modal (real React Native renderer)', () => {
  describe('GIVEN a visible Modal with a title and body content', () => {
    describe('WHEN it is rendered through the real React Native Modal', () => {
      it('THEN the title is announced as a header and the body is on screen', () => {
        renderWithTheme(
          <Modal visible onClose={jest.fn()} title="Delete item?">
            <Text>This action cannot be undone.</Text>
          </Modal>,
        );

        expect(screen.getByRole('header', { name: 'Delete item?' })).toBeOnTheScreen();
        expect(screen.getByText('This action cannot be undone.')).toBeOnTheScreen();
      });
    });
  });

  describe('GIVEN a hidden Modal', () => {
    describe('WHEN it is rendered', () => {
      it('THEN neither the title nor the body is on screen', () => {
        renderWithTheme(
          <Modal visible={false} onClose={jest.fn()} title="Delete item?">
            <Text>This action cannot be undone.</Text>
          </Modal>,
        );

        expect(screen.queryByRole('header', { name: 'Delete item?' })).toBeNull();
        expect(screen.queryByText('This action cannot be undone.')).toBeNull();
      });
    });
  });

  describe('GIVEN a visible, dismissable Modal with a custom close label', () => {
    describe('WHEN the user presses the backdrop', () => {
      it('THEN it carries button semantics and the modal asks to close', async () => {
        const onClose = jest.fn();
        const user = userEvent.setup();
        renderWithTheme(
          <Modal visible onClose={onClose} closeAccessibilityLabel={CLOSE_LABEL}>
            <Text>Body</Text>
          </Modal>,
        );

        const backdrop = screen.getByLabelText(CLOSE_LABEL, INCLUDE_HIDDEN);

        await user.press(backdrop);

        expect(backdrop).toHaveProp('accessibilityRole', 'button');
        expect(onClose).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('GIVEN a visible Modal that cannot be dismissed from the backdrop', () => {
    describe('WHEN it is rendered', () => {
      it('THEN no close button is exposed while the content stays reachable', () => {
        renderWithTheme(
          <Modal
            visible
            onClose={jest.fn()}
            dismissable={false}
            closeAccessibilityLabel={CLOSE_LABEL}
          >
            <Text>Body</Text>
          </Modal>,
        );

        expect(screen.queryByLabelText(CLOSE_LABEL, INCLUDE_HIDDEN)).toBeNull();
        expect(screen.queryAllByRole('button', INCLUDE_HIDDEN)).toHaveLength(0);
        expect(screen.getByText('Body')).toBeOnTheScreen();
      });
    });
  });
});

describe('Modal VoiceOver escape gesture', () => {
  describe('GIVEN a visible, dismissable Modal (its backdrop is unreachable for VoiceOver)', () => {
    describe('WHEN the user performs the two-finger escape gesture on the dialog', () => {
      it('THEN the modal asks to close', () => {
        const onClose = jest.fn();
        renderWithTheme(
          <Modal visible onClose={onClose} testID="dialog">
            <Text>Body</Text>
          </Modal>,
        );

        fireEvent(screen.getByTestId('dialog'), 'accessibilityEscape');

        expect(onClose).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('GIVEN a Modal that must not be dismissed', () => {
    describe('WHEN the escape gesture is performed', () => {
      it('THEN nothing happens', () => {
        const onClose = jest.fn();
        renderWithTheme(
          <Modal visible onClose={onClose} dismissable={false} testID="dialog">
            <Text>Body</Text>
          </Modal>,
        );

        fireEvent(screen.getByTestId('dialog'), 'accessibilityEscape');

        expect(onClose).not.toHaveBeenCalled();
      });
    });
  });
});
