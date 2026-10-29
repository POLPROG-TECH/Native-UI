/** Where the front camera sits on the display. */
export type CameraCutout = 'island' | 'punch-hole' | 'bezel';

/** Physical buttons along the frame; the CSS places each one. */
export type SideButton = 'action' | 'volume-up' | 'volume-down' | 'power' | 'top';

/** Bottom system affordance drawn over the screen. */
export type HomeAffordance = 'indicator' | 'gesture-bar';

/**
 * One device's hardware look and screen geometry. Sizes are CSS pixels of
 * the drawn device; `logicalWidth` is the width (pt / dp) the content lays
 * out at before it is scaled into the screen.
 */
export interface DeviceProfile {
  id: DeviceProfileId;
  label: string;
  logicalWidth: number;
  width: number;
  height: number;
  radius: number;
  band: number;
  bezel: number;
  camera: CameraCutout;
  home: HomeAffordance;
  buttons: readonly SideButton[];
  /** Content insets (logical units) that keep stories clear of camera and home bar. */
  safeArea: { top: number; bottom: number };
}

export type DeviceProfileId = 'iphone' | 'pixel' | 'ipad';

export const DEVICE_PROFILES: Record<DeviceProfileId, DeviceProfile> = {
  iphone: {
    id: 'iphone',
    label: 'iPhone 16 Pro',
    logicalWidth: 393,
    width: 300,
    height: 624,
    radius: 50,
    band: 3.5,
    bezel: 9,
    camera: 'island',
    home: 'indicator',
    buttons: ['action', 'volume-up', 'volume-down', 'power'],
    safeArea: { top: 59, bottom: 34 },
  },
  pixel: {
    id: 'pixel',
    label: 'Pixel 9',
    logicalWidth: 412,
    width: 300,
    height: 640,
    radius: 38,
    band: 3,
    bezel: 8,
    camera: 'punch-hole',
    home: 'gesture-bar',
    buttons: ['power', 'volume-up'],
    safeArea: { top: 40, bottom: 24 },
  },
  ipad: {
    id: 'ipad',
    label: 'iPad mini',
    logicalWidth: 744,
    width: 520,
    height: 760,
    radius: 30,
    band: 3,
    bezel: 18,
    camera: 'bezel',
    home: 'indicator',
    buttons: ['top', 'volume-up', 'volume-down'],
    safeArea: { top: 24, bottom: 20 },
  },
};

export function isDeviceProfileId(value: string): value is DeviceProfileId {
  return value in DEVICE_PROFILES;
}
