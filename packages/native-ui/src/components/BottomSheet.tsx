import React from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '../theme';
import type { SheetFooterLayout } from '../tokens/components';
import { SheetBackdrop } from './bottomSheet/SheetBackdrop';
import { SheetPanel } from './bottomSheet/SheetPanel';
import { useSheetTokens } from './bottomSheet/sheetTokens';

export interface BottomSheetHeaderProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export interface BottomSheetBodyProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export interface BottomSheetFooterProps {
  children: React.ReactNode;
  /**
   * `row`: actions right-aligned in a row; `fill`: each action takes an equal
   * share of the width; `stacked`: full-width actions in a column.
   * @default theme.components.bottomSheet.footerLayout ('row')
   */
  layout?: SheetFooterLayout;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export type { SheetFooterLayout };

export interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Close on backdrop press and handle swipe (default: true) */
  dismissable?: boolean;
  /**
   * Dismiss by dragging the handle down. Ignored when `dismissable` is false.
   * @default true
   */
  swipeToDismiss?: boolean;
  /**
   * Lift the sheet above the software keyboard (iOS padding behaviour;
   * Android resizes the window natively).
   * @default true
   */
  avoidKeyboard?: boolean;
  /**
   * Accessible name of the dismissing backdrop.
   * @default labels.close from `NativeUIConfig.labels`
   */
  closeAccessibilityLabel?: string;
  /** Sheet fill. @default theme.components.bottomSheet.backgroundColor ?? colors.surface */
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/**
 * Bottom sheet that slides up from the bottom of the screen, built on React
 * Native `Modal` + Reanimated. Every dimension and duration comes from
 * `theme.components.bottomSheet`, overridable via `NativeUIConfig.components`.
 *
 * Supports both the monolithic API and a compound component pattern:
 *
 * @example Monolithic
 * ```tsx
 * <BottomSheet visible={show} onClose={close}>
 *   <Text>Sheet content</Text>
 * </BottomSheet>
 * ```
 *
 * @example Compound
 * ```tsx
 * <BottomSheet visible={show} onClose={close}>
 *   <BottomSheet.Header><Heading level={3}>Options</Heading></BottomSheet.Header>
 *   <BottomSheet.Body><Text>Content here</Text></BottomSheet.Body>
 *   <BottomSheet.Footer layout="fill"><Button title="Done" onPress={close} /></BottomSheet.Footer>
 * </BottomSheet>
 * ```
 */
function BottomSheetComponent(props: BottomSheetProps) {
  const { visible, onClose, dismissable = true, swipeToDismiss = true } = props;
  const { avoidKeyboard = true } = props;
  const theme = useTheme();

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.wrapper}
        behavior={avoidKeyboard && Platform.OS === 'ios' ? 'padding' : undefined}
        enabled={avoidKeyboard}
      >
        <SheetBackdrop
          onDismiss={dismissable ? onClose : undefined}
          accessibilityLabel={props.closeAccessibilityLabel ?? theme.labels.close}
        />
        <SheetPanel
          testID={props.testID}
          onClose={onClose}
          dismissable={dismissable}
          swipeToDismiss={swipeToDismiss}
          backgroundColor={props.backgroundColor}
          style={props.style}
        >
          {props.children}
        </SheetPanel>
      </KeyboardAvoidingView>
    </Modal>
  );
}

/** Header section for BottomSheet compound pattern. */
function BottomSheetHeader({ children, style, testID }: BottomSheetHeaderProps) {
  const tokens = useSheetTokens();

  return (
    <View
      testID={testID}
      style={[
        {
          paddingHorizontal: tokens.paddingHorizontal,
          paddingTop: tokens.headerPaddingTop,
          paddingBottom: tokens.headerPaddingBottom,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

BottomSheetHeader.displayName = 'BottomSheet.Header';

/** Body / scrollable content area for BottomSheet compound pattern. */
function BottomSheetBody({ children, style, testID }: BottomSheetBodyProps) {
  const tokens = useSheetTokens();

  return (
    <View
      testID={testID}
      style={[
        {
          paddingHorizontal: tokens.paddingHorizontal,
          paddingVertical: tokens.bodyPaddingVertical,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

BottomSheetBody.displayName = 'BottomSheet.Body';

const FOOTER_LAYOUT_STYLE: Record<SheetFooterLayout, ViewStyle> = {
  row: { flexDirection: 'row', justifyContent: 'flex-end' },
  fill: { flexDirection: 'row' },
  stacked: { flexDirection: 'column', alignItems: 'stretch' },
};

/** Footer / action bar for BottomSheet compound pattern. */
function BottomSheetFooter({ children, layout, style, testID }: BottomSheetFooterProps) {
  const tokens = useSheetTokens();
  const resolvedLayout = layout ?? tokens.footerLayout;
  /*
   * `fill` gives every action an equal share; wrapping keeps the actions'
   * own styles untouched.
   */
  const content =
    resolvedLayout === 'fill'
      ? React.Children.map(children, (child) =>
          child == null ? null : <View style={styles.fillItem}>{child}</View>,
        )
      : children;

  return (
    <View
      testID={testID}
      style={[
        FOOTER_LAYOUT_STYLE[resolvedLayout],
        {
          gap: tokens.footerGap,
          paddingHorizontal: tokens.paddingHorizontal,
          paddingTop: tokens.footerPaddingTop,
          paddingBottom: tokens.footerPaddingBottom,
        },
        style,
      ]}
    >
      {content}
    </View>
  );
}

BottomSheetFooter.displayName = 'BottomSheet.Footer';

export const BottomSheet = Object.assign(BottomSheetComponent, {
  Header: BottomSheetHeader,
  Body: BottomSheetBody,
  Footer: BottomSheetFooter,
});

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  fillItem: {
    flex: 1,
  },
});
