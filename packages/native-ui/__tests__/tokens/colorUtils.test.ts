import {
  contrastRatio,
  DARK_INK,
  getContrastText,
  LIGHT_INK,
  resolveOnColor,
  withAlpha,
  WCAG_AA_TEXT_CONTRAST,
} from '../../src/tokens/colorUtils';

describe('contrastRatio', () => {
  describe('GIVEN black, white and a pair of identical colors', () => {
    describe('WHEN the contrast ratio is computed', () => {
      it('THEN black on white is 21:1 and identical colors are 1:1', () => {
        const max = contrastRatio('#000000', '#FFFFFF');
        const min = contrastRatio('#3B82F6', '#3B82F6');

        expect(max).toBeCloseTo(21, 5);
        expect(min).toBeCloseTo(1, 5);
      });
    });
  });

  describe('GIVEN the same pair expressed in both orders and in shorthand', () => {
    describe('WHEN the ratios are computed', () => {
      it('THEN the order and notation do not change the result', () => {
        const forward = contrastRatio('#FFFFFF', '#DC2626');
        const backward = contrastRatio('#DC2626', '#FFF');

        expect(forward).toBeCloseTo(backward, 10);
        expect(forward).toBeCloseTo(4.83, 2);
      });
    });
  });
});

describe('getContrastText', () => {
  describe('GIVEN a mid blue where the old perceived-brightness rule picked light ink', () => {
    describe('WHEN the contrast text is resolved', () => {
      it('THEN dark ink wins because it has the higher WCAG contrast', () => {
        const ink = getContrastText('#3B82F6');

        expect(ink).toBe(DARK_INK);
        expect(contrastRatio(ink, '#3B82F6')).toBeGreaterThan(contrastRatio(LIGHT_INK, '#3B82F6'));
      });
    });
  });
});

describe('resolveOnColor', () => {
  describe('GIVEN white on a red that passes AA', () => {
    describe('WHEN the on-color is resolved', () => {
      it('THEN the designed ink is preserved', () => {
        const ink = resolveOnColor('#DC2626', '#FFFFFF');

        expect(ink).toBe('#FFFFFF');
      });
    });
  });

  describe('GIVEN white on the bright default green (1.7:1)', () => {
    describe('WHEN the on-color is resolved', () => {
      it('THEN dark ink is used and it meets AA', () => {
        const ink = resolveOnColor('#00E67A', '#FFFFFF');

        expect(ink).toBe(DARK_INK);
        expect(contrastRatio(ink, '#00E67A')).toBeGreaterThanOrEqual(WCAG_AA_TEXT_CONTRAST);
      });
    });
  });

  describe('GIVEN a mid violet where neither ink reaches 4.5:1', () => {
    describe('WHEN the on-color is resolved', () => {
      it('THEN the designed ink stays instead of flipping for a marginal gain', () => {
        const ink = resolveOnColor('#7c5cff', '#FFFFFF');

        expect(ink).toBe('#FFFFFF');
      });
    });
  });

  describe('GIVEN white on a red that passes AA (4.83) but not AAA (7)', () => {
    describe('WHEN the on-color is resolved with the AAA minimum', () => {
      it('THEN no ink reaches 7:1 on this red, so the designed ink is kept', () => {
        const aaa = 7;

        const ink = resolveOnColor('#DC2626', '#FFFFFF', aaa);

        expect(ink).toBe('#FFFFFF');
        /* AND on a light fill the AAA minimum still picks the compliant ink */
        expect(resolveOnColor('#FBBF24', '#FFFFFF', aaa)).toBe(DARK_INK);
      });
    });
  });

  describe('GIVEN an rgba fill that cannot be measured', () => {
    describe('WHEN the on-color is resolved', () => {
      it('THEN the preferred ink is returned', () => {
        const ink = resolveOnColor('rgba(0,0,0,0.5)', '#FFFFFF');

        expect(ink).toBe('#FFFFFF');
      });
    });
  });
});

describe('withAlpha', () => {
  describe('GIVEN a long and a short hex color', () => {
    describe('WHEN alpha is applied', () => {
      it('THEN rgba strings with the same channels are returned', () => {
        const long = withAlpha('#3B82F6', 0.12);
        const short = withAlpha('#FFF', 0.5);

        expect(long).toBe('rgba(59,130,246,0.12)');
        expect(short).toBe('rgba(255,255,255,0.5)');
      });
    });
  });

  describe('GIVEN an out-of-range alpha and a non-hex color', () => {
    describe('WHEN alpha is applied', () => {
      it('THEN alpha is clamped to 1 and the named color is returned as-is', () => {
        const clamped = withAlpha('#000000', 3);
        const passthrough = withAlpha('red', 0.5);

        expect(clamped).toBe('rgba(0,0,0,1)');
        expect(passthrough).toBe('red');
      });
    });
  });
});
