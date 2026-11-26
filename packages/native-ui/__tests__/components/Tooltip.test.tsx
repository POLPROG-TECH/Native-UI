import type { ComponentProps } from 'react';
import { act, fireEvent, screen } from '@testing-library/react';
import { Tooltip } from '../../src/components/Tooltip';
import { Text } from '../../src/primitives/Text';
import { captureTheme, renderWithTheme } from '../test-utils';

const HINT = 'Copy link';
const LONG_PRESS_MS = 400;

function renderTooltip(props: Partial<ComponentProps<typeof Tooltip>> = {}) {
  renderWithTheme(
    <Tooltip content={HINT} testID="tip" longPressDelayMs={LONG_PRESS_MS} {...props}>
      <Text>Trigger</Text>
    </Tooltip>,
  );

  return screen.getByTestId('tip');
}

describe('Tooltip', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('GIVEN a tooltip around a trigger', () => {
    describe('WHEN nothing has happened yet', () => {
      it('THEN the bubble is not rendered', () => {
        renderTooltip();

        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      });
    });

    describe('WHEN a pointer enters and then leaves the trigger', () => {
      it('THEN the bubble shows the hint and hides again', () => {
        const wrapper = renderTooltip();

        fireEvent.pointerEnter(wrapper);

        expect(screen.getByRole('tooltip')).toHaveTextContent(HINT);

        fireEvent.pointerLeave(wrapper);

        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      });
    });

    describe('WHEN keyboard focus moves into and out of the trigger', () => {
      it('THEN the bubble follows the focus', () => {
        const wrapper = renderTooltip();

        fireEvent.focus(wrapper);

        expect(screen.getByRole('tooltip')).toBeInTheDocument();

        fireEvent.blur(wrapper);

        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      });
    });

    describe('WHEN the trigger is held for the long-press delay', () => {
      it('THEN the bubble appears, and leaves a moment after the finger lifts', () => {
        const wrapper = renderTooltip();
        const { visibleDurationMs } = captureTheme().components.tooltip;

        fireEvent.touchStart(wrapper);
        act(() => jest.advanceTimersByTime(LONG_PRESS_MS));

        expect(screen.getByRole('tooltip')).toBeInTheDocument();

        fireEvent.touchEnd(wrapper);
        act(() => jest.advanceTimersByTime(visibleDurationMs - 1));

        expect(screen.getByRole('tooltip')).toBeInTheDocument();

        act(() => jest.advanceTimersByTime(1));

        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      });
    });

    describe('WHEN the trigger is only tapped', () => {
      it('THEN the bubble never appears', () => {
        const wrapper = renderTooltip();

        fireEvent.touchStart(wrapper);
        act(() => jest.advanceTimersByTime(LONG_PRESS_MS - 1));
        fireEvent.touchEnd(wrapper);
        act(() => jest.advanceTimersByTime(LONG_PRESS_MS));

        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      });
    });

    describe('WHEN the touch is cancelled by a scroll', () => {
      it('THEN the bubble hides at once', () => {
        const wrapper = renderTooltip();

        fireEvent.touchStart(wrapper);
        act(() => jest.advanceTimersByTime(LONG_PRESS_MS));
        fireEvent.touchCancel(wrapper);

        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a disabled tooltip', () => {
    describe('WHEN a pointer enters the trigger', () => {
      it('THEN the bubble stays hidden', () => {
        const wrapper = renderTooltip({ disabled: true });

        fireEvent.pointerEnter(wrapper);

        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a tooltip the app controls', () => {
    describe('WHEN visible is true without any interaction', () => {
      it('THEN the bubble is shown below the trigger when asked', () => {
        const { offset } = captureTheme().components.tooltip;
        renderTooltip({ visible: true, placement: 'bottom' });

        const anchor = screen.getByRole('tooltip').parentElement;

        expect(anchor).toHaveStyle({ top: '100%', marginTop: `${offset}px` });
      });
    });

    describe('WHEN visible is false while a pointer is over the trigger', () => {
      it('THEN the bubble stays hidden', () => {
        const wrapper = renderTooltip({ visible: false });

        fireEvent.pointerEnter(wrapper);

        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a tooltip waiting for a long press', () => {
    describe('WHEN it unmounts before the delay ends', () => {
      it('THEN the pending timer is cleared', () => {
        const { unmount } = renderWithTheme(
          <Tooltip content={HINT} testID="tip" longPressDelayMs={LONG_PRESS_MS}>
            <Text>Trigger</Text>
          </Tooltip>,
        );

        fireEvent.touchStart(screen.getByTestId('tip'));
        unmount();

        expect(jest.getTimerCount()).toBe(0);
      });
    });
  });
});
