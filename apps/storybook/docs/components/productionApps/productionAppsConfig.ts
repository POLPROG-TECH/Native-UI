import type { DocsLanguage } from '../../../shared/docsGlobals';
import costBoardIcon from './assets/costboard-icon.webp';
import photoToPuzzleIcon from './assets/phototopuzzle-icon.webp';

/** Headline number shown on an app card, e.g. "94%" over "native-ui coverage". */
export interface AppMetric {
  value: string;
  label: string;
}

/** Translated card text of one app; the app name, links and brand stay language-neutral. */
export interface ProductionAppText {
  tagline: string;
  description: string;
  metrics: readonly AppMetric[];
  tags: readonly string[];
}

/** A shipped app that uses @polprog/native-ui, as presented on the Introduction page. */
export interface ProductionApp {
  id: string;
  name: string;
  icon: string;
  url: string;
  /** Brand gradient of the card banner and CTA, taken from the app icon. */
  brand: { from: string; to: string };
  text: Record<DocsLanguage, ProductionAppText>;
}

export interface ProductionAppsCopy {
  eyebrow: string;
  title: string;
  lead: string;
  liveBadge: string;
  ctaPrefix: string;
  newTab: string;
}

export const PRODUCTION_APPS_COPY: Record<DocsLanguage, ProductionAppsCopy> = {
  en: {
    eyebrow: 'In production',
    title: 'Shipped with native-ui',
    lead: 'Real apps on the App Store and Google Play, built on the same components and tokens you see above.',
    liveBadge: 'Live on iOS + Android',
    ctaPrefix: 'Explore',
    newTab: '(opens in a new tab)',
  },
  pl: {
    eyebrow: 'W produkcji',
    title: 'Aplikacje zbudowane z native-ui',
    lead: 'Prawdziwe aplikacje w App Store i Google Play, zbudowane z tych samych komponentów i tokenów, które widzisz powyżej.',
    liveBadge: 'Dostępne na iOS + Android',
    ctaPrefix: 'Poznaj',
    newTab: '(otwiera się w nowej karcie)',
  },
};

const COSTBOARD_TEXT: Record<DocsLanguage, ProductionAppText> = {
  en: {
    tagline: 'Home and renovation budgets, PDF quotes from your phone',
    description:
      'Keeps the household budget and renovation budgets as separate projects and lets contractors send a client a PDF quote straight from the phone. Works offline and without an account.',
    metrics: [
      { value: '94%', label: 'native-ui coverage' },
      { value: '25', label: 'languages' },
      { value: '0', label: 'ads or trackers' },
    ],
    tags: ['App Store', 'Google Play', 'Offline-first', 'No account'],
  },
  pl: {
    tagline: 'Budżet domowy i budżety remontów, wyceny PDF prosto z telefonu',
    description:
      'Prowadzi budżet domowy i budżety remontów jako osobne projekty, a wykonawcom pozwala wysłać klientowi wycenę PDF prosto z telefonu. Działa offline i bez zakładania konta.',
    metrics: [
      { value: '94%', label: 'pokrycia native-ui' },
      { value: '25', label: 'języków' },
      { value: '0', label: 'reklam i trackerów' },
    ],
    tags: ['App Store', 'Google Play', 'Offline-first', 'Bez konta'],
  },
};

const PHOTO_TO_PUZZLE_TEXT: Record<DocsLanguage, ProductionAppText> = {
  en: {
    tagline: 'Turn any photo into a jigsaw puzzle, privately',
    description:
      'A privacy-first photo puzzle game for phones and tablets. Native-UI drives its buttons, cards, modals, theme tokens and adaptive layouts, while photos never leave the device.',
    metrics: [
      { value: '4', label: 'form factors' },
      { value: '0', label: 'photos uploaded' },
      { value: '100%', label: 'playable offline' },
    ],
    tags: ['App Store', 'Google Play', 'Phone + Tablet', 'Offline-first'],
  },
  pl: {
    tagline: 'Zamień dowolne zdjęcie w puzzle, bez utraty prywatności',
    description:
      'Gra w układanie puzzli ze zdjęć na telefony i tablety, projektowana z myślą o prywatności. Native-UI odpowiada za jej przyciski, karty, okna modalne, tokeny motywu i adaptacyjne układy, a zdjęcia nigdy nie opuszczają urządzenia.',
    metrics: [
      { value: '4', label: 'formaty urządzeń' },
      { value: '0', label: 'wysłanych zdjęć' },
      { value: '100%', label: 'grywalne offline' },
    ],
    tags: ['App Store', 'Google Play', 'Telefon + tablet', 'Offline-first'],
  },
};

export const PRODUCTION_APPS: readonly ProductionApp[] = [
  {
    id: 'costboard',
    name: 'CostBoard',
    icon: costBoardIcon,
    url: 'https://polprog.pl/apps/CostBoard/',
    brand: { from: '#0B5D2E', to: '#4CBB47' },
    text: COSTBOARD_TEXT,
  },
  {
    id: 'phototopuzzle',
    name: 'PhotoToPuzzle',
    icon: photoToPuzzleIcon,
    url: 'https://polprog.pl/apps/PhotoToPuzzle/',
    brand: { from: '#3B2BB8', to: '#B05CF0' },
    text: PHOTO_TO_PUZZLE_TEXT,
  },
];
