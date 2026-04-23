import React from 'react';
import { render, screen } from '@testing-library/react';
import { Text } from '../../src/primitives/Text';
import { NativeUIProvider } from '../../src/theme';
import { compactTypography } from '../../src/tokens/typography';
import { spaceGroteskFontFamilies } from '../../src/tokens/fonts';

// NativeUIProvider defaults to the `compact` typography scale + Space
// Grotesk family names. Tests compare rendered styles against that same
// resolved typography to stay in sync with the provider's defaults.
const typography = compactTypography(spaceGroteskFontFamilies);

function renderWithTheme(ui: React.ReactElement) {
  return render(<NativeUIProvider config={{ colorMode: 'light' }}>{ui}</NativeUIProvider>);
}

describe('Text', () => {
  it('should be exported as a function component', () => {
    // GIVEN the Text export from the primitives module

    // WHEN its runtime type is inspected
    const actualType = typeof Text;

    // THEN it is a function component
    expect(actualType).toBe('function');
  });

  it('should render without crashing when rendered with content', () => {
    // GIVEN a Text element with the content "Hello"

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<Text>Hello</Text>);

    // THEN the text content appears in the document
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('should render text content matching the children string', () => {
    // GIVEN a Text element with the content "Hello World"

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<Text>Hello World</Text>);

    // THEN the exact text content is present in the document
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('should apply body variant fontSize when no variant prop is provided', () => {
    // GIVEN a Text element without a variant prop

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<Text>Test</Text>);

    // THEN the rendered fontSize matches the body typography token
    const el = screen.getByText('Test');
    expect(el.style.fontSize).toBe(`${typography.body.fontSize}px`);
  });

  it('should apply h1 fontSize and fontWeight when variant is h1', () => {
    // GIVEN a Text element configured with variant="h1"

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<Text variant="h1">Heading</Text>);

    // THEN both fontSize and fontWeight match the h1 typography token
    const el = screen.getByText('Heading');
    expect(el.style.fontSize).toBe(`${typography.h1.fontSize}px`);
    expect(el.style.fontWeight).toBe(typography.h1.fontWeight);
  });

  it('should apply caption fontSize when variant is caption', () => {
    // GIVEN a Text element configured with variant="caption"

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<Text variant="caption">Small text</Text>);

    // THEN the rendered fontSize matches the caption typography token
    const el = screen.getByText('Small text');
    expect(el.style.fontSize).toBe(`${typography.caption.fontSize}px`);
  });

  it('should apply a color style when a color token is provided', () => {
    // GIVEN a Text element configured with color="primary"

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<Text color="primary">Colored</Text>);

    // THEN the rendered element has a color style applied
    const el = screen.getByText('Colored');
    expect(el.style.color).toBeTruthy();
  });

  it('should apply a default color style when no color prop is provided', () => {
    // GIVEN a Text element without a color prop

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<Text>Default</Text>);

    // THEN the rendered element still has a default color applied
    const el = screen.getByText('Default');
    expect(el.style.color).toBeTruthy();
  });

  it('should apply text alignment when align prop is provided', () => {
    // GIVEN a Text element configured with align="center"

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<Text align="center">Centered</Text>);

    // THEN textAlign is set to center
    const el = screen.getByText('Centered');
    expect(el.style.textAlign).toBe('center');
  });

  it('should render every supported typography variant without crashing', () => {
    // GIVEN the full list of supported typography variant names
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

    // WHEN each variant is rendered with its name as content
    const renderAll = () => {
      variants.forEach((variant) => {
        const { unmount } = renderWithTheme(<Text variant={variant}>{variant}</Text>);
        expect(screen.getByText(variant)).toBeInTheDocument();
        unmount();
      });
    };

    // THEN every variant renders and shows its name without crashing
    expect(renderAll).not.toThrow();
  });
});
