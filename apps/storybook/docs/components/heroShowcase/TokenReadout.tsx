import {
  NativeUIProvider,
  WCAG_AA_TEXT_CONTRAST,
  contrastRatio,
  useColors,
} from '@polprog/native-ui';
import { sceneConfig, type ShowcaseScene } from './showcaseConfig';
import { useShowcaseCopy } from './showcaseCopy';

/** WCAG 2.x AAA minimum for normal-size text; the library only exports AA. */
const WCAG_AAA_TEXT_CONTRAST = 7;

function contrastGrade(ratio: number, largeTextGrade: string): string {
  if (ratio >= WCAG_AAA_TEXT_CONTRAST) {
    return 'AAA';
  }

  return ratio >= WCAG_AA_TEXT_CONTRAST ? 'AA' : largeTextGrade;
}

function Readout({ scene }: { scene: ShowcaseScene }) {
  const colors = useColors();
  const ratio = contrastRatio(colors.onPrimary, colors.primary);
  const copy = useShowcaseCopy();

  return (
    <>
      <div className="nui-showcase-chip nui-showcase-chip--accent">
        <span className="nui-showcase-swatch" style={{ background: colors.primary }} />
        <span className="nui-showcase-chip-key">{copy.accentLabel}</span>
        <code>{colors.primary.toUpperCase()}</code>
      </div>
      <div className="nui-showcase-chip nui-showcase-chip--contrast">
        <span className="nui-showcase-chip-key">{copy.contrastLabel}</span>
        <strong>{ratio.toFixed(1)} : 1</strong>
        <span className="nui-showcase-grade">{contrastGrade(ratio, copy.largeTextGrade)}</span>
      </div>
      <div className="nui-showcase-chip nui-showcase-chip--code">
        <code>
          {'config={{ preset: '}
          <em>{`'${scene.preset}'`}</em>
          {', colorMode: '}
          <em>{`'${scene.colorMode}'`}</em>
          {scene.highContrast ? (
            <>
              {', highContrast: '}
              <em>true</em>
            </>
          ) : null}
          {' }}'}
        </code>
      </div>
    </>
  );
}

/**
 * Floating glass chips beside the device. Values come from the resolved
 * theme of the active scene (accent, live WCAG ratio of the button label),
 * so they always describe what the device shows instead of a canned number.
 */
export function TokenReadout({ scene }: { scene: ShowcaseScene }) {
  return (
    <NativeUIProvider config={sceneConfig(scene)}>
      <Readout scene={scene} />
    </NativeUIProvider>
  );
}
