import { useCallback, type AnimationEvent, type CSSProperties } from 'react';
import { ShowcaseApp } from './app/ShowcaseApp';
import { ComponentInspector } from './ComponentInspector';
import { DeviceFrame } from '../../../shared/device/DeviceFrame';
import { DEVICE_PROFILES } from '../../../shared/device/profiles';
import { SceneControls } from './SceneControls';
import { TokenReadout } from './TokenReadout';
import { useShowcase } from './ShowcaseProvider';
import { SHOWCASE_LOGICAL_WIDTH, SHOWCASE_SCENES, presetAccent } from './showcaseConfig';
import { useShowcaseCopy } from './showcaseCopy';
import './heroShowcase.css';
import './showcaseLayers.css';

/** Glow colour custom property, registered in CSS so it can transition. */
type StageStyle = CSSProperties & { '--nui-showcase-accent'?: string };

/**
 * Right side of the Introduction hero: a device running a small native-ui
 * app (three tabs, shared state, in-app theme settings) that re-themes with
 * a circular reveal, labels whatever component is hovered or focused, floats
 * token chips with the live WCAG ratio, and offers keyboard / reduced-motion
 * aware controls. State comes from <ShowcaseProvider>, shared with ScreenAnatomy.
 */
export function HeroShowcase() {
  const { app, cycle, inspector, reducedMotion, stageRef, deviceRef, liveLayerRef } = useShowcase();
  const copy = useShowcaseCopy();

  /* Components inside the screen run their own CSS animations; only the outgoing layer's ends a transition. */
  const { settle, customize } = cycle;
  const onRevealEnd = useCallback(
    (event: AnimationEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        settle();
      }
    },
    [settle],
  );

  const stageStyle: StageStyle = { '--nui-showcase-accent': presetAccent(cycle.scene.preset) };

  return (
    /* `sb-unstyled` opts out of Storybook Docs typography, which would restyle react-native-web. */
    <div className="nui-showcase sb-unstyled" role="region" aria-label={copy.regionLabel}>
      <div ref={stageRef} className="nui-showcase-stage" style={stageStyle}>
        <DeviceFrame
          ref={deviceRef}
          profile={DEVICE_PROFILES.iphone}
          logicalWidth={SHOWCASE_LOGICAL_WIDTH}
          systemChrome={false}
          intrinsicSize={false}
          overlay={<ComponentInspector target={inspector.target} />}
        >
          {/*
           * The live layer never remounts, so focus, scroll and input survive a
           * theme change made from the in-app Settings. The outgoing theme sits
           * on top and dissolves through a growing circular hole instead.
           */}
          <div ref={liveLayerRef} className="nui-showcase-layer">
            <ShowcaseApp app={app} theme={{ scene: cycle.scene, customize }} />
          </div>
          {cycle.previous && !reducedMotion ? (
            <div
              key={cycle.revision}
              className="nui-showcase-layer nui-showcase-layer--outgoing"
              aria-hidden="true"
              inert
              onAnimationEnd={onRevealEnd}
            >
              <ShowcaseApp app={app} theme={{ scene: cycle.previous, customize }} />
            </div>
          ) : null}
        </DeviceFrame>
        <TokenReadout key={cycle.revision} scene={cycle.scene} />
      </div>
      <SceneControls
        scenes={SHOWCASE_SCENES}
        index={cycle.index}
        playing={cycle.playing}
        onSelect={cycle.select}
        onTogglePlaying={cycle.togglePlaying}
      />
      <p className="nui-showcase-hint">{copy.inspectHint}</p>
    </div>
  );
}
