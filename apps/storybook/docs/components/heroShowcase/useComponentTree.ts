import { useEffect, useState, type RefObject } from 'react';
import type { ShowcaseSlot } from './showcaseConfig';
import { INSPECT_ATTRIBUTE, slotOf } from './useComponentInspector';

/** One component in the screen's composition; repeated siblings collapse into `elements`. */
export interface ComponentTreeNode {
  slot: ShowcaseSlot;
  elements: readonly Element[];
  children: readonly ComponentTreeNode[];
  /** Stable shape key (slot plus children), used to group and to skip no-op updates. */
  signature: string;
}

/** Nearest inspectable descendants of `element`, skipping plain wrappers in between. */
function slotChildren(element: Element): Element[] {
  return Array.from(element.children).flatMap((child) =>
    child.hasAttribute(INSPECT_ATTRIBUTE) ? [child] : slotChildren(child),
  );
}

function nodeOf(element: Element): ComponentTreeNode | null {
  const slot = slotOf(element);

  if (!slot) {
    return null;
  }

  const children = buildTree(element);
  const signature = `${slot}(${children.map((child) => child.signature).join(',')})`;

  return { slot, elements: [element], children, signature };
}

/** Folds consecutive identical siblings (two ListItems) into one node with several elements. */
function groupRepeats(nodes: readonly ComponentTreeNode[]): ComponentTreeNode[] {
  return nodes.reduce<ComponentTreeNode[]>((grouped, node) => {
    const last = grouped[grouped.length - 1];

    if (last && last.signature === node.signature) {
      grouped[grouped.length - 1] = { ...last, elements: [...last.elements, ...node.elements] };

      return grouped;
    }

    return [...grouped, node];
  }, []);
}

export function buildTree(root: Element): ComponentTreeNode[] {
  const nodes = slotChildren(root)
    .map(nodeOf)
    .filter((node): node is ComponentTreeNode => node !== null);

  return groupRepeats(nodes);
}

function treeKey(nodes: readonly ComponentTreeNode[]): string {
  return nodes.map((node) => `${node.signature}×${node.elements.length}`).join('|');
}

function isStale(nodes: readonly ComponentTreeNode[]): boolean {
  return nodes.some(
    (node) => node.elements.some((element) => !element.isConnected) || isStale(node.children),
  );
}

/**
 * Reads the composition of the live screen straight from the DOM, so the
 * anatomy never drifts from what the device shows: switching tabs,
 * filtering the list or toggling settings all update it.
 */
export function useComponentTree(ref: RefObject<HTMLElement | null>): ComponentTreeNode[] {
  const [tree, setTree] = useState<ComponentTreeNode[]>([]);

  useEffect(() => {
    const root = ref.current;

    if (!root) {
      return undefined;
    }

    /* MutationObserver already batches a whole render into one callback. */
    const rebuild = () => {
      const next = buildTree(root);

      setTree((current) =>
        treeKey(current) === treeKey(next) && !isStale(current) ? current : next,
      );
    };

    const observer = new MutationObserver(rebuild);

    rebuild();
    observer.observe(root, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [ref]);

  return tree;
}
