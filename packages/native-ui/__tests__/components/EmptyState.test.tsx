import React from 'react';
import { render, screen } from '@testing-library/react';
import { Text } from 'react-native';
import { EmptyState } from '../../src/components/EmptyState';
import { NativeUIProvider } from '../../src/theme';

function renderWithTheme(ui: React.ReactElement) {
  return render(<NativeUIProvider config={{ colorMode: 'light' }}>{ui}</NativeUIProvider>);
}

describe('EmptyState', () => {
  it('should be exported as a function component', () => {
    // GIVEN the EmptyState export from the components module

    // WHEN its runtime type is inspected
    const actualType = typeof EmptyState;

    // THEN it is a function component
    expect(actualType).toBe('function');
  });

  it('should render the title when only a title is provided', () => {
    // GIVEN an EmptyState with just a title

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<EmptyState title="Nothing here" />);

    // THEN the title text is present in the document
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });

  it('should render the icon when the icon prop is provided', () => {
    // GIVEN an EmptyState with an "📭" icon

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<EmptyState icon="📭" title="No mail" />);

    // THEN the icon glyph is present
    expect(screen.getByText('📭')).toBeInTheDocument();
  });

  it('should render the message when the message prop is provided', () => {
    // GIVEN an EmptyState with a message

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<EmptyState title="Caught up" message="You are all caught up!" />);

    // THEN the message text is present
    expect(screen.getByText('You are all caught up!')).toBeInTheDocument();
  });

  it('should render the action element when the action prop is provided', () => {
    // GIVEN an EmptyState with a custom action element

    // WHEN the component is rendered inside a theme provider
    renderWithTheme(<EmptyState title="Empty" action={<Text>Refresh</Text>} />);

    // THEN the action element is present
    expect(screen.getByText('Refresh')).toBeInTheDocument();
  });

  it('should not render an icon when no icon is provided', () => {
    // GIVEN an EmptyState without an icon

    // WHEN the component is rendered inside a theme provider
    const { container } = renderWithTheme(<EmptyState title="Empty" />);

    // THEN the rendered DOM does not contain any common test-emoji glyph
    expect(container.textContent).toBe('Empty');
  });
});
