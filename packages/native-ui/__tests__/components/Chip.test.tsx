import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Text } from 'react-native';
import { Chip, ChipGroup } from '../../src/components/Chip';
import { NativeUIProvider } from '../../src/theme';

function renderWithTheme(ui: React.ReactElement) {
  return render(
    <NativeUIProvider config={{ colorMode: 'light' }}>{ui}</NativeUIProvider>,
  );
}

describe('Chip', () => {
  it('should_be_exported_as_a_function_component', () => {
    // GIVEN the Chip export from the components module

    // WHEN its runtime type is inspected
    const actualType = typeof Chip;

    // THEN it is a function component
    expect(actualType).toBe('function');
  });

  it('should_render_the_label_when_the_label_prop_is_provided', () => {
    // GIVEN a Chip configured with a "Filter" label

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<Chip label="Filter" />);

    // THEN the label text is present in the document
    expect(screen.getByText('Filter')).toBeInTheDocument();
  });

  it('should_invoke_onPress_when_the_chip_is_pressed', () => {
    // GIVEN a Chip with a mocked onPress callback
    const onPress = jest.fn();
    renderWithTheme(<Chip label="Click" onPress={onPress} />);

    // WHEN the chip is clicked
    fireEvent.click(screen.getByLabelText('Click'));

    // THEN onPress is called exactly once
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should_render_the_string_icon_when_icon_prop_is_provided', () => {
    // GIVEN a Chip with a "🔥" icon and a "Hot" label
    renderWithTheme(<Chip label="Hot" icon="🔥" />);

    // WHEN the component is rendered THEN both the icon and the label appear
    expect(screen.getByText('🔥')).toBeInTheDocument();
    expect(screen.getByText('Hot')).toBeInTheDocument();
  });

  it('should_prefer_renderIcon_over_icon_when_both_are_provided', () => {
    // GIVEN a Chip supplying both a string icon and a renderIcon render prop
    renderWithTheme(
      <Chip
        label="Tag"
        icon="★"
        renderIcon={() => <span data-testid="custom-icon">custom</span>}
      />,
    );

    // WHEN the component is rendered THEN only the custom render prop output is present
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    expect(screen.queryByText('★')).not.toBeInTheDocument();
  });

  it('should_render_every_chip_shape_without_crashing', () => {
    // GIVEN the full list of Chip shapes
    const shapes = ['pill', 'rounded', 'square'] as const;

    // WHEN each shape is rendered with a matching label
    const renderAll = () => {
      shapes.forEach((shape) => {
        const { unmount } = renderWithTheme(<Chip label={`shape-${shape}`} shape={shape} />);
        expect(screen.getByText(`shape-${shape}`)).toBeInTheDocument();
        unmount();
      });
    };

    // THEN every shape renders its label without crashing
    expect(renderAll).not.toThrow();
  });

  it('should_render_every_variant_selected_and_unselected_without_crashing', () => {
    // GIVEN the full list of Chip variants in both selection states
    const variants = ['solid', 'soft', 'outline'] as const;

    // WHEN each variant is rendered both selected and unselected
    const renderAll = () => {
      variants.forEach((variant) => {
        [false, true].forEach((selected) => {
          const label = `${variant}-${String(selected)}`;
          const { unmount } = renderWithTheme(
            <Chip label={label} variant={variant} selected={selected} />,
          );
          expect(screen.getByText(label)).toBeInTheDocument();
          unmount();
        });
      });
    };

    // THEN every variant renders its label without crashing
    expect(renderAll).not.toThrow();
  });

  it('should_render_every_size_without_crashing', () => {
    // GIVEN both supported sizes
    const sizes = ['sm', 'md'] as const;

    // WHEN each size is rendered with a matching label
    const renderAll = () => {
      sizes.forEach((size) => {
        const { unmount } = renderWithTheme(<Chip label={`size-${size}`} size={size} />);
        expect(screen.getByText(`size-${size}`)).toBeInTheDocument();
        unmount();
      });
    };

    // THEN every size renders its label without crashing
    expect(renderAll).not.toThrow();
  });

  it('should_not_invoke_onPress_when_the_chip_is_disabled', () => {
    // GIVEN a disabled Chip with a mocked onPress
    const onPress = jest.fn();
    renderWithTheme(<Chip label="Nope" onPress={onPress} disabled />);

    // WHEN the chip is clicked
    fireEvent.click(screen.getByLabelText('Nope'));

    // THEN onPress is never invoked
    expect(onPress).not.toHaveBeenCalled();
  });
});

describe('ChipGroup', () => {
  it('should_render_all_child_chips_when_composed_inside_a_group', () => {
    // GIVEN a ChipGroup wrapping two Chips

    // WHEN the composition is rendered inside a theme provider
    renderWithTheme(
      <ChipGroup>
        <Chip label="One" />
        <Chip label="Two" />
      </ChipGroup>,
    );

    // THEN both chip labels appear
    expect(screen.getByText('One')).toBeInTheDocument();
    expect(screen.getByText('Two')).toBeInTheDocument();
  });

  it('should_render_arbitrary_children_without_crashing', () => {
    // GIVEN a ChipGroup wrapping a plain Text child

    // WHEN the composition is rendered inside a theme provider
    renderWithTheme(
      <ChipGroup>
        <Text>Plain</Text>
      </ChipGroup>,
    );

    // THEN the child text is present
    expect(screen.getByText('Plain')).toBeInTheDocument();
  });
});
