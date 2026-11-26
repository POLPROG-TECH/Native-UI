import { useCallback, useState } from 'react';
import { getHaptics, type HapticsInterface } from '../../utils/haptics';

export interface AccordionStateOptions {
  /** Controlled state; when set, the component never keeps its own. */
  expanded: boolean | undefined;
  defaultExpanded: boolean;
  haptic: keyof HapticsInterface | false;
  onExpandedChange: ((expanded: boolean) => void) | undefined;
}

export function useAccordionState(options: AccordionStateOptions) {
  const { expanded, haptic, onExpandedChange } = options;
  const [ownExpanded, setOwnExpanded] = useState(options.defaultExpanded);
  const isExpanded = expanded ?? ownExpanded;

  const toggle = useCallback(() => {
    if (haptic) {
      getHaptics()[haptic]();
    }

    setOwnExpanded(!isExpanded);
    onExpandedChange?.(!isExpanded);
  }, [haptic, isExpanded, onExpandedChange]);

  return { isExpanded, toggle };
}
