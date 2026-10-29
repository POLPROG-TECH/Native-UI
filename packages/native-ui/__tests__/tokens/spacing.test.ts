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
import { defined } from '../shared/defined';

describe('spacing tokens', () => {
  describe('GIVEN the exported spacing object', () => {
    describe('WHEN it is compared to the expected scale', () => {
      it('THEN the object matches the documented scale exactly', () => {
        const actual = spacing;

        expect(actual).toEqual({
          '2xs': 2,
          xs: 4,
          sm: 8,
          smPlus: 12,
          md: 16,
          mdPlus: 20,
          lg: 24,
          xl: 32,
          '2xl': 40,
          '3xl': 56,
        });
      });
    });
  });

  describe('GIVEN the base spacing entries xs, sm, md and lg', () => {
    describe('WHEN their values are read', () => {
      it('THEN sm is double xs and the core values match the design scale', () => {
        const { xs, sm, md, lg } = spacing;

        expect(xs).toBe(4);
        expect(sm).toBe(xs * 2);
        expect(md).toBe(16);
        expect(lg).toBe(24);
      });
    });
  });

  describe('GIVEN the spacing values in declaration order', () => {
    describe('WHEN each consecutive pair is compared', () => {
      it('THEN every next value is strictly greater than the previous one', () => {
        const values = Object.values(spacing);

        const pairs = values
          .slice(1)
          .map((v, i) => [defined(values[i], 'previous spacing'), v] as const);

        pairs.forEach(([prev, next]) => {
          expect(next).toBeGreaterThan(prev);
        });
      });
    });
  });
});

describe('borderRadius tokens', () => {
  describe('GIVEN the exported borderRadius object', () => {
    describe('WHEN each entry is read', () => {
      it('THEN every radius matches its documented value', () => {
        const { xs, sm, md, lg, xl, full } = borderRadius;
        const xxl = borderRadius['2xl'];

        expect(xs).toBe(6);
        expect(sm).toBe(10);
        expect(md).toBe(14);
        expect(lg).toBe(18);
        expect(xl).toBe(24);
        expect(xxl).toBe(32);
        expect(full).toBe(9999);
      });
    });
  });

  describe('GIVEN all borderRadius entries except full', () => {
    describe('WHEN each entry is compared against full', () => {
      it('THEN full is strictly greater than every other entry', () => {
        const entries = Object.entries(borderRadius).filter(([k]) => k !== 'full');

        const values = entries.map(([, v]) => v);

        values.forEach((v) => {
          expect(borderRadius.full).toBeGreaterThan(v);
        });
      });
    });
  });
});

describe('iconSize tokens', () => {
  describe('GIVEN the exported iconSize object', () => {
    describe('WHEN its keys and values are inspected', () => {
      it('THEN there are four entries with the documented values', () => {
        const keys = Object.keys(iconSize);
        const { sm, md, lg, xl } = iconSize;

        expect(keys).toHaveLength(4);
        expect(sm).toBe(16);
        expect(md).toBe(20);
        expect(lg).toBe(24);
        expect(xl).toBe(32);
      });
    });
  });
});

describe('hitSlop tokens', () => {
  describe('GIVEN the exported hitSlop object', () => {
    describe('WHEN its platform presets are read', () => {
      it('THEN each platform preset uses the documented uniform insets', () => {
        const ios = hitSlop.ios;
        const android = hitSlop.android;

        expect(ios).toEqual({ top: 8, bottom: 8, left: 8, right: 8 });
        expect(android).toEqual({ top: 10, bottom: 10, left: 10, right: 10 });
      });
    });
  });
});

describe('elevation tokens', () => {
  describe('GIVEN the exported elevation object', () => {
    describe('WHEN its levels are read', () => {
      it('THEN each level is defined', () => {
        const { none, sm, md, lg, xl } = elevation;

        expect(none).toBeDefined();
        expect(sm).toBeDefined();
        expect(md).toBeDefined();
        expect(lg).toBeDefined();
        expect(xl).toBeDefined();
      });
    });

    describe('WHEN the none level is inspected', () => {
      it('THEN its shadowOpacity and elevation are zero', () => {
        const { shadowOpacity, elevation: elev } = elevation.none;

        expect(shadowOpacity).toBe(0);
        expect(elev).toBe(0);
      });
    });
  });
});

describe('duration tokens', () => {
  describe('GIVEN the exported duration object', () => {
    describe('WHEN the timing values are read', () => {
      it('THEN each value matches the documented duration', () => {
        const { instant, fast, normal, slow } = duration;

        expect(instant).toBe(100);
        expect(fast).toBe(200);
        expect(normal).toBe(300);
        expect(slow).toBe(500);
      });
    });
  });
});

describe('zIndex tokens', () => {
  describe('GIVEN the exported zIndex object', () => {
    describe('WHEN each successive layer is compared to the next', () => {
      it('THEN values strictly increase along the layering order', () => {
        const { base, card, stickyHeader, overlay, modal, toast } = zIndex;

        expect(base).toBeLessThan(card);
        expect(card).toBeLessThan(stickyHeader);
        expect(stickyHeader).toBeLessThan(overlay);
        expect(overlay).toBeLessThan(modal);
        expect(modal).toBeLessThan(toast);
      });
    });
  });
});

describe('opacity tokens', () => {
  describe('GIVEN the exported opacity object', () => {
    describe('WHEN each value is checked against the allowed range', () => {
      it('THEN every value is greater than 0 and at most 1', () => {
        const values = Object.values(opacity);

        const ranges = values;

        ranges.forEach((v) => {
          expect(v).toBeGreaterThan(0);
          expect(v).toBeLessThanOrEqual(1);
        });
      });
    });

    describe('WHEN the disabled value is read', () => {
      it('THEN it equals 0.5', () => {
        const disabled = opacity.disabled;

        expect(disabled).toBe(0.5);
      });
    });
  });
});

describe('borderWidth tokens', () => {
  describe('GIVEN the exported borderWidth object', () => {
    describe('WHEN the none value is read', () => {
      it('THEN it is zero', () => {
        const none = borderWidth.none;

        expect(none).toBe(0);
      });
    });

    describe('WHEN successive widths are compared', () => {
      it('THEN widths ascend from none to thick', () => {
        const { none, hairline, thin, thick } = borderWidth;

        expect(none).toBeLessThan(hairline);
        expect(hairline).toBeLessThanOrEqual(thin);
        expect(thin).toBeLessThan(thick);
      });
    });
  });
});

describe('easing tokens', () => {
  describe('GIVEN the exported easing object', () => {
    describe('WHEN each easing array is inspected', () => {
      it('THEN each array has four control points', () => {
        const { standard, decelerate, accelerate } = easing;

        expect(standard).toHaveLength(4);
        expect(decelerate).toHaveLength(4);
        expect(accelerate).toHaveLength(4);
      });
    });
  });
});

describe('glowShadow', () => {
  describe('GIVEN a red hex color', () => {
    describe('WHEN glowShadow is called with that color', () => {
      it('THEN the resulting style uses the color and 0.3 opacity', () => {
        const result = glowShadow('#FF0000');

        expect(result).toBeDefined();
        expect(result).toHaveProperty('shadowColor', '#FF0000');
        expect(result).toHaveProperty('shadowOpacity', 0.3);
      });
    });
  });
});
