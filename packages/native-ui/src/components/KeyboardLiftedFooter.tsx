import React, { useRef } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import {
  KEYBOARD_LIFT_DEFAULT_ENABLED,
  useKeyboardLift,
  type ViewRef,
} from '../hooks/useKeyboardLift';

export interface KeyboardLiftedFooterProps {
  children: React.ReactNode;
  /**
   * Lift above the keyboard. Defaults to Android only: on iOS a surrounding
   * `KeyboardAvoidingView` already moves the screen.
   * @default Platform.OS === 'android'
   */
  enabled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/**
 * Bottom action bar for form screens, rendered in normal flow below a
 * ScrollView, that translates itself above the software keyboard where the
 * window does not resize for it (Android edge-to-edge). See
 * `useKeyboardLift` for the measuring strategy.
 *
 * @example
 * ```tsx
 * <ScrollView>{fields}</ScrollView>
 * <KeyboardLiftedFooter>
 *   <Button title="Save" fullWidth onPress={save} />
 * </KeyboardLiftedFooter>
 * ```
 */
export function KeyboardLiftedFooter({
  children,
  enabled = KEYBOARD_LIFT_DEFAULT_ENABLED,
  style,
  testID,
}: KeyboardLiftedFooterProps) {
  const theme = useTheme();
  const ref = useRef<ViewRef>(null);
  const lift = useKeyboardLift(ref, enabled);
  const { liftedElevation } = theme.components.keyboardLiftedFooter;

  return (
    <View
      ref={ref}
      testID={testID}
      style={[
        style,
        lift > 0 && {
          elevation: liftedElevation,
          zIndex: liftedElevation,
          transform: [{ translateY: -lift }],
        },
      ]}
    >
      {children}
    </View>
  );
}
