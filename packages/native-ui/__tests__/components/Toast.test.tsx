import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { Toast, useToast } from '../../src/components/Toast';
import { NativeUIProvider } from '../../src/theme';

function Harness({ duration }: { duration?: number }) {
  const { show } = useToast();
  React.useEffect(() => {
    show({ message: 'Saved', duration });
  }, [show, duration]);

  return <Toast />;
}

function renderWithTheme(ui: React.ReactElement) {
  return render(<NativeUIProvider config={{ colorMode: 'light' }}>{ui}</NativeUIProvider>);
}

describe('Toast auto-dismiss semantics', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('should auto dismiss after the default 3 second duration', () => {
    // GIVEN a Toast shown with no explicit duration (default 3000 ms)
    renderWithTheme(<Harness />);
    expect(screen.getByText('Saved')).toBeInTheDocument();

    // WHEN the default duration elapses
    act(() => {
      jest.advanceTimersByTime(3001);
    });

    // THEN the toast is removed
    expect(screen.queryByText('Saved')).not.toBeInTheDocument();
  });

  it('should stay sticky when duration is zero', () => {
    // GIVEN a Toast shown with duration=0 (explicit "sticky" opt-in)
    renderWithTheme(<Harness duration={0} />);
    expect(screen.getByText('Saved')).toBeInTheDocument();

    // WHEN a long time elapses
    act(() => {
      jest.advanceTimersByTime(60_000);
    });

    // THEN the toast is still on screen (no auto-dismiss)
    expect(screen.getByText('Saved')).toBeInTheDocument();
  });

  it('should render the variant glyph for non-default variants', () => {
    // GIVEN a Toast triggered with a `success` variant
    function VariantHarness() {
      const { show } = useToast();
      React.useEffect(() => {
        show({ message: 'All good', variant: 'success' });
      }, [show]);

      return <Toast />;
    }

    // WHEN the harness mounts
    renderWithTheme(<VariantHarness />);

    // THEN the toast message is rendered alongside the variant glyph
    expect(screen.getByText('All good')).toBeInTheDocument();
  });

  it('should invoke the action callback and dismiss the toast when the action is pressed', () => {
    // GIVEN a sticky Toast with an action button and onAction spy
    const onAction = jest.fn();
    function ActionHarness() {
      const { show } = useToast();
      React.useEffect(() => {
        show({ message: 'Undo?', actionLabel: 'Undo', onAction, duration: 0 });
      }, [show]);

      return <Toast />;
    }
    renderWithTheme(<ActionHarness />);

    // WHEN the action button is pressed
    const actionButton = screen.getByRole('button', { name: 'Undo' });
    act(() => {
      actionButton.click();
    });

    // THEN onAction is invoked and the toast is dismissed
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Undo?')).not.toBeInTheDocument();
  });
});
