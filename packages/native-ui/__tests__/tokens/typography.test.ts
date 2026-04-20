import { typography, FONT_SCALE } from '../../src/tokens/typography';
import type { TypographyVariant } from '../../src/tokens/typography';

const allVariants: TypographyVariant[] = [
  'displayLarge', 'displayMedium',
  'h1', 'h2', 'h3',
  'heading', 'title',
  'bodyLarge', 'body', 'bodyMedium', 'bodySmall',
  'label', 'labelSmall',
  'caption', 'overline',
  'mono', 'monoLarge', 'monoSmall',
  'amount', 'amountLarge', 'amountSmall',
];

describe('typography tokens', () => {
  it('should_define_every_expected_variant_on_the_typography_object', () => {
    // GIVEN the full list of expected typography variant names

    // WHEN each variant is looked up on the typography object
    const lookups = allVariants.map((variant) => typography[variant]);

    // THEN every lookup returns a defined style entry
    lookups.forEach((style) => {
      expect(style).toBeDefined();
    });
  });

  it('should_define_required_style_properties_on_every_variant', () => {
    // GIVEN the full list of typography variants

    // WHEN each variant's style is inspected
    const styles = allVariants.map((variant) => typography[variant]);

    // THEN every style has fontFamily, fontSize, lineHeight and fontWeight
    styles.forEach((style) => {
      expect(style).toHaveProperty('fontFamily');
      expect(style).toHaveProperty('fontSize');
      expect(style).toHaveProperty('lineHeight');
      expect(style).toHaveProperty('fontWeight');
    });
  });

  it('should_use_semibold_weight_600_for_heading_variants', () => {
    // GIVEN the three heading variants h1, h2 and h3

    // WHEN their font weights are read
    const weights = [typography.h1.fontWeight, typography.h2.fontWeight, typography.h3.fontWeight];

    // THEN every heading weight is "600"
    weights.forEach((weight) => {
      expect(weight).toBe('600');
    });
  });

  it('should_use_regular_or_medium_weights_for_body_variants', () => {
    // GIVEN the body, bodyLarge and bodySmall variants

    // WHEN their font weights are read
    const bodyWeight = typography.body.fontWeight;
    const bodyLargeWeight = typography.bodyLarge.fontWeight;
    const bodySmallWeight = typography.bodySmall.fontWeight;

    // THEN body weights are 400 or 500 as documented
    expect(bodyWeight).toBe('400');
    expect(['400', '500']).toContain(bodyLargeWeight);
    expect(bodySmallWeight).toBe('400');
  });

  it('should_make_display_variants_the_largest_font_sizes', () => {
    // GIVEN the display and h1 variants

    // WHEN the display font sizes are compared to h1
    const { fontSize: displayLarge } = typography.displayLarge;
    const { fontSize: displayMedium } = typography.displayMedium;
    const { fontSize: h1 } = typography.h1;

    // THEN displayLarge is strictly larger and displayMedium is at least as large as h1
    expect(displayLarge).toBeGreaterThan(h1);
    expect(displayMedium).toBeGreaterThanOrEqual(h1);
  });

  it('should_decrease_font_sizes_from_displayLarge_down_to_caption', () => {
    // GIVEN the typography hierarchy from displayLarge to caption

    // WHEN consecutive font sizes are compared
    const dl = typography.displayLarge.fontSize;
    const dm = typography.displayMedium.fontSize;
    const h1 = typography.h1.fontSize;
    const h2 = typography.h2.fontSize;
    const h3 = typography.h3.fontSize;
    const body = typography.body.fontSize;
    const bodySmall = typography.bodySmall.fontSize;
    const caption = typography.caption.fontSize;

    // THEN font sizes strictly decrease through the hierarchy
    expect(dl).toBeGreaterThan(dm);
    expect(dm).toBeGreaterThanOrEqual(h1);
    expect(h1).toBeGreaterThan(h2);
    expect(h2).toBeGreaterThan(h3);
    expect(body).toBeGreaterThan(bodySmall);
    expect(bodySmall).toBeGreaterThan(caption);
  });

  it('should_have_lineHeight_greater_than_or_equal_to_fontSize_for_every_variant', () => {
    // GIVEN the full list of typography variants

    // WHEN each variant's style is inspected
    const styles = allVariants.map((variant) => typography[variant]);

    // THEN every variant's lineHeight is at least its fontSize
    styles.forEach((style) => {
      expect(style.lineHeight).toBeGreaterThanOrEqual(style.fontSize);
    });
  });

  it('should_match_Apple_native_iOS_text_style_values_for_key_variants', () => {
    // GIVEN the documented Apple HIG font size and line height values

    // WHEN the corresponding variant styles are read
    const body = typography.body;
    const h1 = typography.h1;
    const displayLarge = typography.displayLarge;
    const caption = typography.caption;
    const overline = typography.overline;
    const title = typography.title;
    const bodyMedium = typography.bodyMedium;
    const bodySmall = typography.bodySmall;

    // THEN every variant matches the Apple HIG values
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

  it('should_use_tabular_nums_fontVariant_on_every_mono_variant', () => {
    // GIVEN the three mono variants

    // WHEN their fontVariant arrays are read
    const monoVariants = [
      typography.mono.fontVariant,
      typography.monoLarge.fontVariant,
      typography.monoSmall.fontVariant,
    ];

    // THEN each one contains "tabular-nums"
    monoVariants.forEach((fv) => {
      expect(fv).toContain('tabular-nums');
    });
  });

  it('should_alias_deprecated_amount_variants_to_mono_font_sizes', () => {
    // GIVEN the three amount aliases and their mono counterparts

    // WHEN their font sizes are compared
    const amount = typography.amount.fontSize;
    const amountLarge = typography.amountLarge.fontSize;
    const amountSmall = typography.amountSmall.fontSize;

    // THEN every amount font size equals its mono equivalent
    expect(amount).toBe(typography.mono.fontSize);
    expect(amountLarge).toBe(typography.monoLarge.fontSize);
    expect(amountSmall).toBe(typography.monoSmall.fontSize);
  });
});

describe('FONT_SCALE', () => {
  it('should_expose_default_medium_and_large_tier_properties', () => {
    // GIVEN the exported FONT_SCALE object

    // WHEN its tier keys are inspected
    const scale = FONT_SCALE;

    // THEN it has default, medium and large properties
    expect(scale).toHaveProperty('default');
    expect(scale).toHaveProperty('medium');
    expect(scale).toHaveProperty('large');
  });

  it('should_set_default_tier_scaling_to_zero', () => {
    // GIVEN the exported FONT_SCALE object

    // WHEN the default tier value is read
    const defaultTier = FONT_SCALE['default'];

    // THEN it is zero
    expect(defaultTier).toBe(0);
  });

  it('should_assign_higher_scaling_to_larger_tiers', () => {
    // GIVEN the default, medium and large tier values

    // WHEN the tiers are compared pairwise
    const defaultTier = FONT_SCALE['default']!;
    const mediumTier = FONT_SCALE['medium']!;
    const largeTier = FONT_SCALE['large']!;

    // THEN medium exceeds default and large exceeds medium
    expect(mediumTier).toBeGreaterThan(defaultTier);
    expect(largeTier).toBeGreaterThan(mediumTier);
  });
});
