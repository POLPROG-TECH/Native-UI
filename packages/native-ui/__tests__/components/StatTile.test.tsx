import { screen } from '@testing-library/react';
import { StatTile } from '../../src/components/StatTile';
import { renderWithTheme } from '../test-utils';

describe('StatTile', () => {
  describe('GIVEN the StatTile export from the components module', () => {
    describe('WHEN its runtime type is inspected', () => {
      it('THEN it is a function component', () => {
        const actualType = typeof StatTile;

        expect(actualType).toBe('function');
      });
    });
  });

  describe('GIVEN a StatTile with a "TIME" label and a "01:24" value', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN both the label and the value are present', () => {
        renderWithTheme(<StatTile label="TIME" value="01:24" />);

        expect(screen.getByText('TIME')).toBeInTheDocument();
        expect(screen.getByText('01:24')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a StatTile with a caption', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the caption text is present', () => {
        renderWithTheme(<StatTile label="BEST" value="358" caption="new record" />);

        expect(screen.getByText('new record')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN the full list of StatTile tones', () => {
    describe('WHEN each tone is rendered with a matching label', () => {
      it('THEN every tone renders without crashing', () => {
        const tones = ['neutral', 'primary', 'success', 'warning', 'error'] as const;

        const renderAll = () => {
          tones.forEach((tone) => {
            const { unmount } = renderWithTheme(
              <StatTile label={`tone-${tone}`} value="1" tone={tone} />,
            );
            expect(screen.getByText(`tone-${tone}`)).toBeInTheDocument();
            unmount();
          });
        };

        expect(renderAll).not.toThrow();
      });
    });
  });

  describe('GIVEN the full list of sizes combined with the mono flag', () => {
    describe('WHEN each size is rendered for both mono=true and mono=false', () => {
      it('THEN every combination renders without crashing', () => {
        const sizes = ['sm', 'md', 'lg'] as const;

        const renderAll = () => {
          sizes.forEach((size) => {
            [true, false].forEach((mono) => {
              const label = `${size}-${String(mono)}`;
              const { unmount } = renderWithTheme(
                <StatTile label={label} value="1" size={size} mono={mono} />,
              );
              expect(screen.getByText(label)).toBeInTheDocument();
              unmount();
            });
          });
        };

        expect(renderAll).not.toThrow();
      });
    });
  });

  describe('GIVEN a StatTile configured with align="left"', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the label is present', () => {
        renderWithTheme(<StatTile label="L" value="1" align="left" />);

        expect(screen.getByText('L')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a StatTile with a long value that would otherwise overflow', () => {
    describe('WHEN the value is queried', () => {
      it('THEN it renders intact (single-line + shrink-to-fit)', () => {
        renderWithTheme(<StatTile label="YEAR" value="1 234 567,89 zl" />);

        expect(screen.getByText('1 234 567,89 zl')).toBeInTheDocument();
      });
    });
  });
});
