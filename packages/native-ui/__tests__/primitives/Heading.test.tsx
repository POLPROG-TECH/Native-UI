import React from 'react';
import { screen } from '@testing-library/react';

import { Heading } from '../../src/primitives/Heading';
import { renderWithTheme } from '../test-utils';

describe('Heading', () => {
  it('should be exported as a function component', () => {
    // GIVEN the Heading export

    // WHEN its runtime type is inspected
    const actualType = typeof Heading;

    // THEN it is a function component
    expect(actualType).toBe('function');
  });

  it('should render its text content when mounted', () => {
    // GIVEN a Heading with body text as children
    // WHEN the component is rendered
    renderWithTheme(<Heading>Page Title</Heading>);

    // THEN the text appears in the document
    expect(screen.getByText('Page Title')).toBeInTheDocument();
  });

  it('should expose the `heading` accessibility role', () => {
    // GIVEN a Heading with any text
    // WHEN the component is rendered
    renderWithTheme(<Heading>Page Title</Heading>);

    // THEN a node with the header accessibility role is present
    expect(screen.getByRole('header')).toBeInTheDocument();
  });

  it('should render every supported level without crashing', () => {
    // GIVEN the full set of supported Heading levels
    const levels = [1, 2, 3, 'display', 'displayMedium'] as const;

    // WHEN each level is rendered in isolation
    const renderAll = () => {
      levels.forEach((level) => {
        const { unmount } = renderWithTheme(<Heading level={level}>H {String(level)}</Heading>);
        expect(screen.getByText(`H ${String(level)}`)).toBeInTheDocument();
        unmount();
      });
    };

    // THEN every level renders its content without throwing
    expect(renderAll).not.toThrow();
  });

  it('should apply the provided `align` value as inline text-align', () => {
    // GIVEN a Heading configured with align="center"
    // WHEN the component is rendered
    renderWithTheme(<Heading align="center">Centered</Heading>);
    const heading = screen.getByText('Centered');

    // THEN the inline style carries the alignment
    expect(heading.style.textAlign).toBe('center');
  });
});
