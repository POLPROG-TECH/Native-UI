import {
  familyForWeight,
  spaceGroteskFontFamilies,
  bloomFontFamilies,
} from '../../src/tokens/fonts';

describe('familyForWeight', () => {
  describe('GIVEN Bloom (Plus Jakarta Sans body + Outfit display)', () => {
    describe('WHEN the display role is resolved', () => {
      it('THEN the display role resolves to the Outfit weights', () => {
        expect(familyForWeight(bloomFontFamilies, '600', 'display')).toBe('Outfit_600SemiBold');
        expect(familyForWeight(bloomFontFamilies, '700', 'display')).toBe('Outfit_700Bold');
      });
    });
  });

  describe('GIVEN Bloom with a separate display family', () => {
    describe('WHEN the text role is resolved', () => {
      it('THEN it stays on the Plus Jakarta Sans base family', () => {
        expect(familyForWeight(bloomFontFamilies, '400', 'text')).toBe(
          'PlusJakartaSans_400Regular',
        );
        expect(familyForWeight(bloomFontFamilies, '600', 'text')).toBe(
          'PlusJakartaSans_600SemiBold',
        );
      });
    });
  });

  describe('GIVEN a single-family preset (Aurora ships no display group)', () => {
    describe('WHEN the display role is resolved', () => {
      it('THEN the display role resolves identically to the text role', () => {
        expect(familyForWeight(spaceGroteskFontFamilies, '600', 'display')).toBe(
          familyForWeight(spaceGroteskFontFamilies, '600', 'text'),
        );
        expect(familyForWeight(spaceGroteskFontFamilies, '600', 'display')).toBe(
          'SpaceGrotesk_600SemiBold',
        );
      });
    });
  });

  describe('GIVEN Bloom font families', () => {
    describe('WHEN no role is passed', () => {
      it('THEN the text role is used', () => {
        expect(familyForWeight(bloomFontFamilies, '400')).toBe(
          familyForWeight(bloomFontFamilies, '400', 'text'),
        );
      });
    });
  });
});
