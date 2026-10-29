import { Dimensions } from 'react-native';
import type { Spacing } from './spacing';
import { spacing } from './spacing';

type Breakpoint = 'compact' | 'regular' | 'expanded';

const BREAKPOINTS = {
  compact: 0 /* phones portrait */,
  regular: 600 /* phones landscape / small tablets */,
  expanded: 840 /* tablets */,
} as const;

function getBreakpoint(): Breakpoint {
  const { width } = Dimensions.get('window');

  if (width >= BREAKPOINTS.expanded) {
    return 'expanded';
  }

  if (width >= BREAKPOINTS.regular) {
    return 'regular';
  }

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
    pageHorizontal: 'lg',
    pageVertical: 'xl',
    sectionGap: '2xl',
    cardPadding: 'lg',
  },
  regular: {
    pageHorizontal: 'xl',
    pageVertical: '2xl',
    sectionGap: '3xl',
    cardPadding: 'xl',
  },
  expanded: {
    pageHorizontal: '3xl',
    pageVertical: '3xl',
    sectionGap: '2xl',
    cardPadding: '2xl',
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
