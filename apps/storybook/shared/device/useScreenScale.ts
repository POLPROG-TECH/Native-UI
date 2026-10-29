import { useEffect, type RefObject } from 'react';

/** Custom property the screen's scaler reads; see device.css. */
export const SCREEN_SCALE_PROPERTY = '--device-screen-scale';

/**
 * Keeps `--device-screen-scale` equal to drawn screen width / logical width,
 * so content lays out at the device's real width and is scaled to fit,
 * whatever size the surrounding CSS gives the frame.
 */
export function useScreenScale(ref: RefObject<HTMLElement | null>, logicalWidth: number): void {
  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return undefined;
    }

    const apply = () => {
      const scale = element.clientWidth / logicalWidth;

      element.style.setProperty(SCREEN_SCALE_PROPERTY, scale.toFixed(4));
    };

    const observer = new ResizeObserver(apply);

    apply();
    observer.observe(element);

    return () => observer.disconnect();
  }, [ref, logicalWidth]);
}
