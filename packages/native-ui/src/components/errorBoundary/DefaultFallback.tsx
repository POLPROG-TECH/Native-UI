import { StyleSheet, Text, View, type TextStyle } from 'react-native';
import { renderIconSlot, type IconRenderProps, type IconSlot } from '../../primitives/iconSlot';
import { SystemIcon } from '../../primitives/SystemIcon';
import { useTheme } from '../../theme';
import { Button } from '../Button';

/** Fixed line cap of the built-in fallback; consumers wanting others pass their own UI. */
const MESSAGE_MAX_LINES = 4;

/** Drawn glyph instead of an emoji, so it matches the theme on every platform. */
export function renderDefaultFallbackIcon({ color, size }: IconRenderProps) {
  return <SystemIcon name="alert" color={color} size={size} testID="error-boundary-icon" />;
}

/** Decorative icon in `errorText`; `null` hides it. */
function FallbackIcon({ icon }: { icon: IconSlot }) {
  const theme = useTheme();

  if (icon == null || icon === false) {
    return null;
  }

  return (
    <View
      style={{ marginBottom: theme.spacing.md }}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {renderIconSlot(icon, {
        color: theme.colors.errorText,
        size: theme.components.errorBoundary.iconSize,
      })}
    </View>
  );
}

export interface DefaultFallbackProps {
  message: string | undefined;
  retryLabel: string | undefined;
  icon: IconSlot;
  onReset: () => void;
}

/** Built-in fallback: icon, message and a retry button that resets the boundary. */
export function DefaultFallback({ message, retryLabel, icon, onReset }: DefaultFallbackProps) {
  const theme = useTheme();
  const messageStyle: TextStyle = {
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.surface, padding: theme.spacing.xl },
      ]}
      accessibilityRole="alert"
    >
      <FallbackIcon icon={icon} />
      <Text style={[theme.typography.body, messageStyle]} numberOfLines={MESSAGE_MAX_LINES}>
        {message ?? theme.labels.errorMessage}
      </Text>
      <Button title={retryLabel ?? theme.labels.errorRetry} onPress={onReset} variant="secondary" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
