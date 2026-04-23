import React from 'react';
import { render } from '@testing-library/react';
import { VStack, HStack } from '../../src/primitives/Stack';
import { NativeUIProvider } from '../../src/theme';
import { spacing } from '../../src/tokens/spacing';

function renderWithTheme(ui: React.ReactElement) {
  return render(<NativeUIProvider config={{ colorMode: 'light' }}>{ui}</NativeUIProvider>);
}

describe('VStack', () => {
  it('should be exported as a function component', () => {
    // GIVEN the VStack export from the primitives module

    // WHEN its runtime type is inspected
    const actualType = typeof VStack;

    // THEN it is a function component
    expect(actualType).toBe('function');
  });

  it('should render without crashing when mounted with a child', () => {
    // GIVEN a VStack with a single child span

    // WHEN the component is rendered inside a theme provider
    const { container } = renderWithTheme(
      <VStack>
        <span>a</span>
      </VStack>,
    );

    // THEN the container has a rendered child element
    expect(container.firstChild).toBeTruthy();
  });

  it('should use column flexDirection when rendered', () => {
    // GIVEN a VStack with a single child span

    // WHEN the component is rendered inside a theme provider
    const { container } = renderWithTheme(
      <VStack>
        <span>a</span>
      </VStack>,
    );

    // THEN flexDirection is set to column
    const el = container.firstChild as HTMLElement;
    expect(el.style.flexDirection).toBe('column');
  });

  it('should apply gap from spacing token when gap prop is provided', () => {
    // GIVEN a VStack with gap="md"

    // WHEN the component is rendered inside a theme provider
    const { container } = renderWithTheme(
      <VStack gap="md">
        <span>a</span>
      </VStack>,
    );

    // THEN gap matches the md spacing token
    const el = container.firstChild as HTMLElement;
    expect(el.style.gap).toBe(`${spacing.md}px`);
  });

  it('should apply alignItems and justifyContent when align and justify props are provided', () => {
    // GIVEN a VStack with align="center" and justify="space-between"

    // WHEN the component is rendered inside a theme provider
    const { container } = renderWithTheme(
      <VStack align="center" justify="space-between">
        <span>a</span>
      </VStack>,
    );

    // THEN alignItems and justifyContent match the provided values
    const el = container.firstChild as HTMLElement;
    expect(el.style.alignItems).toBe('center');
    expect(el.style.justifyContent).toBe('space-between');
  });

  it('should apply flex style when flex prop is provided', () => {
    // GIVEN a VStack with flex={1}

    // WHEN the component is rendered inside a theme provider
    const { container } = renderWithTheme(
      <VStack flex={1}>
        <span>a</span>
      </VStack>,
    );

    // THEN the element's flex style contains "1"
    const el = container.firstChild as HTMLElement;
    expect(el.style.flex).toContain('1');
  });

  it('should apply flexWrap when wrap prop is enabled', () => {
    // GIVEN a VStack with wrap enabled

    // WHEN the component is rendered inside a theme provider
    const { container } = renderWithTheme(
      <VStack wrap>
        <span>a</span>
      </VStack>,
    );

    // THEN flexWrap is set to wrap
    const el = container.firstChild as HTMLElement;
    expect(el.style.flexWrap).toBe('wrap');
  });

  it('should apply padding and horizontal margin tokens when p and mx props are provided', () => {
    // GIVEN a VStack with p="lg" and mx="sm"

    // WHEN the component is rendered inside a theme provider
    const { container } = renderWithTheme(
      <VStack p="lg" mx="sm">
        <span>a</span>
      </VStack>,
    );

    // THEN padding and marginLeft match the respective spacing tokens
    const el = container.firstChild as HTMLElement;
    expect(el.style.padding).toBe(`${spacing.lg}px`);
    expect(el.style.marginLeft).toBe(`${spacing.sm}px`);
  });

  it('should apply background color when bg prop is provided', () => {
    // GIVEN a VStack with bg="surface"

    // WHEN the component is rendered inside a theme provider
    const { container } = renderWithTheme(
      <VStack bg="surface">
        <span>a</span>
      </VStack>,
    );

    // THEN the element has a backgroundColor style applied
    const el = container.firstChild as HTMLElement;
    expect(el.style.backgroundColor).toBeTruthy();
  });

  it('should apply border radius when radius prop is provided', () => {
    // GIVEN a VStack with radius="md"

    // WHEN the component is rendered inside a theme provider
    const { container } = renderWithTheme(
      <VStack radius="md">
        <span>a</span>
      </VStack>,
    );

    // THEN the element has a borderRadius style applied
    const el = container.firstChild as HTMLElement;
    expect(el.style.borderRadius).toBeTruthy();
  });

  it('should render all provided children when multiple children are passed', () => {
    // GIVEN a VStack with two child spans

    // WHEN the component is rendered inside a theme provider
    const { container } = renderWithTheme(
      <VStack>
        <span>one</span>
        <span>two</span>
      </VStack>,
    );

    // THEN both children are present in the rendered output
    const el = container.firstChild as HTMLElement;
    expect(el.children).toHaveLength(2);
  });
});

describe('HStack', () => {
  it('should be exported as a function component', () => {
    // GIVEN the HStack export from the primitives module

    // WHEN its runtime type is inspected
    const actualType = typeof HStack;

    // THEN it is a function component
    expect(actualType).toBe('function');
  });

  it('should render without crashing when mounted with a child', () => {
    // GIVEN an HStack with a single child span

    // WHEN the component is rendered inside a theme provider
    const { container } = renderWithTheme(
      <HStack>
        <span>a</span>
      </HStack>,
    );

    // THEN the container has a rendered child element
    expect(container.firstChild).toBeTruthy();
  });

  it('should use row flexDirection when rendered', () => {
    // GIVEN an HStack with a single child span

    // WHEN the component is rendered inside a theme provider
    const { container } = renderWithTheme(
      <HStack>
        <span>a</span>
      </HStack>,
    );

    // THEN flexDirection is set to row
    const el = container.firstChild as HTMLElement;
    expect(el.style.flexDirection).toBe('row');
  });

  it('should default alignItems to center when no align prop is provided', () => {
    // GIVEN an HStack without an align prop

    // WHEN the component is rendered inside a theme provider
    const { container } = renderWithTheme(
      <HStack>
        <span>a</span>
      </HStack>,
    );

    // THEN alignItems defaults to center
    const el = container.firstChild as HTMLElement;
    expect(el.style.alignItems).toBe('center');
  });

  it('should apply gap from spacing token when gap prop is provided', () => {
    // GIVEN an HStack with gap="sm"

    // WHEN the component is rendered inside a theme provider
    const { container } = renderWithTheme(
      <HStack gap="sm">
        <span>a</span>
      </HStack>,
    );

    // THEN gap matches the sm spacing token
    const el = container.firstChild as HTMLElement;
    expect(el.style.gap).toBe(`${spacing.sm}px`);
  });

  it('should override default alignItems when align prop is provided', () => {
    // GIVEN an HStack with align="flex-start"

    // WHEN the component is rendered inside a theme provider
    const { container } = renderWithTheme(
      <HStack align="flex-start">
        <span>a</span>
      </HStack>,
    );

    // THEN alignItems is overridden to flex-start
    const el = container.firstChild as HTMLElement;
    expect(el.style.alignItems).toBe('flex-start');
  });
});
