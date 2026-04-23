import React from 'react';
import { screen } from '@testing-library/react';
import { MarqueeText } from '../../src/primitives/MarqueeText';
import { renderWithTheme } from '../test-utils';

describe('MarqueeText', () => {
  it('should be exported as a function component', () => {
    // GIVEN the MarqueeText export

    // WHEN its runtime type is inspected
    const actualType = typeof MarqueeText;

    // THEN it is a function component
    expect(actualType).toBe('function');
  });

  it('should render the provided text', () => {
    // GIVEN a MarqueeText with a short label
    // WHEN the component is rendered
    renderWithTheme(<MarqueeText text="Hello world" />);

    // THEN the text is present in the document
    expect(screen.getAllByText('Hello world').length).toBeGreaterThan(0);
  });

  it('should expose the text as the default accessibility label', () => {
    // GIVEN a MarqueeText without an explicit accessibilityLabel
    // WHEN the component is rendered
    renderWithTheme(<MarqueeText text="Accessible text" />);

    // THEN the text itself is used as the aria label
    expect(screen.getByLabelText('Accessible text')).toBeInTheDocument();
  });

  it('should prefer an explicit `accessibilityLabel` over the raw text', () => {
    // GIVEN a MarqueeText with a custom aria label
    // WHEN the component is rendered
    renderWithTheme(<MarqueeText text="Verbose version" accessibilityLabel="Short label" />);

    // THEN the custom aria label is exposed instead
    expect(screen.getByLabelText('Short label')).toBeInTheDocument();
  });

  it('should render without crashing when custom speed, gap, and pause are passed', () => {
    // GIVEN a MarqueeText configured with every tuning prop
    // WHEN the component is rendered
    const render = () =>
      renderWithTheme(
        <MarqueeText
          text="Scrolling"
          speed={60}
          pauseDuration={500}
          gap={80}
          overflowTolerance={4}
        />,
      );

    // THEN no error is thrown
    expect(render).not.toThrow();
  });
});
