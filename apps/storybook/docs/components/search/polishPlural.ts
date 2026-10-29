/** Noun forms Polish picks between by count: 1 wynik, 2 wyniki, 5 wyników. */
export interface PolishNounForms {
  one: string;
  few: string;
  many: string;
}

const POLISH_PLURALS = new Intl.PluralRules('pl-PL');

/**
 * The noun form for a whole-number count. CLDR also defines `other` for
 * fractions, which never occur in counts, so it shares the `many` form.
 */
export function polishNoun(count: number, forms: PolishNounForms): string {
  const rule = POLISH_PLURALS.select(count);

  if (rule === 'one' || rule === 'few') {
    return forms[rule];
  }

  return forms.many;
}
