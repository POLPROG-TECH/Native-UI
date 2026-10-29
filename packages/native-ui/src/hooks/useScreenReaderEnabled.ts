import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/**
 * Tracks whether VoiceOver / TalkBack is running. Starts as `false` and
 * updates once the async query resolves, then follows `screenReaderChanged`
 * events. Unsubscribes on unmount and ignores a late query result.
 */
export function useScreenReaderEnabled(): boolean {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    let active = true;

    AccessibilityInfo.isScreenReaderEnabled()
      .then((value) => {
        if (active) {
          setEnabled(value);
        }
      })
      .catch(() => {
        /* Query unsupported on this platform: keep the conservative default. */
      });

    const subscription = AccessibilityInfo.addEventListener('screenReaderChanged', setEnabled);

    return () => {
      active = false;
      subscription.remove();
    };
  }, []);

  return enabled;
}
