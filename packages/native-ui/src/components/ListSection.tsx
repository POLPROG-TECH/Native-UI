import React, { createContext, useContext } from 'react';
import { StyleSheet, View, Text, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';

/**
 * Context indicating that a ListItem/ListSwitchItem is rendered inside a
 * `grouped` ListSection. When true, the row drops its self-contained card
 * styling (bg/radius/margin) so the parent section acts as the single card,
 * with hairline dividers separating siblings - the classic iOS-style
 * "multi-row card" pattern (e.g. a Settings → Sound/Audio card).
 */
export interface ListSectionContextValue {
  grouped: boolean;
}

const ListSectionContext = createContext<ListSectionContextValue>({ grouped: false });

/** Read the nearest ListSection grouping state (used by ListItem/ListSwitchItem). */
export function useListSectionContext(): ListSectionContextValue {
  return useContext(ListSectionContext);
}

export interface ListSectionProps {
  /** Section title (rendered uppercase, tertiary color). */
  title?: string;
  /** Footer note below the section. */
  footer?: string;
  /**
   * When `true`, wraps all children in a single rounded card with hairline
   * dividers between rows (iOS-style "multi-row card" pattern).
   * When `false` (default), each child row renders as its own card
   * (iOS-style per-row card pattern, e.g. Appearance, Language).
   */
  grouped?: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
}

/**
 * Grouped list section with an optional uppercase title and footer.
 *
 * Two visual modes:
 * - Default (`grouped={false}`): each child row is its own rounded card.
 * - `grouped`: children share a single rounded card, separated by hairlines.
 */
export function ListSection({ title, footer, grouped = false, children, style }: ListSectionProps) {
  const theme = useTheme();

  const childArray = React.Children.toArray(children);

  const body = grouped ? (
    <View
      style={{
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        paddingVertical: theme.spacing.xs,
        paddingHorizontal: theme.spacing.md,
      }}
    >
      {childArray.map((child, idx) => {
        const prevChild = idx > 0 ? childArray[idx - 1] : undefined;
        const prevProps = React.isValidElement(prevChild)
          ? (prevChild.props as { hideDivider?: boolean })
          : undefined;
        const showDivider = idx > 0 && !prevProps?.hideDivider;
        return (
          <React.Fragment key={idx}>
            {showDivider && (
              <View
                style={{
                  height: StyleSheet.hairlineWidth,
                  backgroundColor: theme.colors.divider,
                  marginVertical: theme.spacing.xs,
                }}
              />
            )}
            {child}
          </React.Fragment>
        );
      })}
    </View>
  ) : (
    <View>{children}</View>
  );

  return (
    <ListSectionContext.Provider value={{ grouped }}>
      <View style={[{ marginBottom: theme.spacing.lg }, style]}>
        {title && (
          <Text
            style={[
              theme.typography.overline,
              {
                color: theme.colors.textTertiary,
                marginTop: theme.spacing.lg,
                marginBottom: theme.spacing.sm,
                textTransform: 'uppercase',
              },
            ]}
            accessibilityRole="header"
          >
            {title}
          </Text>
        )}
        {body}
        {footer && (
          <Text
            style={[
              theme.typography.caption,
              {
                color: theme.colors.textTertiary,
                marginTop: theme.spacing.sm,
              },
            ]}
          >
            {footer}
          </Text>
        )}
      </View>
    </ListSectionContext.Provider>
  );
}
