import { screen } from '@testing-library/react';
import { Skeleton } from '../../src/components/Skeleton';
import { renderWithTheme } from '../test-utils';

describe('Skeleton', () => {
  describe('GIVEN the Skeleton export', () => {
    describe('WHEN its runtime type is inspected', () => {
      it('THEN it is callable at runtime (function or assigned callable)', () => {
        const actualType = typeof Skeleton;

        expect(['function', 'object']).toContain(actualType);
      });
    });
  });

  describe('GIVEN the Skeleton compound API', () => {
    describe('WHEN Skeleton.Card is accessed', () => {
      it('THEN it is a function component', () => {
        expect(typeof Skeleton.Card).toBe('function');
      });
    });
  });

  describe('GIVEN a Skeleton with explicit width and height', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN a placeholder DOM node is mounted', () => {
        const { container } = renderWithTheme(<Skeleton width={120} height={16} />);

        expect(container.firstChild).not.toBeNull();
      });
    });
  });

  describe('GIVEN a Skeleton rendered under a reduce-motion theme', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN no error is thrown', () => {
        const render = () =>
          renderWithTheme(<Skeleton width={100} height={20} />, {
            config: { reduceAnimations: true },
          });

        expect(render).not.toThrow();
      });
    });
  });

  describe('GIVEN a Skeleton configured with a custom border radius', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN no error is thrown', () => {
        const render = () => renderWithTheme(<Skeleton width={80} height={80} borderRadius={40} />);

        expect(render).not.toThrow();
      });
    });
  });

  describe('GIVEN a Skeleton.Card preset with one line', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN no error is thrown', () => {
        const render = () => renderWithTheme(<Skeleton.Card lines={1} />);

        expect(render).not.toThrow();
      });
    });
  });

  describe('GIVEN a Skeleton.Card preset with several lines and an avatar', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN the card wrapper is mounted', () => {
        const { container } = renderWithTheme(<Skeleton.Card lines={3} withAvatar />);

        expect(container.firstChild).not.toBeNull();
      });
    });
  });

  describe('GIVEN a mounted Skeleton', () => {
    describe('WHEN the component is unmounted', () => {
      it('THEN unmounting does not throw', () => {
        const { unmount } = renderWithTheme(<Skeleton width={10} height={10} />);

        expect(() => unmount()).not.toThrow();
        expect(screen.queryByText(/placeholder/i)).not.toBeInTheDocument();
      });
    });
  });
});
