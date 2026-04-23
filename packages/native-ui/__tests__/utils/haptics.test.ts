import { configureHaptics, getHaptics } from '../../src/utils/haptics';
import type { HapticsInterface } from '../../src/utils/haptics';

describe('haptics utility', () => {
  it('should return a noop implementation whose methods do not throw when no configuration was provided', () => {
    // GIVEN no prior configureHaptics call in this test

    // WHEN getHaptics is invoked and all its methods are called
    const haptics = getHaptics();
    const invokeAll = () => {
      haptics.light();
      haptics.medium();
      haptics.success();
      haptics.warning();
      haptics.error();
    };

    // THEN the returned implementation is defined and calling its methods does not throw
    expect(haptics).toBeDefined();
    expect(invokeAll).not.toThrow();
  });

  it('should replace the implementation returned by getHaptics when configureHaptics is called', () => {
    // GIVEN a mock HapticsInterface with jest.fn() methods
    const mockHaptics: HapticsInterface = {
      light: jest.fn(),
      medium: jest.fn(),
      success: jest.fn(),
      warning: jest.fn(),
      error: jest.fn(),
    };

    // WHEN configureHaptics registers the mock and getHaptics methods are invoked
    configureHaptics(mockHaptics);
    const haptics = getHaptics();
    haptics.medium();
    haptics.success();

    // THEN the mock receives the calls made against the configured implementation
    expect(mockHaptics.medium).toHaveBeenCalledTimes(1);
    expect(mockHaptics.success).toHaveBeenCalledTimes(1);
  });
});
