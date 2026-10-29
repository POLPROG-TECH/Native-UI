import { act } from '@testing-library/react';
import { ConfettiOverlay } from '../../src/components/ConfettiOverlay';
import { renderWithTheme } from '../test-utils';

describe('ConfettiOverlay', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  describe('GIVEN the ConfettiOverlay export', () => {
    describe('WHEN its runtime type is inspected', () => {
      it('THEN it is a function component', () => {
        const actualType = typeof ConfettiOverlay;

        expect(actualType).toBe('function');
      });
    });
  });

  describe('GIVEN a ConfettiOverlay configured with visible={false}', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN no confetti wrapper is mounted', () => {
        const { container } = renderWithTheme(<ConfettiOverlay visible={false} />);

        expect(container.firstChild).toBeNull();
      });
    });
  });

  describe('GIVEN a visible ConfettiOverlay', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN the overlay wrapper element is mounted', () => {
        const { container } = renderWithTheme(
          <ConfettiOverlay visible forceAnimation particleCount={5} />,
        );

        expect(container.firstChild).not.toBeNull();
      });
    });
  });

  describe('GIVEN a visible ConfettiOverlay with an onComplete spy and a known duration', () => {
    describe('WHEN the full duration elapses', () => {
      it('THEN onComplete is called exactly once', () => {
        const onComplete = jest.fn();
        renderWithTheme(
          <ConfettiOverlay
            visible
            forceAnimation
            particleCount={3}
            duration={1000}
            onComplete={onComplete}
          />,
        );

        act(() => {
          jest.advanceTimersByTime(1001);
        });

        expect(onComplete).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('GIVEN a ConfettiOverlay with particleCount=0', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN no error is thrown', () => {
        const render = () =>
          renderWithTheme(<ConfettiOverlay visible forceAnimation particleCount={0} />);

        expect(render).not.toThrow();
      });
    });
  });

  describe('GIVEN a custom color palette', () => {
    describe('WHEN the overlay is rendered using that palette', () => {
      it('THEN no error is thrown', () => {
        const render = () =>
          renderWithTheme(
            <ConfettiOverlay
              visible
              forceAnimation
              particleCount={2}
              colors={['#ff0000', '#00ff00']}
            />,
          );

        expect(render).not.toThrow();
      });
    });
  });

  describe('GIVEN a visible overlay without forceAnimation, in reduce-motion mode', () => {
    describe('WHEN the component is mounted under a reduceAnimations provider', () => {
      it('THEN no confetti pieces are mounted', () => {
        const { container } = renderWithTheme(
          <ConfettiOverlay visible particleCount={4} forceAnimation={false} />,
          { config: { reduceAnimations: true } },
        );

        expect(container.firstChild).toBeNull();
      });
    });
  });
});
