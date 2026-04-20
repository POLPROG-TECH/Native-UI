import React from 'react';
import { View, StyleSheet, useWindowDimensions, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme';

const MAX_CONTENT_WIDTH = 768;

export interface ScreenContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  /** Add default horizontal padding (default: true) */
  padded?: boolean;
  /** Safe area edges to respect */
  edges?: ('top' | 'bottom')[];
}

/**
 * Full-screen container with safe area insets, background color,
 * and tablet-friendly max-width constraint.
 */
export function ScreenContainer({
  children,
  style,
  padded = true,
  edges = [],
}: ScreenContainerProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isTablet = width > MAX_CONTENT_WIDTH;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
        edges.includes('top') && { paddingTop: insets.top },
        edges.includes('bottom') && { paddingBottom: insets.bottom },
        padded && { paddingHorizontal: theme.spacing.lg },
        isTablet && { alignItems: 'center' },
        style,
      ]}
    >
      {isTablet ? (
        <View style={{ width: '100%', maxWidth: MAX_CONTENT_WIDTH }}>{children}</View>
      ) : (
        children
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
