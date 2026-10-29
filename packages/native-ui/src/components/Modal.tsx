import React from 'react';
import {
  StyleSheet,
  View,
  Modal as RNModal,
  KeyboardAvoidingView,
  Platform,
  type ViewStyle,
  type StyleProp,
} from 'react-native';
import { useTheme } from '../theme';
import { ModalBackdrop, ModalTitle, buildDialogStyle } from './modal/ModalDialogParts';

export interface ModalHeaderProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export interface ModalBodyProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export interface ModalFooterProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

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
  /**
   * Accessible name of the dismissing backdrop.
   * @default labels.close from `NativeUIConfig.labels`
   */
  closeAccessibilityLabel?: string;
  /**
   * Lift the dialog above the software keyboard on iOS.
   * @default true
   */
  avoidKeyboard?: boolean;
  /** Dialog fill. @default theme.components.modal.backgroundColor ?? colors.surface */
  backgroundColor?: string;
  /** Additional styles applied to the modal content container. */
  style?: StyleProp<ViewStyle>;
  testID?: string;
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
function ModalComponent(props: ModalProps) {
  const { visible, onClose, title, footer, dismissable = true, avoidKeyboard = true } = props;
  const theme = useTheme();

  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={avoidKeyboard && Platform.OS === 'ios' ? 'padding' : undefined}
        enabled={avoidKeyboard}
        style={styles.wrapper}
      >
        <ModalBackdrop
          onDismiss={dismissable ? onClose : undefined}
          accessibilityLabel={props.closeAccessibilityLabel ?? theme.labels.close}
        />
        <View
          testID={props.testID}
          style={[buildDialogStyle(theme, props.backgroundColor), theme.elevation.xl, props.style]}
          accessibilityViewIsModal={true}
          /*
           * The backdrop sits outside this modal view, so VoiceOver cannot
           * focus it; the two-finger "escape" gesture closes instead.
           */
          onAccessibilityEscape={dismissable ? onClose : undefined}
        >
          {title && <ModalTitle title={title} />}
          {props.children}
          {footer && <ModalFooter>{footer}</ModalFooter>}
        </View>
      </KeyboardAvoidingView>
    </RNModal>
  );
}

/** Header section for Modal compound pattern. */
function ModalHeader({ children, style, testID }: ModalHeaderProps) {
  const { modal } = useTheme().components;

  return (
    <View testID={testID} style={[{ marginBottom: modal.headerMarginBottom }, style]}>
      {children}
    </View>
  );
}

ModalHeader.displayName = 'Modal.Header';

/** Body / content section for Modal compound pattern. */
function ModalBody({ children, style, testID }: ModalBodyProps) {
  const { modal } = useTheme().components;

  return (
    <View testID={testID} style={[{ marginVertical: modal.bodyMarginVertical }, style]}>
      {children}
    </View>
  );
}

ModalBody.displayName = 'Modal.Body';

/** Footer / action section for Modal compound pattern. */
function ModalFooter({ children, style, testID }: ModalFooterProps) {
  const { modal } = useTheme().components;

  return (
    <View
      testID={testID}
      style={[styles.footer, { gap: modal.footerGap, marginTop: modal.footerMarginTop }, style]}
    >
      {children}
    </View>
  );
}

ModalFooter.displayName = 'Modal.Footer';

export const Modal = Object.assign(ModalComponent, {
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
});

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
