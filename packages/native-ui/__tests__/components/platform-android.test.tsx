import React from 'react';
import { Platform } from 'react-native';
import { render, screen } from '@testing-library/react';
import { BottomTabBar } from '../../src/components/BottomTabBar';
import { NativeUIProvider } from '../../src/theme';

function renderWithTheme(ui: React.ReactElement) {
  return render(<NativeUIProvider config={{ colorMode: 'light' }}>{ui}</NativeUIProvider>);
}

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

  it('should apply the larger Android base bottom padding on BottomTabBar', () => {
    // GIVEN the mocked platform reports Android
    Platform.OS = 'android';

    // WHEN the BottomTabBar is rendered inside a theme provider
    renderWithTheme(
      <BottomTabBar items={items} activeKey="home" onSelect={() => {}} testID="bar" />,
    );

    // THEN the Android base padding is applied (ANDROID_BOTTOM_PAD 8 + safeBottomInset 0)
    expect(screen.getByRole('tablist')).toHaveStyle({ paddingBottom: '8px' });
  });

  it('should apply the smaller iOS base bottom padding on BottomTabBar', () => {
    // GIVEN the mocked platform reports iOS
    Platform.OS = 'ios';

    // WHEN the BottomTabBar is rendered inside a theme provider
    renderWithTheme(
      <BottomTabBar items={items} activeKey="home" onSelect={() => {}} testID="bar" />,
    );

    // THEN the iOS base padding is applied (IOS_BOTTOM_PAD 4 + safeBottomInset 0)
    expect(screen.getByRole('tablist')).toHaveStyle({ paddingBottom: '4px' });
  });

  it('should resolve the android entry from Platform.select when OS is android', () => {
    // GIVEN the mocked platform reports Android
    Platform.OS = 'android';

    // WHEN Platform.select is called with per-platform values
    const selected = Platform.select({ ios: 'a', android: 'b', default: 'c' });

    // THEN the android value is returned
    expect(selected).toBe('b');
  });
});
