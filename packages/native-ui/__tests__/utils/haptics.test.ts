import { configureHaptics, getHaptics } from '../../src/utils/haptics';
import { createHapticsMock } from '../test-utils';

describe('haptics utility', () => {
  describe('GIVEN no prior configureHaptics call in this test', () => {
    describe('WHEN getHaptics is invoked and all its methods are called', () => {
      it('THEN the returned implementation is defined and calling its methods does not throw', () => {
        const haptics = getHaptics();
        const invokeAll = () => {
          haptics.light();
          haptics.medium();
          haptics.success();
          haptics.warning();
          haptics.error();
        };

        expect(haptics).toBeDefined();
        expect(invokeAll).not.toThrow();
      });
    });
  });

  describe('GIVEN a mock HapticsInterface with jest.fn() methods', () => {
    describe('WHEN configureHaptics registers the mock and getHaptics methods are invoked', () => {
      it('THEN the mock receives the calls made against the configured implementation', () => {
        const mockHaptics = createHapticsMock();

        configureHaptics(mockHaptics);
        const haptics = getHaptics();
        haptics.medium();
        haptics.success();

        expect(mockHaptics.medium).toHaveBeenCalledTimes(1);
        expect(mockHaptics.success).toHaveBeenCalledTimes(1);
      });
    });
  });
});
