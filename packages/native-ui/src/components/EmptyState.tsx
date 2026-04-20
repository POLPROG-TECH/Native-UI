import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

export interface EmptyStateProps {
  /** Leading emoji or icon string rendered above the title. */
  icon?: string;
  /** Primary heading text. */
  title: string;
  /** Optional descriptive message rendered below the title. */
  message?: string;
  /** Action element (e.g. a `<Button />`) rendered below the message. */
  action?: React.ReactNode;
}

/**
 * Centered empty/zero-state placeholder with icon, title, message, and
 * optional action. Use inside scrollable containers or full-screen views
 * when there is no data to display.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   icon="📭"
 *   title="No messages"
 *   message="You're all caught up!"
 *   action={<Button title="Refresh" onPress={refresh} />}
 * />
 * ```
 */
export function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  const theme = useTheme();

  return (
    <View style={styles.container} accessibilityRole="summary">
      {icon && (
        <Text style={styles.icon} accessibilityElementsHidden>
          {icon}
        </Text>
      )}
      <Text
        style={[theme.typography.h3, { color: theme.colors.textPrimary, textAlign: 'center' }]}
        accessibilityRole="header"
      >
        {title}
      </Text>
      {message && (
        <Text
          style={[
            theme.typography.body,
            {
              color: theme.colors.textSecondary,
              textAlign: 'center',
              marginTop: 8,
            },
          ]}
        >
          {message}
        </Text>
      )}
      {action && <View style={styles.actionContainer}>{action}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  actionContainer: {
    marginTop: 20,
  },
});
