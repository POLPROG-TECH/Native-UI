import { Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';
import { useTheme } from '../../theme';
import type { Theme } from '../../theme/types';

export interface ModalBackdropProps {
  /** Closes the modal; `undefined` makes the backdrop inert. */
  onDismiss?: () => void;
  accessibilityLabel: string;
}

/**
 * Full-screen dimmed backdrop. When it cannot dismiss, it is hidden from
 * assistive technology instead of being announced as a dead button.
 */
export function ModalBackdrop({ onDismiss, accessibilityLabel }: ModalBackdropProps) {
  const theme = useTheme();
  const dismissable = onDismiss !== undefined;

  return (
    <Pressable
      style={[styles.overlay, { backgroundColor: theme.colors.overlay }]}
      onPress={onDismiss}
      accessibilityElementsHidden={!dismissable}
      importantForAccessibility={dismissable ? 'yes' : 'no-hide-descendants'}
      {...(dismissable ? { accessibilityRole: 'button' as const, accessibilityLabel } : {})}
    />
  );
}

export function ModalTitle({ title }: { title: string }) {
  const theme = useTheme();

  return (
    <Text
      style={[
        theme.typography.h2,
        {
          color: theme.colors.textPrimary,
          marginBottom: theme.components.modal.titleMarginBottom,
        },
      ]}
      accessibilityRole="header"
    >
      {title}
    </Text>
  );
}

/** Themed dialog surface; an explicit `backgroundColor` prop wins over tokens. */
export function buildDialogStyle(theme: Theme, backgroundColor?: string): ViewStyle {
  const tokens = theme.components.modal;

  return {
    width: tokens.width,
    maxWidth: tokens.maxWidth,
    padding: tokens.padding,
    backgroundColor: backgroundColor ?? tokens.backgroundColor ?? theme.colors.surface,
    borderRadius: tokens.radius,
  };
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
