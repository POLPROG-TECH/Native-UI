import {
  familiesForLocale,
  familyForWeight,
  spaceGroteskFontFamilies,
  bloomFontFamilies,
  systemFontFamilies,
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

describe('familiesForLocale', () => {
  describe('GIVEN no locale is known yet', () => {
    describe('WHEN the families are resolved', () => {
      it('THEN the preferred Latin preset is used', () => {
        expect(familiesForLocale(undefined)).toBe(spaceGroteskFontFamilies);
      });
    });
  });

  describe('GIVEN a Latin-script locale', () => {
    describe('WHEN the families are resolved', () => {
      it('THEN the preferred preset is kept, including a custom one', () => {
        expect(familiesForLocale('pl')).toBe(spaceGroteskFontFamilies);
        expect(familiesForLocale('de-DE', bloomFontFamilies)).toBe(bloomFontFamilies);
      });
    });
  });

  describe('GIVEN a locale whose script the preset does not cover', () => {
    describe('WHEN the families are resolved', () => {
      it('THEN the system font is used so every glyph renders', () => {
        expect(familiesForLocale('ja')).toBe(systemFontFamilies);
        expect(familiesForLocale('ar-EG')).toBe(systemFontFamilies);
        expect(familiesForLocale('zh-TW', bloomFontFamilies)).toBe(systemFontFamilies);
      });
    });

    describe('WHEN the tag is written in upper case', () => {
      it('THEN it is matched all the same', () => {
        expect(familiesForLocale('ZH-CN')).toBe(systemFontFamilies);
      });
    });
  });
});

describe('familyForWeight without a display family', () => {
  describe('GIVEN a single-family preset', () => {
    describe('WHEN the display role is resolved for every weight', () => {
      it('THEN it falls back to the base family', () => {
        const weights = (['400', '500', '600', '700'] as const).map((weight) =>
          familyForWeight(spaceGroteskFontFamilies, weight, 'display'),
        );

        expect(weights).toEqual([
          spaceGroteskFontFamilies.regular,
          spaceGroteskFontFamilies.medium,
          spaceGroteskFontFamilies.semiBold,
          spaceGroteskFontFamilies.bold,
        ]);
      });
    });
  });
});
