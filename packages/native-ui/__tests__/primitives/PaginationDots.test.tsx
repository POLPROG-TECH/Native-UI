import { screen } from '@testing-library/react';
import { PaginationDots } from '../../src/primitives/PaginationDots';
import { renderWithTheme } from '../test-utils';

describe('PaginationDots', () => {
  describe('GIVEN the PaginationDots export', () => {
    describe('WHEN its runtime type is inspected', () => {
      it('THEN it is a function component', () => {
        const actualType = typeof PaginationDots;

        expect(actualType).toBe('function');
      });
    });
  });

  describe('GIVEN a PaginationDots with count=5 and no active dot change', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN the wrapper contains exactly five child dot nodes', () => {
        const { container } = renderWithTheme(<PaginationDots count={5} current={0} />);

        const wrapper = container.firstChild as HTMLElement;
        expect(wrapper.childNodes.length).toBe(5);
      });
    });
  });

  describe('GIVEN a PaginationDots on the third step of five', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN an accessible label describing "step X of Y" is exposed', () => {
        renderWithTheme(<PaginationDots count={5} current={2} />);

        expect(screen.getByLabelText(/step 3 of 5/i)).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a PaginationDots with a custom accessibilityLabel', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN the custom label is used verbatim', () => {
        renderWithTheme(
          <PaginationDots count={3} current={0} accessibilityLabel="Carousel progress" />,
        );

        expect(screen.getByLabelText('Carousel progress')).toBeInTheDocument();
      });
    });
  });

  describe('GIVEN a PaginationDots with count=0', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN no error is thrown', () => {
        const render = () => renderWithTheme(<PaginationDots count={0} current={0} />);

        expect(render).not.toThrow();
      });
    });
  });

  describe('GIVEN a PaginationDots with animated={false}', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN a wrapper containing the dots is present', () => {
        const { container } = renderWithTheme(
          <PaginationDots count={3} current={1} animated={false} />,
        );

        expect(container.firstChild).not.toBeNull();
      });
    });
  });

  describe('GIVEN custom inactive and active dot colors', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN no error is thrown', () => {
        const render = () =>
          renderWithTheme(
            <PaginationDots count={4} current={1} color="#000000" activeColor="#00ff00" />,
          );

        expect(render).not.toThrow();
      });
    });
  });

  describe('GIVEN PaginationDots sized via every geometric prop', () => {
    describe('WHEN the component is rendered', () => {
      it('THEN no error is thrown', () => {
        const render = () =>
          renderWithTheme(
            <PaginationDots
              count={3}
              current={0}
              dotWidth={6}
              activeWidth={20}
              height={6}
              gap={8}
            />,
          );

        expect(render).not.toThrow();
      });
    });
  });
});
