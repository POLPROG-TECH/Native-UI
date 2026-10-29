import { Component, type ComponentType, type ErrorInfo, type ReactNode } from 'react';
import type { IconSlot } from '../primitives/iconSlot';
import { DefaultFallback, renderDefaultFallbackIcon } from './errorBoundary/DefaultFallback';
import { resetKeysChanged } from './errorBoundary/resetKeys';

export interface ErrorBoundaryProps {
  children: ReactNode;
  /**
   * Simple message shown in the default fallback UI. Ignored when either
   * `fallback` or `renderFallback` is provided.
   * @default labels.errorMessage from `NativeUIConfig.labels`
   */
  fallbackMessage?: string;
  /** Label for the default retry button. @default labels.errorRetry */
  retryLabel?: string;
  /**
   * Icon shown above the message in the default fallback. Pass `null` to
   * hide it. Prefer a render function, which receives `errorText` and
   * `theme.components.errorBoundary.iconSize`:
   * `fallbackIcon={({ color, size }) => <SystemIcon name="info" color={color} size={size} />}`.
   * Nodes render as-is; emoji strings are kept for backwards compatibility.
   * @default a drawn `SystemIcon name="alert"` in `errorText` (testID `error-boundary-icon`)
   */
  fallbackIcon?: IconSlot;
  /**
   * Static fallback element. Takes precedence over `renderFallback` when both
   * are provided. Useful for trivial replacements that don't need the error.
   */
  fallback?: ReactNode;
  /**
   * Render-prop fallback receiving the thrown error, a `reset` function that
   * clears the boundary, and the React `ErrorInfo` (if known). Use this when
   * the fallback needs access to the error message or stack.
   */
  renderFallback?: (error: Error, reset: () => void, info?: ErrorInfo) => ReactNode;
  /**
   * Called after `componentDidCatch`. Hook up your crash reporter here - this
   * keeps the library generic and crash-reporter-agnostic.
   */
  onError?: (error: Error, info: ErrorInfo) => void;
  /**
   * If any value in this array changes between renders, the boundary is
   * automatically reset. Mirrors `react-error-boundary`'s `resetKeys` prop.
   */
  resetKeys?: ReadonlyArray<unknown>;
}

interface State {
  readonly error: Error | null;
  readonly info: ErrorInfo | null;
}

/**
 * Generic error boundary. Catches render-time exceptions from its subtree and
 * shows a fallback UI. Pairs well with {@link withErrorBoundary} for
 * per-feature isolation.
 *
 * - Provide `onError` to forward errors into your crash reporter.
 * - Provide `renderFallback` for full control over the fallback UI.
 * - Provide `resetKeys` for automatic re-try on data change.
 *
 * @example
 * ```tsx
 * <ErrorBoundary
 *   onError={(e, info) => Sentry.captureException(e, { extra: info })}
 *   resetKeys={[userId]}
 * >
 *   <Screen />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
  state: State = { error: null, info: null };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.setState({ info });
    try {
      this.props.onError?.(error, info);
    } catch {
      /* Consumer's onError must never take down the boundary itself. */
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (!this.state.error) {
      return;
    }

    if (resetKeysChanged(prevProps.resetKeys, this.props.resetKeys)) {
      this.reset();
    }
  }

  reset = () => {
    this.setState({ error: null, info: null });
  };

  render() {
    const { error, info } = this.state;

    if (!error) {
      return this.props.children;
    }

    if (this.props.fallback !== undefined) {
      return this.props.fallback;
    }

    if (this.props.renderFallback) {
      return this.props.renderFallback(error, this.reset, info ?? undefined);
    }

    return (
      <DefaultFallback
        message={this.props.fallbackMessage}
        retryLabel={this.props.retryLabel}
        icon={
          this.props.fallbackIcon === undefined
            ? renderDefaultFallbackIcon
            : this.props.fallbackIcon
        }
        onReset={this.reset}
      />
    );
  }
}

/**
 * HOC form of {@link ErrorBoundary}. Wraps `Component` in an `ErrorBoundary`
 * configured with the supplied options. Preserves `displayName` for debugging.
 *
 * @example
 * ```tsx
 * export default withErrorBoundary(SettingsScreen, {
 *   onError: logToCrashReporter,
 *   fallbackMessage: 'Could not load settings.',
 * });
 * ```
 */
export function withErrorBoundary<P extends object>(
  Wrapped: ComponentType<P>,
  options: Omit<ErrorBoundaryProps, 'children'> = {},
): ComponentType<P> {
  const Wrapper = (props: P) => (
    <ErrorBoundary {...options}>
      <Wrapped {...props} />
    </ErrorBoundary>
  );
  /* Anonymous components have an empty `name`, so it falls back as well. */
  const name = Wrapped.displayName ?? (Wrapped.name || 'Component');
  Wrapper.displayName = `withErrorBoundary(${name})`;

  return Wrapper;
}
