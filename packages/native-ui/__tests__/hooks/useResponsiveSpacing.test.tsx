import { render, screen } from '@testing-library/react';
import { useResponsiveSpacing } from '../../src/hooks/useResponsiveSpacing';

function Probe() {
  const rs = useResponsiveSpacing();

  return <div data-testid="rs">{JSON.stringify(rs)}</div>;
}

describe('useResponsiveSpacing', () => {
  describe('GIVEN a Probe component that reads the hook', () => {
    describe('WHEN it is mounted', () => {
      it('THEN all four responsive spacing fields are present as numbers', () => {
        render(<Probe />);
        const parsed = JSON.parse(screen.getByTestId('rs').textContent ?? '{}');

        expect(parsed).toEqual(
          expect.objectContaining({
            pageHorizontal: expect.any(Number),
            pageVertical: expect.any(Number),
            sectionGap: expect.any(Number),
            cardPadding: expect.any(Number),
          }),
        );
      });
    });
  });

  describe('GIVEN a spied Dimensions.addEventListener that returns a removable subscription', () => {
    describe('WHEN the hook mounts and then unmounts', () => {
      it('THEN the subscription is torn down exactly once', () => {
        const remove = jest.fn();
        const rn = require('react-native') as { Dimensions: { addEventListener: unknown } };
        const addEventListener = jest
          .spyOn(
            rn.Dimensions as { addEventListener: (...args: unknown[]) => unknown },
            'addEventListener',
          )
          .mockReturnValue({ remove });

        const view = render(<Probe />);
        expect(addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
        view.unmount();

        expect(remove).toHaveBeenCalledTimes(1);

        addEventListener.mockRestore();
      });
    });
  });
});
