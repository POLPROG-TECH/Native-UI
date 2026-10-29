import { resolveHeaderTitle } from '../../src/components/listHeader/listHeaderTitle';

describe('resolveHeaderTitle', () => {
  describe('GIVEN an xs header without an explicit transform', () => {
    describe('WHEN the title is resolved', () => {
      it('THEN it is uppercased through the style, not the string', () => {
        const result = resolveHeaderTitle('General', 'xs', undefined);

        expect(result).toEqual({ displayTitle: 'General', textTransform: 'uppercase' });
      });
    });
  });

  describe('GIVEN an lg header without an explicit transform', () => {
    describe('WHEN the title is resolved', () => {
      it('THEN no transform is applied', () => {
        const result = resolveHeaderTitle('General', 'lg', undefined);

        expect(result).toEqual({ displayTitle: 'General' });
      });
    });
  });

  describe('GIVEN a function transform', () => {
    describe('WHEN the title is resolved', () => {
      it('THEN the string itself is rewritten', () => {
        const result = resolveHeaderTitle('General', 'xs', (s) => `${s}!`);

        expect(result).toEqual({ displayTitle: 'General!' });
      });
    });
  });

  describe('GIVEN an explicit none transform on an xs header', () => {
    describe('WHEN the title is resolved', () => {
      it('THEN the size default is overridden', () => {
        const result = resolveHeaderTitle('General', 'xs', 'none');

        expect(result).toEqual({ displayTitle: 'General' });
      });
    });
  });
});
