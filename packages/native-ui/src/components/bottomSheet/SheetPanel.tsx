import React from 'react';
import {
  StyleSheet,
  View,
  type GestureResponderHandlers,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import type { Theme } from '../../theme/types';
import { SheetTokensContext, resolveSheetDurations } from './sheetTokens';
import { useSheetDrag } from './useSheetDrag';

export interface SheetPanelProps {
  children: React.ReactNode;
  onClose: () => void;
  dismissable: boolean;
  swipeToDismiss: boolean;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

function buildPanelStyle(theme: Theme, bottomInset: number, backgroundColor?: string): ViewStyle {
  const tokens = theme.components.bottomSheet;

  return {
    /*
     * Full width up to `maxWidth`, then centered: phones keep the edge to
     * edge sheet, tablets and web get a readable column instead of a bar.
     */
    width: '100%',
    maxWidth: tokens.maxWidth,
    alignSelf: 'center',
    maxHeight: tokens.maxHeight,
    backgroundColor: backgroundColor ?? tokens.backgroundColor ?? theme.colors.surface,
    borderTopLeftRadius: tokens.radius,
    borderTopRightRadius: tokens.radius,
    paddingBottom: Math.max(bottomInset, tokens.minBottomPadding),
  };
}

/** Drag handle: decorative for screen readers, which use the escape gesture. */
function SheetHandle({ panHandlers }: { panHandlers?: GestureResponderHandlers }) {
  const theme = useTheme();
  const tokens = theme.components.bottomSheet;

  return (
    <View
      style={[styles.handle, { paddingVertical: tokens.handlePaddingVertical }]}
      importantForAccessibility="no"
      accessibilityElementsHidden
      {...panHandlers}
    >
      <View
        style={{
          width: tokens.handleWidth,
          height: tokens.handleHeight,
          borderRadius: tokens.handleHeight / 2,
          backgroundColor: theme.colors.border,
        }}
      />
    </View>
  );
}

/** The sliding sheet surface: handle, drag gesture and content. */
export function SheetPanel(props: SheetPanelProps) {
  const { dismissable, onClose } = props;
  const theme = useTheme();
  const tokens = theme.components.bottomSheet;
  const insets = useSafeAreaInsets();
  const { enterMs, exitMs } = resolveSheetDurations(theme);
  const drag = useSheetDrag(dismissable && props.swipeToDismiss, tokens, onClose);
  const panelStyle = buildPanelStyle(theme, insets.bottom, props.backgroundColor);

  return (
    <Animated.View
      testID={props.testID}
      entering={SlideInDown.duration(enterMs)}
      exiting={SlideOutDown.duration(exitMs)}
      style={[panelStyle, theme.elevation.xl, drag.animatedStyle, props.style]}
      accessibilityViewIsModal
      /*
       * The backdrop sits outside this modal view, so VoiceOver cannot
       * focus it; the two-finger "escape" gesture closes instead.
       */
      onAccessibilityEscape={dismissable ? onClose : undefined}
    >
      <SheetHandle panHandlers={drag.panHandlers} />
      <SheetTokensContext.Provider value={tokens}>{props.children}</SheetTokensContext.Provider>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  handle: {
    alignItems: 'center',
  },
});
