import type { CSSProperties, ReactNode } from 'react';
import { DeviceFrame } from '../../../shared/device/DeviceFrame';
import {
  DEVICE_PROFILES,
  isDeviceProfileId,
  type DeviceProfile,
} from '../../../shared/device/profiles';
import type { DeviceGlobal } from '../../globals/definitions';

type SafeAreaStyle = CSSProperties & Record<'--device-safe-top' | '--device-safe-bottom', string>;

/*
 * Insets go to the themed canvas (preview.css), not to this wrapper: padding
 * here would show the bare screen above the story and push it past the
 * bottom edge.
 */
function safeAreaStyle(profile: DeviceProfile): SafeAreaStyle {
  return {
    '--device-safe-top': `${profile.safeArea.top}px`,
    '--device-safe-bottom': `${profile.safeArea.bottom}px`,
  };
}

/**
 * Wraps a story in the selected device frame. The story lays out at the
 * device's logical width (real phone proportions) and scrolls inside the
 * screen; safe-area insets keep content clear of the camera and the home
 * indicator, like `ScreenContainer` would on a device.
 */
export function DeviceStage({ device, children }: { device: DeviceGlobal; children: ReactNode }) {
  if (!isDeviceProfileId(device)) {
    return <>{children}</>;
  }

  const profile = DEVICE_PROFILES[device];

  return (
    <div className="nui-device-stage">
      <DeviceFrame profile={profile}>
        <div className="nui-device-content" style={safeAreaStyle(profile)}>
          {children}
        </div>
      </DeviceFrame>
      <span className="nui-device-stage-label">{profile.label}</span>
    </div>
  );
}
