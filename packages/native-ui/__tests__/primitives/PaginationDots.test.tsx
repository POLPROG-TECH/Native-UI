import React from 'react';
import { screen } from '@testing-library/react';
import { PaginationDots } from '../../src/primitives/PaginationDots';
import { renderWithTheme } from '../test-utils';

describe('PaginationDots', () => {
  it('should be exported as a function component', () => {
    // GIVEN the PaginationDots export

    // WHEN its runtime type is inspected
    const actualType = typeof PaginationDots;

    // THEN it is a function component
    expect(actualType).toBe('function');
  });

  it('should render exactly `count` dot elements', () => {
    // GIVEN a PaginationDots with count=5 and no active dot change
    // WHEN the component is rendered
    const { container } = renderWithTheme(<PaginationDots count={5} current={0} />);

    // THEN the wrapper contains exactly five child dot nodes
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.childNodes.length).toBe(5);
  });

  it('should render a meaningful accessibility label indicating progress', () => {
    // GIVEN a PaginationDots on the third step of five
    // WHEN the component is rendered
    renderWithTheme(<PaginationDots count={5} current={2} />);

    // THEN an accessible label describing "step X of Y" is exposed
    expect(screen.getByLabelText(/step 3 of 5/i)).toBeInTheDocument();
  });

  it('should prefer an explicit `accessibilityLabel` over the generated one', () => {
    // GIVEN a PaginationDots with a custom accessibilityLabel
    // WHEN the component is rendered
    renderWithTheme(
      <PaginationDots count={3} current={0} accessibilityLabel="Carousel progress" />,
    );

    // THEN the custom label is used verbatim
    expect(screen.getByLabelText('Carousel progress')).toBeInTheDocument();
  });

  it('should render without crashing for a count of zero', () => {
    // GIVEN a PaginationDots with count=0
    // WHEN the component is rendered
    const render = () => renderWithTheme(<PaginationDots count={0} current={0} />);

    // THEN no error is thrown
    expect(render).not.toThrow();
  });

  it('should render without crashing when `animated` is false', () => {
    // GIVEN a PaginationDots with animated={false}
    // WHEN the component is rendered
    const { container } = renderWithTheme(
      <PaginationDots count={3} current={1} animated={false} />,
    );

    // THEN a wrapper containing the dots is present
    expect(container.firstChild).not.toBeNull();
  });

  it('should render without crashing with custom `color` and `activeColor`', () => {
    // GIVEN custom inactive and active dot colors
    // WHEN the component is rendered
    const render = () =>
      renderWithTheme(
        <PaginationDots count={4} current={1} color="#000000" activeColor="#00ff00" />,
      );

    // THEN no error is thrown
    expect(render).not.toThrow();
  });

  it('should render without crashing with custom widths, height, and gap', () => {
    // GIVEN PaginationDots sized via every geometric prop
    // WHEN the component is rendered
    const render = () =>
      renderWithTheme(
        <PaginationDots count={3} current={0} dotWidth={6} activeWidth={20} height={6} gap={8} />,
      );

    // THEN no error is thrown
    expect(render).not.toThrow();
  });
});
