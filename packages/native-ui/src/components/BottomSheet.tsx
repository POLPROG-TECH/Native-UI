import React from 'react';
import { StyleSheet, View, Modal, Pressable, type ViewStyle, type StyleProp } from 'react-native';
import Animated, { FadeIn, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { useTheme } from '../theme';

// ─── Compound sub-component props ──────────────────────────────

export interface BottomSheetHeaderProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export interface BottomSheetBodyProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export interface BottomSheetFooterProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

// ─── Main bottom sheet props ───────────────────────────────────

export interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Close on backdrop press (default: true) */
  dismissable?: boolean;
  style?: ViewStyle;
}

/**
 * A basic bottom sheet that slides up from the bottom of the screen.
 * Uses React Native Modal + Reanimated for animation.
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
 *   <BottomSheet.Header><Heading level={2}>Title</Heading></BottomSheet.Header>
 *   <BottomSheet.Body><Text>Content</Text></BottomSheet.Body>
 *   <BottomSheet.Footer><Button title="Done" onPress={close} /></BottomSheet.Footer>
 * </BottomSheet>
 * ```
 */
function BottomSheetComponent({
  visible,
  onClose,
  children,
  dismissable = true,
  style,
}: BottomSheetProps) {
  const theme = useTheme();
  const enterDuration = theme.reduceAnimations ? 0 : 300;
  const exitDuration = theme.reduceAnimations ? 0 : 200;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.wrapper}>
        <Animated.View
          entering={FadeIn.duration(enterDuration)}
          style={[styles.backdrop, { backgroundColor: theme.colors.overlay }]}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={dismissable ? onClose : undefined} />
        </Animated.View>

        <Animated.View
          entering={SlideInDown.duration(enterDuration)}
          exiting={SlideOutDown.duration(exitDuration)}
          style={[
            styles.sheet,
            {
              backgroundColor: theme.colors.surface,
              borderTopLeftRadius: theme.borderRadius.xl,
              borderTopRightRadius: theme.borderRadius.xl,
            },
            theme.elevation.xl as ViewStyle,
            style,
          ]}
        >
          <View style={styles.handle}>
            <View style={[styles.handleBar, { backgroundColor: theme.colors.border }]} />
          </View>
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

// ─── Compound sub-components ───────────────────────────────────

/** Header section for BottomSheet compound pattern. */
function BottomSheetHeader({ children, style }: BottomSheetHeaderProps) {
  return <View style={[styles.header, style]}>{children}</View>;
}
BottomSheetHeader.displayName = 'BottomSheet.Header';

/** Body / scrollable content area for BottomSheet compound pattern. */
function BottomSheetBody({ children, style }: BottomSheetBodyProps) {
  return <View style={[styles.body, style]}>{children}</View>;
}
BottomSheetBody.displayName = 'BottomSheet.Body';

/** Footer / action bar for BottomSheet compound pattern. */
function BottomSheetFooter({ children, style }: BottomSheetFooterProps) {
  return <View style={[styles.footer, style]}>{children}</View>;
}
BottomSheetFooter.displayName = 'BottomSheet.Footer';

// ─── Assemble compound component ──────────────────────────────

export const BottomSheet = Object.assign(BottomSheetComponent, {
  Header: BottomSheetHeader,
  Body: BottomSheetBody,
  Footer: BottomSheetFooter,
});

// ─── Styles ───────────────────────────────────────────────────

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...(StyleSheet.absoluteFill as object),
  },
  sheet: {
    paddingBottom: 34,
    maxHeight: '80%',
  },
  handle: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  handleBar: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 8,
  },
  body: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
});
