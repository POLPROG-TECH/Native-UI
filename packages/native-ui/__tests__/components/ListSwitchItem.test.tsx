import { screen, fireEvent } from '@testing-library/react';
import { ListSwitchItem } from '../../src/components/ListSwitchItem';
import { renderWithTheme } from '../test-utils';

describe('ListSwitchItem', () => {
  describe('GIVEN the ListSwitchItem export from the components module', () => {
    describe('WHEN its runtime type is inspected', () => {
      it('THEN it is a function component', () => {
        const actualType = typeof ListSwitchItem;

        expect(actualType).toBe('function');
      });
    });
  });

  describe('GIVEN a ListSwitchItem with a label and a subtitle', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN both label and subtitle are present', () => {
        renderWithTheme(
          <ListSwitchItem
            label="Dark Mode"
            subtitle="Use the dark theme"
            value={false}
            onValueChange={() => {}}
          />,
        );

        expect(screen.getByText('Dark Mode')).toBeInTheDocument();
        expect(screen.getByText('Use the dark theme')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a ListSwitchItem with value={false} and a mocked onValueChange', () => {
    describe('WHEN the underlying switch is clicked', () => {
      it('THEN onValueChange is invoked once with true', () => {
        const onValueChange = jest.fn();
        renderWithTheme(
          <ListSwitchItem label="Dark Mode" value={false} onValueChange={onValueChange} />,
        );

        fireEvent.click(screen.getByRole('switch'));

        expect(onValueChange).toHaveBeenCalledTimes(1);
        expect(onValueChange).toHaveBeenCalledWith(true);
      });
    });
  });

  describe('GIVEN a ListSwitchItem rendered with value={true}', () => {
    describe('WHEN the switch element is inspected', () => {
      it('THEN the switch is checked', () => {
        renderWithTheme(<ListSwitchItem label="On" value onValueChange={() => {}} />);

        expect(screen.getByRole('switch')).toBeChecked();
      });
    });
  });
});
