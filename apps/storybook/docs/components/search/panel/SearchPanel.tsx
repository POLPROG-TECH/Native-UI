import {
  useCallback,
  useDeferredValue,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type RefObject,
} from 'react';
import { countResults, searchCatalog } from '../engine/searchEngine';
import { useSearchCopy, type SearchCopy } from '../searchCopy';
import type {
  AsyncState,
  ResultGroup,
  StorybookDocsIndex,
  TokenEntry,
  UsageIndex,
} from '../searchTypes';
import { readyData } from '../data/useSearchData';
import { useResultsKeyboard } from '../results/useResultsKeyboard';
import { ResultGroups } from '../results/ResultGroups';
import { EmptyState, NoResults, SearchFieldIcon, StatusNote } from './SearchStates';
/* Page tokens and reset first: the results sheet builds on both. */
import './search.css';
import '../results/searchResults.css';

export interface SearchPanelProps {
  tokens: readonly TokenEntry[];
  index: AsyncState<StorybookDocsIndex>;
  usage: AsyncState<UsageIndex>;
  /** Called on the first focus or suggestion pick, to start loading the token usage. */
  onEngage: () => void;
}

/** Query state; results follow a deferred copy so typing stays responsive. */
function useSearchResults({ tokens, index, usage }: Omit<SearchPanelProps, 'onEngage'>) {
  const [query, setQuery] = useState('');
  const settledQuery = useDeferredValue(query);
  const groups = useMemo(
    () => searchCatalog({ tokens, index: readyData(index), usage: readyData(usage) }, settledQuery),
    [tokens, index, usage, settledQuery],
  );

  return { query, setQuery, settledQuery: settledQuery.trim(), groups };
}

function summaryText(
  settledQuery: string,
  groups: readonly ResultGroup[],
  props: SearchPanelProps,
  copy: SearchCopy,
) {
  if (settledQuery !== '') {
    return copy.resultSummary(countResults(groups), settledQuery);
  }

  const components = readyData(props.index)?.components.length ?? 0;

  return copy.catalogStats(props.tokens.length, components);
}

interface SearchFieldProps {
  fieldRef: RefObject<HTMLInputElement | null>;
  value: string;
  resultsId: string;
  hintId: string;
  onChange: (value: string) => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  onFocus: () => void;
}

function SearchField({ fieldRef, value, resultsId, hintId, ...handlers }: SearchFieldProps) {
  const fieldId = useId();
  const copy = useSearchCopy();

  return (
    <div className="nui-search-field">
      <label className="nui-search-sr" htmlFor={fieldId}>
        {copy.inputLabel}
      </label>
      <SearchFieldIcon />
      <input
        ref={fieldRef}
        id={fieldId}
        type="search"
        value={value}
        placeholder={copy.placeholder}
        autoComplete="off"
        spellCheck={false}
        aria-controls={resultsId}
        aria-describedby={hintId}
        onChange={(event: ChangeEvent<HTMLInputElement>) => handlers.onChange(event.target.value)}
        onKeyDown={handlers.onKeyDown}
        onFocus={handlers.onFocus}
      />
      <kbd className="nui-search-kbd" aria-hidden="true">
        {copy.clearHint}
      </kbd>
    </div>
  );
}

function SearchHeader({ titleId, hintId }: { titleId: string; hintId: string }) {
  const copy = useSearchCopy();

  return (
    <header className="nui-search-head">
      <span className="nui-search-eyebrow">{copy.eyebrow}</span>
      <h1 id={titleId} className="nui-search-title">
        {copy.title}
      </h1>
      <p className="nui-search-lead">{copy.lead}</p>
      <p id={hintId} className="nui-search-hint">
        {copy.keyboardHint}
      </p>
    </header>
  );
}

/** Wiring of the panel: ids, query, live announcements, focus refs and keyboard handlers. */
function useSearchPanel(props: SearchPanelProps) {
  const ids = { title: useId(), hint: useId(), results: useId() };
  const results = useSearchResults(props);
  const [announcement, setAnnouncement] = useState('');
  const fieldRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const { setQuery } = results;
  const clear = useCallback(() => setQuery(''), [setQuery]);
  const keyboard = useResultsKeyboard({ fieldRef, resultsRef, onClear: clear });
  const { onEngage } = props;

  const pick = (suggestion: string) => {
    onEngage();
    setQuery(suggestion);
    fieldRef.current?.focus();
  };

  return { ids, ...results, announcement, setAnnouncement, fieldRef, resultsRef, keyboard, pick };
}

interface SearchMetaProps {
  summary: string;
  announcement: string;
  index: AsyncState<StorybookDocsIndex>;
  usage: AsyncState<UsageIndex>;
}

/** Visible result summary plus a hidden live region for copy confirmations. */
function SearchMeta({ summary, announcement, index, usage }: SearchMetaProps) {
  return (
    <div className="nui-search-meta">
      <p className="nui-search-summary" role="status">
        {summary}
      </p>
      <StatusNote index={index} usage={usage} />
      <p className="nui-search-sr" role="status">
        {announcement}
      </p>
    </div>
  );
}

/** Search UI over already-resolved data; `TokenSearch` wires it to the library and Storybook. */
export function SearchPanel(props: SearchPanelProps) {
  const { ids, fieldRef, resultsRef, keyboard, ...panel } = useSearchPanel(props);
  const copy = useSearchCopy();

  return (
    /* `sb-unstyled` keeps Storybook Docs typography from restyling the page. */
    <section className="nui-search sb-unstyled" aria-labelledby={ids.title}>
      <SearchHeader titleId={ids.title} hintId={ids.hint} />
      <SearchField
        fieldRef={fieldRef}
        value={panel.query}
        resultsId={ids.results}
        hintId={ids.hint}
        onChange={panel.setQuery}
        onKeyDown={keyboard.onFieldKeyDown}
        onFocus={props.onEngage}
      />
      <SearchMeta
        summary={summaryText(panel.settledQuery, panel.groups, props, copy)}
        announcement={panel.announcement}
        index={props.index}
        usage={props.usage}
      />
      <div
        ref={resultsRef}
        id={ids.results}
        className="nui-search-results"
        onKeyDown={keyboard.onResultsKeyDown}
      >
        <SearchBody
          query={panel.settledQuery}
          groups={panel.groups}
          onPick={panel.pick}
          onAnnounce={panel.setAnnouncement}
        />
      </div>
    </section>
  );
}

interface SearchBodyProps {
  query: string;
  groups: readonly ResultGroup[];
  onPick: (query: string) => void;
  onAnnounce: (message: string) => void;
}

function SearchBody({ query, groups, onPick, onAnnounce }: SearchBodyProps) {
  if (query === '') {
    return <EmptyState onPick={onPick} />;
  }

  if (groups.length === 0) {
    return <NoResults query={query} onPick={onPick} />;
  }

  return <ResultGroups groups={groups} onAnnounce={onAnnounce} />;
}
