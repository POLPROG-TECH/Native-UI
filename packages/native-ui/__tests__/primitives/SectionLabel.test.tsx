import React from 'react';
import { screen } from '@testing-library/react';
import { SectionLabel } from '../../src/primitives/SectionLabel';
import { renderWithTheme } from '../test-utils';

describe('SectionLabel', () => {
  it('should be exported as a function component', () => {
    // GIVEN the SectionLabel export

    // WHEN its runtime type is inspected
    const actualType = typeof SectionLabel;

    // THEN it is a function component
    expect(actualType).toBe('function');
  });

  it('should render its children as text', () => {
    // GIVEN a SectionLabel with body text
    // WHEN the component is rendered
    renderWithTheme(<SectionLabel>Account</SectionLabel>);

    // THEN the label text appears in the document
    expect(screen.getByText('Account')).toBeInTheDocument();
  });

  it('should default to uppercase text transform', () => {
    // GIVEN a SectionLabel without a custom `transform` prop
    // WHEN the component is rendered
    renderWithTheme(<SectionLabel>Account</SectionLabel>);
    const label = screen.getByText('Account');

    // THEN the inline textTransform style is uppercase
    expect(label.style.textTransform).toBe('uppercase');
  });

  it('should honour a custom text transform override', () => {
    // GIVEN a SectionLabel configured with transform="capitalize"
    // WHEN the component is rendered
    renderWithTheme(<SectionLabel transform="capitalize">hello world</SectionLabel>);
    const label = screen.getByText('hello world');

    // THEN the inline textTransform style matches the override
    expect(label.style.textTransform).toBe('capitalize');
  });

  it('should apply a custom color when provided', () => {
    // GIVEN a SectionLabel configured with an explicit color
    // WHEN the component is rendered
    renderWithTheme(<SectionLabel color="#ff0000">Red</SectionLabel>);
    const label = screen.getByText('Red');

    // THEN the inline color style carries the value
    expect(label.style.color).toBe('rgb(255, 0, 0)');
  });
});
