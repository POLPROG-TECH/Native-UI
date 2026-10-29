import { useId, type ReactNode } from 'react';
import { useSearchCopy } from '../searchCopy';
import type { ResultGroup } from '../searchTypes';
import { ComponentRow, TokenRow } from './ResultRows';

type Announce = (message: string) => void;

function rowsOf(group: ResultGroup, onAnnounce: Announce): ReactNode {
  if (group.kind === 'component') {
    return group.hits.map((hit) => <ComponentRow key={hit.doc.id} hit={hit} />);
  }

  return group.hits.map((hit) => (
    <TokenRow key={hit.entry.path} hit={hit} onAnnounce={onAnnounce} />
  ));
}

function ResultGroupSection({ group, onAnnounce }: { group: ResultGroup; onAnnounce: Announce }) {
  const headingId = useId();
  const hidden = group.total - group.hits.length;
  const copy = useSearchCopy();

  return (
    <section className="nui-search-group" aria-labelledby={headingId}>
      <h2 id={headingId} className="nui-search-group-title">
        {copy.groupLabels[group.kind]}
        <span className="nui-search-count">{group.total}</span>
      </h2>
      <ul className="nui-search-list">{rowsOf(group, onAnnounce)}</ul>
      {hidden > 0 ? <p className="nui-search-more">{copy.moreResults(hidden)}</p> : null}
    </section>
  );
}

export function ResultGroups({
  groups,
  onAnnounce,
}: {
  groups: readonly ResultGroup[];
  onAnnounce: Announce;
}) {
  return (
    <>
      {groups.map((group) => (
        <ResultGroupSection key={group.kind} group={group} onAnnounce={onAnnounce} />
      ))}
    </>
  );
}
