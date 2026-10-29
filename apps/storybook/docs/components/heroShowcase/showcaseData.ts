import { useCallback } from 'react';
import { useDocsLanguage, type DocsLanguage } from '../../../shared/docsGlobals';

export type ShowcaseTab = 'overview' | 'expenses' | 'settings';

export type ExpenseCategory = 'materials' | 'labour';

export type ExpenseFilter = 'all' | ExpenseCategory;

export type ExpenseId = 'tiles' | 'plumber' | 'cabinets' | 'electric' | 'worktop' | 'painting';

/** Language-neutral part of an expense; titles are translated in `showcaseCopy.ts`. */
export interface ExpenseRecord {
  id: ExpenseId;
  /** Company or person name, shown as written in every language. */
  vendor: string;
  amount: number;
  category: ExpenseCategory;
  /** Paid on first render; the demo lets visitors toggle it. */
  initiallyPaid: boolean;
}

/** An expense as the screens show it, with the title in the docs language. */
export interface Expense extends ExpenseRecord {
  title: string;
}

interface MoneyFormat {
  currency: string;
  /** BCP 47 locale per docs language, so separators and symbol placement follow the reader. */
  locales: Record<DocsLanguage, string>;
}

/** Currency of every amount on the demo screen and the locale each language formats it in. */
export const SHOWCASE_MONEY = {
  currency: 'EUR',
  locales: { en: 'en-IE', pl: 'pl-PL' },
} as const satisfies MoneyFormat;

export const SHOWCASE_BUDGET_TOTAL = 18000;

/** How long the CTA shows its loading state before confirming. */
export const SHOWCASE_SEND_DELAY_MS = 1200;

/** Rows the Overview screen previews from the expense list. */
export const SHOWCASE_RECENT_COUNT = 2;

export const SHOWCASE_TABS: readonly ShowcaseTab[] = ['overview', 'expenses', 'settings'];

export const SHOWCASE_CATEGORIES: readonly ExpenseCategory[] = ['materials', 'labour'];

export const SHOWCASE_FILTERS: readonly ExpenseFilter[] = ['all', ...SHOWCASE_CATEGORIES];

export const SHOWCASE_EXPENSES: readonly ExpenseRecord[] = [
  {
    id: 'tiles',
    vendor: 'Tile Depot',
    amount: 2340,
    category: 'materials',
    initiallyPaid: true,
  },
  {
    id: 'plumber',
    vendor: 'J. Nowak',
    amount: 1850,
    category: 'labour',
    initiallyPaid: true,
  },
  {
    id: 'cabinets',
    vendor: 'Oak & Co',
    amount: 4120,
    category: 'materials',
    initiallyPaid: true,
  },
  {
    id: 'electric',
    vendor: 'Volt Pro',
    amount: 1430,
    category: 'labour',
    initiallyPaid: false,
  },
  {
    id: 'worktop',
    vendor: 'Stone Lab',
    amount: 2760,
    category: 'materials',
    initiallyPaid: true,
  },
  {
    id: 'painting',
    vendor: 'ColourWorks',
    amount: 980,
    category: 'labour',
    initiallyPaid: false,
  },
];

/* Building an Intl formatter is costly, so each language builds one on first use. */
const moneyFormats = new Map<DocsLanguage, Intl.NumberFormat>();

function moneyFormat(language: DocsLanguage): Intl.NumberFormat {
  const cached = moneyFormats.get(language);

  if (cached) {
    return cached;
  }

  const format = new Intl.NumberFormat(SHOWCASE_MONEY.locales[language], {
    style: 'currency',
    currency: SHOWCASE_MONEY.currency,
    maximumFractionDigits: 0,
  });

  moneyFormats.set(language, format);

  return format;
}

export function formatMoney(amount: number, language: DocsLanguage): string {
  return moneyFormat(language).format(amount);
}

/** Money formatter for the current docs language; stable until the language changes. */
export function useFormatMoney(): (amount: number) => string {
  const language = useDocsLanguage();

  return useCallback((amount: number) => formatMoney(amount, language), [language]);
}

/** Expense rows with their titles in one language. */
export function localizeExpenses(titles: Record<ExpenseId, string>): Expense[] {
  return SHOWCASE_EXPENSES.map((expense) => ({ ...expense, title: titles[expense.id] }));
}

export function initialPaidIds(): ReadonlySet<string> {
  return new Set(SHOWCASE_EXPENSES.filter((expense) => expense.initiallyPaid).map(({ id }) => id));
}

export function matchesExpense(expense: Expense, filter: ExpenseFilter, query: string): boolean {
  const needle = query.trim().toLowerCase();
  const inCategory = filter === 'all' || expense.category === filter;
  const inText = `${expense.title} ${expense.vendor}`.toLowerCase().includes(needle);

  return inCategory && inText;
}
