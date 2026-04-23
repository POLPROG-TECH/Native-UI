import {
  spacing,
  borderRadius,
  iconSize,
  hitSlop,
  elevation,
  duration,
  zIndex,
  opacity,
  borderWidth,
  easing,
  glowShadow,
} from '../../src/tokens/spacing';

describe('spacing tokens', () => {
  it('should define every entry of the spacing scale from 2xs to 3xl', () => {
    // GIVEN the exported spacing object

    // WHEN it is compared to the expected scale
    const actual = spacing;

    // THEN the object matches the documented scale exactly
    expect(actual).toEqual({
      '2xs': 2,
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      '2xl': 40,
      '3xl': 56,
    });
  });

  it('should follow the base scale pattern', () => {
    // GIVEN the base spacing entries xs, sm, md and lg

    // WHEN their values are read
    const { xs, sm, md, lg } = spacing;

    // THEN sm is double xs and the core values match the design scale
    expect(xs).toBe(4);
    expect(sm).toBe(xs * 2);
    expect(md).toBe(16);
    expect(lg).toBe(24);
  });

  it('should have strictly increasing values across the spacing scale', () => {
    // GIVEN the spacing values in declaration order
    const values = Object.values(spacing);

    // WHEN each consecutive pair is compared
    const pairs = values.slice(1).map((v, i) => [values[i]!, v] as const);

    // THEN every next value is strictly greater than the previous one
    pairs.forEach(([prev, next]) => {
      expect(next).toBeGreaterThan(prev);
    });
  });
});

describe('borderRadius tokens', () => {
  it('should define every radius entry with its documented pixel value', () => {
    // GIVEN the exported borderRadius object

    // WHEN each entry is read
    const { xs, sm, md, lg, xl, full } = borderRadius;
    const xxl = borderRadius['2xl'];

    // THEN every radius matches its documented value
    expect(xs).toBe(6);
    expect(sm).toBe(10);
    expect(md).toBe(14);
    expect(lg).toBe(18);
    expect(xl).toBe(24);
    expect(xxl).toBe(32);
    expect(full).toBe(9999);
  });

  it('should use full as the largest borderRadius value', () => {
    // GIVEN all borderRadius entries except full
    const entries = Object.entries(borderRadius).filter(([k]) => k !== 'full');

    // WHEN each entry is compared against full
    const values = entries.map(([, v]) => v);

    // THEN full is strictly greater than every other entry
    values.forEach((v) => {
      expect(borderRadius.full).toBeGreaterThan(v);
    });
  });
});

describe('iconSize tokens', () => {
  it('should define four icon sizes with expected pixel values', () => {
    // GIVEN the exported iconSize object

    // WHEN its keys and values are inspected
    const keys = Object.keys(iconSize);
    const { sm, md, lg, xl } = iconSize;

    // THEN there are four entries with the documented values
    expect(keys).toHaveLength(4);
    expect(sm).toBe(16);
    expect(md).toBe(20);
    expect(lg).toBe(24);
    expect(xl).toBe(32);
  });
});

describe('hitSlop tokens', () => {
  it('should define uniform iOS and Android hit slop presets', () => {
    // GIVEN the exported hitSlop object

    // WHEN its platform presets are read
    const ios = hitSlop.ios;
    const android = hitSlop.android;

    // THEN each platform preset uses the documented uniform insets
    expect(ios).toEqual({ top: 8, bottom: 8, left: 8, right: 8 });
    expect(android).toEqual({ top: 10, bottom: 10, left: 10, right: 10 });
  });
});

describe('elevation tokens', () => {
  it('should define every elevation level from none to xl', () => {
    // GIVEN the exported elevation object

    // WHEN its levels are read
    const { none, sm, md, lg, xl } = elevation;

    // THEN each level is defined
    expect(none).toBeDefined();
    expect(sm).toBeDefined();
    expect(md).toBeDefined();
    expect(lg).toBeDefined();
    expect(xl).toBeDefined();
  });

  it('should produce zero shadow for none elevation level', () => {
    // GIVEN the exported elevation object

    // WHEN the none level is inspected
    const { shadowOpacity, elevation: elev } = elevation.none;

    // THEN its shadowOpacity and elevation are zero
    expect(shadowOpacity).toBe(0);
    expect(elev).toBe(0);
  });
});

describe('duration tokens', () => {
  it('should define timing values in ascending order', () => {
    // GIVEN the exported duration object

    // WHEN the timing values are read
    const { instant, fast, normal, slow } = duration;

    // THEN each value matches the documented duration
    expect(instant).toBe(100);
    expect(fast).toBe(200);
    expect(normal).toBe(300);
    expect(slow).toBe(500);
  });
});

describe('zIndex tokens', () => {
  it('should layer zIndex values from base up to toast', () => {
    // GIVEN the exported zIndex object

    // WHEN each successive layer is compared to the next
    const { base, card, stickyHeader, overlay, modal, toast } = zIndex;

    // THEN values strictly increase along the layering order
    expect(base).toBeLessThan(card);
    expect(card).toBeLessThan(stickyHeader);
    expect(stickyHeader).toBeLessThan(overlay);
    expect(overlay).toBeLessThan(modal);
    expect(modal).toBeLessThan(toast);
  });
});

describe('opacity tokens', () => {
  it('should keep every opacity value between 0 exclusive and 1 inclusive', () => {
    // GIVEN the exported opacity object
    const values = Object.values(opacity);

    // WHEN each value is checked against the allowed range
    const ranges = values;

    // THEN every value is greater than 0 and at most 1
    ranges.forEach((v) => {
      expect(v).toBeGreaterThan(0);
      expect(v).toBeLessThanOrEqual(1);
    });
  });

  it('should set disabled opacity to exactly zero point five', () => {
    // GIVEN the exported opacity object

    // WHEN the disabled value is read
    const disabled = opacity.disabled;

    // THEN it equals 0.5
    expect(disabled).toBe(0.5);
  });
});

describe('borderWidth tokens', () => {
  it('should set borderWidth none to zero', () => {
    // GIVEN the exported borderWidth object

    // WHEN the none value is read
    const none = borderWidth.none;

    // THEN it is zero
    expect(none).toBe(0);
  });

  it('should have ascending widths from none through thick', () => {
    // GIVEN the exported borderWidth object

    // WHEN successive widths are compared
    const { none, hairline, thin, thick } = borderWidth;

    // THEN widths ascend from none to thick
    expect(none).toBeLessThan(hairline);
    expect(hairline).toBeLessThanOrEqual(thin);
    expect(thin).toBeLessThan(thick);
  });
});

describe('easing tokens', () => {
  it('should define standard decelerate and accelerate cubic bezier arrays with four control points', () => {
    // GIVEN the exported easing object

    // WHEN each easing array is inspected
    const { standard, decelerate, accelerate } = easing;

    // THEN each array has four control points
    expect(standard).toHaveLength(4);
    expect(decelerate).toHaveLength(4);
    expect(accelerate).toHaveLength(4);
  });
});

describe('glowShadow', () => {
  it('should return a shadow style object using given color when called', () => {
    // GIVEN a red hex color

    // WHEN glowShadow is called with that color
    const result = glowShadow('#FF0000');

    // THEN the resulting style uses the color and 0.3 opacity
    expect(result).toBeDefined();
    expect(result).toHaveProperty('shadowColor', '#FF0000');
    expect(result).toHaveProperty('shadowOpacity', 0.3);
  });
});
