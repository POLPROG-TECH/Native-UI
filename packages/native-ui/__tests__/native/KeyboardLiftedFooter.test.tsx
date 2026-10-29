import { Text } from 'react-native';
import { KeyboardLiftedFooter } from '../../src/components/KeyboardLiftedFooter';
import { renderWithTheme } from './test-utils';

describe('KeyboardLiftedFooter', () => {
  describe('GIVEN a footer with an action', () => {
    describe('WHEN it renders without a keyboard', () => {
      it('THEN the content is shown without any lift', () => {
        const { getByText, getByTestId } = renderWithTheme(
          <KeyboardLiftedFooter testID="footer">
            <Text>Save</Text>
          </KeyboardLiftedFooter>,
        );

        expect(getByText('Save')).toBeOnTheScreen();
        expect(getByTestId('footer')).not.toHaveStyle({ elevation: 12 });
      });
    });
  });
});
