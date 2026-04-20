import { Dimensions } from 'react-native';
import type { Spacing } from './spacing';
import { spacing } from './spacing';

type Breakpoint = 'compact' | 'regular' | 'expanded';

const BREAKPOINTS = {
  compact: 0, // phones portrait
  regular: 600, // phones landscape / small tablets
  expanded: 840, // tablets
} as const;

function getBreakpoint(): Breakpoint {
  const { width } = Dimensions.get('window');
  if (width >= BREAKPOINTS.expanded) return 'expanded';
  if (width >= BREAKPOINTS.regular) return 'regular';
  return 'compact';
}

export interface ResponsiveSpacing {
  pageHorizontal: number;
  pageVertical: number;
  sectionGap: number;
  cardPadding: number;
}

const RESPONSIVE_MAP: Record<Breakpoint, Record<keyof ResponsiveSpacing, Spacing>> = {
  compact: {
    pageHorizontal: 'lg', // 16
    pageVertical: 'xl', // 20
    sectionGap: '2xl', // 24
    cardPadding: 'lg', // 16
  },
  regular: {
    pageHorizontal: 'xl', // 20
    pageVertical: '2xl', // 24
    sectionGap: '3xl', // 32
    cardPadding: 'xl', // 20
  },
  expanded: {
    pageHorizontal: '3xl', // 32
    pageVertical: '3xl', // 32
    sectionGap: '2xl', // 40
    cardPadding: '2xl', // 24
  },
};

export function getResponsiveSpacing(): ResponsiveSpacing {
  const bp = getBreakpoint();
  const map = RESPONSIVE_MAP[bp];
  return {
    pageHorizontal: spacing[map.pageHorizontal],
    pageVertical: spacing[map.pageVertical],
    sectionGap: spacing[map.sectionGap],
    cardPadding: spacing[map.cardPadding],
  };
}

export { getBreakpoint, BREAKPOINTS };
export type { Breakpoint };
