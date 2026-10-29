import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { AccessibilityInfo, Platform } from 'react-native';
import { Toast, useToast, type ToastConfig } from '../../src/components/Toast';
import { NativeUIProvider } from '../../src/theme';
import { renderWithTheme } from '../test-utils';

function Harness({ duration }: { duration?: number }) {
  const { show } = useToast();
  React.useEffect(() => {
    show({ message: 'Saved', duration });
  }, [show, duration]);

  return <Toast />;
}

describe('Toast auto-dismiss semantics', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  describe('GIVEN a Toast shown with no explicit duration (default 3000 ms)', () => {
    describe('WHEN the default duration elapses', () => {
      it('THEN the toast is removed', () => {
        renderWithTheme(<Harness />);
        expect(screen.getByText('Saved')).toBeInTheDocument();

        act(() => {
          jest.advanceTimersByTime(3001);
        });

        expect(screen.queryByText('Saved')).not.toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a Toast shown with duration=0 (explicit "sticky" opt-in)', () => {
    describe('WHEN a long time elapses', () => {
      it('THEN the toast is still on screen (no auto-dismiss)', () => {
        renderWithTheme(<Harness duration={0} />);
        expect(screen.getByText('Saved')).toBeInTheDocument();

        act(() => {
          jest.advanceTimersByTime(60_000);
        });

        expect(screen.getByText('Saved')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a Toast triggered with a `success` variant', () => {
    describe('WHEN the harness mounts', () => {
      it('THEN the toast message is rendered alongside the variant glyph', () => {
        function VariantHarness() {
          const { show } = useToast();
          React.useEffect(() => {
            show({ message: 'All good', variant: 'success' });
          }, [show]);

          return <Toast />;
        }

        renderWithTheme(<VariantHarness />);

        expect(screen.getByText('All good')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a sticky Toast with an action button and onAction spy', () => {
    describe('WHEN the action button is pressed', () => {
      it('THEN onAction is invoked and the toast is dismissed', () => {
        const onAction = jest.fn();
        function ActionHarness() {
          const { show } = useToast();
          React.useEffect(() => {
            show({ message: 'Undo?', actionLabel: 'Undo', onAction, duration: 0 });
          }, [show]);

          return <Toast />;
        }

        renderWithTheme(<ActionHarness />);

        const actionButton = screen.getByRole('button', { name: 'Undo' });
        act(() => {
          actionButton.click();
        });

        expect(onAction).toHaveBeenCalledTimes(1);
        expect(screen.queryByText('Undo?')).not.toBeInTheDocument();
      });
    });
  });
});

describe('Toast accessibility', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
    Platform.OS = 'ios';
  });

  function ShowOnMount({ config }: { config: ToastConfig }) {
    const { show } = useToast();
    React.useEffect(() => {
      show(config);
    }, [show, config]);

    return <Toast />;
  }

  async function flushScreenReaderQuery() {
    await act(async () => {
      await Promise.resolve();
    });
  }

  describe('GIVEN a toast with an action', () => {
    describe('WHEN the accessibility tree is queried', () => {
      it('THEN the action is its own focusable button and the message is not swallowed into a container-level label', () => {
        renderWithTheme(
          <ShowOnMount config={{ message: 'Deleted', actionLabel: 'Undo', duration: 0 }} />,
        );

        const action = screen.getByRole('button', { name: 'Undo' });
        const message = screen.getByText('Deleted');

        expect(action).toBeInTheDocument();
        expect(message.closest('[aria-label="Deleted"]')).toBeNull();
      });
    });
  });

  describe('GIVEN iOS and a spy on the announcement API', () => {
    describe('WHEN a toast appears', () => {
      it('THEN the message is announced once', () => {
        Platform.OS = 'ios';
        const announce = jest.spyOn(AccessibilityInfo, 'announceForAccessibility');

        renderWithTheme(<ShowOnMount config={{ message: 'Saved', duration: 0 }} />);

        expect(announce).toHaveBeenCalledWith('Saved');
        expect(announce).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('GIVEN Android', () => {
    describe('WHEN a toast appears', () => {
      it('THEN no explicit announcement is made (no double speech)', () => {
        Platform.OS = 'android';
        const announce = jest.spyOn(AccessibilityInfo, 'announceForAccessibility');

        renderWithTheme(<ShowOnMount config={{ message: 'Saved', duration: 0 }} />);

        expect(announce).not.toHaveBeenCalled();
      });
    });
  });

  describe('GIVEN iOS and a toast that opts out of announcements', () => {
    describe('WHEN it appears', () => {
      it('THEN nothing is announced', () => {
        Platform.OS = 'ios';
        const announce = jest.spyOn(AccessibilityInfo, 'announceForAccessibility');

        renderWithTheme(
          <ShowOnMount config={{ message: 'Quiet', duration: 0, announce: false }} />,
        );

        expect(announce).not.toHaveBeenCalled();
      });
    });
  });

  describe('GIVEN a running screen reader and a 1 s toast', () => {
    describe('WHEN the nominal duration passes', () => {
      it('THEN the toast is still visible, and it goes after the doubled delay', async () => {
        jest.spyOn(AccessibilityInfo, 'isScreenReaderEnabled').mockResolvedValue(true);
        renderWithTheme(<ShowOnMount config={{ message: 'Slow', duration: 1000 }} />);
        await flushScreenReaderQuery();

        act(() => {
          jest.advanceTimersByTime(1500);
        });

        expect(screen.getByText('Slow')).toBeInTheDocument();
        act(() => {
          jest.advanceTimersByTime(600);
        });
        expect(screen.queryByText('Slow')).not.toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a running screen reader and a timed toast with an action', () => {
    describe('WHEN far more than the duration passes', () => {
      it('THEN the toast stays so the action remains reachable', async () => {
        jest.spyOn(AccessibilityInfo, 'isScreenReaderEnabled').mockResolvedValue(true);
        renderWithTheme(
          <ShowOnMount config={{ message: 'Removed', actionLabel: 'Undo', duration: 1000 }} />,
        );
        await flushScreenReaderQuery();

        act(() => {
          jest.advanceTimersByTime(60_000);
        });

        expect(screen.getByText('Removed')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a provider overriding the toast duration token', () => {
    describe('WHEN the token duration passes', () => {
      it('THEN the toast is gone', () => {
        render(
          <NativeUIProvider
            config={{ colorMode: 'light', components: { toast: { durationMs: 500 } } }}
          >
            <ShowOnMount config={{ message: 'Quick' }} />
          </NativeUIProvider>,
        );

        act(() => {
          jest.advanceTimersByTime(501);
        });

        expect(screen.queryByText('Quick')).not.toBeInTheDocument();
      });
    });
  });
});
