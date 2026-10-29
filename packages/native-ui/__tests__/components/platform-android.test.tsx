import { Platform } from 'react-native';
import { screen } from '@testing-library/react';
import { BottomTabBar } from '../../src/components/BottomTabBar';
import { renderWithTheme } from '../test-utils';

const items = [
  { key: 'home', label: 'Home', icon: () => <></> },
  { key: 'settings', label: 'Settings', icon: () => <></> },
];

/**
 * Cross-platform branches (`Platform.OS === 'android'`) are otherwise never
 * exercised because the RN mock defaults to iOS. These tests flip the mocked
 * `Platform.OS` to assert the Android-specific code path, restoring it after.
 */
describe('Android platform branches', () => {
  const originalOS = Platform.OS;

  afterEach(() => {
    Platform.OS = originalOS;
  });

  describe('GIVEN the mocked platform reports Android', () => {
    describe('WHEN the BottomTabBar is rendered inside a theme provider', () => {
      it('THEN the Android base padding is applied (ANDROID_BOTTOM_PAD 8 + safeBottomInset 0)', () => {
        Platform.OS = 'android';

        renderWithTheme(
          <BottomTabBar items={items} activeKey="home" onSelect={() => {}} testID="bar" />,
        );

        expect(screen.getByRole('tablist')).toHaveStyle({ paddingBottom: '8px' });
      });
    });
  });

  describe('GIVEN the mocked platform reports iOS', () => {
    describe('WHEN the BottomTabBar is rendered inside a theme provider', () => {
      it('THEN the iOS base padding is applied (IOS_BOTTOM_PAD 4 + safeBottomInset 0)', () => {
        Platform.OS = 'ios';

        renderWithTheme(
          <BottomTabBar items={items} activeKey="home" onSelect={() => {}} testID="bar" />,
        );

        expect(screen.getByRole('tablist')).toHaveStyle({ paddingBottom: '4px' });
      });
    });
  });

  describe('GIVEN the mocked platform reports Android', () => {
    describe('WHEN Platform.select is called with per-platform values', () => {
      it('THEN the android value is returned', () => {
        Platform.OS = 'android';

        const selected = Platform.select({ ios: 'a', android: 'b', default: 'c' });

        expect(selected).toBe('b');
      });
    });
  });
});
