import React from 'react';
import { StyleSheet, View, Text, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';

export interface SectionProps {
  /** Section title */
  title: string;
  /** Optional action element in the header (e.g. a link or icon button) */
  action?: React.ReactNode;
  children: React.ReactNode;
  style?: ViewStyle;
}

/**
 * Content section with title header and optional action.
 */
export function Section({ title, action, children, style }: SectionProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={[theme.typography.h3, { color: theme.colors.textPrimary }]}>{title}</Text>
        {action}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
});
