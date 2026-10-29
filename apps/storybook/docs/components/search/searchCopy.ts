import { useLocalized, type DocsLanguage } from '../../../shared/docsGlobals';
import { polishNoun, type PolishNounForms } from './polishPlural';
import type { ResultKind, TokenRelation } from './searchTypes';

/** Every user-facing string of the search page, so wording changes in one place. */
export interface SearchCopy {
  eyebrow: string;
  title: string;
  lead: string;
  inputLabel: string;
  placeholder: string;
  clearHint: string;
  keyboardHint: string;
  groupLabels: Record<ResultKind, string>;
  modeLabels: { light: string; dark: string };
  relationLabels: Record<TokenRelation, string>;
  emptyTitle: string;
  emptyBody: string;
  suggestionsLabel: string;
  noResultsTitle: (query: string) => string;
  noResultsBody: string;
  resultSummary: (count: number, query: string) => string;
  moreResults: (hidden: number) => string;
  moreTokens: (hidden: number) => string;
  catalogStats: (tokens: number, components: number) => string;
  indexLoading: string;
  indexError: string;
  usageLoading: string;
  usageError: string;
  copyLabel: (what: string, value: string) => string;
  copied: string;
  copyFailed: string;
  copiedAnnouncement: (value: string) => string;
  copyFailedAnnouncement: string;
  matchedTokensLabel: (component: string) => string;
  typeSample: string;
  noDocsPage: string;
}

const ENGLISH: SearchCopy = {
  eyebrow: 'Search',
  title: 'Find any token or component',
  lead: 'Type a token name, a hex color, a number such as 16, or a component name. Colors show their light and dark values, and components show which matching tokens they use or document.',
  inputLabel: 'Search tokens and components',
  placeholder: 'Try "primary", "md" or "Button"',
  clearHint: 'Esc',
  keyboardHint: 'Arrow keys move through results, Enter opens, Esc returns to the field.',
  groupLabels: {
    color: 'Colors',
    spacing: 'Spacing',
    radius: 'Radius',
    typography: 'Typography',
    component: 'Components',
  },
  modeLabels: { light: 'Light', dark: 'Dark' },
  relationLabels: { uses: 'uses', documents: 'documents' },
  emptyTitle: 'Start typing to search',
  emptyBody:
    'Results update as you type and are grouped by type. Pick a suggestion to see how it works.',
  suggestionsLabel: 'Suggestions',
  noResultsTitle: (query) => `No results for "${query}"`,
  noResultsBody: 'Check the spelling, search for part of a name, or try one of these:',
  resultSummary: (count, query) =>
    count === 1 ? `1 result for "${query}"` : `${count} results for "${query}"`,
  moreResults: (hidden) => `${hidden} more, refine your query to see them`,
  moreTokens: (hidden) => `+${hidden}`,
  catalogStats: (tokens, components) => `${tokens} tokens and ${components} components indexed`,
  indexLoading: 'Loading the component list...',
  indexError: 'The component list could not be loaded. Token results still work.',
  usageLoading: 'Scanning components for token usage...',
  usageError: 'Token usage could not be scanned. Components still match by name.',
  copyLabel: (what, value) => `Copy ${what} value ${value}`,
  copied: 'Copied',
  copyFailed: 'Copy failed',
  copiedAnnouncement: (value) => `Copied ${value} to the clipboard`,
  copyFailedAnnouncement: 'Copying to the clipboard failed',
  matchedTokensLabel: (component) => `Matching tokens in ${component}`,
  typeSample: 'Ag',
  noDocsPage: 'No docs page',
};

const RESULTS: PolishNounForms = { one: 'wynik', few: 'wyniki', many: 'wyników' };
const TOKENS: PolishNounForms = { one: 'token', few: 'tokeny', many: 'tokenów' };
const COMPONENTS: PolishNounForms = { one: 'komponent', few: 'komponenty', many: 'komponentów' };

const POLISH: SearchCopy = {
  eyebrow: 'Wyszukiwarka',
  title: 'Znajdź dowolny token lub komponent',
  lead: 'Wpisz nazwę tokena, kolor w zapisie hex, liczbę, np. 16, albo nazwę komponentu. Kolory pokazują wartości dla trybu jasnego i ciemnego, a komponenty pokazują, których pasujących tokenów używają lub które dokumentują.',
  inputLabel: 'Szukaj tokenów i komponentów',
  placeholder: 'Spróbuj „primary”, „md” lub „Button”',
  clearHint: 'Esc',
  keyboardHint: 'Strzałki przechodzą między wynikami, Enter otwiera wynik, Esc wraca do pola.',
  groupLabels: {
    color: 'Kolory',
    spacing: 'Odstępy',
    radius: 'Zaokrąglenia',
    typography: 'Typografia',
    component: 'Komponenty',
  },
  modeLabels: { light: 'Jasny', dark: 'Ciemny' },
  relationLabels: { uses: 'używa', documents: 'dokumentuje' },
  emptyTitle: 'Zacznij pisać, aby wyszukać',
  emptyBody:
    'Wyniki odświeżają się w trakcie pisania i są pogrupowane według typu. Wybierz podpowiedź, aby zobaczyć, jak to działa.',
  suggestionsLabel: 'Podpowiedzi',
  noResultsTitle: (query) => `Brak wyników dla „${query}”`,
  noResultsBody: 'Sprawdź pisownię, wyszukaj fragment nazwy albo spróbuj jednej z tych fraz:',
  resultSummary: (count, query) => `${count} ${polishNoun(count, RESULTS)} dla „${query}”`,
  moreResults: (hidden) =>
    `Jeszcze ${hidden} ${polishNoun(hidden, RESULTS)}, zawęź zapytanie, aby je zobaczyć`,
  moreTokens: (hidden) => `+${hidden}`,
  catalogStats: (tokens, components) =>
    `W indeksie: ${tokens} ${polishNoun(tokens, TOKENS)} i ${components} ${polishNoun(components, COMPONENTS)}`,
  indexLoading: 'Wczytywanie listy komponentów...',
  indexError: 'Nie udało się wczytać listy komponentów. Wyniki dla tokenów nadal działają.',
  usageLoading: 'Sprawdzanie, których tokenów używają komponenty...',
  usageError: 'Nie udało się sprawdzić użycia tokenów. Komponenty nadal są dopasowywane po nazwie.',
  copyLabel: (what, value) => `Kopiuj wartość ${value} (${what.toLocaleLowerCase('pl-PL')})`,
  copied: 'Skopiowano',
  copyFailed: 'Błąd kopiowania',
  copiedAnnouncement: (value) => `Skopiowano ${value} do schowka`,
  copyFailedAnnouncement: 'Nie udało się skopiować do schowka',
  matchedTokensLabel: (component) => `Pasujące tokeny w komponencie ${component}`,
  typeSample: 'Ag',
  noDocsPage: 'Brak strony dokumentacji',
};

export const SEARCH_COPY: Record<DocsLanguage, SearchCopy> = { en: ENGLISH, pl: POLISH };

/** Search page copy in the language picked by the Locale global. */
export function useSearchCopy(): SearchCopy {
  return useLocalized(SEARCH_COPY);
}
