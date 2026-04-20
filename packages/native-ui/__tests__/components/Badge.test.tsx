import React from 'react';
import { render, screen } from '@testing-library/react';
import { Badge } from '../../src/components/Badge';
import { NativeUIProvider } from '../../src/theme';

function renderWithTheme(ui: React.ReactElement) {
  return render(
    <NativeUIProvider config={{ colorMode: 'light' }}>{ui}</NativeUIProvider>,
  );
}

describe('Badge', () => {
  it('should_render_label_text_when_the_label_prop_is_provided', () => {
    // GIVEN a Badge configured with a "New" label

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<Badge label="New" />);

    // THEN the label text appears in the document
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('should_display_capped_count_with_plus_suffix_when_count_exceeds_max', () => {
    // GIVEN a Badge configured with a count greater than its max

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<Badge count={250} max={99} />);

    // THEN the displayed text shows the capped value followed by +
    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  it('should_display_the_raw_count_when_count_is_below_max', () => {
    // GIVEN a Badge configured with a count well below its max

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<Badge count={7} max={99} />);

    // THEN the displayed text equals the raw count
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('should_render_successfully_with_the_info_variant', () => {
    // GIVEN a Badge configured with the info variant and an "info" label

    // WHEN the component is rendered inside a theme provider
    const { container } = renderWithTheme(
      <Badge label="info" variant="info" />,
    );

    // THEN the component mounts and shows the label
    expect(container).toBeTruthy();
    expect(screen.getByText('info')).toBeInTheDocument();
  });
});
