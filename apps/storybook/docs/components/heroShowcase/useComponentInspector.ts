import { useCallback, useEffect, useState, type RefObject } from 'react';
import {
  SHOWCASE_COMPONENTS,
  type InspectableComponent,
  type ShowcaseSlot,
} from './showcaseConfig';

/** Attribute that marks an element on the demo screen as inspectable. */
export const INSPECT_ATTRIBUTE = 'data-showcase-slot';

/** Box of one inspected element, relative to the inspector's container. */
export interface InspectedBox {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface InspectedComponent extends InspectableComponent {
  /** The inspected elements; several when the anatomy hovers a repeated node. */
  elements: readonly Element[];
  boxes: readonly InspectedBox[];
}

export interface ComponentInspector {
  target: InspectedComponent | null;
  /** Inspect elements chosen elsewhere (the anatomy tree); `[]` clears. */
  inspectElements: (elements: readonly Element[]) => void;
}

export function isSlot(value: string | null | undefined): value is ShowcaseSlot {
  return typeof value === 'string' && value in SHOWCASE_COMPONENTS;
}

export function slotOf(element: Element): ShowcaseSlot | null {
  const slot = element.getAttribute(INSPECT_ATTRIBUTE);

  return isSlot(slot) ? slot : null;
}

function boxOf(element: Element, container: HTMLElement): InspectedBox {
  const box = element.getBoundingClientRect();
  const origin = container.getBoundingClientRect();

  return {
    top: box.top - origin.top,
    left: box.left - origin.left,
    width: box.width,
    height: box.height,
  };
}

function describe(elements: readonly Element[], container: HTMLElement): InspectedComponent | null {
  const slot = elements[0] ? slotOf(elements[0]) : null;

  if (!slot) {
    return null;
  }

  const boxes = elements.map((element) => boxOf(element, container));

  return { ...SHOWCASE_COMPONENTS[slot], elements, boxes };
}

function closestSlot(target: EventTarget | null): Element | null {
  return target instanceof Element ? target.closest(`[${INSPECT_ATTRIBUTE}]`) : null;
}

/**
 * Tracks which demo component sits under the pointer or holds keyboard focus,
 * so the hero can label it like a devtools inspector. `pointerover` fires
 * only when the hovered element changes, so moving inside one component
 * costs no re-renders. The anatomy tree drives it too via `inspectElements`.
 */
export function useComponentInspector(ref: RefObject<HTMLElement | null>): ComponentInspector {
  const [target, setTarget] = useState<InspectedComponent | null>(null);

  const inspectElements = useCallback(
    (elements: readonly Element[]) => {
      const container = ref.current;

      setTarget(container ? describe(elements, container) : null);
    },
    [ref],
  );

  useEffect(() => {
    const container = ref.current;

    if (!container) {
      return undefined;
    }

    const onEnter = (event: Event) => {
      const element = closestSlot(event.target);

      setTarget(element ? describe([element], container) : null);
    };

    const clear = () => setTarget(null);

    container.addEventListener('pointerover', onEnter);
    container.addEventListener('focusin', onEnter);
    container.addEventListener('pointerleave', clear);
    container.addEventListener('focusout', clear);

    return () => {
      container.removeEventListener('pointerover', onEnter);
      container.removeEventListener('focusin', onEnter);
      container.removeEventListener('pointerleave', clear);
      container.removeEventListener('focusout', clear);
    };
  }, [ref]);

  return { target, inspectElements };
}
