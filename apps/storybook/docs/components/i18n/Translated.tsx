import type { ReactNode } from 'react';
import { useDocsLanguage, type DocsLanguage } from '../../../shared/docsGlobals';

/**
 * One language version of a block of MDX guide text. A page holds an
 * `en` and a `pl` block side by side; only the one matching the Locale
 * global renders (locales without a translation show English).
 *
 * @example
 * <Translated lang="en">
 *
 * ## Install
 *
 * </Translated>
 * <Translated lang="pl">
 *
 * ## Instalacja
 *
 * </Translated>
 */
export function Translated({ lang, children }: { lang: DocsLanguage; children: ReactNode }) {
  const current = useDocsLanguage();

  return current === lang ? <>{children}</> : null;
}
