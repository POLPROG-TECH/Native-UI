import {
  familyForWeight,
  spaceGroteskFontFamilies,
  bloomFontFamilies,
} from '../../src/tokens/fonts';

describe('familyForWeight', () => {
  it('should route the display role to the display family when one is configured', () => {
    // GIVEN Bloom (Plus Jakarta Sans body + Outfit display)
    // THEN the display role resolves to the Outfit weights
    expect(familyForWeight(bloomFontFamilies, '600', 'display')).toBe('Outfit_600SemiBold');
    expect(familyForWeight(bloomFontFamilies, '700', 'display')).toBe('Outfit_700Bold');
  });

  it('should keep body/text on the base family', () => {
    expect(familyForWeight(bloomFontFamilies, '400', 'text')).toBe('PlusJakartaSans_400Regular');
    expect(familyForWeight(bloomFontFamilies, '600', 'text')).toBe('PlusJakartaSans_600SemiBold');
  });

  it('should fall back to the base family for the display role when no display family exists', () => {
    // GIVEN a single-family preset (Aurora ships no display group)
    // THEN the display role resolves identically to the text role
    expect(familyForWeight(spaceGroteskFontFamilies, '600', 'display')).toBe(
      familyForWeight(spaceGroteskFontFamilies, '600', 'text'),
    );
    expect(familyForWeight(spaceGroteskFontFamilies, '600', 'display')).toBe(
      'SpaceGrotesk_600SemiBold',
    );
  });

  it('should default to the text role when none is provided', () => {
    expect(familyForWeight(bloomFontFamilies, '400')).toBe(
      familyForWeight(bloomFontFamilies, '400', 'text'),
    );
  });
});
