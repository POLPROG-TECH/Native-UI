import { useCallback } from 'react';
import { useFocusRing } from '../../hooks/useFocusRing';
import { ensureReadable } from '../../tokens/colorUtils';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { renderIconSlot, type IconSlot } from '../../primitives/iconSlot';
import { SystemIcon, type SystemIconName } from '../../primitives/SystemIcon';
import { useTheme } from '../../theme';
import { toastStore, type ActiveToast, type ToastPosition, type ToastVariant } from './toastStore';
import {
  buildToastSurfaceStyle,
  resolveToastColors,
  resolveAccent,
  resolveEdgeStyle,
  resolveToastMotion,
} from './toastAppearance';

const VARIANT_ICON: Record<Exclude<ToastVariant, 'default'>, SystemIconName> = {
  success: 'check',
  warning: 'alert',
  error: 'close',
  info: 'info',
};

interface ToastIconProps {
  icon: IconSlot | undefined;
  variant: ToastVariant;
  color: string;
}

/**
 * A consumer `icon` (even `null`) replaces the variant glyph and is drawn
 * with the same accent color and size.
 */
function ToastIcon({ icon, variant, color }: ToastIconProps) {
  const { iconSize } = useTheme().components.toast;
  const glyph =
    variant === 'default' ? null : (
      <SystemIcon name={VARIANT_ICON[variant]} color={color} size={iconSize} />
    );
  const iconNode = icon !== undefined ? renderIconSlot(icon, { color, size: iconSize }) : glyph;

  if (iconNode == null) {
    return null;
  }

  return <View style={styles.iconContainer}>{iconNode}</View>;
}

function ToastMessage({ message }: { message: string }) {
  const theme = useTheme();

  return (
    <View style={styles.textContainer}>
      <Text
        style={[theme.typography.labelSmall, { color: resolveToastColors(theme).text }]}
        numberOfLines={theme.components.toast.messageMaxLines}
        accessibilityRole="alert"
      >
        {message}
      </Text>
    </View>
  );
}

/** Runs the toast's action, then dismisses it. */
function ToastAction({ toast, color }: { toast: ActiveToast; color: string }) {
  const theme = useTheme();
  const slop = theme.components.toast.actionHitSlop;
  const { focusProps, focusRingStyle } = useFocusRing();
  const handlePress = useCallback(() => {
    toast.onAction?.();
    toastStore.hide();
  }, [toast]);

  return (
    <Pressable
      {...focusProps}
      onPress={handlePress}
      hitSlop={{ top: slop, bottom: slop, left: slop, right: slop }}
      style={focusRingStyle}
      accessibilityRole="button"
      accessibilityLabel={toast.actionLabel}
    >
      <Text style={[theme.typography.labelSmall, { color, fontWeight: '700' }]}>
        {toast.actionLabel}
      </Text>
    </Pressable>
  );
}

export interface ToastCardProps {
  toast: ActiveToast;
  position: ToastPosition;
  /** Distance from the screen edge, added to the safe-area inset. */
  offset: number;
}

/** The visible toast: accent border, optional icon, message and action. */
export function ToastCard({ toast, position, offset }: ToastCardProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const variant = toast.variant ?? 'default';
  const accent = resolveAccent(variant, theme, toast.accent);
  const { entering, exiting } = resolveToastMotion(position, theme);
  const edgeStyle = resolveEdgeStyle(position, insets, theme, offset);

  return (
    <Animated.View
      entering={entering}
      exiting={exiting}
      style={[
        styles.container,
        edgeStyle,
        theme.elevation.lg,
        buildToastSurfaceStyle(theme, accent),
      ]}
      /*
       * Not `accessible`: grouping the container would hide the action
       * button from VoiceOver / TalkBack focus. The live region still makes
       * Android announce the message when the toast appears.
       */
      accessibilityLiveRegion="polite"
    >
      <ToastIcon icon={toast.icon} variant={variant} color={accent} />
      <ToastMessage message={toast.message} />
      {toast.actionLabel && (
        <ToastAction
          toast={toast}
          color={ensureReadable(accent, [resolveToastColors(theme).surface])}
        />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
});
