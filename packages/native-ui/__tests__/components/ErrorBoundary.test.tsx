import React from 'react';
import { render } from '@testing-library/react';
import { ErrorBoundary, withErrorBoundary } from '../../src/components/ErrorBoundary';
import { NativeUIProvider } from '../../src/theme';

function renderWithTheme(ui: React.ReactElement) {
  return render(
    <NativeUIProvider config={{ colorMode: 'light' }}>{ui}</NativeUIProvider>,
  );
}

describe('ErrorBoundary', () => {
  it('should_be_exported_as_a_class_component', () => {
    // GIVEN the ErrorBoundary export from the components module

    // WHEN its runtime type is inspected
    const actualType = typeof ErrorBoundary;

    // THEN it is a function constructor (class)
    expect(actualType).toBe('function');
  });

  it('should_render_its_children_when_no_error_is_thrown', () => {
    // GIVEN an ErrorBoundary wrapping a benign child

    // WHEN the tree is rendered inside a theme provider
    const { getByText } = renderWithTheme(
      <ErrorBoundary>
        <span>Safe content</span>
      </ErrorBoundary>,
    );

    // THEN the child content is present in the document
    expect(getByText('Safe content')).toBeInTheDocument();
  });
});

describe('withErrorBoundary', () => {
  it('should_return_a_function_component_that_renders_the_wrapped_component', () => {
    // GIVEN a simple wrapped component
    const Base: React.FC<{ msg: string }> = ({ msg }) => <span>{msg}</span>;
    const Wrapped = withErrorBoundary(Base, { fallbackMessage: 'Boom' });

    // WHEN the wrapped component is rendered
    const { getByText } = renderWithTheme(<Wrapped msg="Hello" />);

    // THEN the wrapped component's output is present and the HOC preserves a display name
    expect(getByText('Hello')).toBeInTheDocument();
    expect(Wrapped.displayName).toBe('withErrorBoundary(Base)');
  });
});
