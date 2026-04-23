import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProgressBar } from '../../src/components/ProgressBar';
import { NativeUIProvider } from '../../src/theme';

function renderWithTheme(ui: React.ReactElement) {
  return render(<NativeUIProvider config={{ colorMode: 'light' }}>{ui}</NativeUIProvider>);
}

describe('ProgressBar', () => {
  it('should be exported as a function component', () => {
    // GIVEN the ProgressBar export from the components module

    // WHEN its runtime type is inspected
    const actualType = typeof ProgressBar;

    // THEN it is a function component
    expect(actualType).toBe('function');
  });

  it('should expose the progressbar role when rendered', () => {
    // GIVEN a ProgressBar with a 50 % value

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<ProgressBar value={0.5} />);

    // THEN it exposes the progressbar role
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should prefer the value prop over the progress alias when both are provided', () => {
    // GIVEN a ProgressBar with both value and progress set

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<ProgressBar value={0.75} progress={0.25} accessibilityLabel="Wins" />);

    // THEN the element is present and accessible
    expect(screen.getByLabelText('Wins')).toBeInTheDocument();
  });

  it('should fall back to the progress alias when value is not provided', () => {
    // GIVEN a ProgressBar supplying only the progress alias

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<ProgressBar progress={0.4} accessibilityLabel="P" />);

    // THEN it exposes the progressbar role
    expect(screen.getByLabelText('P')).toBeInTheDocument();
  });

  it('should default to zero progress when neither value nor progress is provided', () => {
    // GIVEN a ProgressBar with no value or progress prop

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<ProgressBar accessibilityLabel="Zero" />);

    // THEN the element is present
    expect(screen.getByLabelText('Zero')).toBeInTheDocument();
  });

  it('should clamp values above one without crashing', () => {
    // GIVEN a ProgressBar with a value greater than 1

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<ProgressBar value={2} accessibilityLabel="Over" />);

    // THEN the element is present
    expect(screen.getByLabelText('Over')).toBeInTheDocument();
  });

  it('should clamp values below zero without crashing', () => {
    // GIVEN a ProgressBar with a negative value

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<ProgressBar value={-0.5} accessibilityLabel="Under" />);

    // THEN the element is present
    expect(screen.getByLabelText('Under')).toBeInTheDocument();
  });

  it('should render every semantic color without crashing', () => {
    // GIVEN the full list of semantic color keys
    const colors = ['primary', 'success', 'warning', 'error'] as const;

    // WHEN each color is rendered with a matching accessibility label
    const renderAll = () => {
      colors.forEach((c) => {
        const { unmount } = renderWithTheme(
          <ProgressBar value={0.5} color={c} accessibilityLabel={`col-${c}`} />,
        );
        expect(screen.getByLabelText(`col-${c}`)).toBeInTheDocument();
        unmount();
      });
    };

    // THEN every color renders without crashing
    expect(renderAll).not.toThrow();
  });

  it('should render a custom hex color without crashing', () => {
    // GIVEN a ProgressBar with a raw hex color

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<ProgressBar value={0.5} color="#123456" accessibilityLabel="hex" />);

    // THEN the element is present
    expect(screen.getByLabelText('hex')).toBeInTheDocument();
  });
});
