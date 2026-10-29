import { SCORE_WEIGHTS } from '../searchConfig';

/** Text an entry can be found by: names match anywhere, values only whole or from the start. */
export interface SearchFields {
  names: readonly string[];
  values: readonly string[];
}

/**
 * Shortest hex prefix that counts as a match, so typing "16" finds the
 * spacing step 16 rather than every color that starts with those digits.
 */
const MIN_HEX_PREFIX_LENGTH = 3;

/** Splits a query into lowercase terms; empty when the query is blank. */
export function toSearchTerms(query: string): string[] {
  return query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter((term) => term.length > 0);
}

/** Splits `primaryText`, `colors.primary` or `Icon slot` into lowercase words. */
function wordsOf(text: string): string[] {
  return text
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .toLowerCase()
    .split(/[\s._/'"[\]-]+/)
    .filter((word) => word.length > 0);
}

/** Relevance of a name-like field for one lowercase term; 0 when it does not match. */
export function scoreName(field: string, term: string): number {
  const text = field.toLowerCase();

  if (text === term) {
    return SCORE_WEIGHTS.exact;
  }

  if (text.startsWith(term)) {
    return SCORE_WEIGHTS.prefix;
  }

  if (wordsOf(field).some((word) => word.startsWith(term))) {
    return SCORE_WEIGHTS.wordStart;
  }

  return text.includes(term) ? SCORE_WEIGHTS.substring : 0;
}

/** Hex values match with or without the leading `#`. */
function withoutHash(text: string): string {
  return text.replace(/^#/, '');
}

/**
 * Relevance of a value field for one lowercase term. Numbers only match
 * whole; hex colors also match from the start.
 */
export function scoreValue(value: string, term: string): number {
  const isHex = value.startsWith('#');
  const text = withoutHash(value.toLowerCase());
  const bareTerm = withoutHash(term);

  if (bareTerm.length === 0) {
    return 0;
  }

  if (text === bareTerm) {
    return SCORE_WEIGHTS.valueExact;
  }

  const isHexPrefix = isHex && bareTerm.length >= MIN_HEX_PREFIX_LENGTH;

  return isHexPrefix && text.startsWith(bareTerm) ? SCORE_WEIGHTS.valuePrefix : 0;
}

/** Best score of one term across all fields of an entry. */
function scoreTerm(fields: SearchFields, term: string): number {
  const nameScores = fields.names.map((name) => scoreName(name, term));
  const valueScores = fields.values.map((value) => scoreValue(value, term));

  return Math.max(0, ...nameScores, ...valueScores);
}

/**
 * Relevance of an entry for all terms: the sum of the per-term scores, or 0
 * when any term misses, so "primary text" narrows instead of widening.
 */
export function scoreFields(fields: SearchFields, terms: readonly string[]): number {
  const termScores = terms.map((term) => scoreTerm(fields, term));

  if (termScores.length === 0 || termScores.includes(0)) {
    return 0;
  }

  return termScores.reduce((sum, score) => sum + score, 0);
}
