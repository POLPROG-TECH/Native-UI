import { screen, fireEvent } from '@testing-library/react';
import { Switch } from '../../src/components/Switch';
import { renderWithTheme } from '../test-utils';

/*
 * Press logic only. Accessibility (role, name, checked and disabled state)
 * is proven by the real renderer in `__tests__/native/Switch.test.tsx`.
 */
describe('Switch', () => {
  describe('GIVEN the Switch export from the components module', () => {
    describe('WHEN its runtime type is inspected', () => {
      it('THEN it is a React.memo exotic component', () => {
        expect(Switch).toHaveProperty('$$typeof', Symbol.for('react.memo'));
      });
    });
  });

  describe('GIVEN a Switch with value={false} and a mocked onValueChange', () => {
    describe('WHEN the switch element is clicked', () => {
      it('THEN onValueChange is invoked with true', () => {
        const onValueChange = jest.fn();
        renderWithTheme(<Switch value={false} onValueChange={onValueChange} label="S" />);

        fireEvent.click(screen.getByRole('switch'));

        expect(onValueChange).toHaveBeenCalledWith(true);
      });
    });
  });

  describe('GIVEN a disabled Switch with a mocked onValueChange', () => {
    describe('WHEN the switch element is clicked', () => {
      it('THEN onValueChange is never invoked', () => {
        const onValueChange = jest.fn();
        renderWithTheme(<Switch value={false} onValueChange={onValueChange} label="S" disabled />);

        fireEvent.click(screen.getByRole('switch'));

        expect(onValueChange).not.toHaveBeenCalled();
      });
    });
  });
});
