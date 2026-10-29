import type { HapticsInterface } from '../../src/utils/haptics';

/**
 * A haptics implementation whose every method is a `jest.fn`, for
 * `configureHaptics(createHapticsMock())`. Renderer-agnostic, so both the
 * `dom` and `native` test-utils re-export it.
 */
export function createHapticsMock(): jest.Mocked<HapticsInterface> {
  return {
    light: jest.fn(),
    medium: jest.fn(),
    success: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
  };
}
