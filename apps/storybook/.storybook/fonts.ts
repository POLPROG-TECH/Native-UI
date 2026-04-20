/**
 * Load Space Grotesk (the library's default branded family) into the
 * Storybook preview iframe and alias it under the Expo Google Fonts naming
 * that the tokens expect.
 *
 * Why this file is careful about *when* things happen:
 *
 *  - Components reference font families by their Expo name
 *    (`SpaceGrotesk_400Regular`…) via react-native-web's `StyleSheet`.
 *    rn-web caches computed layout on first mount, so if the real font
 *    isn't available by that moment the story is laid out with the
 *    system fallback's metrics and stays misaligned until a remount/
 *    refresh - the classic "STORIES rozjechane po otwarciu, ok po F5".
 *
 *  - To prevent that FOUT we do three things:
 *    1. Inject `<link rel="preload" as="font">` so the browser starts
 *       fetching the woff2 immediately, in parallel with JS init.
 *    2. Use `font-display: block` on the Expo-aliased `@font-face` rules
 *       so any text styled under those families renders *invisibly* for
 *       up to 3 s instead of painting with a fallback whose metrics
 *       don't match. For a ~30 kB local woff2 this is imperceptible,
 *       and eliminates the visible jump.
 *    3. Resolve against `document.fonts.ready` - re-exported as
 *       `fontsReady` - so decorators that need to suspend before the
 *       first paint have something to await.
 */
import '@fontsource/space-grotesk/400.css';
import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/600.css';
import '@fontsource/space-grotesk/700.css';

import woff2_400 from '@fontsource/space-grotesk/files/space-grotesk-latin-400-normal.woff2?url';
import woff2_500 from '@fontsource/space-grotesk/files/space-grotesk-latin-500-normal.woff2?url';
import woff2_600 from '@fontsource/space-grotesk/files/space-grotesk-latin-600-normal.woff2?url';
import woff2_700 from '@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff2?url';

const STYLE_SOURCE_ID = 'native-ui-space-grotesk-aliases';
const PRELOAD_SOURCE_ID = 'native-ui-space-grotesk-preload';

const aliases: Array<[string, string, string]> = [
  ['SpaceGrotesk_400Regular', '400', woff2_400],
  ['SpaceGrotesk_500Medium', '500', woff2_500],
  ['SpaceGrotesk_600SemiBold', '600', woff2_600],
  ['SpaceGrotesk_700Bold', '700', woff2_700],
];

/**
 * Promise that resolves once every Space Grotesk weight we alias has
 * actually loaded (or the browser decided not to load it). Preview
 * decorators can `await` this to gate first paint.
 */
export const fontsReady: Promise<void> = (async () => {
  // SSR guard - Storybook static build can evaluate preview modules in Node.
  if (typeof document === 'undefined') return;

  // 1) Preload link tags - start the network fetch ASAP, in parallel
  //    with the rest of preview bundle init. Idempotent on HMR.
  if (!document.head.querySelector(`link[data-source="${PRELOAD_SOURCE_ID}"]`)) {
    for (const [, , url] of aliases) {
      const link = document.createElement('link');
      link.setAttribute('rel', 'preload');
      link.setAttribute('as', 'font');
      link.setAttribute('type', 'font/woff2');
      link.setAttribute('crossorigin', 'anonymous');
      link.setAttribute('data-source', PRELOAD_SOURCE_ID);
      link.href = url;
      document.head.appendChild(link);
    }
  }

  // 2) Expo-name @font-face aliases. Idempotent guard - HMR re-evaluates
  //    this module; avoid stacking duplicate <style> tags.
  if (!document.querySelector(`style[data-source="${STYLE_SOURCE_ID}"]`)) {
    const style = document.createElement('style');
    style.setAttribute('data-source', STYLE_SOURCE_ID);
    style.textContent = aliases
      .map(
        ([family, weight, url]) => `@font-face {
  font-family: '${family}';
  font-weight: ${weight};
  font-style: normal;
  font-display: block;
  src: url(${url}) format('woff2');
}`,
      )
      .join('\n');
    document.head.appendChild(style);
  }

  // 3) Kick off loads explicitly so `document.fonts.ready` flips when
  //    *these* families are resolved (not just the CSS declarations).
  //    We also race against a hard timeout so that a broken network
  //    can't stall the preview module forever (preview.tsx awaits this
  //    promise at top level).
  const timeout = new Promise<void>((resolve) => {
    setTimeout(resolve, 3000);
  });

  const loads =
    typeof document.fonts?.load === 'function'
      ? Promise.all(
          aliases.map(([family, weight]) =>
            document.fonts.load(`${weight} 1em '${family}'`).catch(() => {
              /* tolerate individual weight failures; fallback is acceptable */
            }),
          ),
        ).then(() => {})
      : Promise.resolve();

  await Promise.race([loads, timeout]);

  // 4) Wait until all pending font loads settle (swap-in has happened),
  //    but again bounded by the same timeout so we never block forever.
  const ready = document.fonts?.ready
    ? Promise.resolve(document.fonts.ready).then(() => {
        /* ignore value */
      })
    : Promise.resolve();
  await Promise.race([ready, timeout]).catch(() => {
    /* ignore - rendering will proceed with fallback */
  });
})();
