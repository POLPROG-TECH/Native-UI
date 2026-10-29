import { Text } from 'react-native';
import { screen, fireEvent } from '@testing-library/react';
import { HeaderBar } from '../../src/components/HeaderBar';
import { renderWithTheme } from '../test-utils';

describe('HeaderBar', () => {
  describe('GIVEN the HeaderBar export from the components module', () => {
    describe('WHEN its runtime type is inspected', () => {
      it('THEN it is a function component', () => {
        const actualType = typeof HeaderBar;

        expect(actualType).toBe('function');
      });
    });
  });

  describe('GIVEN a HeaderBar configured with a "Settings" title', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the title text appears in the document', () => {
        renderWithTheme(<HeaderBar title="Settings" />);

        expect(screen.getByText('Settings')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a HeaderBar with a mocked onBack callback', () => {
    describe('WHEN the back button is clicked', () => {
      it('THEN the back button was rendered and the callback was invoked once', () => {
        const onBack = jest.fn();
        renderWithTheme(<HeaderBar title="Profile" onBack={onBack} />);
        const back = screen.getByLabelText('Go back');

        fireEvent.click(back);

        expect(back).toBeInTheDocument();
        expect(onBack).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('GIVEN a HeaderBar without an onBack prop', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN no back button is present in the document', () => {
        renderWithTheme(<HeaderBar title="Home" />);

        expect(screen.queryByLabelText('Go back')).not.toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a HeaderBar configured with a custom back accessibility label', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the back button uses the custom label', () => {
        renderWithTheme(<HeaderBar title="X" onBack={() => {}} backAccessibilityLabel="Wstecz" />);

        expect(screen.getByLabelText('Wstecz')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a HeaderBar with a right slot element', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the right slot content appears in the document', () => {
        renderWithTheme(<HeaderBar title="X" right={<Text>RIGHT</Text>} />);

        expect(screen.getByText('RIGHT')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a HeaderBar without a title prop', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the component renders DOM output without crashing', () => {
        const { container } = renderWithTheme(<HeaderBar onBack={() => {}} />);

        expect(container).toBeTruthy();
      });
    });
  });
});
