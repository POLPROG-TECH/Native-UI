import { screen } from '@testing-library/react';
import { Text } from '../../src/primitives/Text';
import { compactTypography } from '../../src/tokens/typography';
import { spaceGroteskFontFamilies } from '../../src/tokens/fonts';
import { renderWithTheme } from '../test-utils';

/*
 * NativeUIProvider defaults to the `compact` typography scale + Space
 * Grotesk family names. Tests compare rendered styles against that same
 * resolved typography to stay in sync with the provider's defaults.
 */
const typography = compactTypography(spaceGroteskFontFamilies);

describe('Text', () => {
  describe('GIVEN the Text export from the primitives module', () => {
    describe('WHEN its runtime type is inspected', () => {
      it('THEN it is a function component', () => {
        const actualType = typeof Text;

        expect(actualType).toBe('function');
      });
    });
  });

  describe('GIVEN a Text element with the content "Hello"', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the text content appears in the document', () => {
        renderWithTheme(<Text>Hello</Text>);

        expect(screen.getByText('Hello')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a Text element with the content "Hello World"', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the exact text content is present in the document', () => {
        renderWithTheme(<Text>Hello World</Text>);

        expect(screen.getByText('Hello World')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a Text element without a variant prop', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the rendered fontSize matches the body typography token', () => {
        renderWithTheme(<Text>Test</Text>);

        const el = screen.getByText('Test');
        expect(el.style.fontSize).toBe(`${typography.body.fontSize}px`);
      });
    });
  });

  describe('GIVEN a Text element configured with variant="h1"', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN both fontSize and fontWeight match the h1 typography token', () => {
        renderWithTheme(<Text variant="h1">Heading</Text>);

        const el = screen.getByText('Heading');
        expect(el.style.fontSize).toBe(`${typography.h1.fontSize}px`);
        expect(el.style.fontWeight).toBe(typography.h1.fontWeight);
      });
    });
  });

  describe('GIVEN a Text element configured with variant="caption"', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the rendered fontSize matches the caption typography token', () => {
        renderWithTheme(<Text variant="caption">Small text</Text>);

        const el = screen.getByText('Small text');
        expect(el.style.fontSize).toBe(`${typography.caption.fontSize}px`);
      });
    });
  });

  describe('GIVEN a Text element configured with color="primary"', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the rendered element has a color style applied', () => {
        renderWithTheme(<Text color="primary">Colored</Text>);

        const el = screen.getByText('Colored');
        expect(el.style.color).toBeTruthy();
      });
    });
  });

  describe('GIVEN a Text element without a color prop', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN the rendered element still has a default color applied', () => {
        renderWithTheme(<Text>Default</Text>);

        const el = screen.getByText('Default');
        expect(el.style.color).toBeTruthy();
      });
    });
  });

  describe('GIVEN a Text element configured with align="center"', () => {
    describe('WHEN the component is rendered inside a theme provider', () => {
      it('THEN textAlign is set to center', () => {
        renderWithTheme(<Text align="center">Centered</Text>);

        const el = screen.getByText('Centered');
        expect(el.style.textAlign).toBe('center');
      });
    });
  });

  describe('GIVEN the full list of supported typography variant names', () => {
    describe('WHEN each variant is rendered with its name as content', () => {
      it('THEN every variant renders and shows its name without crashing', () => {
        const variants = [
          'displayLarge',
          'displayMedium',
          'h1',
          'h2',
          'h3',
          'bodyLarge',
          'body',
          'bodySmall',
          'label',
          'labelSmall',
          'caption',
          'mono',
          'monoLarge',
          'monoSmall',
        ] as const;

        const renderAll = () => {
          variants.forEach((variant) => {
            const { unmount } = renderWithTheme(<Text variant={variant}>{variant}</Text>);
            expect(screen.getByText(variant)).toBeInTheDocument();
            unmount();
          });
        };

        expect(renderAll).not.toThrow();
      });
    });
  });
});
