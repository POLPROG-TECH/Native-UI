import type { CSSProperties } from 'react';
import { PREVIEW_LIMITS } from '../searchConfig';
import { useSearchCopy } from '../searchCopy';
import type { TokenEntry } from '../searchTypes';

/** Token values reach the stylesheet as custom properties, so one rule set draws every preview. */
type SwatchStyle = CSSProperties & { '--swatch-light': string; '--swatch-dark': string };
type SizeStyle = CSSProperties & { '--preview-size': string };

function px(value: number, limit: number): string {
  return `${Math.min(value, limit)}px`;
}

function previewStyle(entry: TokenEntry): SwatchStyle | SizeStyle {
  if (entry.kind === 'color') {
    return { '--swatch-light': entry.light, '--swatch-dark': entry.dark };
  }

  if (entry.kind === 'typography') {
    return {
      '--preview-size': px(entry.fontSize, PREVIEW_LIMITS.typeSamplePx),
      fontWeight: entry.fontWeight,
    };
  }

  const limit = entry.kind === 'spacing' ? PREVIEW_LIMITS.spacingBarPx : PREVIEW_LIMITS.radiusPx;

  return { '--preview-size': px(entry.value, limit) };
}

/**
 * Decorative picture of a token: a light/dark split swatch for colors, a bar
 * for spacing, a rounded square for radius and a type sample for typography.
 * The value itself is announced by the copy button next to it.
 */
export function TokenPreview({ entry }: { entry: TokenEntry }) {
  const { typeSample } = useSearchCopy();

  return (
    <span
      className={`nui-search-preview nui-search-preview--${entry.kind}`}
      style={previewStyle(entry)}
      aria-hidden="true"
    >
      {entry.kind === 'typography' ? typeSample : null}
    </span>
  );
}

/** Up to two capitals of a component name, e.g. `LS` for ListSection. */
function monogramOf(name: string): string {
  const capitals = (name.match(/[A-Z0-9]/g) ?? []).slice(0, 2).join('');

  return capitals.length > 0 ? capitals : name.slice(0, 2).toUpperCase();
}

export function ComponentPreview({ name }: { name: string }) {
  return (
    <span className="nui-search-preview nui-search-preview--component" aria-hidden="true">
      {monogramOf(name)}
    </span>
  );
}
