import { SEARCH_LIMITS } from '../searchConfig';
import type { CSSProperties } from 'react';
import { useSearchCopy, type SearchCopy } from '../searchCopy';
import { useCopyFeedback, type CopyStatus } from '../../../../shared/useCopyFeedback';

type DotStyle = CSSProperties & { '--dot-color': string };

interface CopyValueButtonProps {
  value: string;
  /** What the value is, for the accessible name: "Light", "Spacing"... */
  what: string;
  /** Color values get a small dot of the color itself and their mode as a caption. */
  showDot?: boolean;
  caption?: string;
  onAnnounce: (message: string) => void;
}

/* While idle the status slot still holds the longer label, so the pill keeps its width. */
function statusText(status: CopyStatus, text: SearchCopy): string {
  return status === 'failed' ? text.copyFailed : text.copied;
}

function CopyIcon() {
  return (
    <svg className="nui-search-copy-icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <rect x="5.5" y="5.5" width="8" height="8" rx="2" />
      <path d="M10.5 3.5v-.5a1.5 1.5 0 0 0-1.5-1.5H4A1.5 1.5 0 0 0 2.5 3v5A1.5 1.5 0 0 0 4 9.5h.5" />
    </svg>
  );
}

/**
 * Pill that shows a token value and copies it. The value and the status text
 * share one grid cell, so swapping them never changes the pill's width.
 */
export function CopyValueButton({
  value,
  what,
  showDot = false,
  caption,
  onAnnounce,
}: CopyValueButtonProps) {
  const { status, copy } = useCopyFeedback(SEARCH_LIMITS.copyFeedbackMs);
  const text = useSearchCopy();
  const dotStyle: DotStyle = { '--dot-color': value };

  const handleClick = async () => {
    const outcome = await copy(value);

    onAnnounce(outcome === 'copied' ? text.copiedAnnouncement(value) : text.copyFailedAnnouncement);
  };

  return (
    <button
      type="button"
      className="nui-search-copy"
      data-status={status}
      aria-label={text.copyLabel(what, value)}
      onClick={() => void handleClick()}
    >
      {caption === undefined ? null : (
        <span className="nui-search-copy-caption" aria-hidden="true">
          {caption}
        </span>
      )}
      {showDot ? (
        <span className="nui-search-copy-dot" style={dotStyle} aria-hidden="true" />
      ) : null}
      <span className="nui-search-copy-text">
        <span data-visible={status === 'idle'}>{value}</span>
        <span data-visible={status !== 'idle'} aria-hidden="true">
          {statusText(status, text)}
        </span>
      </span>
      <CopyIcon />
    </button>
  );
}
