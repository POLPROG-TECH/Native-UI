import { useState } from 'react';
import { act, screen } from '@testing-library/react';
import { View } from 'react-native';
import {
  resolveTooltipPosition,
  type TooltipPositionInput,
} from '../../src/components/tooltip/tooltipPosition';
import {
  useTooltipPosition,
  type TooltipPositionResult,
} from '../../src/components/tooltip/useTooltipPosition';
import { createLayoutEvent } from '../shared/events';
import { defined, renderWithTheme } from '../test-utils';

const WINDOW = { width: 375, height: 812 };
const BUBBLE = { width: 120, height: 30 };
const OFFSET = 6;
const EDGE_INSET = 8;

function input(overrides: Partial<TooltipPositionInput>): TooltipPositionInput {
  return {
    placement: 'top',
    trigger: { x: 160, y: 400, width: 44, height: 44 },
    bubble: BUBBLE,
    window: WINDOW,
    offset: OFFSET,
    edgeInset: EDGE_INSET,
    ...overrides,
  };
}

describe('resolveTooltipPosition', () => {
  describe('GIVEN a trigger in the middle of the window', () => {
    describe('WHEN the position is resolved', () => {
      it('THEN the requested side is kept and the bubble stays centered', () => {
        expect(resolveTooltipPosition(input({}))).toEqual({ placement: 'top', shiftX: 0 });
        expect(resolveTooltipPosition(input({ placement: 'bottom' })).placement).toBe('bottom');
      });
    });
  });

  describe('GIVEN a trigger right under the top edge', () => {
    describe('WHEN a top tooltip is resolved', () => {
      it('THEN it flips below the trigger', () => {
        const position = resolveTooltipPosition(
          input({ trigger: { x: 160, y: 10, width: 44, height: 44 } }),
        );

        expect(position.placement).toBe('bottom');
      });
    });
  });

  describe('GIVEN a trigger at the bottom edge', () => {
    describe('WHEN a bottom tooltip is resolved', () => {
      it('THEN it flips above the trigger', () => {
        const position = resolveTooltipPosition(
          input({ placement: 'bottom', trigger: { x: 160, y: 760, width: 44, height: 44 } }),
        );

        expect(position.placement).toBe('top');
      });
    });
  });

  describe('GIVEN a window too short for either side', () => {
    describe('WHEN the position is resolved', () => {
      it('THEN the requested side is kept instead of flipping back and forth', () => {
        const cramped = input({
          window: { width: 375, height: 60 },
          trigger: { x: 160, y: 10, width: 44, height: 44 },
        });

        expect(resolveTooltipPosition(cramped).placement).toBe('top');
      });
    });
  });

  describe('GIVEN a trigger at the left edge', () => {
    describe('WHEN the position is resolved', () => {
      it('THEN the bubble slides right until it clears the inset', () => {
        const position = resolveTooltipPosition(
          input({ trigger: { x: 0, y: 400, width: 44, height: 44 } }),
        );

        /* Centered, the bubble would start at 22 - 60 = -38; the inset is 8. */
        expect(position.shiftX).toBe(46);
      });
    });
  });

  describe('GIVEN a trigger at the right edge', () => {
    describe('WHEN the position is resolved', () => {
      it('THEN the bubble slides left until it clears the inset', () => {
        const position = resolveTooltipPosition(
          input({ trigger: { x: 331, y: 400, width: 44, height: 44 } }),
        );

        /* Centered it would start at 293; the furthest allowed start is 375 - 8 - 120 = 247. */
        expect(position.shiftX).toBe(-46);
      });
    });
  });

  describe('GIVEN a bubble wider than the window', () => {
    describe('WHEN the position is resolved', () => {
      it('THEN it is pinned to the leading inset', () => {
        const position = resolveTooltipPosition(
          input({
            bubble: { width: 400, height: 30 },
            trigger: { x: 160, y: 400, width: 44, height: 44 },
          }),
        );

        expect(182 - 200 + position.shiftX).toBe(EDGE_INSET);
      });
    });
  });
});

describe('useTooltipPosition', () => {
  let latest: TooltipPositionResult | null = null;

  function Probe({ visible }: { visible: boolean }) {
    latest = useTooltipPosition('top', visible);

    return <View ref={latest.triggerRef} testID="trigger" />;
  }

  function stubTriggerBox(top: number) {
    jest
      .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockReturnValue(new DOMRect(160, top, 44, 44));
  }

  afterEach(() => {
    jest.restoreAllMocks();
    latest = null;
  });

  describe('GIVEN a hidden tooltip', () => {
    describe('WHEN nothing is measured yet', () => {
      it('THEN there is no position', () => {
        renderWithTheme(<Probe visible={false} />);

        expect(defined(latest).position).toBeNull();
      });
    });
  });

  describe('GIVEN a visible tooltip whose trigger sits under the top edge', () => {
    describe('WHEN the bubble reports its size', () => {
      it('THEN the measured position flips the bubble below the trigger', () => {
        stubTriggerBox(10);
        renderWithTheme(<Probe visible />);

        expect(defined(latest).position).toBeNull();

        act(() => defined(latest).onBubbleLayout(createLayoutEvent(120, 30)));

        expect(defined(latest).position).toEqual({ placement: 'bottom', shiftX: 0 });
        expect(screen.getByTestId('trigger')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a tooltip that was positioned and then hidden', () => {
    describe('WHEN it is shown again after the trigger moved', () => {
      it('THEN the trigger is measured again', () => {
        let setVisible: (visible: boolean) => void = () => {};

        function Controlled() {
          const [visible, set] = useState(true);
          setVisible = set;

          return <Probe visible={visible} />;
        }

        stubTriggerBox(10);
        renderWithTheme(<Controlled />);
        act(() => defined(latest).onBubbleLayout(createLayoutEvent(120, 30)));

        act(() => setVisible(false));

        expect(defined(latest).position).toBeNull();

        stubTriggerBox(400);
        act(() => setVisible(true));

        expect(defined(latest).position).toEqual({ placement: 'top', shiftX: 0 });
      });
    });
  });
});
