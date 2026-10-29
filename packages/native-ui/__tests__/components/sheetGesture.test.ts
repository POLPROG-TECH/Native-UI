import { clampSheetDrag, shouldDismissSheet } from '../../src/components/bottomSheet/sheetGesture';

const thresholds = { dismissDistance: 80, dismissVelocity: 0.5 };

describe('shouldDismissSheet', () => {
  describe('GIVEN a slow drag exactly at the threshold', () => {
    describe('WHEN the release is evaluated', () => {
      it('THEN the sheet dismisses', () => {
        const result = shouldDismissSheet(80, 0.1, thresholds);

        expect(result).toBe(true);
      });
    });
  });

  describe('GIVEN a short drag released quickly', () => {
    describe('WHEN the release is evaluated', () => {
      it('THEN velocity alone dismisses it', () => {
        const result = shouldDismissSheet(20, 0.8, thresholds);

        expect(result).toBe(true);
      });
    });
  });

  describe('GIVEN a short, slow drag', () => {
    describe('WHEN the release is evaluated', () => {
      it('THEN the sheet springs back', () => {
        const result = shouldDismissSheet(30, 0.2, thresholds);

        expect(result).toBe(false);
      });
    });
  });

  describe('GIVEN an upward drag with a large velocity value', () => {
    describe('WHEN the release is evaluated', () => {
      it('THEN the sheet stays', () => {
        const result = shouldDismissSheet(-120, 2, thresholds);

        expect(result).toBe(false);
      });
    });
  });
});

describe('clampSheetDrag', () => {
  describe('GIVEN downward and upward drag distances', () => {
    describe('WHEN they are clamped', () => {
      it('THEN only the downward offset is applied', () => {
        const down = clampSheetDrag(42);
        const up = clampSheetDrag(-42);

        expect(down).toBe(42);
        expect(up).toBe(0);
      });
    });
  });
});
