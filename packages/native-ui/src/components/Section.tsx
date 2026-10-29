import React from 'react';
import { StyleSheet, View, Text, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';

export interface SectionProps {
  /** Section title */
  title: string;
  /** Optional action element in the header (e.g. a link or icon button) */
  action?: React.ReactNode;
  children: React.ReactNode;
  /** Additional styles applied to the section container. */
  style?: StyleProp<ViewStyle>;
  /** Test ID forwarded to the section container. */
  testID?: string;
}

/**
 * Content section with title header and optional action. Geometry comes from
 * `theme.components.section`.
 */
export function Section({ title, action, children, style, testID }: SectionProps) {
  const theme = useTheme();
  const tokens = theme.components.section;

  return (
    <View
      style={[
        { paddingHorizontal: tokens.paddingHorizontal, marginBottom: tokens.marginBottom },
        style,
      ]}
      testID={testID}
    >
      <View style={[styles.header, { marginBottom: tokens.headerMarginBottom }]}>
        <Text style={[theme.typography.h3, { color: theme.colors.textPrimary }]}>{title}</Text>
        {action}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
