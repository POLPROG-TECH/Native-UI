import React, { useRef, useEffect, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { FadeInDown, FadeInUp, FadeOutDown, FadeOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme';

// ─── Toast State (simple module-level store) ───────────────────
type Listener = () => void;

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
   * Auto-dismiss duration in milliseconds.
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

let _config: (ToastConfig & { _id: number }) | null = null;
let _nextId = 0;
const _listeners = new Set<Listener>();
let _rootCount = 0;

function notify() {
  _listeners.forEach((l) => l());
}

function useToastState() {
  const [, forceUpdate] = React.useState(0);
  useEffect(() => {
    const listener = () => forceUpdate((n) => n + 1);
    _listeners.add(listener);
    return () => {
      _listeners.delete(listener);
    };
  }, []);
  return _config;
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
export function useToast() {
  const show = useCallback((config: ToastConfig) => {
    _config = { ...config, _id: ++_nextId };
    notify();
  }, []);

  const hide = useCallback(() => {
    _config = null;
    notify();
  }, []);

  return { show, hide };
}

// ─── Toast Component ───────────────────────────────────────────

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
export function Toast({ offset = 80, defaultPosition = 'bottom' }: ToastProps = {}) {
  const config = useToastState();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    _rootCount += 1;
    if (__DEV__ && _rootCount > 1) {
      // eslint-disable-next-line no-console
      console.warn(
        '[native-ui] Multiple <Toast /> roots detected. Mount exactly one at the app root.',
      );
    }
    return () => {
      _rootCount = Math.max(0, _rootCount - 1);
      // Only clear the active toast when the *last* root is unmounting.
      // Earlier this unconditionally nulled `_config` on every unmount,
      // which killed in-flight toasts during StrictMode dev-mode double-
      // mounts, HMR, or any tree-swap that remounted the Toast root.
      if (_rootCount === 0) {
        _config = null;
        _listeners.clear();
      } else {
        notify();
      }
    };
  }, []);

  useEffect(() => {
    if (config) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        _config = null;
        notify();
      }, config.duration ?? 3000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [config]);

  if (!config) return null;

  // Toast surface: routed through theme so preset/custom themes can override.
  const bgColor = theme.colors.surfaceElevated;
  const animDuration = theme.reduceAnimations ? 0 : 250;

  const variant: ToastVariant = config.variant ?? 'default';
  const accent = resolveAccent(variant, theme, config.accent);
  const iconNode = config.icon !== undefined ? config.icon : renderDefaultIcon(variant, accent);

  const position: ToastPosition = config.position ?? defaultPosition;
  const isTop = position === 'top';

  const positionStyle = isTop
    ? { top: Math.max(insets.top, 16) + offset }
    : { bottom: Math.max(insets.bottom, 16) + offset };

  const entering = isTop ? FadeInUp.duration(animDuration) : FadeInDown.duration(animDuration);
  const exiting = isTop
    ? FadeOutUp.duration(theme.reduceAnimations ? 0 : 200)
    : FadeOutDown.duration(theme.reduceAnimations ? 0 : 200);

  return (
    <Animated.View
      key={config._id}
      entering={entering}
      exiting={exiting}
      style={[
        styles.container,
        positionStyle,
        theme.elevation.lg,
        {
          backgroundColor: bgColor,
          borderRadius: theme.borderRadius.md,
          borderLeftWidth: 3,
          borderLeftColor: accent,
        },
      ]}
      accessible
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      accessibilityLabel={config.message}
    >
      {iconNode != null && <View style={styles.iconContainer}>{iconNode}</View>}
      <View style={styles.textContainer}>
        <Text
          style={[theme.typography.labelSmall, { color: theme.colors.textPrimary }]}
          numberOfLines={2}
        >
          {config.message}
        </Text>
      </View>
      {config.actionLabel && (
        <Pressable
          onPress={() => {
            config.onAction?.();
            _config = null;
            notify();
          }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel={config.actionLabel}
        >
          <Text style={[theme.typography.labelSmall, { color: accent, fontWeight: '700' }]}>
            {config.actionLabel}
          </Text>
        </Pressable>
      )}
    </Animated.View>
  );
}

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
  const glyph =
    variant === 'success' ? '✓' : variant === 'warning' ? '!' : variant === 'error' ? '✕' : 'i';
  return (
    <Text
      accessibilityElementsHidden
      style={{
        width: 20,
        textAlign: 'center',
        // 15pt semibold glyph - small but readable, aligns with labelSmall baseline.
        fontSize: 15,
        lineHeight: 18,
        fontWeight: '700',
        color,
      }}
    >
      {glyph}
    </Text>
  );
}

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
});

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
    _config = { ...config, _id: ++_nextId };
    notify();
  },
  hide() {
    _config = null;
    notify();
  },
};
