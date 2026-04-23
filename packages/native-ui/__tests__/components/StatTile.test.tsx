import React from 'react';
import { render, screen } from '@testing-library/react';
import { StatTile } from '../../src/components/StatTile';
import { NativeUIProvider } from '../../src/theme';

function renderWithTheme(ui: React.ReactElement) {
  return render(<NativeUIProvider config={{ colorMode: 'light' }}>{ui}</NativeUIProvider>);
}

describe('StatTile', () => {
  it('should be exported as a function component', () => {
    // GIVEN the StatTile export from the components module

    // WHEN its runtime type is inspected
    const actualType = typeof StatTile;

    // THEN it is a function component
    expect(actualType).toBe('function');
  });

  it('should render the label and value when rendered', () => {
    // GIVEN a StatTile with a "TIME" label and a "01:24" value

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<StatTile label="TIME" value="01:24" />);

    // THEN both the label and the value are present
    expect(screen.getByText('TIME')).toBeInTheDocument();
    expect(screen.getByText('01:24')).toBeInTheDocument();
  });

  it('should render the caption when provided', () => {
    // GIVEN a StatTile with a caption

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<StatTile label="BEST" value="358" caption="new record" />);

    // THEN the caption text is present
    expect(screen.getByText('new record')).toBeInTheDocument();
  });

  it('should render every tone without crashing', () => {
    // GIVEN the full list of StatTile tones
    const tones = ['neutral', 'primary', 'success', 'warning', 'error'] as const;

    // WHEN each tone is rendered with a matching label
    const renderAll = () => {
      tones.forEach((tone) => {
        const { unmount } = renderWithTheme(
          <StatTile label={`tone-${tone}`} value="1" tone={tone} />,
        );
        expect(screen.getByText(`tone-${tone}`)).toBeInTheDocument();
        unmount();
      });
    };

    // THEN every tone renders without crashing
    expect(renderAll).not.toThrow();
  });

  it('should render every size in mono and non mono modes without crashing', () => {
    // GIVEN the full list of sizes combined with the mono flag
    const sizes = ['sm', 'md', 'lg'] as const;

    // WHEN each size is rendered for both mono=true and mono=false
    const renderAll = () => {
      sizes.forEach((size) => {
        [true, false].forEach((mono) => {
          const label = `${size}-${String(mono)}`;
          const { unmount } = renderWithTheme(
            <StatTile label={label} value="1" size={size} mono={mono} />,
          );
          expect(screen.getByText(label)).toBeInTheDocument();
          unmount();
        });
      });
    };

    // THEN every combination renders without crashing
    expect(renderAll).not.toThrow();
  });

  it('should render a left aligned variant without crashing', () => {
    // GIVEN a StatTile configured with align="left"

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<StatTile label="L" value="1" align="left" />);

    // THEN the label is present
    expect(screen.getByText('L')).toBeInTheDocument();
  });
});
