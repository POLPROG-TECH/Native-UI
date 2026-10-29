import { screen } from '@testing-library/react';
import { HeaderBar } from '../../src/components/HeaderBar';
import { renderWithTheme } from '../test-utils';

describe('HeaderBar alignment and tokens', () => {
  describe('GIVEN a header with only a back button', () => {
    describe('WHEN the title and container are inspected', () => {
      it('THEN the title is centered and a placeholder balances the back button', () => {
        renderWithTheme(<HeaderBar title="Settings" onBack={() => {}} testID="header" />);

        const title = screen.getByText('Settings');
        const header = screen.getByTestId('header');

        expect(title).toHaveStyle({ textAlign: 'center' });
        expect(header.children).toHaveLength(3);
      });
    });
  });

  describe('GIVEN a left-aligned header without a right slot', () => {
    describe('WHEN it is inspected', () => {
      it('THEN the title is left-aligned and no spacer is reserved on the right', () => {
        renderWithTheme(
          <HeaderBar title="Entries" onBack={() => {}} titleAlign="left" testID="header" />,
        );

        const title = screen.getByText('Entries');
        const header = screen.getByTestId('header');

        expect(title).toHaveStyle({ textAlign: 'left' });
        expect(header.children).toHaveLength(2);
      });
    });
  });

  describe('GIVEN tokens that left-align every header', () => {
    describe('WHEN it is inspected', () => {
      it('THEN the token values apply without props', () => {
        renderWithTheme(<HeaderBar title="Budget" testID="header" />, {
          config: {
            colorMode: 'light',
            components: { headerBar: { titleAlign: 'left', marginBottom: 12 } },
          },
        });

        const title = screen.getByText('Budget');

        expect(title).toHaveStyle({ textAlign: 'left' });
        expect(screen.getByTestId('header')).toHaveStyle({ marginBottom: '12px' });
      });
    });
  });

  describe('GIVEN Polish labels', () => {
    describe('WHEN the back button is looked up by name', () => {
      it('THEN the localized label is used', () => {
        renderWithTheme(<HeaderBar title="Ustawienia" onBack={() => {}} />, {
          config: { colorMode: 'light', labels: { goBack: 'Wstecz' } },
        });

        const back = screen.getByRole('button', { name: 'Wstecz' });

        expect(back).toBeInTheDocument();
      });
    });
  });
});
