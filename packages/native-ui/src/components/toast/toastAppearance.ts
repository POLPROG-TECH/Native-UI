import type { ViewStyle } from 'react-native';
import { FadeInDown, FadeInUp, FadeOutDown, FadeOutUp } from 'react-native-reanimated';
import type { EdgeInsets } from 'react-native-safe-area-context';
import type { Theme } from '../../theme/types';
import type { ToastPosition, ToastVariant } from './toastStore';

/** Accent for the border, icon and action: an explicit override wins. */
export function resolveAccent(variant: ToastVariant, theme: Theme, override?: string): string {
  if (override) {
    return override;
  }

  switch (variant) {
    case 'success':
      return theme.colors.success;
    case 'warning':
      return theme.colors.warning;
    case 'error':
      return theme.colors.error;
    case 'info':
      return theme.colors.info;
    case 'default':
      return theme.colors.primary;
  }
}

/** Distance from the chosen screen edge, never closer than the safe area. */
export function resolveEdgeStyle(
  position: ToastPosition,
  insets: EdgeInsets,
  theme: Theme,
  offset: number,
): ViewStyle {
  const { minEdgeInset } = theme.components.toast;

  if (position === 'top') {
    return { top: Math.max(insets.top, minEdgeInset) + offset };
  }

  return { bottom: Math.max(insets.bottom, minEdgeInset) + offset };
}

/** Enter/exit animations that slide from the toast's own edge. */
export function resolveToastMotion(position: ToastPosition, theme: Theme) {
  const tokens = theme.components.toast;
  const enterMs = theme.reduceAnimations ? 0 : tokens.enterDurationMs;
  const exitMs = theme.reduceAnimations ? 0 : tokens.exitDurationMs;

  if (position === 'top') {
    return { entering: FadeInUp.duration(enterMs), exiting: FadeOutUp.duration(exitMs) };
  }

  return { entering: FadeInDown.duration(enterMs), exiting: FadeOutDown.duration(exitMs) };
}

/** Surface and ink of the toast card for the configured appearance. */
export function resolveToastColors(theme: Theme): { surface: string; text: string } {
  if (theme.components.toast.appearance === 'inverse') {
    return { surface: theme.colors.inverseSurface, text: theme.colors.onInverseSurface };
  }

  return { surface: theme.colors.surfaceElevated, text: theme.colors.textPrimary };
}

export function buildToastSurfaceStyle(theme: Theme, accent: string): ViewStyle {
  const tokens = theme.components.toast;

  return {
    left: tokens.marginHorizontal,
    right: tokens.marginHorizontal,
    paddingHorizontal: tokens.paddingHorizontal,
    paddingVertical: tokens.paddingVertical,
    gap: tokens.gap,
    zIndex: tokens.zIndex,
    backgroundColor: resolveToastColors(theme).surface,
    borderRadius: tokens.radius,
    borderLeftWidth: tokens.accentBorderWidth,
    borderLeftColor: accent,
  };
}
