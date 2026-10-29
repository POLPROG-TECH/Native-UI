import { scoreFields, toSearchTerms, type SearchFields } from './scoring';
import {
  RESULT_GROUP_ORDER,
  SCORE_WEIGHTS,
  SEARCH_LIMITS,
  STORYBOOK_URLS,
  TOKEN_DOCS_TITLES,
} from '../searchConfig';
import type {
  ComponentDoc,
  ComponentHit,
  MatchedTokenRef,
  ResultGroup,
  ResultKind,
  StorybookDocsIndex,
  TokenEntry,
  TokenHit,
  TokenKind,
  TokenRelation,
  TokenUsage,
  UsageIndex,
} from '../searchTypes';

/** Everything a query runs against; the index and usage arrive later than the tokens. */
export interface SearchInput {
  tokens: readonly TokenEntry[];
  index: StorybookDocsIndex | null;
  usage: UsageIndex | null;
}

function tokenSearchFields(entry: TokenEntry): SearchFields {
  const names = [entry.key, entry.path];

  if (entry.kind === 'color') {
    return { names, values: [entry.light, entry.dark] };
  }

  const value = entry.kind === 'typography' ? entry.fontSize : entry.value;

  return { names, values: [String(value)] };
}

/** Link to the token reference page of a family, or null when the index lacks it. */
export function tokenDocsHref(kind: TokenKind, index: StorybookDocsIndex | null): string | null {
  const title = TOKEN_DOCS_TITLES[kind].find((candidate) => index?.docsIdByTitle.has(candidate));
  const id = title === undefined ? undefined : index?.docsIdByTitle.get(title);

  return id === undefined ? null : STORYBOOK_URLS.docsPage(id);
}

function byScore<T extends { score: number }>(a: T, b: T): number {
  return b.score - a.score;
}

/** Matching tokens, best first; ties keep the theme's own order. */
export function searchTokens(
  tokens: readonly TokenEntry[],
  terms: readonly string[],
  index: StorybookDocsIndex | null,
): TokenHit[] {
  return tokens
    .map((entry) => ({
      entry,
      score: scoreFields(tokenSearchFields(entry), terms),
      href: tokenDocsHref(entry.kind, index),
    }))
    .filter((hit) => hit.score > 0)
    .sort(byScore);
}

function relationOf(usage: TokenUsage, path: string): TokenRelation | null {
  if (usage.uses.has(path)) {
    return 'uses';
  }

  return usage.documents.has(path) ? 'documents' : null;
}

/** Matched token paths this component uses or documents, in token relevance order. */
function matchedTokensOf(
  usage: TokenUsage | undefined,
  tokenPaths: readonly string[],
): MatchedTokenRef[] {
  if (usage === undefined) {
    return [];
  }

  return tokenPaths.flatMap((path) => {
    const relation = relationOf(usage, path);

    return relation === null ? [] : [{ path, relation }];
  });
}

function componentHit(
  doc: ComponentDoc,
  terms: readonly string[],
  matchedTokens: readonly MatchedTokenRef[],
): ComponentHit {
  const nameScore = scoreFields({ names: [doc.name], values: [] }, terms);
  const tokenScore =
    matchedTokens.length > 0 ? SCORE_WEIGHTS.componentViaToken + matchedTokens.length : 0;

  return {
    doc,
    score: Math.max(nameScore, tokenScore),
    href: STORYBOOK_URLS.docsPage(doc.id),
    matchedTokens,
  };
}

/** Components matched by name or through a matching token they use or document. */
export function searchComponents(
  input: SearchInput,
  terms: readonly string[],
  tokenHits: readonly TokenHit[],
): ComponentHit[] {
  const tokenPaths = tokenHits.map((hit) => hit.entry.path);
  const docs = input.index?.components ?? [];

  return docs
    .map((doc) => componentHit(doc, terms, matchedTokensOf(input.usage?.get(doc.id), tokenPaths)))
    .filter((hit) => hit.score > 0)
    .sort(byScore);
}

function groupFor(
  kind: ResultKind,
  tokenHits: readonly TokenHit[],
  componentHits: readonly ComponentHit[],
): ResultGroup {
  const limit = SEARCH_LIMITS.maxHitsPerGroup;

  if (kind === 'component') {
    return { kind, hits: componentHits.slice(0, limit), total: componentHits.length };
  }

  const hits = tokenHits.filter((hit) => hit.entry.kind === kind);

  return { kind, hits: hits.slice(0, limit), total: hits.length };
}

/** Runs a query and returns the non-empty result groups in page order. */
export function searchCatalog(input: SearchInput, query: string): ResultGroup[] {
  const terms = toSearchTerms(query);

  if (terms.length === 0) {
    return [];
  }

  const tokenHits = searchTokens(input.tokens, terms, input.index);
  const componentHits = searchComponents(input, terms, tokenHits);

  return RESULT_GROUP_ORDER.map((kind) => groupFor(kind, tokenHits, componentHits)).filter(
    (group) => group.total > 0,
  );
}

/** Total matches across groups, including those hidden by the per-group cap. */
export function countResults(groups: readonly ResultGroup[]): number {
  return groups.reduce((sum, group) => sum + group.total, 0);
}
