import React from 'react';
import { render, screen } from '@testing-library/react';
import { ListSection } from '../../src/components/ListSection';
import { ListItem } from '../../src/components/ListItem';
import { NativeUIProvider } from '../../src/theme';

function renderWithTheme(ui: React.ReactElement) {
  return render(
    <NativeUIProvider config={{ colorMode: 'light' }}>{ui}</NativeUIProvider>,
  );
}

describe('ListSection', () => {
  it('should_be_exported_as_a_function_component', () => {
    // GIVEN the ListSection export from the components module

    // WHEN its runtime type is inspected
    const actualType = typeof ListSection;

    // THEN it is a function component
    expect(actualType).toBe('function');
  });

  it('should_render_the_title_when_provided', () => {
    // GIVEN a ListSection with a title

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(
      <ListSection title="Account">
        <ListItem title="Profile" />
      </ListSection>,
    );

    // THEN the title text is present
    expect(screen.getByText('Account')).toBeInTheDocument();
  });

  it('should_render_the_footer_when_provided', () => {
    // GIVEN a ListSection with a footer

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(
      <ListSection footer="Need help? Contact support.">
        <ListItem title="Profile" />
      </ListSection>,
    );

    // THEN the footer text is present
    expect(screen.getByText('Need help? Contact support.')).toBeInTheDocument();
  });

  it('should_render_all_children_in_default_non_grouped_mode', () => {
    // GIVEN a non-grouped ListSection wrapping two list items

    // WHEN the section is rendered inside a theme provider
    renderWithTheme(
      <ListSection>
        <ListItem title="Alpha" />
        <ListItem title="Beta" />
      </ListSection>,
    );

    // THEN both list items are present
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
  });

  it('should_render_all_children_in_grouped_mode', () => {
    // GIVEN a grouped ListSection wrapping three list items

    // WHEN the section is rendered inside a theme provider
    renderWithTheme(
      <ListSection grouped>
        <ListItem title="Alpha" />
        <ListItem title="Beta" />
        <ListItem title="Gamma" />
      </ListSection>,
    );

    // THEN every list item is present
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
    expect(screen.getByText('Gamma')).toBeInTheDocument();
  });
});
