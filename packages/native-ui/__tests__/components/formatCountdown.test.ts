import { formatCountdown, toEpochMs } from '../../src/components/countdown/formatCountdown';

const units = { hours: 'h', minutes: 'm', seconds: 's' };
const ONE_HOUR_FIVE_MIN_NINE_SEC = (3600 + 5 * 60 + 9) * 1000;
const FIVE_MIN_NINE_SEC = (5 * 60 + 9) * 1000;

describe('formatCountdown', () => {
  describe('GIVEN at least an hour remaining', () => {
    describe('WHEN it is formatted with auto', () => {
      it('THEN hours and padded minutes are shown', () => {
        expect(formatCountdown(ONE_HOUR_FIVE_MIN_NINE_SEC, 'auto', units)).toBe('1h 05m');
      });
    });
  });

  describe('GIVEN under an hour remaining', () => {
    describe('WHEN it is formatted with auto', () => {
      it('THEN unpadded minutes and padded seconds are shown', () => {
        expect(formatCountdown(FIVE_MIN_NINE_SEC, 'auto', units)).toBe('5m 09s');
      });
    });
  });

  describe('GIVEN the explicit formats', () => {
    describe('WHEN the same duration is formatted', () => {
      it('THEN each format shows its segments', () => {
        const formatted = (['hms', 'hm', 'ms'] as const).map((format) =>
          formatCountdown(ONE_HOUR_FIVE_MIN_NINE_SEC, format, units),
        );

        expect(formatted).toEqual(['1h 05m 09s', '1h 05m', '5m 09s']);
      });
    });
  });

  describe('GIVEN a negative remaining time', () => {
    describe('WHEN it is formatted', () => {
      it('THEN it clamps to zero', () => {
        expect(formatCountdown(-5000, 'ms', units)).toBe('0m 00s');
      });
    });
  });
});

describe('toEpochMs', () => {
  describe('GIVEN the same instant as Date, number and ISO string', () => {
    describe('WHEN each is normalized', () => {
      it('THEN all yield the same epoch milliseconds', () => {
        const iso = '2026-01-01T00:00:00.000Z';
        const epoch = Date.parse(iso);

        expect([toEpochMs(new Date(iso)), toEpochMs(epoch), toEpochMs(iso)]).toEqual([
          epoch,
          epoch,
          epoch,
        ]);
      });
    });
  });
});
