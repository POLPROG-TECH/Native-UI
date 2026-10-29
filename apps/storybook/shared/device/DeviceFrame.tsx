import { useRef, type CSSProperties, type ReactNode, type Ref } from 'react';
import type { DeviceProfile } from './profiles';
import { useScreenScale } from './useScreenScale';
import './device.css';

/** Geometry custom properties the device stylesheet reads. */
type DeviceStyle = CSSProperties & Record<`--device-${string}`, string>;

interface DeviceFrameProps {
  profile: DeviceProfile;
  /** Screen content; it lays out at `logicalWidth` and is scaled to the screen. */
  children: ReactNode;
  /** Overrides the profile's layout width (the hero uses a narrower phone). */
  logicalWidth?: number;
  /** Drawn over the display without clipping, e.g. an inspector overlay. */
  overlay?: ReactNode;
  /** Draws the home indicator; off when the content renders its own system bars. */
  systemChrome?: boolean;
  /** Uses the profile's own size; off when surrounding CSS sizes the frame (hero). */
  intrinsicSize?: boolean;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

/*
 * Size is optional so surrounding CSS (the hero's container query) can own
 * it; the rest is per-device hardware.
 */
function hardwareStyle(profile: DeviceProfile, intrinsicSize: boolean): DeviceStyle {
  const hardware: DeviceStyle = {
    '--device-radius': `${profile.radius}px`,
    '--device-band': `${profile.band}px`,
    '--device-bezel': `${profile.bezel}px`,
  };

  if (!intrinsicSize) {
    return hardware;
  }

  return {
    ...hardware,
    '--device-width': `${profile.width}px`,
    '--device-height': `${profile.height}px`,
  };
}

/**
 * Device hardware drawn in CSS: a metal band with antenna breaks, side
 * buttons, bezel, camera cutout, glass sheen and the home affordance. The
 * hardware is decorative and hidden from assistive tech; content inside
 * stays fully accessible.
 */
export function DeviceFrame({
  profile,
  children,
  logicalWidth = profile.logicalWidth,
  overlay,
  systemChrome = true,
  intrinsicSize = true,
  className,
  ref,
}: DeviceFrameProps) {
  const screenRef = useRef<HTMLDivElement>(null);

  useScreenScale(screenRef, logicalWidth);

  return (
    <div
      ref={ref}
      className={className ? `nui-device ${className}` : 'nui-device'}
      data-device={profile.id}
      style={hardwareStyle(profile, intrinsicSize)}
    >
      {profile.buttons.map((button) => (
        <span key={button} className={`nui-device-button is-${button}`} aria-hidden="true" />
      ))}
      <div className="nui-device-bezel">
        <div ref={screenRef} className="nui-device-screen">
          <div className="nui-device-scaler">{children}</div>
          <div className="nui-device-glare" aria-hidden="true" />
          {systemChrome ? (
            <span className={`nui-device-home is-${profile.home}`} aria-hidden="true" />
          ) : null}
        </div>
        <div className={`nui-device-camera is-${profile.camera}`} aria-hidden="true">
          <span className="nui-device-lens" />
        </div>
      </div>
      {overlay}
    </div>
  );
}
