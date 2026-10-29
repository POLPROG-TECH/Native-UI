import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
} from 'react-native';
import { useTheme } from '../../theme';

/** The Button props that describe what is drawn inside the pressable. */
export interface ButtonContentSource {
  title: string;
  icon?: React.ReactNode;
  renderLeft?: () => React.ReactNode;
  renderRight?: () => React.ReactNode;
  renderBackground?: () => React.ReactNode;
  numberOfLines?: number;
}

export interface ButtonContentProps {
  content: ButtonContentSource;
  loading: boolean;
  labelStyle: StyleProp<TextStyle>;
  spinnerColor: string;
}

/** Custom fill layer, clipped by the container and transparent to touches. */
function ButtonBackground({ render }: { render: () => React.ReactNode }) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {render()}
    </View>
  );
}

function ButtonSpinner({ color }: { color: string }) {
  return (
    <View style={styles.spinner} pointerEvents="none">
      <ActivityIndicator color={color} size="small" />
    </View>
  );
}

/** Everything inside the Button pressable: background, label row and spinner. */
export function ButtonContent({ content, loading, labelStyle, spinnerColor }: ButtonContentProps) {
  const tokens = useTheme().components.button;
  const { renderLeft, renderBackground } = content;

  return (
    <>
      {renderBackground ? <ButtonBackground render={renderBackground} /> : null}
      {/* The label stays mounted (hidden) while loading so the button keeps
          its width instead of collapsing around the spinner. */}
      <View style={[styles.content, { gap: tokens.gap }, loading && styles.hidden]}>
        {renderLeft ? renderLeft() : content.icon}
        <Text style={labelStyle} numberOfLines={content.numberOfLines ?? tokens.maxLabelLines}>
          {content.title}
        </Text>
        {content.renderRight?.()}
      </View>
      {loading ? <ButtonSpinner color={spinnerColor} /> : null}
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hidden: {
    opacity: 0,
  },
  spinner: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
