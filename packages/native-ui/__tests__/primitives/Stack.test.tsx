import React from 'react';
import { render } from '@testing-library/react';
import { VStack, HStack } from '../../src/primitives/Stack';
import { NativeUIProvider } from '../../src/theme';
import { spacing } from '../../src/tokens/spacing';

function renderWithTheme(ui: React.ReactElement) {
  return render(
    <NativeUIProvider config={{ colorMode: 'light' }}>
      {ui}
    </NativeUIProvider>,
  );
}

describe('VStack', () => {
  it('should_be_exported_as_a_function_component', () => {
    // GIVEN the VStack export from the primitives module

    // WHEN its runtime type is inspected
    const actualType = typeof VStack;

    // THEN it is a function component
    expect(actualType).toBe('function');
  });

  it('should_render_without_crashing_when_mounted_with_a_child', () => {
    // GIVEN a VStack with a single child span

    // WHEN the component is rendered inside a theme provider
    const { container } = renderWithTheme(<VStack><span>a</span></VStack>);

    // THEN the container has a rendered child element
    expect(container.firstChild).toBeTruthy();
  });

  it('should_use_column_flexDirection_when_rendered', () => {
    // GIVEN a VStack with a single child span

    // WHEN the component is rendered inside a theme provider
    const { container } = renderWithTheme(<VStack><span>a</span></VStack>);

    // THEN flexDirection is set to column
    const el = container.firstChild as HTMLElement;
    expect(el.style.flexDirection).toBe('column');
  });

  it('should_apply_gap_from_spacing_token_when_gap_prop_is_provided', () => {
    // GIVEN a VStack with gap="md"

    // WHEN the component is rendered inside a theme provider
    const { container } = renderWithTheme(<VStack gap="md"><span>a</span></VStack>);

    // THEN gap matches the md spacing token
    const el = container.firstChild as HTMLElement;
    expect(el.style.gap).toBe(`${spacing.md}px`);
  });

  it('should_apply_alignItems_and_justifyContent_when_align_and_justify_props_are_provided', () => {
    // GIVEN a VStack with align="center" and justify="space-between"

    // WHEN the component is rendered inside a theme provider
    const { container } = renderWithTheme(
      <VStack align="center" justify="space-between"><span>a</span></VStack>,
    );

    // THEN alignItems and justifyContent match the provided values
    const el = container.firstChild as HTMLElement;
    expect(el.style.alignItems).toBe('center');
    expect(el.style.justifyContent).toBe('space-between');
  });

  it('should_apply_flex_style_when_flex_prop_is_provided', () => {
    // GIVEN a VStack with flex={1}

    // WHEN the component is rendered inside a theme provider
    const { container } = renderWithTheme(<VStack flex={1}><span>a</span></VStack>);

    // THEN the element's flex style contains "1"
    const el = container.firstChild as HTMLElement;
    expect(el.style.flex).toContain('1');
  });

  it('should_apply_flexWrap_when_wrap_prop_is_enabled', () => {
    // GIVEN a VStack with wrap enabled

    // WHEN the component is rendered inside a theme provider
    const { container } = renderWithTheme(<VStack wrap><span>a</span></VStack>);

    // THEN flexWrap is set to wrap
    const el = container.firstChild as HTMLElement;
    expect(el.style.flexWrap).toBe('wrap');
  });

  it('should_apply_padding_and_horizontal_margin_tokens_when_p_and_mx_props_are_provided', () => {
    // GIVEN a VStack with p="lg" and mx="sm"

    // WHEN the component is rendered inside a theme provider
    const { container } = renderWithTheme(<VStack p="lg" mx="sm"><span>a</span></VStack>);

    // THEN padding and marginLeft match the respective spacing tokens
    const el = container.firstChild as HTMLElement;
    expect(el.style.padding).toBe(`${spacing.lg}px`);
    expect(el.style.marginLeft).toBe(`${spacing.sm}px`);
  });

  it('should_apply_background_color_when_bg_prop_is_provided', () => {
    // GIVEN a VStack with bg="surface"

    // WHEN the component is rendered inside a theme provider
    const { container } = renderWithTheme(<VStack bg="surface"><span>a</span></VStack>);

    // THEN the element has a backgroundColor style applied
    const el = container.firstChild as HTMLElement;
    expect(el.style.backgroundColor).toBeTruthy();
  });

  it('should_apply_border_radius_when_radius_prop_is_provided', () => {
    // GIVEN a VStack with radius="md"

    // WHEN the component is rendered inside a theme provider
    const { container } = renderWithTheme(<VStack radius="md"><span>a</span></VStack>);

    // THEN the element has a borderRadius style applied
    const el = container.firstChild as HTMLElement;
    expect(el.style.borderRadius).toBeTruthy();
  });

  it('should_render_all_provided_children_when_multiple_children_are_passed', () => {
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
  it('should_be_exported_as_a_function_component', () => {
    // GIVEN the HStack export from the primitives module

    // WHEN its runtime type is inspected
    const actualType = typeof HStack;

    // THEN it is a function component
    expect(actualType).toBe('function');
  });

  it('should_render_without_crashing_when_mounted_with_a_child', () => {
    // GIVEN an HStack with a single child span

    // WHEN the component is rendered inside a theme provider
    const { container } = renderWithTheme(<HStack><span>a</span></HStack>);

    // THEN the container has a rendered child element
    expect(container.firstChild).toBeTruthy();
  });

  it('should_use_row_flexDirection_when_rendered', () => {
    // GIVEN an HStack with a single child span

    // WHEN the component is rendered inside a theme provider
    const { container } = renderWithTheme(<HStack><span>a</span></HStack>);

    // THEN flexDirection is set to row
    const el = container.firstChild as HTMLElement;
    expect(el.style.flexDirection).toBe('row');
  });

  it('should_default_alignItems_to_center_when_no_align_prop_is_provided', () => {
    // GIVEN an HStack without an align prop

    // WHEN the component is rendered inside a theme provider
    const { container } = renderWithTheme(<HStack><span>a</span></HStack>);

    // THEN alignItems defaults to center
    const el = container.firstChild as HTMLElement;
    expect(el.style.alignItems).toBe('center');
  });

  it('should_apply_gap_from_spacing_token_when_gap_prop_is_provided', () => {
    // GIVEN an HStack with gap="sm"

    // WHEN the component is rendered inside a theme provider
    const { container } = renderWithTheme(<HStack gap="sm"><span>a</span></HStack>);

    // THEN gap matches the sm spacing token
    const el = container.firstChild as HTMLElement;
    expect(el.style.gap).toBe(`${spacing.sm}px`);
  });

  it('should_override_default_alignItems_when_align_prop_is_provided', () => {
    // GIVEN an HStack with align="flex-start"

    // WHEN the component is rendered inside a theme provider
    const { container } = renderWithTheme(<HStack align="flex-start"><span>a</span></HStack>);

    // THEN alignItems is overridden to flex-start
    const el = container.firstChild as HTMLElement;
    expect(el.style.alignItems).toBe('flex-start');
  });
});
