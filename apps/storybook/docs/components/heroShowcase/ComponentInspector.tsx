import type { ReactNode } from 'react';
import type { ShowcaseSlot } from './showcaseConfig';
import { INSPECT_ATTRIBUTE, type InspectedComponent } from './useComponentInspector';

/** Above this offset the label fits over the element; otherwise it drops below. */
const LABEL_CLEARANCE = 30;

/**
 * Marks one demo component for the inspector. A plain DOM wrapper is fine
 * here: react-native-web renders to the DOM, and the wrapper only carries
 * the slot attribute.
 */
export function Inspectable({
  slot,
  flex,
  children,
}: {
  slot: ShowcaseSlot;
  /** Flex share of the wrapper inside a row, standing in for the child's own `flex`. */
  flex?: number;
  children: ReactNode;
}) {
  return (
    <div
      className="nui-showcase-inspectable"
      style={flex === undefined ? undefined : { flex }}
      {...{ [INSPECT_ATTRIBUTE]: slot }}
    >
      {children}
    </div>
  );
}

/** Devtools-style outlines, with a name tag on the first, over the inspected component(s). */
export function ComponentInspector({ target }: { target: InspectedComponent | null }) {
  if (!target) {
    return null;
  }

  return (
    <>
      {target.boxes.map((box, index) => (
        <div
          key={`${box.top}-${box.left}`}
          className="nui-showcase-inspector"
          aria-hidden="true"
          style={{ top: box.top, left: box.left, width: box.width, height: box.height }}
        >
          {index === 0 ? (
            <span
              className={`nui-showcase-inspector-tag${box.top < LABEL_CLEARANCE ? ' is-below' : ''}`}
            >
              <span className="nui-showcase-inspector-name">{`<${target.name}`}</span>
              {target.props ? (
                <span className="nui-showcase-inspector-props">{` ${target.props}`}</span>
              ) : null}
              <span className="nui-showcase-inspector-name">
                {target.boxes.length > 1 ? ` /> ×${target.boxes.length}` : ' />'}
              </span>
            </span>
          ) : null}
        </div>
      ))}
    </>
  );
}
