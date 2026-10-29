import { resetKeysChanged } from '../../src/components/errorBoundary/resetKeys';

describe('resetKeysChanged', () => {
  describe('GIVEN missing keys before and an empty list after', () => {
    describe('WHEN the keys are compared', () => {
      it('THEN they are treated as unchanged', () => {
        expect(resetKeysChanged(undefined, [])).toBe(false);
      });
    });
  });

  describe('GIVEN the same values in new array instances', () => {
    describe('WHEN the keys are compared', () => {
      it('THEN they are unchanged', () => {
        const id = { userId: 1 };

        expect(resetKeysChanged([id, 'a'], [id, 'a'])).toBe(false);
      });
    });
  });

  describe('GIVEN a key added to the list', () => {
    describe('WHEN the keys are compared', () => {
      it('THEN they changed', () => {
        expect(resetKeysChanged(['a'], ['a', 'b'])).toBe(true);
      });
    });
  });

  describe('GIVEN an equal-looking object with a new identity', () => {
    describe('WHEN the keys are compared', () => {
      it('THEN they changed, because keys compare by identity', () => {
        expect(resetKeysChanged([{ userId: 1 }], [{ userId: 1 }])).toBe(true);
      });
    });
  });
});
