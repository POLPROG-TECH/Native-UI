import { screen } from '@testing-library/react';
import { Stepper } from '../../src/components/Stepper';
import { defaultLabels, type NativeUILabels } from '../../src/theme/labels';
import { arLabels } from '../../src/theme/locales/ar';
import { deLabels } from '../../src/theme/locales/de';
import { esLabels } from '../../src/theme/locales/es';
import { plLabels } from '../../src/theme/locales/pl';
import { typedKeys } from '../../src/utils/typedKeys';
import { renderWithTheme } from '../test-utils';

const PACKS: ReadonlyArray<[name: string, pack: NativeUILabels]> = [
  ['pl', plLabels],
  ['es', esLabels],
  ['de', deLabels],
  ['ar', arLabels],
];

/**
 * Keys that are punctuation or number formats, plus words that are spelled
 * the same in the target language, so they may equal the English default.
 */
const SAME_AS_ENGLISH: Record<string, ReadonlyArray<keyof NativeUILabels>> = {
  pl: ['confirm'],
  es: ['avatar'],
  de: ['confirm', 'avatar'],
  ar: [],
};
const FORMAT_KEYS: ReadonlyArray<keyof NativeUILabels> = ['requiredMarker', 'rangeSeparator'];

function textKeys(): Array<keyof NativeUILabels> {
  return typedKeys(defaultLabels).filter(
    (key) => typeof defaultLabels[key] === 'string' && !FORMAT_KEYS.includes(key),
  );
}

describe('label packs', () => {
  describe.each(PACKS)('GIVEN the %s label pack', (name, pack) => {
    describe('WHEN its text labels are compared with the English defaults', () => {
      it('THEN no English text is left untranslated', () => {
        const allowed = SAME_AS_ENGLISH[name] ?? [];
        const untranslated = textKeys().filter(
          (key) => pack[key] === defaultLabels[key] && !allowed.includes(key),
        );

        expect(untranslated).toEqual([]);
      });
    });

    describe('WHEN its message functions are called', () => {
      it('THEN each message carries the numbers it was given', () => {
        expect(pack.pinProgress(3, 6)).toMatch(/3.*6/);
        expect(pack.stepOf(2, 5)).toMatch(/2.*5/);
        expect(pack.countOverflow(99)).toContain('99');
        expect(pack.statValue('A', 'B')).toMatch(/A.*B/);
      });
    });

    describe('WHEN it is passed to the provider', () => {
      it('THEN components render its strings', () => {
        renderWithTheme(<Stepper accessibilityLabel="x" value={1} onChange={() => {}} />, {
          config: { colorMode: 'light', labels: pack },
        });

        expect(screen.getByRole('button', { name: pack.increase })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: pack.decrease })).toBeInTheDocument();
      });
    });
  });
});
