import {
  PROVIDER_DOCS_TITLE,
  SHOWCASE_COMPONENTS,
  componentDocsHref,
  docsHref,
  sceneConfig,
  type ShowcaseScene,
} from '../showcaseConfig';
import { useShowcaseCopy } from '../showcaseCopy';
import type { ComponentTreeNode } from '../useComponentTree';

interface TreeProps {
  nodes: readonly ComponentTreeNode[];
  /** First element the inspector is showing, to mark the matching row. */
  active: Element | null;
  onInspect: (elements: readonly Element[]) => void;
}

/** Hover and keyboard focus both preview the node on the device. */
function inspectHandlers(elements: readonly Element[], onInspect: TreeProps['onInspect']) {
  const show = () => onInspect(elements);
  const hide = () => onInspect([]);

  return { onMouseEnter: show, onMouseLeave: hide, onFocus: show, onBlur: hide };
}

function TreeNode({
  node,
  active,
  onInspect,
}: { node: ComponentTreeNode } & Omit<TreeProps, 'nodes'>) {
  const component = SHOWCASE_COMPONENTS[node.slot];
  const copy = useShowcaseCopy().anatomy;
  const isActive = active !== null && node.elements.includes(active);
  const count = node.elements.length;

  return (
    <li>
      <a
        className={`nui-anatomy-node${isActive ? ' is-active' : ''}`}
        href={componentDocsHref(component)}
        target="_top"
        aria-label={copy.openDocs(component.name)}
        {...inspectHandlers(node.elements, onInspect)}
      >
        <span className="nui-anatomy-name">{`<${component.name}`}</span>
        {component.props ? (
          <span className="nui-anatomy-props">{` ${component.props}`}</span>
        ) : null}
        <span className="nui-anatomy-name">{node.children.length > 0 ? '>' : ' />'}</span>
        {count > 1 ? <span className="nui-anatomy-count">{`×${count}`}</span> : null}
      </a>
      {node.children.length > 0 ? (
        <>
          <Branch nodes={node.children} active={active} onInspect={onInspect} />
          <span className="nui-anatomy-close" aria-hidden="true">{`</${component.name}>`}</span>
        </>
      ) : null}
    </li>
  );
}

function Branch({ nodes, active, onInspect }: TreeProps) {
  return (
    <ul className="nui-anatomy-branch">
      {nodes.map((node, index) => (
        <TreeNode
          key={`${index}-${node.signature}`}
          node={node}
          active={active}
          onInspect={onInspect}
        />
      ))}
    </ul>
  );
}

/** One `key: value` line per provider config entry, as it would be written in code. */
function providerLines(scene: ShowcaseScene): string[] {
  return Object.entries(sceneConfig(scene)).map(([key, value]) =>
    typeof value === 'string' ? `${key}: '${value}',` : `${key}: ${String(value)},`,
  );
}

/**
 * The screen's composition as nested lists (screen readers announce depth
 * and size for free), rooted at the provider with its live config.
 */
export function AnatomyTree({ scene, ...props }: TreeProps & { scene: ShowcaseScene }) {
  const copy = useShowcaseCopy().anatomy;

  return (
    <ul className="nui-anatomy-tree" aria-label={copy.treeLabel}>
      <li>
        <a className="nui-anatomy-node is-root" href={docsHref(PROVIDER_DOCS_TITLE)} target="_top">
          <span className="nui-anatomy-name">{'<NativeUIProvider'}</span>
          <span className="nui-anatomy-props">{' config={{'}</span>
          {providerLines(scene).map((line) => (
            <span key={line} className="nui-anatomy-config">
              {line}
            </span>
          ))}
          <span className="nui-anatomy-props">{'}}'}</span>
          <span className="nui-anatomy-name">{'>'}</span>
        </a>
        <Branch {...props} />
        <span className="nui-anatomy-close" aria-hidden="true">
          {'</NativeUIProvider>'}
        </span>
      </li>
    </ul>
  );
}
