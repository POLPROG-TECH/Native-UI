import { screen } from '@testing-library/react';
import { Spinner } from '../../src/components/Spinner';
import { renderWithTheme } from '../test-utils';

describe('Spinner', () => {
  describe('GIVEN the Spinner export from the components module', () => {
    describe('WHEN its runtime type is inspected', () => {
      it('THEN it is a function component', () => {
        const actualType = typeof Spinner;

        expect(actualType).toBe('function');
      });
    });
  });

  describe('GIVEN a Spinner with no explicit label', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the default "Loading" accessibility label is present', () => {
        renderWithTheme(<Spinner />);

        expect(screen.getByLabelText('Loading')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a Spinner with a custom label', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the label text is present and also used as the a11y label', () => {
        renderWithTheme(<Spinner label="Fetching..." />);

        expect(screen.getByText('Fetching...')).toBeInTheDocument();
        expect(screen.getByLabelText('Fetching...')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN both supported spinner sizes', () => {
    describe('WHEN each size is rendered with a matching label', () => {
      it('THEN every size renders without crashing', () => {
        const sizes = ['small', 'large'] as const;

        const renderAll = () => {
          sizes.forEach((size) => {
            const { unmount } = renderWithTheme(<Spinner label={`size-${size}`} size={size} />);
            expect(screen.getByLabelText(`size-${size}`)).toBeInTheDocument();
            unmount();
          });
        };

        expect(renderAll).not.toThrow();
      });
    });
  });
});
