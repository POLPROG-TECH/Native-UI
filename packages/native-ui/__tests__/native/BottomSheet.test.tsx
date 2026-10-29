import { Text } from 'react-native';
import { BottomSheet } from '../../src/components/BottomSheet';
import { fireEvent, renderWithTheme, screen } from './test-utils';

describe('BottomSheet (real React Native renderer)', () => {
  describe('GIVEN a visible sheet whose backdrop VoiceOver cannot focus', () => {
    describe('WHEN the two-finger escape gesture is performed on the sheet', () => {
      it('THEN the sheet asks to close', () => {
        const onClose = jest.fn();
        renderWithTheme(
          <BottomSheet visible onClose={onClose} testID="sheet">
            <Text>Body</Text>
          </BottomSheet>,
        );

        fireEvent(screen.getByTestId('sheet'), 'accessibilityEscape');

        expect(onClose).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('GIVEN a visible sheet', () => {
    describe('WHEN the sheet container is inspected', () => {
      it('THEN screen readers are confined to it', () => {
        renderWithTheme(
          <BottomSheet visible onClose={jest.fn()} testID="sheet">
            <Text>Body</Text>
          </BottomSheet>,
        );

        const sheet = screen.getByTestId('sheet');

        expect(sheet).toHaveProp('accessibilityViewIsModal', true);
        expect(screen.getByText('Body')).toBeOnTheScreen();
      });
    });
  });
});
