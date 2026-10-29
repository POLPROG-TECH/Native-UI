import { typography, FONT_SCALE } from '../../src/tokens/typography';
import type { TypographyVariant } from '../../src/tokens/typography';
import { defined } from '../shared/defined';

const allVariants: TypographyVariant[] = [
  'displayLarge',
  'displayMedium',
  'h1',
  'h2',
  'h3',
  'heading',
  'title',
  'bodyLarge',
  'body',
  'bodyMedium',
  'bodySmall',
  'label',
  'labelSmall',
  'caption',
  'overline',
  'mono',
  'monoLarge',
  'monoSmall',
];

describe('typography tokens', () => {
  describe('GIVEN the full list of expected typography variant names', () => {
    describe('WHEN each variant is looked up on the typography object', () => {
      it('THEN every lookup returns a defined style entry', () => {
        const lookups = allVariants.map((variant) => typography[variant]);

        lookups.forEach((style) => {
          expect(style).toBeDefined();
        });
      });
    });
  });

  describe('GIVEN the full list of typography variants', () => {
    describe("WHEN each variant's style is inspected", () => {
      it('THEN every style has fontFamily, fontSize, lineHeight and fontWeight', () => {
        const styles = allVariants.map((variant) => typography[variant]);

        styles.forEach((style) => {
          expect(style).toHaveProperty('fontFamily');
          expect(style).toHaveProperty('fontSize');
          expect(style).toHaveProperty('lineHeight');
          expect(style).toHaveProperty('fontWeight');
        });
      });
    });
  });

  describe('GIVEN the three heading variants h1, h2 and h3', () => {
    describe('WHEN their font weights are read', () => {
      it('THEN every heading weight is "600"', () => {
        const weights = [
          typography.h1.fontWeight,
          typography.h2.fontWeight,
          typography.h3.fontWeight,
        ];

        weights.forEach((weight) => {
          expect(weight).toBe('600');
        });
      });
    });
  });

  describe('GIVEN the body, bodyLarge and bodySmall variants', () => {
    describe('WHEN their font weights are read', () => {
      it('THEN body weights are 400 or 500 as documented', () => {
        const bodyWeight = typography.body.fontWeight;
        const bodyLargeWeight = typography.bodyLarge.fontWeight;
        const bodySmallWeight = typography.bodySmall.fontWeight;

        expect(bodyWeight).toBe('400');
        expect(['400', '500']).toContain(bodyLargeWeight);
        expect(bodySmallWeight).toBe('400');
      });
    });
  });

  describe('GIVEN the display and h1 variants', () => {
    describe('WHEN the display font sizes are compared to h1', () => {
      it('THEN displayLarge is strictly larger and displayMedium is at least as large as h1', () => {
        const { fontSize: displayLarge } = typography.displayLarge;
        const { fontSize: displayMedium } = typography.displayMedium;
        const { fontSize: h1 } = typography.h1;

        expect(displayLarge).toBeGreaterThan(h1);
        expect(displayMedium).toBeGreaterThanOrEqual(h1);
      });
    });
  });

  describe('GIVEN the typography hierarchy from displayLarge to caption', () => {
    describe('WHEN consecutive font sizes are compared', () => {
      it('THEN font sizes strictly decrease through the hierarchy', () => {
        const dl = typography.displayLarge.fontSize;
        const dm = typography.displayMedium.fontSize;
        const h1 = typography.h1.fontSize;
        const h2 = typography.h2.fontSize;
        const h3 = typography.h3.fontSize;
        const body = typography.body.fontSize;
        const bodySmall = typography.bodySmall.fontSize;
        const caption = typography.caption.fontSize;

        expect(dl).toBeGreaterThan(dm);
        expect(dm).toBeGreaterThanOrEqual(h1);
        expect(h1).toBeGreaterThan(h2);
        expect(h2).toBeGreaterThan(h3);
        expect(body).toBeGreaterThan(bodySmall);
        expect(bodySmall).toBeGreaterThan(caption);
      });
    });
  });

  describe('GIVEN the full list of typography variants', () => {
    describe("WHEN each variant's style is inspected", () => {
      it("THEN every variant's lineHeight is at least its fontSize", () => {
        const styles = allVariants.map((variant) => typography[variant]);

        styles.forEach((style) => {
          expect(style.lineHeight).toBeGreaterThanOrEqual(style.fontSize);
        });
      });
    });
  });

  describe('GIVEN the documented Apple HIG font size and line height values', () => {
    describe('WHEN the corresponding variant styles are read', () => {
      it('THEN every variant matches the Apple HIG values', () => {
        const body = typography.body;
        const h1 = typography.h1;
        const displayLarge = typography.displayLarge;
        const caption = typography.caption;
        const overline = typography.overline;
        const title = typography.title;
        const bodyMedium = typography.bodyMedium;
        const bodySmall = typography.bodySmall;

        expect(body.fontSize).toBe(17);
        expect(body.lineHeight).toBe(22);
        expect(h1.fontSize).toBe(28);
        expect(displayLarge.fontSize).toBe(34);
        expect(caption.fontSize).toBe(13);
        expect(caption.lineHeight).toBe(18);
        expect(overline.fontSize).toBe(11);
        expect(overline.letterSpacing).toBeGreaterThan(0);
        expect(title.fontSize).toBe(17);
        expect(bodyMedium.fontSize).toBe(16);
        expect(bodySmall.fontSize).toBe(15);
      });
    });
  });

  describe('GIVEN the three mono variants', () => {
    describe('WHEN their fontVariant arrays are read', () => {
      it('THEN each one contains "tabular-nums"', () => {
        const monoVariants = [
          typography.mono.fontVariant,
          typography.monoLarge.fontVariant,
          typography.monoSmall.fontVariant,
        ];

        monoVariants.forEach((fv) => {
          expect(fv).toContain('tabular-nums');
        });
      });
    });
  });
});

describe('FONT_SCALE', () => {
  describe('GIVEN the exported FONT_SCALE object', () => {
    describe('WHEN its tier keys are inspected', () => {
      it('THEN it has default, medium and large properties', () => {
        const scale = FONT_SCALE;

        expect(scale).toHaveProperty('default');
        expect(scale).toHaveProperty('medium');
        expect(scale).toHaveProperty('large');
      });
    });

    describe('WHEN the default tier value is read', () => {
      it('THEN it is zero', () => {
        const defaultTier = FONT_SCALE['default'];

        expect(defaultTier).toBe(0);
      });
    });
  });

  describe('GIVEN the default, medium and large tier values', () => {
    describe('WHEN the tiers are compared pairwise', () => {
      it('THEN medium exceeds default and large exceeds medium', () => {
        const defaultTier = defined(FONT_SCALE['default'], 'default tier');
        const mediumTier = defined(FONT_SCALE['medium'], 'medium tier');
        const largeTier = defined(FONT_SCALE['large'], 'large tier');

        expect(mediumTier).toBeGreaterThan(defaultTier);
        expect(largeTier).toBeGreaterThan(mediumTier);
      });
    });
  });
});
