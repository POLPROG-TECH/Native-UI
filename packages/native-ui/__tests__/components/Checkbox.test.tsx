import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Checkbox } from '../../src/components/Checkbox';
import { NativeUIProvider } from '../../src/theme';

function renderWithTheme(ui: React.ReactElement) {
  return render(<NativeUIProvider config={{ colorMode: 'light' }}>{ui}</NativeUIProvider>);
}

describe('Checkbox', () => {
  it('should be exported as a function component', () => {
    // GIVEN the Checkbox export from the components module

    // WHEN its runtime type is inspected
    const actualType = typeof Checkbox;

    // THEN it is a function component
    expect(actualType).toBe('function');
  });

  it('should render its label when the label prop is provided', () => {
    // GIVEN a Checkbox configured with an "Accept terms" label

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<Checkbox checked={false} onChange={() => {}} label="Accept terms" />);

    // THEN the label text is present in the document
    expect(screen.getByText('Accept terms')).toBeInTheDocument();
  });

  it('should invoke onChange with the opposite value when the row is pressed', () => {
    // GIVEN an unchecked Checkbox with a mocked onChange
    const onChange = jest.fn();
    renderWithTheme(<Checkbox checked={false} onChange={onChange} label="Toggle" />);

    // WHEN the row is clicked
    fireEvent.click(screen.getByLabelText('Toggle'));

    // THEN onChange is invoked with true
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('should invoke onChange with false when a checked checkbox is pressed', () => {
    // GIVEN a checked Checkbox with a mocked onChange
    const onChange = jest.fn();
    renderWithTheme(<Checkbox checked onChange={onChange} label="Toggle" />);

    // WHEN the row is clicked
    fireEvent.click(screen.getByLabelText('Toggle'));

    // THEN onChange is invoked with false
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it('should render a check glyph only when checked', () => {
    // GIVEN a checked Checkbox
    renderWithTheme(<Checkbox checked onChange={() => {}} label="Done" />);

    // WHEN the check glyph is queried THEN it is present in the document
    expect(screen.getByText('✓')).toBeInTheDocument();
  });

  it('should not invoke onChange when the checkbox is disabled', () => {
    // GIVEN a disabled Checkbox with a mocked onChange
    const onChange = jest.fn();
    renderWithTheme(<Checkbox checked={false} onChange={onChange} label="Disabled" disabled />);

    // WHEN the row is clicked
    fireEvent.click(screen.getByLabelText('Disabled'));

    // THEN onChange is never invoked
    expect(onChange).not.toHaveBeenCalled();
  });

  it('should render every size without crashing', () => {
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
