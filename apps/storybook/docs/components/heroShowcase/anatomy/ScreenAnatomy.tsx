import { useId } from 'react';
import { useShowcase } from '../ShowcaseProvider';
import { componentDocsHref, sceneConfig } from '../showcaseConfig';
import { useShowcaseCopy } from '../showcaseCopy';
import { useComponentTree } from '../useComponentTree';
import { AnatomyTree } from './AnatomyTree';
import { componentUsages, instanceCount, type ComponentUsage } from './anatomyStats';
import './screenAnatomy.css';

function UsageChip({
  usage,
  onInspect,
}: {
  usage: ComponentUsage;
  onInspect: (elements: readonly Element[]) => void;
}) {
  const show = () => onInspect(usage.elements);
  const hide = () => onInspect([]);

  return (
    <li>
      <a
        className="nui-anatomy-chip"
        href={componentDocsHref(usage.component)}
        target="_top"
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
      >
        {usage.component.name}
        {usage.elements.length > 1 ? <span>{`×${usage.elements.length}`}</span> : null}
      </a>
    </li>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="nui-anatomy-stat">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

/**
 * "Screen anatomy" panel under the hero: which native-ui components the
 * device's current screen is made of, as counts and as a tree, read live
 * from the device and synced both ways with its inspector.
 */
export function ScreenAnatomy() {
  const titleId = useId();
  const { app, cycle, inspector, liveLayerRef } = useShowcase();
  const tree = useComponentTree(liveLayerRef);
  const usages = componentUsages(tree);
  const { anatomy: copy, tabs } = useShowcaseCopy();
  const active = inspector.target?.elements[0] ?? null;

  return (
    <section className="nui-anatomy sb-unstyled" aria-labelledby={titleId}>
      <div className="nui-anatomy-summary">
        <span className="nui-anatomy-eyebrow">{copy.eyebrow}</span>
        <h2 id={titleId}>{copy.title(tabs[app.tab])}</h2>
        <p>{copy.lead}</p>
        <dl className="nui-anatomy-stats">
          <Stat value={instanceCount(usages)} label={copy.instances} />
          <Stat value={usages.length} label={copy.components} />
          <Stat value={Object.keys(sceneConfig(cycle.scene)).length} label={copy.providerProps} />
        </dl>
        <h3>{copy.usedHere}</h3>
        <ul className="nui-anatomy-chips">
          {usages.map((usage) => (
            <UsageChip
              key={usage.component.name}
              usage={usage}
              onInspect={inspector.inspectElements}
            />
          ))}
        </ul>
      </div>
      <div className="nui-anatomy-code">
        <AnatomyTree
          scene={cycle.scene}
          nodes={tree}
          active={active}
          onInspect={inspector.inspectElements}
        />
      </div>
    </section>
  );
}
