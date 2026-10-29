import { createContext, useContext } from 'react';

/**
 * Context indicating that a ListItem/ListSwitchItem is rendered inside a
 * `grouped` ListSection. When true, the row drops its self-contained card
 * styling (bg/radius/margin) so the parent section acts as the single card,
 * with hairline dividers separating siblings: the classic iOS-style
 * "multi-row card" pattern (e.g. a Settings → Sound/Audio card).
 */
export interface ListSectionContextValue {
  grouped: boolean;
}

export const ListSectionContext = createContext<ListSectionContextValue>({ grouped: false });

/** Read the nearest ListSection grouping state (used by ListItem/ListSwitchItem). */
export function useListSectionContext(): ListSectionContextValue {
  return useContext(ListSectionContext);
}
