import { SUGGESTED_QUERIES } from '../searchConfig';
import { useSearchCopy, type SearchCopy } from '../searchCopy';
import type { AsyncState, StorybookDocsIndex, UsageIndex } from '../searchTypes';

type PickQuery = (query: string) => void;

function SearchGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  );
}

export function SearchFieldIcon() {
  return (
    <span className="nui-search-field-icon">
      <SearchGlyph />
    </span>
  );
}

function Suggestions({ onPick }: { onPick: PickQuery }) {
  const copy = useSearchCopy();

  return (
    <ul className="nui-search-suggestions" aria-label={copy.suggestionsLabel}>
      {SUGGESTED_QUERIES.map((suggestion) => (
        <li key={suggestion}>
          <button type="button" onClick={() => onPick(suggestion)}>
            {suggestion}
          </button>
        </li>
      ))}
    </ul>
  );
}

/** Shown before the first keystroke: what the page does and where to start. */
export function EmptyState({ onPick }: { onPick: PickQuery }) {
  const copy = useSearchCopy();

  return (
    <div className="nui-search-state">
      <span className="nui-search-state-icon">
        <SearchGlyph />
      </span>
      <p className="nui-search-state-title">{copy.emptyTitle}</p>
      <p className="nui-search-state-body">{copy.emptyBody}</p>
      <Suggestions onPick={onPick} />
    </div>
  );
}

export function NoResults({ query, onPick }: { query: string; onPick: PickQuery }) {
  const copy = useSearchCopy();

  return (
    <div className="nui-search-state" data-variant="no-results">
      <p className="nui-search-state-title">{copy.noResultsTitle(query)}</p>
      <p className="nui-search-state-body">{copy.noResultsBody}</p>
      <Suggestions onPick={onPick} />
    </div>
  );
}

interface StatusNotesProps {
  index: AsyncState<StorybookDocsIndex>;
  usage: AsyncState<UsageIndex>;
}

function noteText({ index, usage }: StatusNotesProps, copy: SearchCopy): string | null {
  if (index.status === 'loading') {
    return copy.indexLoading;
  }

  if (index.status === 'error') {
    return copy.indexError;
  }

  if (usage.status === 'loading') {
    return copy.usageLoading;
  }

  return usage.status === 'error' ? copy.usageError : null;
}

/** Progress and failures of the data the component results depend on. */
export function StatusNote(props: StatusNotesProps) {
  const text = noteText(props, useSearchCopy());
  const isError = props.index.status === 'error' || props.usage.status === 'error';

  return text === null ? null : (
    <p className="nui-search-note" data-tone={isError ? 'error' : 'info'}>
      {text}
    </p>
  );
}
