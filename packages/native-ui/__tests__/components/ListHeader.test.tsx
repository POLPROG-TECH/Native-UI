import React from 'react';
import { render, screen } from '@testing-library/react';
import { ListHeader } from '../../src/components/ListHeader';
import { NativeUIProvider } from '../../src/theme';

function renderWithTheme(ui: React.ReactElement) {
  return render(
    <NativeUIProvider config={{ colorMode: 'light' }}>{ui}</NativeUIProvider>,
  );
}

describe('ListHeader', () => {
  it('should_be_exported_as_a_function_component', () => {
    // GIVEN the ListHeader export from the components module

    // WHEN its runtime type is inspected
    const actualType = typeof ListHeader;

    // THEN it is a function component
    expect(actualType).toBe('function');
  });

  it('should_render_the_title_as_a_heading_when_rendered', () => {
    // GIVEN a ListHeader with a "Settings" title

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<ListHeader title="Settings" />);

    // THEN the heading is present in the document
    expect(screen.getByRole('header')).toHaveTextContent('Settings');
  });

  it('should_render_the_subtitle_when_provided', () => {
    // GIVEN a ListHeader with a subtitle

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<ListHeader title="Home" subtitle="Welcome back" />);

    // THEN the subtitle text is present
    expect(screen.getByText('Welcome back')).toBeInTheDocument();
  });

  it('should_pass_the_title_verbatim_when_a_text_transform_string_is_provided', () => {
    // GIVEN a ListHeader configured with an uppercase transform

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<ListHeader title="hello" transform="uppercase" />);

    // THEN the visible text matches the original (transform is a CSS style)
    expect(screen.getByText('hello')).toBeInTheDocument();
  });

  it('should_apply_a_function_transform_to_the_title_when_one_is_provided', () => {
    // GIVEN a ListHeader whose transform function reverses the title

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(
      <ListHeader title="abc" transform={(s) => s.split('').reverse().join('')} />,
    );

    // THEN the displayed title is the transformed value
    expect(screen.getByText('cba')).toBeInTheDocument();
  });

  it('should_render_the_title_unchanged_when_transform_is_set_to_none', () => {
    // GIVEN a ListHeader with transform="none"

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<ListHeader title="Plain" transform="none" />);

    // THEN the title appears unchanged
    expect(screen.getByText('Plain')).toBeInTheDocument();
  });

  it('should_render_every_string_transform_without_crashing', () => {
    // GIVEN the full list of string-based transforms
    const transforms = ['uppercase', 'lowercase', 'capitalize', 'none'] as const;

    // WHEN each transform is rendered with a matching title
    const renderAll = () => {
      transforms.forEach((t) => {
        const { unmount } = renderWithTheme(<ListHeader title={`t-${t}`} transform={t} />);
        expect(screen.getByText(`t-${t}`)).toBeInTheDocument();
        unmount();
      });
    };

    // THEN every transform renders without crashing
    expect(renderAll).not.toThrow();
  });
});
