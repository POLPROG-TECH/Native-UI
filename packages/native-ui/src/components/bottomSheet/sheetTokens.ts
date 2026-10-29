import { createContext, useContext } from 'react';
import { useTheme } from '../../theme';
import type { Theme } from '../../theme/types';
import type { BottomSheetTokens } from '../../tokens/components';

/** Tokens of the enclosing sheet, so compound parts match their container. */
export const SheetTokensContext = createContext<BottomSheetTokens | null>(null);

export function useSheetTokens(): BottomSheetTokens {
  const theme = useTheme();

  return useContext(SheetTokensContext) ?? theme.components.bottomSheet;
}

export interface SheetDurations {
  enterMs: number;
  exitMs: number;
}

/** Enter/exit durations, collapsed to zero when the user reduces motion. */
export function resolveSheetDurations(theme: Theme): SheetDurations {
  const tokens = theme.components.bottomSheet;

  if (theme.reduceAnimations) {
    return { enterMs: 0, exitMs: 0 };
  }

  return { enterMs: tokens.enterDurationMs, exitMs: tokens.exitDurationMs };
}
