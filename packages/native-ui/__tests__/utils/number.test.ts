import { parseDecimalInput } from '../../src/utils/number';

describe('parseDecimalInput', () => {
  it('should parse a value using a dot decimal separator', () => {
    // GIVEN a dot-separated decimal string
    const input = '12.50';

    // WHEN it is parsed
    const result = parseDecimalInput(input);

    // THEN the numeric value is returned
    expect(result).toBe(12.5);
  });

  it('should parse a value using a comma decimal separator', () => {
    // GIVEN a comma-separated decimal string (European keyboards)
    const input = '12,50';

    // WHEN it is parsed
    const result = parseDecimalInput(input);

    // THEN the comma is treated as the decimal point
    expect(result).toBe(12.5);
  });

  it('should parse a plain integer string', () => {
    // GIVEN an integer string
    const input = '100';

    // WHEN it is parsed
    const result = parseDecimalInput(input);

    // THEN the integer value is returned
    expect(result).toBe(100);
  });

  it('should preserve a leading negative sign', () => {
    // GIVEN a negative comma-separated value
    const input = '-3,5';

    // WHEN it is parsed
    const result = parseDecimalInput(input);

    // THEN the sign and magnitude are preserved
    expect(result).toBe(-3.5);
  });

  it('should return NaN for empty or non-numeric input', () => {
    // GIVEN empty and non-numeric input
    const fromEmpty = parseDecimalInput('');
    const fromText = parseDecimalInput('abc');

    // WHEN the results are checked THEN NaN is returned so callers can validate
    expect(Number.isNaN(fromEmpty)).toBe(true);
    expect(Number.isNaN(fromText)).toBe(true);
  });
});
