import React, { useCallback, useEffect, useRef, useSyncExternalStore } from 'react';
import { Pressable, StyleSheet, Text, View, type TextStyle } from 'react-native';
import Animated, { FadeInDown, FadeInUp, FadeOutDown, FadeOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme';

// ─── Public types ──────────────────────────────────────────────

export type ToastVariant = 'default' | 'success' | 'warning' | 'error' | 'info';
export type ToastPosition = 'top' | 'bottom';

export interface ToastConfig {
  /** The text displayed inside the toast. */
  message: string;
  /** Label for an optional action button shown on the right side. */
  actionLabel?: string;
  /** Callback fired when the action button is pressed. */
  onAction?: () => void;
  /**
   * Auto-dismiss duration in milliseconds. Pass `0` (or any non-positive
   * value) to keep the toast sticky until `hide()` is called, the action
   * button is pressed, or another toast replaces it.
   * @default 3000
   */
  duration?: number;
  /**
   * Accent color for the left border and action label. Overrides the color
   * derived from `variant`.
   */
  accent?: string;
  /**
   * Semantic variant. Applies a themed accent color (and, if `icon` is not
   * provided, a default textual glyph).
   * @default 'default'
   */
  variant?: ToastVariant;
  /**
   * Optional leading node rendered before the message. Consumers pass their
   * own icon here (e.g. a brand logo). Takes precedence over the variant glyph.
   */
  icon?: React.ReactNode;
  /**
   * Placement of the toast on screen.
   * @default 'bottom'
   */
  position?: ToastPosition;
}

export interface ToastProps {
  /**
   * Offset from the edge of the screen (top or bottom, depending on position).
   * Added on top of safe-area insets. Defaults to `80` to clear tab bars.
   */
  offset?: number;
  /**
   * Optional per-root override for the default `position`. Individual
   * `show()` calls can still override this by passing their own `position`.
   */
  defaultPosition?: ToastPosition;
}

// ─── Constants ─────────────────────────────────────────────────

const DEFAULT_DURATION_MS = 3000;
const DEFAULT_OFFSET = 80;
const MIN_EDGE_INSET = 16;
const ENTER_DURATION_MS = 250;
const EXIT_DURATION_MS = 200;
const BORDER_LEFT_WIDTH = 3;
const ACTION_HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 } as const;

const VARIANT_GLYPH: Record<Exclude<ToastVariant, 'default'>, string> = {
  success: '✓',
  warning: '!',
  error: '✕',
  info: 'i',
};

// ─── Store (module-level singleton) ────────────────────────────

interface ActiveToast extends ToastConfig {
  readonly id: number;
}

type Listener = () => void;

interface ToastStore {
  show: (config: ToastConfig) => void;
  hide: () => void;
  subscribe: (listener: Listener) => () => void;
  getSnapshot: () => ActiveToast | null;
  /** @internal Increments the mounted-root counter and returns a cleanup. */
  registerRoot: () => () => void;
  /** @internal Used only by tests / Fast Refresh. */
  _resetForTest: () => void;
}

function createToastStore(): ToastStore {
  let active: ActiveToast | null = null;
  let nextId = 0;
  let rootCount = 0;
  const listeners = new Set<Listener>();

  const notify = (): void => {
    listeners.forEach((listener) => listener());
  };

  return {
    show(config) {
      active = { ...config, id: ++nextId };
      notify();
    },
    hide() {
      if (active === null) return;

      active = null;
      notify();
    },
    subscribe(listener) {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },
    getSnapshot() {
      return active;
    },
    registerRoot() {
      rootCount += 1;
      if (__DEV__ && rootCount > 1) {
        // eslint-disable-next-line no-console
        console.warn(
          '[native-ui] Multiple <Toast /> roots detected. Mount exactly one at the app root.',
        );
      }

      return () => {
        rootCount = Math.max(0, rootCount - 1);
        // Only clear the active toast when the *last* root is unmounting.
        // Guards against StrictMode double-mounts and HMR-induced remounts
        // killing an in-flight toast.
        if (rootCount === 0) {
          active = null;
          listeners.clear();
        } else {
          notify();
        }
      };
    },
    _resetForTest() {
      active = null;
      nextId = 0;
      rootCount = 0;
      listeners.clear();
    },
  };
}

const toastStore = createToastStore();

// ─── Hooks ─────────────────────────────────────────────────────

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

function useActiveToast(): ActiveToast | null {
  return useSyncExternalStore(toastStore.subscribe, toastStore.getSnapshot, toastStore.getSnapshot);
}

