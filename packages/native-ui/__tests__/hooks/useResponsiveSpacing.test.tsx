import React from 'react';
import { render, screen } from '@testing-library/react';
import { useResponsiveSpacing } from '../../src/hooks/useResponsiveSpacing';

function Probe() {
  const rs = useResponsiveSpacing();

  return <div data-testid="rs">{JSON.stringify(rs)}</div>;
}

describe('useResponsiveSpacing', () => {
  it('should return a complete responsive spacing object on mount', () => {
    // GIVEN a Probe component that reads the hook
    // WHEN it is mounted
    render(<Probe />);
    const parsed = JSON.parse(screen.getByTestId('rs').textContent ?? '{}');

    // THEN all four responsive spacing fields are present as numbers
    expect(parsed).toEqual(
      expect.objectContaining({
        pageHorizontal: expect.any(Number),
        pageVertical: expect.any(Number),
        sectionGap: expect.any(Number),
        cardPadding: expect.any(Number),
      }),
    );
  });

  it('should subscribe to Dimensions changes on mount and clean up on unmount', () => {
    // GIVEN a spied Dimensions.addEventListener that returns a removable subscription
    const remove = jest.fn();
    const rn = require('react-native') as { Dimensions: { addEventListener: unknown } };
    const addEventListener = jest
      .spyOn(
        rn.Dimensions as { addEventListener: (...args: unknown[]) => unknown },
        'addEventListener',
      )
      .mockReturnValue({ remove });

    // WHEN the hook mounts and then unmounts
    const view = render(<Probe />);
    expect(addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    view.unmount();

    // THEN the subscription is torn down exactly once
    expect(remove).toHaveBeenCalledTimes(1);

    addEventListener.mockRestore();
  });
});
