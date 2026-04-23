import React from 'react';
import { render } from '@testing-library/react';
import { Box } from '../../src/primitives/Box';
import { NativeUIProvider } from '../../src/theme';
import { spacing, borderRadius } from '../../src/tokens/spacing';

function renderWithTheme(ui: React.ReactElement) {
  return render(<NativeUIProvider config={{ colorMode: 'light' }}>{ui}</NativeUIProvider>);
}

describe('Box', () => {
  it('should be exported as a function component', () => {
    // GIVEN the Box export from the primitives module

    // WHEN its runtime type is inspected
    const actualType = typeof Box;

    // THEN it is a function component
    expect(actualType).toBe('function');
  });

  it('should render without crashing when mounted with no props', () => {
    // GIVEN an empty Box element

    // WHEN the component is rendered inside a theme provider
    const { container } = renderWithTheme(<Box />);

    // THEN the container has a rendered child element
    expect(container.firstChild).toBeTruthy();
  });

  it('should render children inside the Box when children are provided', () => {
    // GIVEN a Box element containing a child span

    // WHEN the component is rendered inside a theme provider
    const { getByText } = renderWithTheme(
      <Box>
        <span>child</span>
      </Box>,
    );

    // THEN the child text is present in the document
    expect(getByText('child')).toBeInTheDocument();
  });

  it('should apply padding from spacing token when p prop is provided', () => {
    // GIVEN a Box element with p="md"

    // WHEN the component is rendered inside a theme provider
    const { container } = renderWithTheme(<Box p="md" />);

    // THEN the element's padding matches the md spacing token
    const el = container.firstChild as HTMLElement;
    expect(el.style.padding).toBe(`${spacing.md}px`);
  });

  it('should apply horizontal padding from spacing token when px prop is provided', () => {
    // GIVEN a Box element with px="lg"

    // WHEN the component is rendered inside a theme provider
    const { container } = renderWithTheme(<Box px="lg" />);

    // THEN paddingLeft and paddingRight match the lg spacing token
    const el = container.firstChild as HTMLElement;
    expect(el.style.paddingLeft).toBe(`${spacing.lg}px`);
    expect(el.style.paddingRight).toBe(`${spacing.lg}px`);
  });

  it('should apply vertical padding from spacing token when py prop is provided', () => {
    // GIVEN a Box element with py="sm"

    // WHEN the component is rendered inside a theme provider
    const { container } = renderWithTheme(<Box py="sm" />);

    // THEN paddingTop and paddingBottom match the sm spacing token
    const el = container.firstChild as HTMLElement;
    expect(el.style.paddingTop).toBe(`${spacing.sm}px`);
    expect(el.style.paddingBottom).toBe(`${spacing.sm}px`);
  });

  it('should apply margin from spacing token when m prop is provided', () => {
    // GIVEN a Box element with m="xl"

    // WHEN the component is rendered inside a theme provider
    const { container } = renderWithTheme(<Box m="xl" />);

    // THEN the element's margin matches the xl spacing token
    const el = container.firstChild as HTMLElement;
    expect(el.style.margin).toBe(`${spacing.xl}px`);
  });

  it('should apply border radius from token when radius prop is provided', () => {
    // GIVEN a Box element with radius="md"

    // WHEN the component is rendered inside a theme provider
    const { container } = renderWithTheme(<Box radius="md" />);

    // THEN the element's borderRadius matches the md radius token
    const el = container.firstChild as HTMLElement;
    expect(el.style.borderRadius).toBe(`${borderRadius.md}px`);
  });

  it('should apply a background color when bg prop references a theme color token', () => {
    // GIVEN a Box element with bg="surface"

    // WHEN the component is rendered inside a theme provider
    const { container } = renderWithTheme(<Box bg="surface" />);

    // THEN the element has a backgroundColor style applied
    const el = container.firstChild as HTMLElement;
    expect(el.style.backgroundColor).toBeTruthy();
  });

  it('should apply flex style when flex prop is provided', () => {
    // GIVEN a Box element with flex={1}

    // WHEN the component is rendered inside a theme provider
    const { container } = renderWithTheme(<Box flex={1} />);

    // THEN the element's flex style contains "1"
    const el = container.firstChild as HTMLElement;
    expect(el.style.flex).toContain('1');
  });

  it('should render without error when elevation prop is provided', () => {
    // GIVEN a Box element with elevation="sm"

    // WHEN the component is rendered inside a theme provider
    const { container } = renderWithTheme(<Box elevation="sm" />);

    // THEN the element renders without error
    const el = container.firstChild as HTMLElement;
    expect(el).toBeTruthy();
  });

  it('should merge custom style with token derived styles when style prop is provided', () => {
    // GIVEN a Box element with p="md" and a custom width style

    // WHEN the component is rendered inside a theme provider
    const { container } = renderWithTheme(<Box p="md" style={{ width: 100 }} />);

    // THEN both token padding and custom width styles are applied
    const el = container.firstChild as HTMLElement;
    expect(el.style.padding).toBe(`${spacing.md}px`);
    expect(el.style.width).toBe('100px');
  });
});
