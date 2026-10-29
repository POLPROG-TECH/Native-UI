import { SHOWCASE_COMPONENTS, type InspectableComponent } from '../showcaseConfig';
import type { ComponentTreeNode } from '../useComponentTree';

/** One component and every place it appears on the current screen. */
export interface ComponentUsage {
  component: InspectableComponent;
  elements: readonly Element[];
}

function flatten(nodes: readonly ComponentTreeNode[]): ComponentTreeNode[] {
  return nodes.flatMap((node) => [node, ...flatten(node.children)]);
}

/** Usages grouped by component name, most used first, then alphabetical. */
export function componentUsages(tree: readonly ComponentTreeNode[]): ComponentUsage[] {
  const byName = new Map<string, ComponentUsage>();

  flatten(tree).forEach((node) => {
    const component = SHOWCASE_COMPONENTS[node.slot];
    const usage = byName.get(component.name);

    byName.set(component.name, {
      component,
      elements: [...(usage?.elements ?? []), ...node.elements],
    });
  });

  return [...byName.values()].sort(
    (a, b) =>
      b.elements.length - a.elements.length || a.component.name.localeCompare(b.component.name),
  );
}

export function instanceCount(usages: readonly ComponentUsage[]): number {
  return usages.reduce((sum, usage) => sum + usage.elements.length, 0);
}
