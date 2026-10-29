import { useEffect, useRef, useSyncExternalStore } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';
import { useScreenReaderEnabled } from '../../hooks/useScreenReaderEnabled';
import { useTheme } from '../../theme';
import type { ToastTokens } from '../../tokens/components';
import { toastStore, type ActiveToast } from './toastStore';

function useActiveToast(): ActiveToast | null {
  return useSyncExternalStore(toastStore.subscribe, toastStore.getSnapshot, toastStore.getSnapshot);
}

/**
 * Effective auto-dismiss delay, or `null` for a sticky toast. `duration <= 0`
 * means sticky; `undefined` falls back to the default. With a screen reader
 * running the delay is stretched (or removed for actionable toasts) so the
 * announcement and the action stay reachable.
 */
export function resolveDismissDelay(
  active: ActiveToast,
  defaultDuration: number,
  tokens: ToastTokens,
  screenReaderEnabled: boolean,
): number | null {
  const duration = active.duration ?? defaultDuration;

  if (duration <= 0) {
    return null;
  }

  if (!screenReaderEnabled) {
    return duration;
  }

  if (active.actionLabel && tokens.stickyActionsWithScreenReader) {
    return null;
  }

  return duration * tokens.screenReaderDurationMultiplier;
}

function useAutoDismiss(active: ActiveToast | null, delay: number | null): void {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (active === null || delay === null) {
      return;
    }

    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      toastStore.hide();
    }, delay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [active, delay]);
}

/**
 * Announces each new toast on iOS. Android reads it through the container's
 * `accessibilityLiveRegion`, which iOS ignores, so announcing there as well
 * would make TalkBack speak the message twice.
 */
function useAnnouncement(active: ActiveToast | null): void {
  useEffect(() => {
    if (active === null || Platform.OS !== 'ios' || active.announce === false) {
      return;
    }

    AccessibilityInfo.announceForAccessibility(active.message);
  }, [active]);
}

/**
 * Wires a `<Toast />` root to the store: registers the root, auto-dismisses
 * the active toast and announces it. Returns the toast to render, if any.
 */
export function useToastLifecycle(defaultDuration: number | undefined): ActiveToast | null {
  const active = useActiveToast();
  const tokens = useTheme().components.toast;
  const screenReaderEnabled = useScreenReaderEnabled();
  const delay = active
    ? resolveDismissDelay(active, defaultDuration ?? tokens.durationMs, tokens, screenReaderEnabled)
    : null;

  useAutoDismiss(active, delay);
  useAnnouncement(active);
  useEffect(() => toastStore.registerRoot(), []);

  return active;
}
