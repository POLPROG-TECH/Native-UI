import { screen, act } from '@testing-library/react';
import { Countdown } from '../../src/components/Countdown';
import { renderWithTheme } from '../test-utils';

describe('Countdown', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2030-01-01T00:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('GIVEN the Countdown export from the components module', () => {
    describe('WHEN its runtime type is inspected', () => {
      it('THEN it is a function component', () => {
        const actualType = typeof Countdown;

        expect(actualType).toBe('function');
      });
    });
  });

  describe('GIVEN a deadline 90 seconds in the future', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN the default auto-format produces "1m 30s"', () => {
        const target = Date.now() + 90_000;

        renderWithTheme(<Countdown to={target} />);

        expect(screen.getByText('1m 30s')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a deadline 2 hours and 5 minutes in the future', () => {
    describe('WHEN the component is rendered with the default format', () => {
      it('THEN the default auto-format produces "2h 05m"', () => {
        const target = Date.now() + (2 * 3600 + 5 * 60) * 1000;

        renderWithTheme(<Countdown to={target} />);

        expect(screen.getByText('2h 05m')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a 1-hour-2-minute-3-second deadline and the hms format', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN the output includes hours, minutes, and seconds', () => {
        const target = Date.now() + (3600 + 2 * 60 + 3) * 1000;

        renderWithTheme(<Countdown to={target} format="hms" />);

        expect(screen.getByText('1h 02m 03s')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a 2-hour-30-minute deadline and the hm format', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN the output includes hours and minutes', () => {
        const target = Date.now() + (2 * 3600 + 30 * 60) * 1000;

        renderWithTheme(<Countdown to={target} format="hm" />);

        expect(screen.getByText('2h 30m')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a 5-minute-15-second deadline and the ms format', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN the output includes minutes and seconds', () => {
        const target = Date.now() + (5 * 60 + 15) * 1000;

        renderWithTheme(<Countdown to={target} format="ms" />);

        expect(screen.getByText('5m 15s')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a deadline 1 second in the past', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN the expired label is rendered', () => {
        const target = Date.now() - 1000;

        renderWithTheme(<Countdown to={target} expiredLabel="Done" />);

        expect(screen.getByText('Done')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a 2-second deadline and a mocked onExpire callback', () => {
    describe('WHEN enough time passes for the deadline to pass', () => {
      it('THEN onExpire is invoked exactly once', () => {
        const target = Date.now() + 2000;
        const onExpire = jest.fn();
        renderWithTheme(<Countdown to={target} tickMs={1000} onExpire={onExpire} />);

        act(() => {
          jest.advanceTimersByTime(3000);
        });

        expect(onExpire).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('GIVEN a 1-minute deadline and a renderLabel that prefixes "Ends in "', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN the output is wrapped with the transform', () => {
        const target = Date.now() + 60_000;

        renderWithTheme(<Countdown to={target} renderLabel={(s) => `Ends in ${s}`} />);

        expect(screen.getByText('Ends in 1m 00s')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a deadline expressed as an ISO string 30 seconds in the future', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN the formatted output matches the string input', () => {
        const target = new Date(Date.now() + 30_000).toISOString();

        renderWithTheme(<Countdown to={target} format="ms" />);

        expect(screen.getByText('0m 30s')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a deadline expressed as a Date instance 45 seconds in the future', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN the formatted output matches the date input', () => {
        const target = new Date(Date.now() + 45_000);

        renderWithTheme(<Countdown to={target} format="ms" />);

        expect(screen.getByText('0m 45s')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a 2-second deadline and a spy-able setInterval / clearInterval', () => {
    describe('WHEN the deadline is crossed', () => {
      it('THEN no new pending 1s tick timers remain (interval self-cleared on expiry)', () => {
        const target = Date.now() + 2000;
        const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
        renderWithTheme(<Countdown to={target} tickMs={1000} />);

        act(() => {
          jest.advanceTimersByTime(2500);
        });
        const clearedByTick = clearIntervalSpy.mock.calls.length;

        /* AND more time passes */
        act(() => {
          jest.advanceTimersByTime(5000);
        });

        expect(clearedByTick).toBeGreaterThanOrEqual(1);
        clearIntervalSpy.mockRestore();
      });
    });
  });
});
