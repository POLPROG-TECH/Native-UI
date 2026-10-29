/**
 * Keep our Docs-canvas overflow override the *last* stylesheet in <head>.
 *
 * @storybook/blocks injects Emotion rules (e.g. `overflow: auto` on the
 * Docs Canvas/Story containers) *after* our preview-head.html <style>
 * when Storybook does client-side navigation between Docs pages. At
 * equal specificity the later rule wins → stories render with an inner
 * scroll ("rozjechane") until a hard refresh pushes our rules back to
 * the end. A small, single MutationObserver re-appends the tag whenever
 * new stylesheets are inserted.
 */
const OVERRIDE_STYLE_ID = 'native-ui-docs-overflow-fix';
const OVERRIDE_CSS = `
  .sb-show-main .docs-story,
  .sb-show-main .docs-story > div,
  .sb-show-main .sbdocs-preview { overflow: visible !important; }
`;

function getOrCreateOverrideStyle(): HTMLStyleElement {
  const existing = document.getElementById(OVERRIDE_STYLE_ID);

  if (existing instanceof HTMLStyleElement) {
    return existing;
  }

  const created = document.createElement('style');
  created.id = OVERRIDE_STYLE_ID;
  created.textContent = OVERRIDE_CSS;
  document.head.appendChild(created);

  return created;
}

export function keepOverrideStyleLast(): void {
  if (typeof document === 'undefined') {
    return;
  }

  const overrideEl = getOrCreateOverrideStyle();
  let reAppending = false;
  const observer = new MutationObserver(() => {
    if (reAppending || document.head.lastElementChild === overrideEl) {
      return;
    }

    reAppending = true;
    document.head.appendChild(overrideEl);
    reAppending = false;
  });
  observer.observe(document.head, { childList: true });
}
