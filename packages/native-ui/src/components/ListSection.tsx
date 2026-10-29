import React, { useMemo } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import { GroupedRows } from './listSection/GroupedRows';
import { ListSectionFooter, ListSectionTitle } from './listSection/ListSectionLabels';
import { ListSectionContext, type ListSectionContextValue } from './listSection/listSectionContext';

export { useListSectionContext } from './listSection/listSectionContext';
export type { ListSectionContextValue } from './listSection/listSectionContext';

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
  /** Additional styles applied to the section container. */
  style?: StyleProp<ViewStyle>;
  /** Test ID forwarded to the section container. */
  testID?: string;
}

/**
 * Grouped list section with an optional uppercase title and footer.
 *
 * Two visual modes:
 * - Default (`grouped={false}`): each child row is its own rounded card.
 * - `grouped`: children share a single rounded card, separated by hairlines.
 *
 * Geometry comes from `theme.components.listSection`; the hairline thickness
 * follows `theme.components.divider.thickness`.
 */
export function ListSection({
  title,
  footer,
  grouped = false,
  children,
  style,
  testID,
}: ListSectionProps) {
  const theme = useTheme();
  const contextValue = useMemo<ListSectionContextValue>(() => ({ grouped }), [grouped]);

  return (
    <ListSectionContext.Provider value={contextValue}>
      <View
        style={[{ marginBottom: theme.components.listSection.marginBottom }, style]}
        testID={testID}
      >
        {title && <ListSectionTitle title={title} />}
        {grouped ? <GroupedRows>{children}</GroupedRows> : <View>{children}</View>}
        {footer && <ListSectionFooter footer={footer} />}
      </View>
    </ListSectionContext.Provider>
  );
}
