import React from 'react';

/**
 * Story-level i18n helper.
 *
 * Problem
 * -------
 * Consumer apps (PuzzleGo, DailyForma, …) render UI strings through
 * i18next / react-intl. Storybook stories used to hardcode English copy,
 * which (a) made Polish QA blind to layout bugs (longer words overflow)
 * and (b) gave designers no way to verify RTL/localisation at the library
 * level.
 *
 * Design
 * ------
 * A global toolbar item `locale` exposes `en | pl | es | de | ar`. Stories
 * opt-in via `useStoryLocale()` or the `st()` helper. A React context is
 * set by `withLocale` decorator (in preview.tsx) so components deep in the
 * tree can read it synchronously during render.
 *
 * The helper deliberately does NOT depend on i18next - the library is
 * runtime-free and must stay that way. Stories that need deep trees
 * wrap the dictionary themselves.
 */
export type StoryLocale = 'en' | 'pl' | 'es' | 'de' | 'ar';

export const LOCALES: readonly StoryLocale[] = ['en', 'pl', 'es', 'de', 'ar'] as const;

export const LOCALE_LABELS: Record<StoryLocale, string> = {
  en: 'English',
  pl: 'Polski',
  es: 'Español',
  de: 'Deutsch',
  ar: 'العربية',
};

export const RTL_LOCALES: ReadonlySet<StoryLocale> = new Set(['ar']);

type LocaleContextValue = {
  locale: StoryLocale;
  isRTL: boolean;
};

const LocaleContext = React.createContext<LocaleContextValue>({
  locale: 'en',
  isRTL: false,
});

export const StoryLocaleProvider: React.FC<{
  locale: StoryLocale;
  children: React.ReactNode;
}> = ({ locale, children }) => {
  const value = React.useMemo(
    () => ({ locale, isRTL: RTL_LOCALES.has(locale) }),
    [locale],
  );
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
};

export const useStoryLocale = (): LocaleContextValue => React.useContext(LocaleContext);

/**
 * Shared demo dictionary used by Patterns stories. Keep keys terse
 * and UI-oriented. This is NOT a production i18n catalog - just enough
 * to validate layout across locales.
 */
export type StoryDict = {
  common: {
    save: string;
    cancel: string;
    delete: string;
    confirm: string;
    search: string;
    loading: string;
    empty: string;
    retry: string;
  };
  forms: {
    email: string;
    password: string;
    emailPlaceholder: string;
    passwordPlaceholder: string;
    submit: string;
    forgotPassword: string;
  };
  settings: {
    title: string;
    appearance: string;
    notifications: string;
    privacy: string;
    about: string;
    darkMode: string;
    language: string;
  };
  errors: {
    required: string;
    invalidEmail: string;
    networkError: string;
  };
};

