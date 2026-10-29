import { resolveInitials } from '../../src/components/avatar/initials';

describe('resolveInitials', () => {
  describe('GIVEN explicit initials and a name', () => {
    describe('WHEN initials are resolved', () => {
      it('THEN the explicit initials win, capped and uppercased', () => {
        expect(resolveInitials('abc', 'John Doe')).toBe('AB');
      });
    });
  });

  describe('GIVEN only a name with extra whitespace and three words', () => {
    describe('WHEN initials are resolved', () => {
      it('THEN the first letters of the first two words are used', () => {
        expect(resolveInitials(undefined, '  john   ronald doe ')).toBe('JR');
      });
    });
  });

  describe('GIVEN neither initials nor a name', () => {
    describe('WHEN initials are resolved', () => {
      it('THEN a placeholder is shown', () => {
        expect(resolveInitials(undefined, undefined)).toBe('?');
      });
    });
  });
});
