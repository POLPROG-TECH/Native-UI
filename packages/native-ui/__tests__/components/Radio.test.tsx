import { screen, fireEvent } from '@testing-library/react';
import { Radio } from '../../src/components/Radio';
import { renderWithTheme } from '../test-utils';

/*
 * Press logic only. Accessibility (role, name, selected state, the passive
 * indicator) is proven by the real renderer in `__tests__/native/Radio.test.tsx`.
 */
describe('Radio', () => {
  describe('GIVEN the Radio export from the components module', () => {
    describe('WHEN its runtime type is inspected', () => {
      it('THEN it is a React.memo exotic component', () => {
        expect(Radio).toHaveProperty('$$typeof', Symbol.for('react.memo'));
      });
    });
  });

  describe('GIVEN a Radio with a mocked onPress', () => {
    describe('WHEN the row is clicked', () => {
      it('THEN onPress is invoked exactly once', () => {
        const onPress = jest.fn();
        renderWithTheme(<Radio selected={false} label="A" onPress={onPress} />);

        fireEvent.click(screen.getByLabelText('A'));

        expect(onPress).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('GIVEN a disabled Radio with a mocked onPress', () => {
    describe('WHEN the row is clicked', () => {
      it('THEN onPress is never invoked', () => {
        const onPress = jest.fn();
        renderWithTheme(<Radio selected={false} label="A" onPress={onPress} disabled />);

        fireEvent.click(screen.getByLabelText('A'));

        expect(onPress).not.toHaveBeenCalled();
      });
    });
  });
});
