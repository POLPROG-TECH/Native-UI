import React from 'react';
import { render, screen } from '@testing-library/react';
import { Badge } from '../../src/components/Badge';
import { NativeUIProvider } from '../../src/theme';

function renderWithTheme(ui: React.ReactElement) {
  return render(<NativeUIProvider config={{ colorMode: 'light' }}>{ui}</NativeUIProvider>);
}

describe('Badge', () => {
  it('should render label text when the label prop is provided', () => {
    // GIVEN a Badge configured with a "New" label

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<Badge label="New" />);

    // THEN the label text appears in the document
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('should display capped count with plus suffix when count exceeds max', () => {
    // GIVEN a Badge configured with a count greater than its max

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<Badge count={250} max={99} />);

    // THEN the displayed text shows the capped value followed by +
    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  it('should display the raw count when count is below max', () => {
    // GIVEN a Badge configured with a count well below its max

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<Badge count={7} max={99} />);

    // THEN the displayed text equals the raw count
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('should render successfully with the info variant', () => {
    // GIVEN a Badge configured with the info variant and an "info" label

    // WHEN the component is rendered inside a theme provider
    const { container } = renderWithTheme(<Badge label="info" variant="info" />);

    // THEN the component mounts and shows the label
    expect(container).toBeTruthy();
    expect(screen.getByText('info')).toBeInTheDocument();
  });
});
