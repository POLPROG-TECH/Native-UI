import type { ReactNode } from 'react';
import { SEARCH_LIMITS } from '../searchConfig';
import { useSearchCopy } from '../searchCopy';
import type { ComponentHit, MatchedTokenRef, TokenEntry, TokenHit } from '../searchTypes';
import { tokenValueText } from '../tokens/tokenCatalog';
import { ComponentPreview, TokenPreview } from './TokenPreview';
import { CopyValueButton } from './CopyValueButton';
import { RESULT_LINK_ATTRIBUTE, RESULT_ROW_ATTRIBUTE } from './useResultsKeyboard';

const rowAttributes = { [RESULT_ROW_ATTRIBUTE]: '' };
const linkAttributes = { [RESULT_LINK_ATTRIBUTE]: '' };

interface ResultLinkProps {
  href: string | null;
  title: string;
  subtitle: string;
}

/**
 * The row's main target. It stretches over the whole row (see the CSS), and
 * opens the docs page in the manager window rather than inside the preview.
 */
function ResultLink({ href, title, subtitle }: ResultLinkProps) {
  const { noDocsPage } = useSearchCopy();
  const content: ReactNode = (
    <>
      <span className="nui-search-name">{title}</span>
      {/* Keeps the name and path apart in the link's accessible name. */}{' '}
      <span className="nui-search-path">{subtitle}</span>
    </>
  );

  if (href === null) {
    return (
      <span className="nui-search-link" title={noDocsPage}>
        {content}
      </span>
    );
  }

  return (
    <a className="nui-search-link" href={href} target="_top" {...linkAttributes}>
      {content}
    </a>
  );
}

interface AnnounceProps {
  onAnnounce: (message: string) => void;
}

function TokenValues({ entry, onAnnounce }: { entry: TokenEntry } & AnnounceProps) {
  const { groupLabels, modeLabels } = useSearchCopy();

  if (entry.kind !== 'color') {
    return (
      <CopyValueButton
        value={tokenValueText(entry)}
        what={groupLabels[entry.kind]}
        onAnnounce={onAnnounce}
      />
    );
  }

  return (
    <>
      <CopyValueButton
        value={entry.light}
        what={modeLabels.light}
        caption={modeLabels.light}
        showDot
        onAnnounce={onAnnounce}
      />
      <CopyValueButton
        value={entry.dark}
        what={modeLabels.dark}
        caption={modeLabels.dark}
        showDot
        onAnnounce={onAnnounce}
      />
    </>
  );
}

export function TokenRow({ hit, onAnnounce }: { hit: TokenHit } & AnnounceProps) {
  const { entry } = hit;

  return (
    <li className="nui-search-row" {...rowAttributes}>
      <TokenPreview entry={entry} />
      <ResultLink href={hit.href} title={entry.key} subtitle={entry.path} />
      <div className="nui-search-aside">
        <TokenValues entry={entry} onAnnounce={onAnnounce} />
      </div>
    </li>
  );
}

function TokenChips({ refs, component }: { refs: readonly MatchedTokenRef[]; component: string }) {
  const visible = refs.slice(0, SEARCH_LIMITS.maxTokenChips);
  const hidden = refs.length - visible.length;
  const copy = useSearchCopy();

  return (
    <ul className="nui-search-chips" aria-label={copy.matchedTokensLabel(component)}>
      {visible.map((ref) => (
        <li key={ref.path} className="nui-search-chip" data-relation={ref.relation}>
          <span className="nui-search-chip-relation">{copy.relationLabels[ref.relation]}</span>
          <code>{ref.path}</code>
        </li>
      ))}
      {hidden > 0 ? (
        <li className="nui-search-chip nui-search-chip--more">{copy.moreTokens(hidden)}</li>
      ) : null}
    </ul>
  );
}

export function ComponentRow({ hit }: { hit: ComponentHit }) {
  const { doc, matchedTokens } = hit;

  return (
    <li className="nui-search-row" {...rowAttributes}>
      <ComponentPreview name={doc.name} />
      <ResultLink href={hit.href} title={doc.name} subtitle={doc.section} />
      {matchedTokens.length > 0 ? (
        <div className="nui-search-aside">
          <TokenChips refs={matchedTokens} component={doc.name} />
        </div>
      ) : null}
    </li>
  );
}
