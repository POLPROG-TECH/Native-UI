import {
  parseValue,
  formatValue,
  formatDisplay,
} from '../../src/components/datePicker/datePickerUtils';

describe('datePickerUtils', () => {
  describe('parseValue', () => {
    describe('GIVEN an empty value string', () => {
      describe('WHEN parseValue is called with any mode', () => {
        it('THEN a Date close to now is returned', () => {
          const result = parseValue('', 'date');

          expect(result).toBeInstanceOf(Date);
          expect(Math.abs(result.getTime() - Date.now())).toBeLessThan(1000);
        });
      });
    });

    describe('GIVEN a YYYY-MM-DD value', () => {
      describe('WHEN parseValue is called in date mode', () => {
        it('THEN the year, month, and day match without timezone shifting', () => {
          const result = parseValue('2025-03-15', 'date');

          expect(result.getFullYear()).toBe(2025);
          expect(result.getMonth()).toBe(2); /* 0-indexed */
          expect(result.getDate()).toBe(15);
        });
      });
    });

    describe('GIVEN an HH:MM value', () => {
      describe('WHEN parseValue is called in time mode', () => {
        it('THEN hours and minutes are set correctly', () => {
          const result = parseValue('14:30', 'time');

          expect(result.getHours()).toBe(14);
          expect(result.getMinutes()).toBe(30);
        });
      });
    });

    describe('GIVEN a YYYY-MM-DDTHH:MM value', () => {
      describe('WHEN parseValue is called in datetime mode', () => {
        it('THEN date and time components are correct', () => {
          const result = parseValue('2025-06-20T08:45', 'datetime');

          expect(result.getFullYear()).toBe(2025);
          expect(result.getMonth()).toBe(5); /* June = 5 */
          expect(result.getDate()).toBe(20);
          expect(result.getHours()).toBe(8);
          expect(result.getMinutes()).toBe(45);
        });
      });
    });

    describe('GIVEN an unparseable string in datetime mode', () => {
      describe('WHEN parseValue is called', () => {
        it('THEN it falls back to the current date', () => {
          const result = parseValue('not-a-date', 'datetime');

          expect(result).toBeInstanceOf(Date);
          expect(Math.abs(result.getTime() - Date.now())).toBeLessThan(1000);
        });
      });
    });

    describe('GIVEN a partial date string missing day', () => {
      describe('WHEN parseValue is called in date mode', () => {
        it('THEN it uses defaults for missing parts', () => {
          const result = parseValue('2025-06', 'date');

          expect(result.getFullYear()).toBe(2025);
          expect(result.getMonth()).toBe(5); /* June */
          expect(result.getDate()).toBe(1); /* default day */
        });
      });
    });
  });

  describe('formatValue', () => {
    describe('GIVEN a known Date', () => {
      describe('WHEN formatValue is called in date mode', () => {
        it('THEN the ISO date string is returned', () => {
          const result = formatValue(new Date(2025, 2, 5), 'date');

          expect(result).toBe('2025-03-05');
        });
      });
    });

    describe('GIVEN a Date with specific hours and minutes', () => {
      describe('WHEN formatValue is called in time mode', () => {
        it('THEN the zero-padded time string is returned', () => {
          const d = new Date(2025, 0, 1, 8, 5);

          const result = formatValue(d, 'time');

          expect(result).toBe('08:05');
        });
      });
    });

    describe('GIVEN a Date with specific date and time', () => {
      describe('WHEN formatValue is called in datetime mode', () => {
        it('THEN the ISO datetime string is returned', () => {
          const d = new Date(2025, 5, 15, 14, 0);

          const result = formatValue(d, 'datetime');

          expect(result).toBe('2025-06-15T14:00');
        });
      });
    });

    describe('GIVEN a Date where all numeric parts are single digits', () => {
      describe('WHEN formatValue is called in datetime mode', () => {
        it('THEN all parts are zero-padded', () => {
          const d = new Date(2025, 0, 3, 4, 7);

          const result = formatValue(d, 'datetime');

          expect(result).toBe('2025-01-03T04:07');
        });
      });
    });
  });

  describe('formatDisplay', () => {
    describe('GIVEN a known Date', () => {
      describe('WHEN formatDisplay is called in date mode with en-US locale', () => {
        it('THEN it contains the month abbreviation', () => {
          const result = formatDisplay(new Date(2025, 5, 20), 'en-US', 'date');

          expect(result).toMatch(/Jun/);
          expect(result).toMatch(/20/);
          expect(result).toMatch(/2025/);
        });
      });
    });

    describe('GIVEN a Date with specific time', () => {
      describe('WHEN formatDisplay is called in time mode', () => {
        it('THEN it contains the formatted time', () => {
          const d = new Date(2025, 0, 1, 14, 30);

          const result = formatDisplay(d, 'en-US', 'time');

          expect(result).toMatch(/[12]?[0-9]:[03]0/);
        });
      });
    });

    describe('GIVEN a Date with both date and time', () => {
      describe('WHEN formatDisplay is called in datetime mode', () => {
        it('THEN it contains both date and time parts', () => {
          const d = new Date(2025, 5, 15, 14, 0);

          const result = formatDisplay(d, 'en-US', 'datetime');

          expect(result).toMatch(/Jun/);
          expect(result).toMatch(/15/);
        });
      });
    });

    describe('GIVEN a Date and a locale that makes Intl throw', () => {
      describe('WHEN formatDisplay is called with an invalid locale that triggers an error We simulate by temporarily breaking toLocaleDateString', () => {
        it('THEN it falls back to the machine-readable format', () => {
          const d = new Date(2025, 2, 5);

          const origFn = Date.prototype.toLocaleDateString;

          Date.prototype.toLocaleDateString = () => {
            throw new RangeError('Invalid locale');
          };

          const result = formatDisplay(d, 'INVALID', 'date');

          expect(result).toBe('2025-03-05');

          Date.prototype.toLocaleDateString = origFn;
        });
      });
    });
  });
});
