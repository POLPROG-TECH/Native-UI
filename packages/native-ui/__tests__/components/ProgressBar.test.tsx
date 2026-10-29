import { screen } from '@testing-library/react';
import { ProgressBar } from '../../src/components/ProgressBar';
import { renderWithTheme } from '../test-utils';

describe('ProgressBar', () => {
  describe('GIVEN the ProgressBar export from the components module', () => {
    describe('WHEN its runtime type is inspected', () => {
      it('THEN it is a function component', () => {
        const actualType = typeof ProgressBar;

        expect(actualType).toBe('function');
      });
    });
  });

  describe('GIVEN a ProgressBar with a 50 % value', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN it exposes the progressbar role', () => {
        renderWithTheme(<ProgressBar value={0.5} />);

        expect(screen.getByRole('progressbar')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a ProgressBar with both value and progress set', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the element is present and accessible', () => {
        renderWithTheme(<ProgressBar value={0.75} progress={0.25} accessibilityLabel="Wins" />);

        expect(screen.getByLabelText('Wins')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a ProgressBar supplying only the progress alias', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN it exposes the progressbar role', () => {
        renderWithTheme(<ProgressBar progress={0.4} accessibilityLabel="P" />);

        expect(screen.getByLabelText('P')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a ProgressBar with no value or progress prop', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the element is present', () => {
        renderWithTheme(<ProgressBar accessibilityLabel="Zero" />);

        expect(screen.getByLabelText('Zero')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a ProgressBar with a value greater than 1', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the element is present', () => {
        renderWithTheme(<ProgressBar value={2} accessibilityLabel="Over" />);

        expect(screen.getByLabelText('Over')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a ProgressBar with a negative value', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the element is present', () => {
        renderWithTheme(<ProgressBar value={-0.5} accessibilityLabel="Under" />);

        expect(screen.getByLabelText('Under')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN the full list of semantic color keys', () => {
    describe('WHEN each color is rendered with a matching accessibility label', () => {
      it('THEN every color renders without crashing', () => {
        const colors = ['primary', 'success', 'warning', 'error'] as const;

        const renderAll = () => {
          colors.forEach((c) => {
            const { unmount } = renderWithTheme(
              <ProgressBar value={0.5} color={c} accessibilityLabel={`col-${c}`} />,
            );
            expect(screen.getByLabelText(`col-${c}`)).toBeInTheDocument();
            unmount();
          });
        };

        expect(renderAll).not.toThrow();
      });
    });
  });

  describe('GIVEN a ProgressBar with a raw hex color', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the element is present', () => {
        renderWithTheme(<ProgressBar value={0.5} color="#123456" accessibilityLabel="hex" />);

        expect(screen.getByLabelText('hex')).toBeInTheDocument();
      });
    });
  });
});
