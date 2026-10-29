import { useCallback, useState } from 'react';
import type { SelectOption, SelectProps } from './types';

type SelectStateInput<T extends string> = Pick<
  SelectProps<T>,
  'value' | 'options' | 'onChange' | 'disabled'
>;

export interface SelectState<T extends string> {
  isOpen: boolean;
  /** `value`, or `null` when nothing is selected. */
  resolvedValue: T | null;
  selectedOption: SelectOption<T> | undefined;
  /** Notifies `onChange`, then closes the sheet. */
  select: (value: T) => void;
  /** No-op while disabled. */
  open: () => void;
  close: () => void;
}

/**
 * Open state and selection of the monolithic Select; picking an option
 * notifies `onChange` and closes the sheet.
 */
export function useSelectState<T extends string>(props: SelectStateInput<T>): SelectState<T> {
  const { value, options, onChange, disabled } = props;
  const [isOpen, setIsOpen] = useState(false);
  const resolvedValue = value ?? null;
  const selectedOption = options.find((o) => o.value === resolvedValue);

  const select = useCallback(
    (optionValue: T) => {
      onChange?.(optionValue);
      setIsOpen(false);
    },
    [onChange],
  );

  const open = useCallback(() => {
    if (!disabled) {
      setIsOpen(true);
    }
  }, [disabled]);

  const close = useCallback(() => setIsOpen(false), []);

  return { isOpen, resolvedValue, selectedOption, select, open, close };
}
