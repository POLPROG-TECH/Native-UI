import { Platform, type AccessibilityValue } from 'react-native';

const WEB = 'web';

/**
 * The value props of a range control, for every platform. iOS and Android
 * read `accessibilityValue`. React Native Web ignores it, so on web the value
 * is also written as `aria-value*` attributes. `webValue` lets a control give
 * the browser exact numbers where the native value has to stay text only
 * (Android reads `min` / `max` / `now` as integers).
 */
export function accessibilityValueProps(
  value: AccessibilityValue,
  webValue: AccessibilityValue = value,
) {
  const base = { accessibilityValue: value };

  if (Platform.OS !== WEB) {
    return base;
  }

  return {
    ...base,
    'aria-valuemin': webValue.min,
    'aria-valuemax': webValue.max,
    'aria-valuenow': webValue.now,
    'aria-valuetext': webValue.text,
  };
}
