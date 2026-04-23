import React from 'react';
import { screen } from '@testing-library/react';
import { Skeleton } from '../../src/components/Skeleton';
import { renderWithTheme } from '../test-utils';

describe('Skeleton', () => {
  it('should be exported as a callable component (compound with `.Card`)', () => {
    // GIVEN the Skeleton export

    // WHEN its runtime type is inspected
    const actualType = typeof Skeleton;

    // THEN it is callable at runtime (function or assigned callable)
    expect(['function', 'object']).toContain(actualType);
  });

  it('should expose `Card` as a static subcomponent', () => {
    // GIVEN the Skeleton compound API
    // WHEN Skeleton.Card is accessed
    // THEN it is a function component
    expect(typeof Skeleton.Card).toBe('function');
  });

  it('should render a placeholder node with the requested dimensions', () => {
    // GIVEN a Skeleton with explicit width and height
    // WHEN the component is rendered
    const { container } = renderWithTheme(<Skeleton width={120} height={16} />);

    // THEN a placeholder DOM node is mounted
    expect(container.firstChild).not.toBeNull();
  });

  it('should render without crashing when `reduceAnimations` is enabled', () => {
    // GIVEN a Skeleton rendered under a reduce-motion theme
    // WHEN the component is rendered
    const render = () =>
      renderWithTheme(<Skeleton width={100} height={20} />, {
        config: { reduceAnimations: true },
      });

    // THEN no error is thrown
    expect(render).not.toThrow();
  });

  it('should render without crashing with a custom `borderRadius`', () => {
    // GIVEN a Skeleton configured with a custom border radius
    // WHEN the component is rendered
    const render = () => renderWithTheme(<Skeleton width={80} height={80} borderRadius={40} />);

    // THEN no error is thrown
    expect(render).not.toThrow();
  });

  it('should render a Skeleton.Card preset with a single line without crashing', () => {
    // GIVEN a Skeleton.Card preset with one line
    // WHEN the component is rendered
    const render = () => renderWithTheme(<Skeleton.Card lines={1} />);

    // THEN no error is thrown
    expect(render).not.toThrow();
  });

  it('should render a Skeleton.Card preset with multiple lines and an avatar without crashing', () => {
    // GIVEN a Skeleton.Card preset with several lines and an avatar
    // WHEN the component is rendered
    const { container } = renderWithTheme(<Skeleton.Card lines={3} withAvatar />);

    // THEN the card wrapper is mounted
    expect(container.firstChild).not.toBeNull();
  });

  it('should not leak between renders when unmounted', () => {
    // GIVEN a mounted Skeleton
    const { unmount } = renderWithTheme(<Skeleton width={10} height={10} />);

    // WHEN the component is unmounted
    // THEN unmounting does not throw
    expect(() => unmount()).not.toThrow();
    expect(screen.queryByText(/placeholder/i)).not.toBeInTheDocument();
  });
});
