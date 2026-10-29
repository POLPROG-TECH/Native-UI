import { useCallback, useEffect, useState } from 'react';
import { Platform, type PressableProps, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import type { Theme } from '../theme/types';
import { lastInputWasKeyboard, trackInputModality } from './inputModality';

type FocusHandler = PressableProps['onFocus'];
type BlurHandler = PressableProps['onBlur'];

export interface FocusRingResult {
  /** Spread onto the focusable element; chains the caller's own handlers. */
  focusProps: { onFocus: NonNullable<FocusHandler>; onBlur: NonNullable<BlurHandler> };
  /** Outline to append to the element's style (undefined when not needed). */
  focusRingStyle: ViewStyle | undefined;
  isFocusVisible: boolean;
}

/** Web draws its own ring for keyboard focus; hide it so only ours shows. */
const WEB_NO_OUTLINE: ViewStyle = { outlineWidth: 0 };

/**
 * Themed keyboard focus indicator (web, Android TV, hardware keyboards).
 * Shown only when focus came from the keyboard, sized and colored by
 * `theme.components.focusRing`.
 */
export function useFocusRing(onFocus?: FocusHandler, onBlur?: BlurHandler): FocusRingResult {
  const theme = useTheme();
  const [isFocusVisible, setFocusVisible] = useState(false);

  useEffect(trackInputModality, []);

  const handleFocus = useCallback<NonNullable<FocusHandler>>(
    (event) => {
      setFocusVisible(lastInputWasKeyboard());
      onFocus?.(event);
    },
    [onFocus],
  );
  const handleBlur = useCallback<NonNullable<BlurHandler>>(
    (event) => {
      setFocusVisible(false);
      onBlur?.(event);
    },
    [onBlur],
  );

  return {
    focusProps: { onFocus: handleFocus, onBlur: handleBlur },
    focusRingStyle: isFocusVisible ? buildRingStyle(theme) : idleRingStyle(),
    isFocusVisible,
  };
}

function buildRingStyle(theme: Theme): ViewStyle {
  const tokens = theme.components.focusRing;

  return {
    outlineStyle: 'solid',
    outlineWidth: tokens.width,
    outlineOffset: tokens.offset,
    outlineColor: tokens.color ?? theme.colors.primaryText,
  };
}

function idleRingStyle(): ViewStyle | undefined {
  return Platform.OS === 'web' ? WEB_NO_OUTLINE : undefined;
}
