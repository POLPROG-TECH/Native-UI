import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal as RNModal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  type ViewStyle,
  type StyleProp,
} from 'react-native';
import { useTheme } from '../theme';

// ─── Compound sub-component props ──────────────────────────────

export interface ModalHeaderProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export interface ModalBodyProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export interface ModalFooterProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

// ─── Main modal props ──────────────────────────────────────────

export interface ModalProps {
  /** Controls whether the modal is displayed. */
  visible: boolean;
  /** Callback fired when the modal requests to close (backdrop tap or back button). */
  onClose: () => void;
  /** Optional title rendered at the top of the dialog. */
  title?: string;
  /** Content rendered inside the modal body. */
  children: React.ReactNode;
  /** Footer element (e.g. action buttons) rendered below the body with right-aligned layout. */
  footer?: React.ReactNode;
  /**
   * Whether the modal can be dismissed by tapping the backdrop.
   * @default true
   */
  dismissable?: boolean;
  /** Additional styles applied to the modal content container. */
  style?: ViewStyle;
}

/**
 * Centered dialog modal with a translucent backdrop, optional title, and footer.
 * Uses `KeyboardAvoidingView` on iOS to stay visible when the keyboard is open.
 *
 * Supports both the monolithic API and a compound component pattern:
 *
 * @example Monolithic
 * ```tsx
 * <Modal visible={show} onClose={close} title="Delete item?">
 *   <Text>This action cannot be undone.</Text>
 * </Modal>
 * ```
 *
 * @example Compound
 * ```tsx
 * <Modal visible={show} onClose={close}>
 *   <Modal.Header><Heading level={2}>Delete?</Heading></Modal.Header>
 *   <Modal.Body><Text>Cannot be undone.</Text></Modal.Body>
 *   <Modal.Footer><Button title="Delete" onPress={del} /></Modal.Footer>
 * </Modal>
 * ```
 */
function ModalComponent({
  visible,
  onClose,
  title,
  children,
  footer,
  dismissable = true,
  style,
}: ModalProps) {
  const theme = useTheme();

  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.wrapper}
      >
        <Pressable
          style={[styles.overlay, { backgroundColor: theme.colors.overlay }]}
          onPress={dismissable ? onClose : undefined}
        />
        <View
          style={[
            styles.content,
            {
              backgroundColor: theme.colors.surface,
              borderRadius: theme.borderRadius.xl,
            },
            theme.elevation.xl as ViewStyle,
            style,
          ]}
          accessibilityViewIsModal={true}
        >
          {title && (
            <Text
              style={[
                theme.typography.h2,
                {
                  color: theme.colors.textPrimary,
                  marginBottom: 12,
                },
              ]}
              accessibilityRole="header"
            >
              {title}
            </Text>
          )}
          {children}
          {footer && <View style={styles.footer}>{footer}</View>}
        </View>
      </KeyboardAvoidingView>
    </RNModal>
  );
}

// ─── Compound sub-components ───────────────────────────────────

/** Header section for Modal compound pattern. */
function ModalHeader({ children, style }: ModalHeaderProps) {
  return <View style={[styles.header, style]}>{children}</View>;
}
ModalHeader.displayName = 'Modal.Header';

/** Body / content section for Modal compound pattern. */
function ModalBody({ children, style }: ModalBodyProps) {
  return <View style={[styles.body, style]}>{children}</View>;
}
ModalBody.displayName = 'Modal.Body';

/** Footer / action section for Modal compound pattern. */
function ModalFooter({ children, style }: ModalFooterProps) {
  return <View style={[styles.footer, style]}>{children}</View>;
}
ModalFooter.displayName = 'Modal.Footer';

// ─── Assemble compound component ──────────────────────────────

export const Modal = Object.assign(ModalComponent, {
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
});

// ─── Styles ───────────────────────────────────────────────────

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...(StyleSheet.absoluteFill as object),
  },
  content: {
    width: '85%',
    maxWidth: 400,
    padding: 24,
  },
  header: {
    marginBottom: 12,
  },
  body: {
    marginVertical: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 20,
  },
});
