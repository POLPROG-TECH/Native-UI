import { screen } from '@testing-library/react';
import { MarqueeText } from '../../src/primitives/MarqueeText';
import { captureTheme, renderWithTheme } from '../test-utils';

describe('MarqueeText', () => {
  describe('GIVEN the MarqueeText export', () => {
    describe('WHEN its runtime type is inspected', () => {
      it('THEN it is a function component', () => {
        const actualType = typeof MarqueeText;

        expect(actualType).toBe('function');
      });
    });
  });

  describe('GIVEN a MarqueeText with a short label', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN the text is present in the document', () => {
        renderWithTheme(<MarqueeText text="Hello world" />);

        expect(screen.getAllByText('Hello world').length).toBeGreaterThan(0);
      });
    });
  });

  describe('GIVEN a MarqueeText without an explicit accessibilityLabel', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN the text itself is used as the aria label', () => {
        renderWithTheme(<MarqueeText text="Accessible text" />);

        expect(screen.getByLabelText('Accessible text')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a MarqueeText with a custom aria label', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN the custom aria label is exposed instead', () => {
        renderWithTheme(<MarqueeText text="Verbose version" accessibilityLabel="Short label" />);

        expect(screen.getByLabelText('Short label')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a MarqueeText configured with every tuning prop', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN no error is thrown', () => {
        const render = () =>
          renderWithTheme(
            <MarqueeText
              text="Scrolling"
              speed={60}
              pauseDuration={500}
              gap={80}
              overflowTolerance={4}
            />,
          );

        expect(render).not.toThrow();
      });
    });
  });

  describe('GIVEN a MarqueeText rendered in the dark theme without a style colour', () => {
    describe('WHEN the visible text is inspected', () => {
      it('THEN it uses the theme textPrimary so it stays readable on dark surfaces', () => {
        const dark = { colorMode: 'dark' } as const;
        const { textPrimary } = captureTheme(dark).colors;

        renderWithTheme(<MarqueeText text="Readable" />, { config: dark });
        const rendered = screen.getAllByText('Readable');

        /* The last match is the visible text; the first is the hidden measure layer. */
        expect(rendered[rendered.length - 1]).toHaveStyle({ color: textPrimary });
      });
    });
  });

  describe('GIVEN a MarqueeText with an explicit style colour', () => {
    describe('WHEN the visible text is inspected', () => {
      it('THEN the caller colour overrides the theme default', () => {
        const brand = '#ff0000';

        renderWithTheme(<MarqueeText text="Branded" style={{ color: brand }} />);
        const rendered = screen.getAllByText('Branded');

        expect(rendered[rendered.length - 1]).toHaveStyle({ color: brand });
      });
    });
  });
});
