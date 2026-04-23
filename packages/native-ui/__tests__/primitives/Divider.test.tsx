import React from 'react';
import { screen } from '@testing-library/react';
import { Divider } from '../../src/primitives/Divider';
import { renderWithTheme } from '../test-utils';

describe('Divider', () => {
  it('should be exported as a function component', () => {
    // GIVEN the Divider export

    // WHEN its runtime type is inspected
    const actualType = typeof Divider;

    // THEN it is a function component
    expect(actualType).toBe('function');
  });

  it('should render a single presentational element when mounted', () => {
    // GIVEN a Divider without any custom props
    // WHEN the component is rendered
    const { container } = renderWithTheme(<Divider />);

    // THEN it renders a single DOM node
    expect(container.childNodes.length).toBe(1);
  });

  it('should honour the `inset` prop by setting left/right margins', () => {
    // GIVEN a Divider with a custom inset of 24
    // WHEN the component is rendered
    const { container } = renderWithTheme(<Divider inset={24} />);
    const node = container.firstChild as HTMLElement;

    // THEN the computed inline margin styles reflect that inset
    expect(node.style.marginLeft).toBe('24px');
    expect(node.style.marginRight).toBe('24px');
  });

  it('should not appear in the accessibility tree as a semantic role', () => {
    // GIVEN a Divider rendered on its own
    // WHEN the component is mounted
    renderWithTheme(<Divider />);

    // THEN no `separator` role is exposed - the component is purely decorative
    expect(screen.queryByRole('separator')).not.toBeInTheDocument();
  });
});