export const STORY_DICT: Record<StoryLocale, StoryDict> = {
  en: {
    common: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      confirm: 'Confirm',
      search: 'Search',
      loading: 'Loading…',
      empty: 'Nothing here yet',
      retry: 'Try again',
    },
    forms: {
      email: 'Email',
      password: 'Password',
      emailPlaceholder: 'you@example.com',
      passwordPlaceholder: 'Enter your password',
      submit: 'Submit',
      forgotPassword: 'Forgot password?',
    },
    settings: {
      title: 'Settings',
      appearance: 'Appearance',
      notifications: 'Notifications',
      privacy: 'Privacy',
      about: 'About',
      darkMode: 'Dark mode',
      language: 'Language',
    },
    errors: {
      required: 'This field is required',
      invalidEmail: 'Please enter a valid email',
      networkError: 'Network unavailable. Try again.',
    },
  },
  pl: {
    common: {
      save: 'Zapisz',
      cancel: 'Anuluj',
      delete: 'Usuń',
      confirm: 'Potwierdź',
      search: 'Szukaj',
      loading: 'Ładowanie…',
      empty: 'Na razie pusto',
      retry: 'Spróbuj ponownie',
    },
    forms: {
      email: 'E-mail',
      password: 'Hasło',
      emailPlaceholder: 'ty@przyklad.pl',
      passwordPlaceholder: 'Wpisz swoje hasło',
      submit: 'Wyślij',
      forgotPassword: 'Nie pamiętasz hasła?',
    },
    settings: {
      title: 'Ustawienia',
      appearance: 'Wygląd',
      notifications: 'Powiadomienia',
      privacy: 'Prywatność',
      about: 'O aplikacji',
      darkMode: 'Tryb ciemny',
      language: 'Język',
    },
    errors: {
      required: 'To pole jest wymagane',
      invalidEmail: 'Wprowadź poprawny adres e-mail',
      networkError: 'Brak połączenia. Spróbuj ponownie.',
    },
  },
  es: {
    common: {
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      confirm: 'Confirmar',
      search: 'Buscar',
      loading: 'Cargando…',
      empty: 'Aún no hay nada',
      retry: 'Reintentar',
    },
    forms: {
      email: 'Correo',
      password: 'Contraseña',
      emailPlaceholder: 'tu@ejemplo.com',
      passwordPlaceholder: 'Introduce tu contraseña',
      submit: 'Enviar',
      forgotPassword: '¿Olvidaste la contraseña?',
    },
    settings: {
      title: 'Ajustes',
      appearance: 'Apariencia',
      notifications: 'Notificaciones',
      privacy: 'Privacidad',
      about: 'Acerca de',
      darkMode: 'Modo oscuro',
      language: 'Idioma',
    },
    errors: {
      required: 'Campo obligatorio',
      invalidEmail: 'Introduce un correo válido',
      networkError: 'Sin red. Inténtalo de nuevo.',
    },
  },
  de: {
    common: {
      save: 'Speichern',
      cancel: 'Abbrechen',
      delete: 'Löschen',
      confirm: 'Bestätigen',
      search: 'Suchen',
      loading: 'Wird geladen…',
      empty: 'Noch nichts hier',
      retry: 'Erneut versuchen',
    },
    forms: {
      email: 'E-Mail',
      password: 'Passwort',
      emailPlaceholder: 'du@beispiel.de',
      passwordPlaceholder: 'Passwort eingeben',
      submit: 'Absenden',
      forgotPassword: 'Passwort vergessen?',
    },
    settings: {
      title: 'Einstellungen',
      appearance: 'Erscheinungsbild',
      notifications: 'Mitteilungen',
      privacy: 'Datenschutz',
      about: 'Info',
      darkMode: 'Dunkelmodus',
      language: 'Sprache',
    },
    errors: {
      required: 'Pflichtfeld',
      invalidEmail: 'Bitte gültige E-Mail eingeben',
      networkError: 'Kein Netzwerk. Erneut versuchen.',
    },
  },
  ar: {
    common: {
      save: 'حفظ',
      cancel: 'إلغاء',
      delete: 'حذف',
      confirm: 'تأكيد',
      search: 'بحث',
      loading: 'جارٍ التحميل…',
      empty: 'لا يوجد شيء هنا بعد',
      retry: 'إعادة المحاولة',
    },
    forms: {
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      emailPlaceholder: 'you@example.com',
      passwordPlaceholder: 'أدخل كلمة المرور',
      submit: 'إرسال',
      forgotPassword: 'هل نسيت كلمة المرور؟',
    },
    settings: {
      title: 'الإعدادات',
      appearance: 'المظهر',
      notifications: 'الإشعارات',
      privacy: 'الخصوصية',
      about: 'حول',
      darkMode: 'الوضع الداكن',
      language: 'اللغة',
    },
    errors: {
      required: 'هذا الحقل مطلوب',
      invalidEmail: 'أدخل بريدًا صالحًا',
      networkError: 'لا يوجد اتصال. حاول مجددًا.',
    },
  },
};

/** Shorthand for `STORY_DICT[locale]` with safe fallback to English. */
export const dict = (locale: StoryLocale): StoryDict => STORY_DICT[locale] ?? STORY_DICT.en;
