import type { ToastTokens } from '../../src/tokens/components';
import { resolveDismissDelay } from '../../src/components/toast/toastLifecycle';
import { captureTheme } from '../test-utils';

function readToastTokens(overrides: Partial<ToastTokens> = {}): ToastTokens {
  return { ...captureTheme().components.toast, ...overrides };
}

describe('resolveDismissDelay', () => {
  describe('GIVEN a toast without its own duration', () => {
    describe('WHEN no screen reader runs', () => {
      it('THEN the default duration is used', () => {
        const tokens = readToastTokens();

        const delay = resolveDismissDelay({ id: 1, message: 'Saved' }, 2500, tokens, false);

        expect(delay).toBe(2500);
      });
    });
  });

  describe('GIVEN a toast with a non-positive duration', () => {
    describe('WHEN the delay is resolved', () => {
      it('THEN the toast is sticky', () => {
        const tokens = readToastTokens();

        const delay = resolveDismissDelay(
          { id: 1, message: 'Hi', duration: 0 },
          2500,
          tokens,
          false,
        );

        expect(delay).toBeNull();
      });
    });
  });

  describe('GIVEN a plain toast while a screen reader runs', () => {
    describe('WHEN the delay is resolved', () => {
      it('THEN the duration is stretched by the screen-reader multiplier', () => {
        const tokens = readToastTokens({ screenReaderDurationMultiplier: 3 });

        const delay = resolveDismissDelay(
          { id: 1, message: 'Hi', duration: 1000 },
          2500,
          tokens,
          true,
        );

        expect(delay).toBe(3000);
      });
    });
  });

  describe('GIVEN an actionable toast while a screen reader runs', () => {
    describe('WHEN sticky actions are enabled', () => {
      it('THEN the toast stays until dismissed', () => {
        const tokens = readToastTokens({ stickyActionsWithScreenReader: true });
        const toast = { id: 1, message: 'Deleted', actionLabel: 'Undo', duration: 1000 };

        expect(resolveDismissDelay(toast, 2500, tokens, true)).toBeNull();
      });
    });
  });
});
