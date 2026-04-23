import React from 'react';
import { act, screen } from '@testing-library/react';
import { ConfettiOverlay } from '../../src/components/ConfettiOverlay';
import { renderWithTheme } from '../test-utils';

describe('ConfettiOverlay', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('should be exported as a function component', () => {
    // GIVEN the ConfettiOverlay export

    // WHEN its runtime type is inspected
    const actualType = typeof ConfettiOverlay;

    // THEN it is a function component
    expect(actualType).toBe('function');
  });

  it('should render nothing when `visible` is false', () => {
    // GIVEN a ConfettiOverlay configured with visible={false}
    // WHEN the component is rendered
    const { container } = renderWithTheme(<ConfettiOverlay visible={false} />);

    // THEN no confetti wrapper is mounted
    expect(container.firstChild).toBeNull();
  });

  it('should render the overlay wrapper when `visible` is true', () => {
    // GIVEN a visible ConfettiOverlay
    // WHEN the component is rendered
    const { container } = renderWithTheme(
      <ConfettiOverlay visible forceAnimation particleCount={5} />,
    );

    // THEN the overlay wrapper element is mounted
    expect(container.firstChild).not.toBeNull();
  });

  it('should invoke `onComplete` after the configured duration elapses', () => {
    // GIVEN a visible ConfettiOverlay with an onComplete spy and a known duration
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

    // WHEN the full duration elapses
    act(() => {
      jest.advanceTimersByTime(1001);
    });

    // THEN onComplete is called exactly once
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('should render without crashing for a zero particle count', () => {
    // GIVEN a ConfettiOverlay with particleCount=0
    // WHEN the component is rendered
    const render = () =>
      renderWithTheme(<ConfettiOverlay visible forceAnimation particleCount={0} />);

    // THEN no error is thrown
    expect(render).not.toThrow();
  });

  it('should render without crashing when a custom color palette is provided', () => {
    // GIVEN a custom color palette
    // WHEN the overlay is rendered using that palette
    const render = () =>
      renderWithTheme(
        <ConfettiOverlay
          visible
          forceAnimation
          particleCount={2}
          colors={['#ff0000', '#00ff00']}
        />,
      );

    // THEN no error is thrown
    expect(render).not.toThrow();
  });

  it('should not render confetti when reduceAnimations is on and `forceAnimation` is false', () => {
    // GIVEN a visible overlay without forceAnimation, in reduce-motion mode
    // WHEN the component is mounted under a reduceAnimations provider
    const { container } = renderWithTheme(
      <ConfettiOverlay visible particleCount={4} forceAnimation={false} />,
      { config: { reduceAnimations: true } },
    );

    // THEN no confetti pieces are mounted
    expect(container.firstChild).toBeNull();
  });
});
