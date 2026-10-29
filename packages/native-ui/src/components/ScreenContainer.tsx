import React from 'react';
import {
  View,
  StyleSheet,
  useWindowDimensions,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme';

export interface ScreenContainerProps {
  children: React.ReactNode;
  /** Additional styles applied to the screen container. */
  style?: StyleProp<ViewStyle>;
  /** Test ID forwarded to the screen container. */
  testID?: string;
  /** Add default horizontal padding (default: true) */
  padded?: boolean;
  /** Safe area edges to respect */
  edges?: ('top' | 'bottom')[];
}

interface ScreenFrameOptions {
  edges: readonly ('top' | 'bottom')[];
  padded: boolean;
  isTablet: boolean;
}

/** Background, requested safe-area edges, gutters and tablet centering. */
function useScreenFrameStyle({ edges, padded, isTablet }: ScreenFrameOptions) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { paddingHorizontal } = theme.components.screenContainer;

  return [
    styles.container,
    { backgroundColor: theme.colors.background },
    edges.includes('top') && { paddingTop: insets.top },
    edges.includes('bottom') && { paddingBottom: insets.bottom },
    padded && { paddingHorizontal },
    isTablet && { alignItems: 'center' as const },
  ];
}

/**
 * Full-screen container with safe area insets, background color,
 * and tablet-friendly max-width constraint. Padding and the content width cap
 * come from `theme.components.screenContainer`.
 */
export function ScreenContainer({
  children,
  style,
  padded = true,
  edges = [],
  testID,
}: ScreenContainerProps) {
  const { maxContentWidth } = useTheme().components.screenContainer;
  const isTablet = useWindowDimensions().width > maxContentWidth;
  const frameStyle = useScreenFrameStyle({ edges, padded, isTablet });

  return (
    <View style={[...frameStyle, style]} testID={testID}>
      {isTablet ? (
        <View style={[styles.content, { maxWidth: maxContentWidth }]}>{children}</View>
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
  content: {
    width: '100%',
  },
});
