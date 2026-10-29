import { useCallback } from 'react';
import { useTheme } from '../theme';
import { ToastCard } from './toast/ToastCard';
import { useToastLifecycle } from './toast/toastLifecycle';
import { toastStore, type ToastConfig, type ToastPosition } from './toast/toastStore';

export type { ToastVariant, ToastPosition, ToastConfig } from './toast/toastStore';

export interface ToastProps {
  /**
   * Offset from the edge of the screen (top or bottom, depending on position).
   * Added on top of safe-area insets.
   * @default theme.components.toast.offset (80, clears tab bars)
   */
  offset?: number;
  /**
   * Optional per-root override for the default `position`. Individual
   * `show()` calls can still override this by passing their own `position`.
   */
  defaultPosition?: ToastPosition;
  /**
   * Auto-dismiss delay for toasts shown without a `duration`.
   * @default theme.components.toast.durationMs (3000)
   */
  defaultDuration?: number;
}

/**
 * Imperative hook for showing and hiding toasts from any component.
 *
 * @example
 * ```tsx
 * const { show, hide } = useToast();
 * show({ message: 'Item saved', duration: 2000 });
 * ```
 */
export function useToast(): { show: (config: ToastConfig) => void; hide: () => void } {
  const show = useCallback((config: ToastConfig) => toastStore.show(config), []);
  const hide = useCallback(() => toastStore.hide(), []);

  return { show, hide };
}

/**
 * Toast notification overlay. Place once near the root of your app.
 *
 * Screen readers: the message is announced (live region on Android,
 * `announceForAccessibility` on iOS), the action button stays separately
 * focusable, and auto-dismiss is extended while VoiceOver / TalkBack runs.
 *
 * @example
 * ```tsx
 * // In your root layout:
 * <Toast />
 *
 * // In any component:
 * const { show } = useToast();
 * show({ message: 'Saved!', variant: 'success', duration: 2000 });
 * ```
 */
export function Toast({ offset, defaultPosition = 'bottom', defaultDuration }: ToastProps = {}) {
  const active = useToastLifecycle(defaultDuration);
  const tokens = useTheme().components.toast;

  if (active === null) {
    return null;
  }

  /* Keyed by id so a replacing toast remounts and plays its enter animation. */
  return (
    <ToastCard
      key={active.id}
      toast={active}
      position={active.position ?? defaultPosition}
      offset={offset ?? tokens.offset}
    />
  );
}

/**
 * Imperative singleton facade usable outside React components (e.g. inside
 * async action handlers, middleware, or utility modules). Requires a `<Toast />`
 * root to be mounted in the component tree.
 *
 * @example
 * import { toast } from '@polprog/native-ui';
 * toast.show({ message: 'Saved', variant: 'success' });
 */
export const toast = {
  show(config: ToastConfig) {
    toastStore.show(config);
  },
  hide() {
    toastStore.hide();
  },
};
