import React from 'react';
import { render } from '@testing-library/react';
import { ErrorBoundary, withErrorBoundary } from '../../src/components/ErrorBoundary';
import { NativeUIProvider } from '../../src/theme';

function renderWithTheme(ui: React.ReactElement) {
  return render(<NativeUIProvider config={{ colorMode: 'light' }}>{ui}</NativeUIProvider>);
}

describe('ErrorBoundary', () => {
  it('should be exported as a class component', () => {
    // GIVEN the ErrorBoundary export from the components module

    // WHEN its runtime type is inspected
    const actualType = typeof ErrorBoundary;

    // THEN it is a function constructor (class)
    expect(actualType).toBe('function');
  });

  it('should render its children when no error is thrown', () => {
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

describe('ErrorBoundary resetKeys', () => {
  // Silence React's error logging during intentional render-error tests.
  let errorSpy: jest.SpyInstance;
  beforeEach(() => {
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    errorSpy.mockRestore();
  });

  function Thrower({ shouldThrow }: { shouldThrow: boolean }) {
    if (shouldThrow) throw new Error('boom');

    return <span>OK</span>;
  }

  it('should reset when resetKeys contents change', () => {
    // GIVEN a boundary rendering a thrower with initial resetKeys=[1]
    const { rerender, queryByText, getByText } = renderWithTheme(
      <ErrorBoundary resetKeys={[1]}>
        <Thrower shouldThrow />
      </ErrorBoundary>,
    );
    expect(getByText('Try again')).toBeInTheDocument();

    // WHEN the resetKeys array changes and the throw condition clears
    rerender(
      <NativeUIProvider config={{ colorMode: 'light' }}>
        <ErrorBoundary resetKeys={[2]}>
          <Thrower shouldThrow={false} />
        </ErrorBoundary>
      </NativeUIProvider>,
    );

    // THEN the fallback is cleared and children re-render
    expect(queryByText('Try again')).not.toBeInTheDocument();
    expect(getByText('OK')).toBeInTheDocument();
  });

  it('should reset when resetKeys presence changes from undefined to defined', () => {
    // GIVEN a boundary rendering a thrower with no resetKeys
    const { rerender, queryByText, getByText } = renderWithTheme(
      <ErrorBoundary>
        <Thrower shouldThrow />
      </ErrorBoundary>,
    );
    expect(getByText('Try again')).toBeInTheDocument();

    // WHEN resetKeys is introduced (undefined → [1]) and the throw clears
    rerender(
      <NativeUIProvider config={{ colorMode: 'light' }}>
        <ErrorBoundary resetKeys={[1]}>
          <Thrower shouldThrow={false} />
        </ErrorBoundary>
      </NativeUIProvider>,
    );

    // THEN the boundary treats presence change as a key change and resets
    expect(queryByText('Try again')).not.toBeInTheDocument();
    expect(getByText('OK')).toBeInTheDocument();
  });
});

describe('withErrorBoundary', () => {
  it('should return a function component that renders the wrapped component', () => {
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
