import { useCallback, type KeyboardEvent, type RefObject } from 'react';

/** Marks the focusable link of a result row; rows without a docs page have none. */
export const RESULT_LINK_ATTRIBUTE = 'data-search-result';
/** Marks a result row, so arrows also work while a copy button in the row has focus. */
export const RESULT_ROW_ATTRIBUTE = 'data-result-row';

const STEP_BY_KEY: Partial<Record<string, number>> = { ArrowDown: 1, ArrowUp: -1 };

function resultLinks(container: HTMLElement | null): HTMLElement[] {
  if (container === null) {
    return [];
  }

  return Array.from(container.querySelectorAll<HTMLElement>(`[${RESULT_LINK_ATTRIBUTE}]`));
}

function rowIndexOf(links: readonly HTMLElement[], target: EventTarget): number {
  if (!(target instanceof Node)) {
    return -1;
  }

  return links.findIndex((link) => link.closest(`[${RESULT_ROW_ATTRIBUTE}]`)?.contains(target));
}

interface ResultsKeyboardOptions {
  fieldRef: RefObject<HTMLInputElement | null>;
  resultsRef: RefObject<HTMLElement | null>;
  onClear: () => void;
}

export interface ResultsKeyboard {
  onFieldKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  onResultsKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
}

/**
 * Keyboard model of the results: real focus moves between result links (so
 * screen readers announce each link and Enter opens it natively), ArrowUp from
 * the first result and Escape return to the field, and Enter in the field
 * opens the top result.
 */
export function useResultsKeyboard({
  fieldRef,
  resultsRef,
  onClear,
}: ResultsKeyboardOptions): ResultsKeyboard {
  const onFieldKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      const first = resultLinks(resultsRef.current)[0];

      if (event.key === 'Escape') {
        event.preventDefault();
        onClear();

        return;
      }

      if (first === undefined || (event.key !== 'ArrowDown' && event.key !== 'Enter')) {
        return;
      }

      event.preventDefault();

      if (event.key === 'Enter') {
        first.click();

        return;
      }

      first.focus();
    },
    [resultsRef, onClear],
  );

  const onResultsKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      const step = STEP_BY_KEY[event.key];

      if (event.key === 'Escape') {
        event.preventDefault();
        fieldRef.current?.focus();

        return;
      }

      if (step === undefined) {
        return;
      }

      event.preventDefault();
      moveFocus(resultLinks(resultsRef.current), event.target, step, fieldRef.current);
    },
    [fieldRef, resultsRef],
  );

  return { onFieldKeyDown, onResultsKeyDown };
}

/** Focuses the link `step` rows away from the focused row; above the first goes back to the field. */
function moveFocus(
  links: readonly HTMLElement[],
  target: EventTarget,
  step: number,
  field: HTMLInputElement | null,
): void {
  const next = rowIndexOf(links, target) + step;

  if (next < 0) {
    field?.focus();

    return;
  }

  links[Math.min(next, links.length - 1)]?.focus();
}
