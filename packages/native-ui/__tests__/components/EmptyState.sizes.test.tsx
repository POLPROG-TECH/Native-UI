import { Text } from 'react-native';
import { screen } from '@testing-library/react';
import { EmptyState } from '../../src/components/EmptyState';
import { renderWithTheme } from '../test-utils';

describe('EmptyState sizes and layout', () => {
  describe('GIVEN an empty state of the given size', () => {
    describe('WHEN its container is inspected', () => {
      it.each([
        ['sm', '24px'],
        ['md', '32px'],
        ['lg', '32px'],
      ] as const)('THEN the preset spacing is used (%s)', (size, paddingHorizontal) => {
        renderWithTheme(<EmptyState title="Nothing" size={size} testID="empty" />);

        const container = screen.getByTestId('empty');

        expect(container).toHaveStyle({
          paddingLeft: paddingHorizontal,
          paddingRight: paddingHorizontal,
        });
      });
    });
  });

  describe('GIVEN an empty state used inside a list', () => {
    describe('WHEN its container is inspected', () => {
      it('THEN it does not claim flex growth', () => {
        renderWithTheme(<EmptyState title="No results" fill={false} testID="empty" />);

        const container = screen.getByTestId('empty');

        expect(container).not.toHaveStyle({ flex: 1 });
      });
    });
  });

  describe('GIVEN a custom icon node', () => {
    describe('WHEN the title is queried', () => {
      it('THEN the title keeps its header role and the icon renders', () => {
        renderWithTheme(<EmptyState title="Empty" icon={<Text>ICON</Text>} />);

        const title = screen.getByText('Empty');

        expect(title).toHaveAttribute('role', 'header');
        expect(screen.getByText('ICON')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN tokens that make "sm" the default', () => {
    describe('WHEN its container is inspected', () => {
      it('THEN the sm preset spacing applies', () => {
        renderWithTheme(<EmptyState title="Nothing" testID="empty" />, {
          config: { colorMode: 'light', components: { emptyState: { defaultSize: 'sm' } } },
        });

        const container = screen.getByTestId('empty');

        expect(container).toHaveStyle({ paddingLeft: '24px' });
      });
    });
  });
});
