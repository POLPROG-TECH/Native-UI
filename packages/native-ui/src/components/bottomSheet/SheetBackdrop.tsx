import { Pressable, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '../../theme';
import { resolveSheetDurations } from './sheetTokens';

export interface SheetBackdropProps {
  /** Closes the sheet; `undefined` makes the backdrop inert. */
  onDismiss?: () => void;
  accessibilityLabel: string;
}

/**
 * Dimmed overlay behind the sheet. When it cannot dismiss, it is hidden from
 * assistive technology instead of being announced as a dead button.
 */
export function SheetBackdrop({ onDismiss, accessibilityLabel }: SheetBackdropProps) {
  const theme = useTheme();
  const { enterMs } = resolveSheetDurations(theme);

  return (
    <Animated.View
      entering={FadeIn.duration(enterMs)}
      style={[StyleSheet.absoluteFill, { backgroundColor: theme.colors.overlay }]}
    >
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={onDismiss}
        {...(onDismiss
          ? { accessibilityRole: 'button' as const, accessibilityLabel }
          : { importantForAccessibility: 'no-hide-descendants' as const })}
      />
    </Animated.View>
  );
}
