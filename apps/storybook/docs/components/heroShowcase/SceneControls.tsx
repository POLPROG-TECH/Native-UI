import { useId } from 'react';
import { presetAccent, sceneName, type ShowcaseScene } from './showcaseConfig';
import { useShowcaseCopy, type ShowcaseCopy } from './showcaseCopy';

interface SceneControlsProps {
  scenes: readonly ShowcaseScene[];
  index: number;
  playing: boolean;
  onSelect: (index: number) => void;
  onTogglePlaying: () => void;
}

/** Spoken name of a scene: the preset id as in code, the colour mode in the docs language. */
function sceneLabel(scene: ShowcaseScene, copy: ShowcaseCopy): string {
  return `${scene.preset} · ${copy.colorModes[scene.colorMode]}`;
}

/**
 * Native radio inputs (arrow keys, one tab stop, checked state for screen
 * readers) styled as accent dots, plus the pause control WCAG 2.2.2 asks for
 * on content that changes by itself.
 */
export function SceneControls({
  scenes,
  index,
  playing,
  onSelect,
  onTogglePlaying,
}: SceneControlsProps) {
  const groupName = useId();
  const copy = useShowcaseCopy();

  return (
    <div className="nui-showcase-controls">
      <fieldset className="nui-showcase-dots">
        <legend className="nui-showcase-sr">{copy.scenePickerLabel}</legend>
        {scenes.map((scene, sceneIndex) => (
          <label
            key={sceneName(scene)}
            className="nui-showcase-dot"
            data-mode={scene.colorMode}
            style={{ color: presetAccent(scene.preset) }}
          >
            <input
              type="radio"
              name={groupName}
              checked={sceneIndex === index}
              onChange={() => onSelect(sceneIndex)}
            />
            <span className="nui-showcase-sr">{sceneLabel(scene, copy)}</span>
          </label>
        ))}
      </fieldset>
      <button
        type="button"
        className="nui-showcase-play"
        aria-pressed={!playing}
        aria-label={playing ? copy.pauseLabel : copy.playLabel}
        onClick={onTogglePlaying}
      >
        <span aria-hidden="true" className={playing ? 'is-pause' : 'is-play'} />
      </button>
    </div>
  );
}
