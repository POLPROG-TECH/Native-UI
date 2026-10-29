import { resolveRangeBounds } from '../../src/components/datePicker/rangeBounds';

function ymd(date: Date | undefined): string | undefined {
  if (!date) {
    return undefined;
  }

  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

describe('resolveRangeBounds', () => {
  describe('GIVEN an empty range and no global bounds', () => {
    describe('WHEN the bounds are resolved', () => {
      it('THEN neither endpoint is constrained', () => {
        const actual = resolveRangeBounds({ start: '', end: '' });

        expect(actual).toEqual({ startMax: undefined, endMin: undefined });
      });
    });
  });

  describe('GIVEN a range with both dates inside the global bounds', () => {
    describe('WHEN the bounds are resolved', () => {
      it('THEN the start is capped by the end date and the end floored by the start date', () => {
        const minimumDate = new Date(2025, 0, 1);
        const maximumDate = new Date(2025, 11, 31);

        const actual = resolveRangeBounds(
          { start: '2025-06-01', end: '2025-06-14' },
          minimumDate,
          maximumDate,
        );

        expect(ymd(actual.startMax)).toBe('2025-6-14');
        expect(ymd(actual.endMin)).toBe('2025-6-1');
      });
    });
  });

  describe('GIVEN range dates outside the global bounds', () => {
    describe('WHEN the bounds are resolved', () => {
      it('THEN the global bounds win', () => {
        const minimumDate = new Date(2025, 5, 10);
        const maximumDate = new Date(2025, 5, 20);

        const actual = resolveRangeBounds(
          { start: '2025-06-01', end: '2025-06-30' },
          minimumDate,
          maximumDate,
        );

        expect(actual.startMax).toBe(maximumDate);
        expect(actual.endMin).toBe(minimumDate);
      });
    });
  });

  describe('GIVEN only global bounds and an empty range', () => {
    describe('WHEN the bounds are resolved', () => {
      it('THEN each endpoint falls back to the matching global bound', () => {
        const minimumDate = new Date(2025, 0, 1);
        const maximumDate = new Date(2025, 11, 31);

        const actual = resolveRangeBounds({ start: '', end: '' }, minimumDate, maximumDate);

        expect(actual).toEqual({ startMax: maximumDate, endMin: minimumDate });
      });
    });
  });
});
