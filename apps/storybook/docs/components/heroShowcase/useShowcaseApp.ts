import { useCallback, useEffect, useMemo, useState } from 'react';
import { useShowcaseCopy } from './showcaseCopy';
import {
  SHOWCASE_BUDGET_TOTAL,
  SHOWCASE_EXPENSES,
  SHOWCASE_SEND_DELAY_MS,
  initialPaidIds,
  localizeExpenses,
  matchesExpense,
  type Expense,
  type ExpenseCategory,
  type ExpenseFilter,
  type ShowcaseTab,
} from './showcaseData';

export type QuoteStatus = 'idle' | 'sending' | 'sent';

/**
 * Everything the demo app remembers. It lives above the scene layers, so a
 * theme reveal (two layers rendered at once) never resets what the visitor
 * did: the old and new themes show the same tab, list and switches.
 */
export interface ShowcaseApp {
  tab: ShowcaseTab;
  selectTab: (tab: ShowcaseTab) => void;
  query: string;
  setQuery: (query: string) => void;
  filter: ExpenseFilter;
  setFilter: (filter: ExpenseFilter) => void;
  /** Every expense, titled in the docs language. */
  expenses: readonly Expense[];
  /** Expenses matching the filter and query; the query matches the translated titles. */
  visibleExpenses: readonly Expense[];
  isPaid: (id: string) => boolean;
  togglePaid: (id: string) => void;
  spent: number;
  /** Paid amount per category, for the Overview split bar. */
  spentByCategory: Record<ExpenseCategory, number>;
  spentRatio: number;
  left: number;
  alerts: boolean;
  setAlerts: (value: boolean) => void;
  quote: QuoteStatus;
  sendQuote: () => void;
}

function usePaidExpenses() {
  const [paidIds, setPaidIds] = useState(initialPaidIds);

  const togglePaid = useCallback((id: string) => {
    setPaidIds((current) => {
      const next = new Set(current);

      if (!next.delete(id)) {
        next.add(id);
      }

      return next;
    });
  }, []);

  const spent = useMemo(
    () =>
      SHOWCASE_EXPENSES.filter(({ id }) => paidIds.has(id)).reduce(
        (sum, expense) => sum + expense.amount,
        0,
      ),
    [paidIds],
  );

  const spentByCategory = useMemo(() => {
    const totals: Record<ExpenseCategory, number> = { materials: 0, labour: 0 };

    SHOWCASE_EXPENSES.filter(({ id }) => paidIds.has(id)).forEach((expense) => {
      totals[expense.category] += expense.amount;
    });

    return totals;
  }, [paidIds]);

  const isPaid = useCallback((id: string) => paidIds.has(id), [paidIds]);

  return { isPaid, togglePaid, spent, spentByCategory };
}

/** Fake "send" with a loading state; the timer is cleared if the hero unmounts. */
function useQuote() {
  const [quote, setQuote] = useState<QuoteStatus>('idle');

  useEffect(() => {
    if (quote !== 'sending') {
      return undefined;
    }

    const timer = window.setTimeout(() => setQuote('sent'), SHOWCASE_SEND_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [quote]);

  const sendQuote = useCallback(() => {
    setQuote((current) => (current === 'sending' ? current : 'sending'));
  }, []);

  return { quote, sendQuote };
}

/** Expenses in the docs language, narrowed by the Expenses tab's search and filter. */
function useExpenseList() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<ExpenseFilter>('all');
  const { titles } = useShowcaseCopy().expenses;
  const expenses = useMemo(() => localizeExpenses(titles), [titles]);

  const visibleExpenses = useMemo(
    () => expenses.filter((expense) => matchesExpense(expense, filter, query)),
    [expenses, filter, query],
  );

  return { query, setQuery, filter, setFilter, expenses, visibleExpenses };
}

export function useShowcaseApp(): ShowcaseApp {
  const [tab, selectTab] = useState<ShowcaseTab>('overview');
  const [alerts, setAlerts] = useState(true);
  const list = useExpenseList();
  const { isPaid, togglePaid, spent, spentByCategory } = usePaidExpenses();
  const { quote, sendQuote } = useQuote();

  return {
    tab,
    selectTab,
    ...list,
    isPaid,
    togglePaid,
    spent,
    spentByCategory,
    spentRatio: spent / SHOWCASE_BUDGET_TOTAL,
    left: SHOWCASE_BUDGET_TOTAL - spent,
    alerts,
    setAlerts,
    quote,
    sendQuote,
  };
}
