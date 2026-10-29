import type { NativeUILabels } from '@polprog/native-ui';
import type { StoryLocale } from '../storyI18n';

/**
 * What the Locale global hands to NativeUIProvider: the BCP 47 tag for date
 * and number formatting, and the strings the library renders itself
 * (Cancel, Close, "Select...", required markers, Countdown units, a11y
 * labels). English uses the library defaults, so it has no overrides.
 * Countdown appends units straight to the number, so spelled-out units
 * carry their own leading space ("2 Std. 14 Min.").
 */
export interface LibraryLocale {
  bcp47: string;
  labels?: Partial<NativeUILabels>;
}

export const LIBRARY_LOCALES: Record<StoryLocale, LibraryLocale> = {
  en: { bcp47: 'en-US' },
  pl: {
    bcp47: 'pl-PL',
    labels: {
      close: 'Zamknij',
      cancel: 'Anuluj',
      confirm: 'OK',
      clear: 'Wyczyść',
      clearSearch: 'Wyczyść wyszukiwanie',
      goBack: 'Wstecz',
      loading: 'Ładowanie treści',
      loadingIndicator: 'Ładowanie',
      avatar: 'Awatar',
      required: 'wymagane',
      selectPlaceholder: 'Wybierz...',
      rangeStart: 'Od',
      rangeEnd: 'Do',
      cardHint: 'Dotknij, aby zobaczyć szczegóły',
      errorMessage: 'Coś poszło nie tak.',
      errorRetry: 'Spróbuj ponownie',
      stepOf: (current, total) => `Krok ${current} z ${total}`,
      countdownUnits: { hours: ' godz.', minutes: ' min', seconds: ' s' },
    },
  },
  es: {
    bcp47: 'es-ES',
    labels: {
      close: 'Cerrar',
      cancel: 'Cancelar',
      confirm: 'Aceptar',
      clear: 'Borrar',
      clearSearch: 'Borrar búsqueda',
      goBack: 'Volver',
      loading: 'Cargando contenido',
      loadingIndicator: 'Cargando',
      avatar: 'Avatar',
      required: 'obligatorio',
      selectPlaceholder: 'Seleccionar...',
      rangeStart: 'Inicio',
      rangeEnd: 'Fin',
      cardHint: 'Toca para ver los detalles',
      errorMessage: 'Algo salió mal.',
      errorRetry: 'Reintentar',
      stepOf: (current, total) => `Paso ${current} de ${total}`,
    },
  },
  de: {
    bcp47: 'de-DE',
    labels: {
      close: 'Schließen',
      cancel: 'Abbrechen',
      confirm: 'OK',
      clear: 'Löschen',
      clearSearch: 'Suche löschen',
      goBack: 'Zurück',
      loading: 'Inhalt wird geladen',
      loadingIndicator: 'Wird geladen',
      avatar: 'Avatar',
      required: 'erforderlich',
      selectPlaceholder: 'Auswählen...',
      rangeStart: 'Beginn',
      rangeEnd: 'Ende',
      cardHint: 'Für Details tippen',
      errorMessage: 'Etwas ist schiefgelaufen.',
      errorRetry: 'Erneut versuchen',
      stepOf: (current, total) => `Schritt ${current} von ${total}`,
      countdownUnits: { hours: ' Std.', minutes: ' Min.', seconds: ' Sek.' },
    },
  },
  ar: {
    bcp47: 'ar',
    labels: {
      close: 'إغلاق',
      cancel: 'إلغاء',
      confirm: 'موافق',
      clear: 'مسح',
      clearSearch: 'مسح البحث',
      goBack: 'رجوع',
      loading: 'جارٍ تحميل المحتوى',
      loadingIndicator: 'جارٍ التحميل',
      avatar: 'الصورة الرمزية',
      required: 'مطلوب',
      selectPlaceholder: 'اختر...',
      rangeStart: 'البداية',
      rangeEnd: 'النهاية',
      cardHint: 'اضغط لعرض التفاصيل',
      errorMessage: 'حدث خطأ ما.',
      errorRetry: 'إعادة المحاولة',
      stepOf: (current, total) => `الخطوة ${current} من ${total}`,
      countdownUnits: { hours: ' س', minutes: ' د', seconds: ' ث' },
    },
  },
};
