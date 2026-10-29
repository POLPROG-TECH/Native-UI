import { parseDecimalInput } from '../../src/utils/number';

describe('parseDecimalInput', () => {
  describe('GIVEN a dot-separated decimal string', () => {
    describe('WHEN it is parsed', () => {
      it('THEN the numeric value is returned', () => {
        const input = '12.50';

        const result = parseDecimalInput(input);

        expect(result).toBe(12.5);
      });
    });
  });

  describe('GIVEN a comma-separated decimal string (European keyboards)', () => {
    describe('WHEN it is parsed', () => {
      it('THEN the comma is treated as the decimal point', () => {
        const input = '12,50';

        const result = parseDecimalInput(input);

        expect(result).toBe(12.5);
      });
    });
  });

  describe('GIVEN an integer string', () => {
    describe('WHEN it is parsed', () => {
      it('THEN the integer value is returned', () => {
        const input = '100';

        const result = parseDecimalInput(input);

        expect(result).toBe(100);
      });
    });
  });

  describe('GIVEN a negative comma-separated value', () => {
    describe('WHEN it is parsed', () => {
      it('THEN the sign and magnitude are preserved', () => {
        const input = '-3,5';

        const result = parseDecimalInput(input);

        expect(result).toBe(-3.5);
      });
    });
  });

  describe('GIVEN empty and non-numeric input', () => {
    describe('WHEN the results are checked', () => {
      it('THEN NaN is returned so callers can validate', () => {
        const fromEmpty = parseDecimalInput('');
        const fromText = parseDecimalInput('abc');

        expect(Number.isNaN(fromEmpty)).toBe(true);
        expect(Number.isNaN(fromText)).toBe(true);
      });
    });
  });
});

describe('parseDecimalInput grouping', () => {
  describe('GIVEN a pasted amount with thousands grouping', () => {
    describe('WHEN it is parsed without locale information', () => {
      it.each([
        ['1 234,56', 1234.56],
        ['1 234,56', 1234.56],
        ['1 234,56', 1234.56],
        ['1.234,56', 1234.56],
        ['1,234.56', 1234.56],
        ['1,234,567', 1234567],
        ['1.234.567', 1234567],
        ["1'234.50", 1234.5],
        ['  -1 234,5  ', -1234.5],
      ])('THEN the grouping is ignored and the full value is kept (%p, %p)', (input, expected) => {
        const result = parseDecimalInput(input);

        expect(result).toBe(expected);
      });
    });
  });

  describe('GIVEN input with non-numeric characters after the digits', () => {
    describe('WHEN it is parsed', () => {
      it('THEN NaN is returned so the caller can flag the field', () => {
        const result = parseDecimalInput('12abc');

        expect(Number.isNaN(result)).toBe(true);
      });
    });
  });

  describe('GIVEN "1,234" which is a decimal in pl-PL but grouping in en-US', () => {
    describe("WHEN it is parsed with each locale's decimal separator", () => {
      it('THEN the explicit separator wins over the heuristic', () => {
        const inferred = parseDecimalInput('1,234');
        const enUS = parseDecimalInput('1,234', { decimalSeparator: '.' });
        const plPL = parseDecimalInput('1.234', { decimalSeparator: ',' });

        expect(inferred).toBe(1.234);
        expect(enUS).toBe(1234);
        expect(plPL).toBe(1234);
      });
    });
  });

  describe('GIVEN two decimal commas in a pl-PL input', () => {
    describe('WHEN it is parsed with the comma as decimal separator', () => {
      it('THEN the malformed value is rejected', () => {
        const result = parseDecimalInput('1,2,3', { decimalSeparator: ',' });

        expect(Number.isNaN(result)).toBe(true);
      });
    });
  });
});
