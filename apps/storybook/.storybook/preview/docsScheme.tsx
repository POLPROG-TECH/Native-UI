import { useLayoutEffect, type ComponentProps } from 'react';
import { DocsContainer } from '@storybook/addon-docs/blocks';
import { GLOBALS_UPDATED, SET_GLOBALS } from 'storybook/internal/core-events';
import { addons } from 'storybook/preview-api';
import {
  getDocsGlobals,
  setDocsGlobals,
  useDocsGlobal,
  useDocsLanguage,
} from '../../shared/docsGlobals';
import { SCHEME_ATTRIBUTE, globalsOf, schemeForGlobals, watchOsScheme } from '../schemeSync';
import { darkTheme, lightTheme } from '../theme';

/* The scheme attribute drives every docs page and custom section's CSS. */
function reflectOnDocument(): void {
  document.documentElement.setAttribute(SCHEME_ATTRIBUTE, schemeForGlobals(getDocsGlobals()));
}

function onGlobals(payload: unknown): void {
  setDocsGlobals(globalsOf(payload) ?? getDocsGlobals());
  reflectOnDocument();
}

/* "System" mode re-resolves on an OS flip; a fresh object re-renders subscribers. */
function onOsSchemeChange(): void {
  setDocsGlobals({ ...getDocsGlobals() });
  reflectOnDocument();
}

/**
 * Feeds the docs globals store from the channel, so docs pages, the
 * Introduction sections and the canvas background follow Mode and Locale
 * from the Appearance menu instead of only the OS. Returns a stop function
 * so a hot-reloaded preview does not stack a second set of listeners.
 */
export function startDocsGlobalsSync(): () => void {
  if (typeof document === 'undefined') {
    return () => undefined;
  }

  const channel = addons.getChannel();
  const stopOsWatch = watchOsScheme(onOsSchemeChange);

  channel.on(SET_GLOBALS, onGlobals);
  channel.on(GLOBALS_UPDATED, onGlobals);
  reflectOnDocument();

  return () => {
    channel.off(SET_GLOBALS, onGlobals);
    channel.off(GLOBALS_UPDATED, onGlobals);
    stopOsWatch();
  };
}

/**
 * Storybook's DocsContainer with the light or dark docs theme picked by the
 * Mode global. It also owns <html lang / dir> on docs pages: the text is in
 * the docs language and always left to right, even right after an RTL story
 * was shown in the same iframe (the story decorator sets them in story view).
 */
export function SchemeDocsContainer(props: ComponentProps<typeof DocsContainer>) {
  const scheme = useDocsGlobal(schemeForGlobals);
  const language = useDocsLanguage();

  useLayoutEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = 'ltr';
  }, [language]);

  return <DocsContainer {...props} theme={scheme === 'dark' ? darkTheme : lightTheme} />;
}
