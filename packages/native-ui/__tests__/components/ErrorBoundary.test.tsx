import React from 'react';
import { ErrorBoundary, withErrorBoundary } from '../../src/components/ErrorBoundary';
import { NativeUIProvider } from '../../src/theme';
import { renderWithTheme } from '../test-utils';

describe('ErrorBoundary', () => {
  describe('GIVEN the ErrorBoundary export from the components module', () => {
    describe('WHEN its runtime type is inspected', () => {
      it('THEN it is a function constructor (class)', () => {
        const actualType = typeof ErrorBoundary;

        expect(actualType).toBe('function');
      });
    });
  });

  describe('GIVEN an ErrorBoundary wrapping a benign child', () => {
    describe('WHEN the tree is rendered inside a theme provider', () => {
      it('THEN the child content is present in the document', () => {
        const { getByText } = renderWithTheme(
          <ErrorBoundary>
            <span>Safe content</span>
          </ErrorBoundary>,
        );

        expect(getByText('Safe content')).toBeInTheDocument();
      });
    });
  });
});

describe('ErrorBoundary resetKeys', () => {
  /* Silence React's error logging during intentional render-error tests. */
  let errorSpy: jest.SpyInstance;
  beforeEach(() => {
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    errorSpy.mockRestore();
  });

  function Thrower({ shouldThrow }: { shouldThrow: boolean }) {
    if (shouldThrow) {
      throw new Error('boom');
    }

    return <span>OK</span>;
  }

  describe('GIVEN a boundary rendering a thrower with initial resetKeys=[1]', () => {
    describe('WHEN the resetKeys array changes and the throw condition clears', () => {
      it('THEN the fallback is cleared and children re-render', () => {
        const { rerender, queryByText, getByText } = renderWithTheme(
          <ErrorBoundary resetKeys={[1]}>
            <Thrower shouldThrow />
          </ErrorBoundary>,
        );
        expect(getByText('Try again')).toBeInTheDocument();

        rerender(
          <NativeUIProvider config={{ colorMode: 'light' }}>
            <ErrorBoundary resetKeys={[2]}>
              <Thrower shouldThrow={false} />
            </ErrorBoundary>
          </NativeUIProvider>,
        );

        expect(queryByText('Try again')).not.toBeInTheDocument();
        expect(getByText('OK')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a boundary rendering a thrower with no resetKeys', () => {
    describe('WHEN resetKeys is introduced (undefined → [1]) and the throw clears', () => {
      it('THEN the boundary treats presence change as a key change and resets', () => {
        const { rerender, queryByText, getByText } = renderWithTheme(
          <ErrorBoundary>
            <Thrower shouldThrow />
          </ErrorBoundary>,
        );
        expect(getByText('Try again')).toBeInTheDocument();

        rerender(
          <NativeUIProvider config={{ colorMode: 'light' }}>
            <ErrorBoundary resetKeys={[1]}>
              <Thrower shouldThrow={false} />
            </ErrorBoundary>
          </NativeUIProvider>,
        );

        expect(queryByText('Try again')).not.toBeInTheDocument();
        expect(getByText('OK')).toBeInTheDocument();
      });
    });
  });
});

describe('withErrorBoundary', () => {
  describe('GIVEN a simple wrapped component', () => {
    describe('WHEN the wrapped component is rendered', () => {
      it("THEN the wrapped component's output is present and the HOC preserves a display name", () => {
        const Base: React.FC<{ msg: string }> = ({ msg }) => <span>{msg}</span>;
        const Wrapped = withErrorBoundary(Base, { fallbackMessage: 'Boom' });

        const { getByText } = renderWithTheme(<Wrapped msg="Hello" />);

        expect(getByText('Hello')).toBeInTheDocument();
        expect(Wrapped.displayName).toBe('withErrorBoundary(Base)');
      });
    });
  });

  describe('GIVEN an anonymous component with no display name', () => {
    describe('WHEN it is wrapped', () => {
      it('THEN the HOC falls back to a generic component name', () => {
        const Wrapped = withErrorBoundary(() => <span>Hi</span>);

        expect(Wrapped.displayName).toBe('withErrorBoundary(Component)');
      });
    });
  });
});
