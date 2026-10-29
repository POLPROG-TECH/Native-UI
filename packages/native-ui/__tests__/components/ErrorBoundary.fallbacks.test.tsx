import { ErrorBoundary, withErrorBoundary } from '../../src/components/ErrorBoundary';
import { fireEvent, renderWithTheme, screen } from '../test-utils';

const failure = new Error('Profile failed to load');

/**
 * A child that throws until `recover()` is called, so a test controls when a
 * retry can succeed (React may re-render a failing child more than once).
 */
function createFlakyChild() {
  const health = { failing: true };

  function FlakyChild() {
    if (health.failing) {
      throw failure;
    }

    return <span>Profile</span>;
  }

  return {
    FlakyChild,
    recover: () => {
      health.failing = false;
    },
  };
}

function AlwaysThrows(): never {
  throw failure;
}

function RetryFallback({ error, reset }: { error: Error; reset: () => void }) {
  return <button onClick={reset}>{`Retry after: ${error.message}`}</button>;
}

describe('ErrorBoundary fallbacks', () => {
  /* Silence React's error logging during intentional render-error tests. */
  let errorSpy: jest.SpyInstance;
  beforeEach(() => {
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    errorSpy.mockRestore();
  });

  describe('GIVEN both a static fallback and a renderFallback', () => {
    describe('WHEN a child throws', () => {
      it('THEN the static fallback wins and renderFallback is not called', () => {
        const renderFallback = jest.fn(() => <span>Rendered fallback</span>);

        renderWithTheme(
          <ErrorBoundary fallback={<span>Static fallback</span>} renderFallback={renderFallback}>
            <AlwaysThrows />
          </ErrorBoundary>,
        );

        expect(screen.getByText('Static fallback')).toBeInTheDocument();
        expect(renderFallback).not.toHaveBeenCalled();
      });
    });
  });

  describe('GIVEN a renderFallback and a child that fails only once', () => {
    describe('WHEN the child throws and the user presses the fallback retry', () => {
      it('THEN the fallback sees the error and its reset re-renders the child', () => {
        const { FlakyChild, recover } = createFlakyChild();
        renderWithTheme(
          <ErrorBoundary
            renderFallback={(error, reset) => <RetryFallback error={error} reset={reset} />}
          >
            <FlakyChild />
          </ErrorBoundary>,
        );
        const retry = screen.getByRole('button', { name: 'Retry after: Profile failed to load' });

        recover();
        fireEvent.click(retry);

        expect(screen.getByText('Profile')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN an onError reporter', () => {
    describe('WHEN a child throws', () => {
      it('THEN the reporter receives the error and the component stack', () => {
        const onError = jest.fn();

        renderWithTheme(
          <ErrorBoundary onError={onError}>
            <AlwaysThrows />
          </ErrorBoundary>,
        );

        expect(onError).toHaveBeenCalledWith(
          failure,
          expect.objectContaining({ componentStack: expect.any(String) }),
        );
      });
    });
  });

  describe('GIVEN an onError reporter that itself throws', () => {
    describe('WHEN a child throws', () => {
      it('THEN the boundary still shows its default fallback', () => {
        const onError = jest.fn(() => {
          throw new Error('reporter offline');
        });

        renderWithTheme(
          <ErrorBoundary onError={onError} fallbackMessage="Could not load the profile.">
            <AlwaysThrows />
          </ErrorBoundary>,
        );

        expect(onError).toHaveBeenCalledTimes(1);
        expect(screen.getByText('Could not load the profile.')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN the default fallback with a custom retry label', () => {
    describe('WHEN the user presses retry after a one-off failure', () => {
      it('THEN the child renders again', () => {
        const { FlakyChild, recover } = createFlakyChild();
        renderWithTheme(
          <ErrorBoundary retryLabel="Reload profile">
            <FlakyChild />
          </ErrorBoundary>,
        );

        recover();
        fireEvent.click(screen.getByRole('button', { name: 'Reload profile' }));

        expect(screen.getByText('Profile')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN the default fallback with `fallbackIcon={null}`', () => {
    describe('WHEN a child throws', () => {
      it('THEN the message shows without the default alert icon', () => {
        renderWithTheme(
          <ErrorBoundary fallbackIcon={null} fallbackMessage="Something broke.">
            <AlwaysThrows />
          </ErrorBoundary>,
        );

        expect(screen.getByText('Something broke.')).toBeInTheDocument();
        expect(screen.queryByTestId('error-boundary-icon')).not.toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a component with a displayName wrapped without options', () => {
    describe('WHEN the wrapped component throws', () => {
      it('THEN the default fallback shows and the HOC name uses the displayName', () => {
        function Inner(): never {
          throw failure;
        }

        Inner.displayName = 'ProfileCard';
        const Wrapped = withErrorBoundary(Inner);

        renderWithTheme(<Wrapped />);

        expect(Wrapped.displayName).toBe('withErrorBoundary(ProfileCard)');
        expect(screen.getByTestId('error-boundary-icon')).toBeInTheDocument();
      });
    });
  });
});
