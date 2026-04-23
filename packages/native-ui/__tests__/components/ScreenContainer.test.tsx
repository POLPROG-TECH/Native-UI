import React from 'react';
import { Text } from 'react-native';
import { screen } from '@testing-library/react';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { renderWithTheme } from '../test-utils';

describe('ScreenContainer', () => {
  it('should be exported as a function component', () => {
    // GIVEN the ScreenContainer export

    // WHEN its runtime type is inspected
    const actualType = typeof ScreenContainer;

    // THEN it is a function component
    expect(actualType).toBe('function');
  });

  it('should render its children when mounted', () => {
    // GIVEN a ScreenContainer wrapping some body text
    // WHEN the component is rendered
    renderWithTheme(
      <ScreenContainer>
        <Text>Body</Text>
      </ScreenContainer>,
    );

    // THEN the children are present in the document
    expect(screen.getByText('Body')).toBeInTheDocument();
  });

  it('should render without crashing when `padded` is false', () => {
    // GIVEN a ScreenContainer configured with padded={false}
    // WHEN the component is rendered
    renderWithTheme(
      <ScreenContainer padded={false}>
        <Text>Edge-to-edge</Text>
      </ScreenContainer>,
    );

    // THEN the child content is still rendered
    expect(screen.getByText('Edge-to-edge')).toBeInTheDocument();
  });

  it('should render without crashing when top and bottom safe-area edges are requested', () => {
    // GIVEN a ScreenContainer configured to inset on both top and bottom
    // WHEN the component is rendered
    renderWithTheme(
      <ScreenContainer edges={['top', 'bottom']}>
        <Text>Safe</Text>
      </ScreenContainer>,
    );

    // THEN the child content is still rendered
    expect(screen.getByText('Safe')).toBeInTheDocument();
  });
});
