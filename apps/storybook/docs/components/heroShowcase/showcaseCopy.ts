import { useLocalized, type DocsLanguage } from '../../../shared/docsGlobals';
import type { ShowcaseColorMode } from './showcaseConfig';
import type { ExpenseFilter, ExpenseId, ShowcaseTab } from './showcaseData';

/** Visible strings of the hero device and its controls, kept together for translation. */
export interface ShowcaseCopy {
  clock: string;
  initials: string;
  tabs: Record<ShowcaseTab, string>;
  overview: {
    greeting: string;
    project: string;
    budgetLabel: string;
    spentLabel: string;
    totalLabel: string;
    expensesAction: string;
    spentCaption: (percent: number) => string;
    progressLabel: string;
    recentTitle: string;
    splitTitle: string;
    seeAll: string;
    cta: string;
    ctaDone: string;
  };
  expenses: {
    searchPlaceholder: string;
    filters: Record<ExpenseFilter, string>;
    /** Demo expense titles; vendor names are proper names and stay as written. */
    titles: Record<ExpenseId, string>;
    paid: string;
    due: string;
    togglePaidHint: string;
    emptyTitle: string;
    emptyMessage: string;
  };
  settings: {
    appearance: string;
    darkMode: string;
    darkModeSubtitle: string;
    highContrast: string;
    highContrastSubtitle: string;
    accent: string;
    notifications: string;
    alerts: string;
    alertsSubtitle: string;
  };
  anatomy: {
    eyebrow: string;
    title: (screen: string) => string;
    lead: string;
    instances: string;
    components: string;
    providerProps: string;
    usedHere: string;
    treeLabel: string;
    openDocs: (name: string) => string;
  };
  regionLabel: string;
  scenePickerLabel: string;
  /** Spoken names of the colour modes in the scene picker; preset ids stay as in code. */
  colorModes: Record<ShowcaseColorMode, string>;
  pauseLabel: string;
  playLabel: string;
  contrastLabel: string;
  accentLabel: string;
  /** WCAG grade for a ratio that only passes for large text. */
  largeTextGrade: string;
  inspectHint: string;
}

const ENGLISH: ShowcaseCopy = {
  clock: '9:41',
  initials: 'KR',
  tabs: { overview: 'Overview', expenses: 'Expenses', settings: 'Settings' },
  overview: {
    greeting: 'Good evening',
    project: 'Kitchen renovation',
    budgetLabel: 'Budget left',
    spentLabel: 'Spent',
    totalLabel: 'Total plan',
    expensesAction: 'Expenses',
    spentCaption: (percent) => `${percent}% spent`,
    progressLabel: 'Budget spent',
    recentTitle: 'Recent',
    splitTitle: 'Where it went',
    seeAll: 'See all',
    cta: 'Send PDF quote',
    ctaDone: 'Quote sent',
  },
  expenses: {
    searchPlaceholder: 'Search expenses',
    filters: { all: 'All', materials: 'Materials', labour: 'Labour' },
    titles: {
      tiles: 'Wall tiles',
      plumber: 'Plumbing',
      cabinets: 'Cabinets',
      electric: 'Electrics',
      worktop: 'Quartz worktop',
      painting: 'Painting',
    },
    paid: 'Paid',
    due: 'Due',
    togglePaidHint: 'Tap a row to mark it paid',
    emptyTitle: 'Nothing found',
    emptyMessage: 'Try another search or filter.',
  },
  settings: {
    appearance: 'Appearance',
    darkMode: 'Dark appearance',
    darkModeSubtitle: "colorMode: 'dark'",
    highContrast: 'High contrast',
    highContrastSubtitle: 'highContrast: true',
    accent: 'Accent preset',
    notifications: 'Notifications',
    alerts: 'Price alerts',
    alertsSubtitle: 'Notify me when tiles drop',
  },
  anatomy: {
    eyebrow: 'Screen anatomy',
    title: (screen) => `What the ${screen} screen is made of`,
    lead: 'Read live from the device above: switch tabs or filter the list and the tree follows. Hover a row to find the component on screen; open it for its docs.',
    instances: 'instances',
    components: 'components',
    providerProps: 'provider props',
    usedHere: 'Used on this screen',
    treeLabel: 'Component tree',
    openDocs: (name) => `${name} docs`,
  },
  regionLabel: 'Live preview of native-ui components re-themed by one provider prop',
  scenePickerLabel: 'Theme preset',
  colorModes: { light: 'light', dark: 'dark' },
  pauseLabel: 'Pause theme rotation',
  playLabel: 'Play theme rotation',
  contrastLabel: 'contrast',
  accentLabel: 'primary',
  largeTextGrade: 'AA large',
  inspectHint: 'Tap around the app, or hover a component to inspect it',
};

