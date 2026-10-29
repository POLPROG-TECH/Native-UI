import { screen } from '@testing-library/react';

import { Heading } from '../../src/primitives/Heading';
import { renderWithTheme } from '../test-utils';

describe('Heading', () => {
  describe('GIVEN the Heading export', () => {
    describe('WHEN its runtime type is inspected', () => {
      it('THEN it is a function component', () => {
        const actualType = typeof Heading;

        expect(actualType).toBe('function');
      });
    });
  });

  describe('GIVEN a Heading with body text as children', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN the text appears in the document', () => {
        renderWithTheme(<Heading>Page Title</Heading>);

        expect(screen.getByText('Page Title')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a Heading with any text', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN a node with the header accessibility role is present', () => {
        renderWithTheme(<Heading>Page Title</Heading>);

        expect(screen.getByRole('header')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN the full set of supported Heading levels', () => {
    describe('WHEN each level is rendered in isolation', () => {
      it('THEN every level renders its content without throwing', () => {
        const levels = [1, 2, 3, 'display', 'displayMedium'] as const;

        const renderAll = () => {
          levels.forEach((level) => {
            const { unmount } = renderWithTheme(<Heading level={level}>H {String(level)}</Heading>);
            expect(screen.getByText(`H ${String(level)}`)).toBeInTheDocument();
            unmount();
          });
        };

        expect(renderAll).not.toThrow();
      });
    });
  });

  describe('GIVEN a Heading configured with align="center"', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN the inline style carries the alignment', () => {
        renderWithTheme(<Heading align="center">Centered</Heading>);
        const heading = screen.getByText('Centered');

        expect(heading.style.textAlign).toBe('center');
      });
    });
  });
});