function useAutoDismiss(active: ActiveToast | null): void {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (active === null) return;

    // `duration <= 0` means "sticky" - the toast stays until explicitly
    // hidden (via `hide()` / action press / being replaced). Only `undefined`
    // falls back to the 3 s default.
    const duration = active.duration ?? DEFAULT_DURATION_MS;
    if (duration <= 0) return;

    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      toastStore.hide();
    }, duration);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [active]);
}

// ─── Component ─────────────────────────────────────────────────

/**
 * Toast notification overlay. Place once near the root of your app.
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
export function Toast({ offset = DEFAULT_OFFSET, defaultPosition = 'bottom' }: ToastProps = {}) {
  const active = useActiveToast();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  useAutoDismiss(active);
  useEffect(() => toastStore.registerRoot(), []);

  const handleActionPress = useCallback(() => {
    active?.onAction?.();
    toastStore.hide();
  }, [active]);

  if (active === null) return null;

  const variant = active.variant ?? 'default';
  const accent = resolveAccent(variant, theme, active.accent);
  const iconNode = active.icon !== undefined ? active.icon : renderDefaultIcon(variant, accent);

  const position: ToastPosition = active.position ?? defaultPosition;
  const isTop = position === 'top';

  const positionStyle = isTop
    ? { top: Math.max(insets.top, MIN_EDGE_INSET) + offset }
    : { bottom: Math.max(insets.bottom, MIN_EDGE_INSET) + offset };

  const enterMs = theme.reduceAnimations ? 0 : ENTER_DURATION_MS;
  const exitMs = theme.reduceAnimations ? 0 : EXIT_DURATION_MS;
  const entering = isTop ? FadeInUp.duration(enterMs) : FadeInDown.duration(enterMs);
  const exiting = isTop ? FadeOutUp.duration(exitMs) : FadeOutDown.duration(exitMs);

  const actionTextStyle: TextStyle = { color: accent, fontWeight: '700' };

  return (
    <Animated.View
      key={active.id}
      entering={entering}
      exiting={exiting}
      style={[
        styles.container,
        positionStyle,
        theme.elevation.lg,
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderRadius: theme.borderRadius.md,
          borderLeftWidth: BORDER_LEFT_WIDTH,
          borderLeftColor: accent,
        },
      ]}
      accessible
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      accessibilityLabel={active.message}
    >
      {iconNode != null && <View style={styles.iconContainer}>{iconNode}</View>}

      <View style={styles.textContainer}>
        <Text
          style={[theme.typography.labelSmall, { color: theme.colors.textPrimary }]}
          numberOfLines={2}
        >
          {active.message}
        </Text>
      </View>

      {active.actionLabel && (
        <Pressable
          onPress={handleActionPress}
          hitSlop={ACTION_HIT_SLOP}
          accessibilityRole="button"
          accessibilityLabel={active.actionLabel}
        >
          <Text style={[theme.typography.labelSmall, actionTextStyle]}>{active.actionLabel}</Text>
        </Pressable>
      )}
    </Animated.View>
  );
}

// ─── Helpers ───────────────────────────────────────────────────

function resolveAccent(
  variant: ToastVariant,
  theme: ReturnType<typeof useTheme>,
  override?: string,
): string {
  if (override) return override;

  switch (variant) {
    case 'success':
      return theme.colors.success;
    case 'warning':
      return theme.colors.warning;
    case 'error':
      return theme.colors.error;
    case 'info':
      return theme.colors.info;
    default:
      return theme.colors.primary;
  }
}

function renderDefaultIcon(variant: ToastVariant, color: string): React.ReactNode {
  if (variant === 'default') return null;

  return <VariantGlyph variant={variant} color={color} />;
}

interface VariantGlyphProps {
  readonly variant: Exclude<ToastVariant, 'default'>;
  readonly color: string;
}

const VariantGlyph = React.memo(function VariantGlyph({ variant, color }: VariantGlyphProps) {
  return (
    <Text accessibilityElementsHidden style={[styles.glyph, { color }]}>
      {VARIANT_GLYPH[variant]}
    </Text>
  );
});

// ─── Styles ────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
    zIndex: 9999,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  glyph: {
    width: 20,
    textAlign: 'center',
    // 15pt semibold glyph - small but readable, aligns with labelSmall baseline.
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '700',
  },
});

// ─── Imperative facade ─────────────────────────────────────────

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
