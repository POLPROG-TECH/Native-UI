import { parseValue, formatValue, formatDisplay } from '../../src/components/datePickerUtils';

describe('datePickerUtils', () => {
  describe('parseValue', () => {
    it('should return current date when given an empty string', () => {
      // GIVEN an empty value string

      // WHEN parseValue is called with any mode
      const result = parseValue('', 'date');

      // THEN a Date close to now is returned
      expect(result).toBeInstanceOf(Date);
      expect(Math.abs(result.getTime() - Date.now())).toBeLessThan(1000);
    });

    it('should parse a date mode string into a local Date without timezone offset', () => {
      // GIVEN a YYYY-MM-DD value

      // WHEN parseValue is called in date mode
      const result = parseValue('2025-03-15', 'date');

      // THEN the year, month, and day match without timezone shifting
      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(2); // 0-indexed
      expect(result.getDate()).toBe(15);
    });

    it('should parse a time mode string and apply it to today', () => {
      // GIVEN an HH:MM value

      // WHEN parseValue is called in time mode
      const result = parseValue('14:30', 'time');

      // THEN hours and minutes are set correctly
      expect(result.getHours()).toBe(14);
      expect(result.getMinutes()).toBe(30);
    });

    it('should parse a datetime mode string into a Date', () => {
      // GIVEN a YYYY-MM-DDTHH:MM value

      // WHEN parseValue is called in datetime mode
      const result = parseValue('2025-06-20T08:45', 'datetime');

      // THEN date and time components are correct
      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(5); // June = 5
      expect(result.getDate()).toBe(20);
      expect(result.getHours()).toBe(8);
      expect(result.getMinutes()).toBe(45);
    });

    it('should return current date for invalid datetime string', () => {
      // GIVEN an unparseable string in datetime mode

      // WHEN parseValue is called
      const result = parseValue('not-a-date', 'datetime');

      // THEN it falls back to the current date
      expect(result).toBeInstanceOf(Date);
      expect(Math.abs(result.getTime() - Date.now())).toBeLessThan(1000);
    });

    it('should handle partial date strings gracefully', () => {
      // GIVEN a partial date string missing day

      // WHEN parseValue is called in date mode
      const result = parseValue('2025-06', 'date');

      // THEN it uses defaults for missing parts
      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(5); // June
      expect(result.getDate()).toBe(1); // default day
    });
  });

  describe('formatValue', () => {
    it('should format a Date as YYYY-MM-DD in date mode', () => {
      // GIVEN a known Date

      // WHEN formatValue is called in date mode
      const result = formatValue(new Date(2025, 2, 5), 'date');

      // THEN the ISO date string is returned
      expect(result).toBe('2025-03-05');
    });

    it('should format a Date as HH:MM in time mode', () => {
      // GIVEN a Date with specific hours and minutes
      const d = new Date(2025, 0, 1, 8, 5);

      // WHEN formatValue is called in time mode
      const result = formatValue(d, 'time');

      // THEN the zero-padded time string is returned
      expect(result).toBe('08:05');
    });

    it('should format a Date as YYYY-MM-DDTHH:MM in datetime mode', () => {
      // GIVEN a Date with specific date and time
      const d = new Date(2025, 5, 15, 14, 0);

      // WHEN formatValue is called in datetime mode
      const result = formatValue(d, 'datetime');

      // THEN the ISO datetime string is returned
      expect(result).toBe('2025-06-15T14:00');
    });

    it('should zero-pad single digit months, days, hours, and minutes', () => {
      // GIVEN a Date where all numeric parts are single digits
      const d = new Date(2025, 0, 3, 4, 7);

      // WHEN formatValue is called in datetime mode
      const result = formatValue(d, 'datetime');

      // THEN all parts are zero-padded
      expect(result).toBe('2025-01-03T04:07');
    });
  });

  describe('formatDisplay', () => {
    it('should format a Date for display in date mode using Intl', () => {
      // GIVEN a known Date

      // WHEN formatDisplay is called in date mode with en-US locale
      const result = formatDisplay(new Date(2025, 5, 20), 'en-US', 'date');

      // THEN it contains the month abbreviation
      expect(result).toMatch(/Jun/);
      expect(result).toMatch(/20/);
      expect(result).toMatch(/2025/);
    });

    it('should format a Date for display in time mode using Intl', () => {
      // GIVEN a Date with specific time
      const d = new Date(2025, 0, 1, 14, 30);

      // WHEN formatDisplay is called in time mode
      const result = formatDisplay(d, 'en-US', 'time');

      // THEN it contains the formatted time
      expect(result).toMatch(/[12]?[0-9]:[03]0/);
    });

    it('should format a Date for display in datetime mode using Intl', () => {
      // GIVEN a Date with both date and time
      const d = new Date(2025, 5, 15, 14, 0);

      // WHEN formatDisplay is called in datetime mode
      const result = formatDisplay(d, 'en-US', 'datetime');

      // THEN it contains both date and time parts
      expect(result).toMatch(/Jun/);
      expect(result).toMatch(/15/);
    });

    it('should fall back to formatValue when Intl throws', () => {
      // GIVEN a Date and a locale that makes Intl throw
      const d = new Date(2025, 2, 5);

      // WHEN formatDisplay is called with an invalid locale that triggers an error
      // We simulate by temporarily breaking toLocaleDateString
      const origFn = Date.prototype.toLocaleDateString;

      Date.prototype.toLocaleDateString = () => {
        throw new RangeError('Invalid locale');
      };

      const result = formatDisplay(d, 'INVALID', 'date');

      // THEN it falls back to the machine-readable format
      expect(result).toBe('2025-03-05');

      // Cleanup
      Date.prototype.toLocaleDateString = origFn;
    });
  });
});