const POLISH: ShowcaseCopy = {
  clock: '9:41',
  initials: 'KR',
  tabs: { overview: 'Przegląd', expenses: 'Wydatki', settings: 'Ustawienia' },
  overview: {
    greeting: 'Dobry wieczór',
    project: 'Remont kuchni',
    budgetLabel: 'Pozostały budżet',
    spentLabel: 'Wydano',
    totalLabel: 'Cały plan',
    expensesAction: 'Wydatki',
    spentCaption: (percent) => `Wydano ${percent}%`,
    progressLabel: 'Wykorzystany budżet',
    recentTitle: 'Ostatnie',
    splitTitle: 'Na co poszło',
    seeAll: 'Wszystkie',
    cta: 'Wyślij wycenę PDF',
    ctaDone: 'Wycena wysłana',
  },
  expenses: {
    searchPlaceholder: 'Szukaj wydatków',
    filters: { all: 'Wszystkie', materials: 'Materiały', labour: 'Robocizna' },
    titles: {
      tiles: 'Płytki ścienne',
      plumber: 'Hydraulika',
      cabinets: 'Szafki',
      electric: 'Elektryka',
      worktop: 'Blat kwarcowy',
      painting: 'Malowanie',
    },
    paid: 'Opłacone',
    due: 'Do zapłaty',
    togglePaidHint: 'Dotknij wiersza, aby oznaczyć go jako opłacony',
    emptyTitle: 'Nic nie znaleziono',
    emptyMessage: 'Zmień wyszukiwaną frazę lub filtr.',
  },
  settings: {
    appearance: 'Wygląd',
    darkMode: 'Ciemny motyw',
    darkModeSubtitle: "colorMode: 'dark'",
    highContrast: 'Wysoki kontrast',
    highContrastSubtitle: 'highContrast: true',
    accent: 'Preset akcentu',
    notifications: 'Powiadomienia',
    alerts: 'Alerty cenowe',
    alertsSubtitle: 'Powiadom mnie, gdy płytki stanieją',
  },
  anatomy: {
    eyebrow: 'Anatomia ekranu',
    title: (screen) => `Z czego składa się ekran „${screen}”`,
    lead: 'Odczytywane na żywo z urządzenia powyżej: przełącz kartę albo przefiltruj listę, a drzewo się zaktualizuje. Najedź na wiersz, aby wskazać komponent na ekranie; kliknij go, aby otworzyć dokumentację.',
    instances: 'wystąpienia',
    components: 'komponenty',
    providerProps: 'propsy providera',
    usedHere: 'Użyte na tym ekranie',
    treeLabel: 'Drzewo komponentów',
    openDocs: (name) => `Dokumentacja ${name}`,
  },
  regionLabel: 'Podgląd na żywo komponentów native-ui, których motyw zmienia jeden prop providera',
  scenePickerLabel: 'Preset motywu',
  colorModes: { light: 'jasny', dark: 'ciemny' },
  pauseLabel: 'Wstrzymaj zmianę motywów',
  playLabel: 'Wznów zmianę motywów',
  contrastLabel: 'kontrast',
  accentLabel: 'primary',
  largeTextGrade: 'AA duży tekst',
  inspectHint: 'Klikaj w aplikacji albo najedź na komponent, aby go podejrzeć',
};

export const SHOWCASE_COPY: Record<DocsLanguage, ShowcaseCopy> = { en: ENGLISH, pl: POLISH };

/** Hero copy in the language picked by the Locale global. */
export function useShowcaseCopy(): ShowcaseCopy {
  return useLocalized(SHOWCASE_COPY);
}
