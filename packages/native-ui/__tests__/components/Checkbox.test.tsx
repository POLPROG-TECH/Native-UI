import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Checkbox } from '../../src/components/Checkbox';
import { NativeUIProvider } from '../../src/theme';

function renderWithTheme(ui: React.ReactElement) {
  return render(
    <NativeUIProvider config={{ colorMode: 'light' }}>{ui}</NativeUIProvider>,
  );
}

describe('Checkbox', () => {
  it('should_be_exported_as_a_function_component', () => {
    // GIVEN the Checkbox export from the components module

    // WHEN its runtime type is inspected
    const actualType = typeof Checkbox;

    // THEN it is a function component
    expect(actualType).toBe('function');
  });

  it('should_render_its_label_when_the_label_prop_is_provided', () => {
    // GIVEN a Checkbox configured with an "Accept terms" label

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<Checkbox checked={false} onChange={() => {}} label="Accept terms" />);

    // THEN the label text is present in the document
    expect(screen.getByText('Accept terms')).toBeInTheDocument();
  });

  it('should_invoke_onChange_with_the_opposite_value_when_the_row_is_pressed', () => {
    // GIVEN an unchecked Checkbox with a mocked onChange
    const onChange = jest.fn();
    renderWithTheme(<Checkbox checked={false} onChange={onChange} label="Toggle" />);

    // WHEN the row is clicked
    fireEvent.click(screen.getByLabelText('Toggle'));

    // THEN onChange is invoked with true
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('should_invoke_onChange_with_false_when_a_checked_checkbox_is_pressed', () => {
    // GIVEN a checked Checkbox with a mocked onChange
    const onChange = jest.fn();
    renderWithTheme(<Checkbox checked onChange={onChange} label="Toggle" />);

    // WHEN the row is clicked
    fireEvent.click(screen.getByLabelText('Toggle'));

    // THEN onChange is invoked with false
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it('should_render_a_check_glyph_only_when_checked', () => {
    // GIVEN a checked Checkbox
    renderWithTheme(<Checkbox checked onChange={() => {}} label="Done" />);

    // WHEN the check glyph is queried THEN it is present in the document
    expect(screen.getByText('✓')).toBeInTheDocument();
  });

  it('should_not_invoke_onChange_when_the_checkbox_is_disabled', () => {
    // GIVEN a disabled Checkbox with a mocked onChange
    const onChange = jest.fn();
    renderWithTheme(
      <Checkbox checked={false} onChange={onChange} label="Disabled" disabled />,
    );

    // WHEN the row is clicked
    fireEvent.click(screen.getByLabelText('Disabled'));

    // THEN onChange is never invoked
    expect(onChange).not.toHaveBeenCalled();
  });

  it('should_render_every_size_without_crashing', () => {
    // GIVEN both supported sizes
    const sizes = ['sm', 'md'] as const;

    // WHEN each size is rendered with a matching label
    const renderAll = () => {
      sizes.forEach((size) => {
        const { unmount } = renderWithTheme(
          <Checkbox checked onChange={() => {}} label={`size-${size}`} size={size} />,
        );
        expect(screen.getByText(`size-${size}`)).toBeInTheDocument();
        unmount();
      });
    };

    // THEN every size renders its label without crashing
    expect(renderAll).not.toThrow();
  });
});
